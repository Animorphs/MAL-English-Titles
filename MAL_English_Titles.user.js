// ==UserScript==
// @name         MAL English Titles
// @version      2.3.0
// @description  Add English Titles to various MyAnimeList pages, whilst still displaying Japanese Titles
// @author       Animorphs
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace    https://github.com/Animorphs/MAL-English-Titles
// @icon         https://myanimelist.net/favicon.ico
// @match        https://myanimelist.net/*
// @updateURL    https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// @downloadURL  https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// ==/UserScript==



// Get Japanese titles from page, and send to be translated (addTranslation)
async function translate()
{
    const LOCATION_HREF = location.href;
    const URL_REGEX = /https:\/\/myanimelist\.net\/(anime|manga)\/([1-9][0-9]?[0-9]?[0-9]?[0-9]?[0-9]?)\/?.*/;
    const URL_PHP_REGEX = /https:\/\/myanimelist\.net\/(anime|manga)\.php\?id\=([1-9][0-9]?[0-9]?[0-9]?[0-9]?[0-9]?)\/?.*/;

    // Anime/Manga Page (store only, don't display)
    if (URL_REGEX.test(LOCATION_HREF) || URL_PHP_REGEX.test(LOCATION_HREF))
    {
        let titleHtml = document.getElementsByClassName('title-english')[0];
        let id = LOCATION_HREF.includes('.php') ? LOCATION_HREF.split('id=')[1] : LOCATION_HREF.split('/')[4];

        let type = LOCATION_HREF.includes('/anime') ? "anime" : "manga";
        let store = type === 'anime' ? storedAnime : storedManga;
        if (titleHtml)
        {
            let title = titleHtml.innerText;
            console.log(`Updated ${type} ${id}: ${title}`);
            type === 'anime' ? await storeAnime(id, title) : await storeManga(id, title);
        }
        else if (!store || !store.hasOwnProperty(id) || store[id][0] === '')
        {
            console.log(`Updated ${type} ${id}`);
            type === 'anime' ? await storeAnime(id, '') : await storeManga(id, '');
        }
    }

    // Anime/Manga Page User Recommendations
    if ((URL_REGEX.test(LOCATION_HREF) || URL_PHP_REGEX.test(LOCATION_HREF)) && LOCATION_HREF.includes('/userrecs'))
    {
        let results = document.querySelectorAll('[style*="margin-bottom: 2px"]');
        let type = LOCATION_HREF.includes('/anime') ? 'anime' : 'manga';
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById(type + i))
            {
                let url = results[i].children[0].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'div[style="margin-bottom: 2px;"] > a[href="' + urlDecoded + '"]';
                addTranslation(type, i, url, id, selector);
            }
        }
    }

    // Recommendations
    else if (LOCATION_HREF.includes('https://myanimelist.net/recommendations.php'))
    {
        let results = Array.from(document.querySelectorAll('.spaceit.borderClass a')).filter((link) => link.querySelector('strong'));
        let arr = new Set();
        let type = LOCATION_HREF.includes('&t=anime') ? 'anime' : 'manga';
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById(type + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let parts = urlDecoded.split('/' + type);
                if (parts.length < 2)
                {
                    continue;
                }
                let urlShort = '/' + type + parts[1];
                if (!arr.has(urlShort))
                {
                    arr.add(urlShort);
                    let id = url.split('/')[4];
                    let next = results[i].nextElementSibling;
                    if (next && next.getAttribute('style') === 'font-weight:bold')
                    {
                        results[i].dataset.engSkip = '1';
                    }
                    let selector = 'td > a[href*="' + urlShort + '"]:not([data-eng-skip])';
                    addTranslation(type, i, url, id, selector);
                }
            }
        }
    }

    // Anime Top
    else if (LOCATION_HREF.includes('https://myanimelist.net/topanime.php'))
    {
        let results = document.getElementsByClassName('fl-l fs14 fw-b anime_ranking_h3');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].children[0].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = '.fl-l.fs14.fw-b.anime_ranking_h3 > a[href="' + urlDecoded + '"]';
                addTranslation('anime', i, url, id, selector);
            }
        }
    }

    // Manga Top
    else if (LOCATION_HREF.includes('https://myanimelist.net/topmanga.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fs14 fw-b');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fs14.fw-b';
                addTranslation('manga', i, url, id, selector);
            }
        }
    }

    // Anime List and Manga List
    else if (LOCATION_HREF.includes('https://myanimelist.net/animelist') || LOCATION_HREF.includes('https://myanimelist.net/mangalist'))
    {
        let type = LOCATION_HREF.includes('/animelist') ? 'anime' : 'manga';
        let results = document.querySelectorAll('tbody:not([style]) .data.title');

        function processResults(tempResults)
        {
            for (let i = 0; i < tempResults.length; i++)
            {
                let url = tempResults[i].children[0].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('/')[4];
                let selector = '.data.title > a[href="' + urlShortDecoded + '"]';
                addTranslation(type, i, url, id, selector);
            }
        }

        function attachMutationObserver(listTable)
        {
            new MutationObserver(function (mutationsList, observer)
            {
                mutationsList.forEach(function (mutation)
                {
                    processResults(
                        Array.from(
                            mutation.addedNodes,
                            (addedNode) => addedNode.children[0].children[3]
                        )
                    );
                });

                if ((listTable.children.length - 1) % 150 !== 0)
                {
                    observer.disconnect();
                }
            }).observe(
                listTable,
                { childList: true }
            );
        }

        let table = document.querySelector('table');

        if (results.length)
        {
            processResults(results);
            if (results.length === 150)
            {
                attachMutationObserver(table);
            }
        }
        else if (table)
        {
            new MutationObserver(function (mutationsList, observer)
            {
                mutationsList.some(function (mutation)
                {
                    return Array.from(mutation.addedNodes).some(function (addedNode)
                    {
                        if (addedNode.tagName === 'TABLE')
                        {
                            let results = addedNode.querySelectorAll('.data.title');
                            processResults(results);
                            if (results.length === 150)
                            {
                                attachMutationObserver(addedNode);
                            }
                            observer.disconnect();
                            return true;
                        }
                    });
                });
            }).observe(
                table.parentElement,
                { childList: true }
            );
        }
    }

    // Search
    else if (LOCATION_HREF.includes('https://myanimelist.net/search/'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('a.fw-b.fl-l[href*="/anime/"]');
        for (let i = 0; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = resultsAnime[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].fw-b.fl-l';
                addTranslation('anime', i, url, id, selector, true);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('a.fw-b[href*="/manga/"]');
        for (let i = 0; i < resultsManga.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = resultsManga[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].fw-b';
                addTranslation('manga', i, url, id, selector);
            }
        }
    }

    // Anime Search
    else if (LOCATION_HREF.includes('https://myanimelist.net/anime.php?q') || LOCATION_HREF.includes('https://myanimelist.net/anime.php?cat'))
    {
        let results = document.querySelectorAll('a.fw-b.fl-l[href*="/anime/"]');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].fw-b.fl-l';
                addTranslation('anime', i, url, id, selector, true);
            }
        }
    }

    // Manga Search
    else if (LOCATION_HREF.includes('https://myanimelist.net/manga.php?q') || LOCATION_HREF.includes('https://myanimelist.net/manga.php?cat'))
    {
        let results = document.querySelectorAll('a.fw-b[href*="/manga/"]');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].fw-b';
                addTranslation('manga', i, url, id, selector);
            }
        }
    }

    // Anime Seasonal
    else if (LOCATION_HREF.includes('https://myanimelist.net/anime/season'))
    {
        let results = document.getElementsByClassName('link-title');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].link-title';
                addTranslation('anime', i, url, id, selector, false, true);
            }
        }
    }

    // Reviews
    else if (LOCATION_HREF.includes('https://myanimelist.net/reviews.php'))
    {
        let type = LOCATION_HREF.includes('&t=manga') ? 'manga' : 'anime';
        let results = document.querySelectorAll('.review-element .titleblock a.title');
        let processedIds = new Set();

        for (let i = 0; i < results.length; i++)
        {
            let url = results[i].href;
            let urlDecoded = decodeURIComponent(url);
            let id = url.split('/')[4];
            if (!processedIds.has(id))
            {
                processedIds.add(id);
                let selector = '.review-element .titleblock a.title[href="' + urlDecoded + '"]';
                addTranslation(type, i, url, id, selector);
            }
        }
    }

    // Anime Genres
    else if (LOCATION_HREF.includes('https://myanimelist.net/anime/genre'))
    {
        // Seasonal View
        if (document.getElementsByClassName('js-btn-view-style seasonal on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].link-title';
                    addTranslation('anime', i, url, id, selector, true, true);
                }
            }
        }

        // List View
        else if (document.getElementsByClassName('js-btn-view-style list on')[0])
        {
            let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b';
                    addTranslation('anime', i, url, id, selector);
                }
            }
        }
    }

    // Manga Genres
    else if (LOCATION_HREF.includes('https://myanimelist.net/manga/genre') || LOCATION_HREF.includes('https://myanimelist.net/manga/adapted'))
    {
        // Seasonal View
        if (document.getElementsByClassName('js-btn-view-style seasonal on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('manga' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].link-title';
                    addTranslation('manga', i, url, id, selector, false, true);
                }
            }
        }

        // List View
        else if (document.getElementsByClassName('js-btn-view-style list on')[0])
        {
            let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('manga' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b';
                    addTranslation('manga', i, url, id, selector);
                }
            }
        }
    }

    // Stacks
    else if (LOCATION_HREF.includes('https://myanimelist.net/stacks/'))
    {
        const viewButton = document.querySelector('.view-style2 a.on');
        const isTileView = viewButton && viewButton.classList.contains('tile');
        const isSeasonalView = viewButton && viewButton.classList.contains('seasonal');
        const linksSelector = isTileView
            ? '.seasonal-anime .title > a[href*="/anime/"], .seasonal-anime .title > a[href*="/manga/"]'
            : 'a.link-title[href*="/anime/"], a.link-title[href*="/manga/"]';

        const links = document.querySelectorAll(linksSelector);
        let animeCount = 0;
        let mangaCount = 0;

        links.forEach(function (link)
        {
            const url = link.href;
            const urlDecoded = decodeURIComponent(url);
            const id = url.split('/')[4];
            const type = url.includes('/anime/') ? 'anime' : 'manga';
            const count = type === 'anime' ? animeCount++ : mangaCount++;

            if (!document.getElementById(type + count))
            {
                const selector = isTileView
                    ? '.seasonal-anime .title > a[href="' + urlDecoded + '"]'
                    : 'a.link-title[href="' + urlDecoded + '"]';

                const useTileStyle = isSeasonalView || isTileView;
                const useParent = !isTileView && !isSeasonalView;

                addTranslation(type, count, url, id, selector, useParent, useTileStyle);

                if (isTileView)
                {
                    ensureTileLayoutStyles();
                    const translationEl = document.getElementById(type + count);
                    if (translationEl)
                    {
                        translationEl.classList.add('eng-tile-title');
                    }
                }
            }
        });
    }

    // Anime Producers
    else if (LOCATION_HREF.includes('https://myanimelist.net/anime/producer'))
    {
        // Tile View
        if (document.getElementsByClassName('js-btn-view-style2 tile on')[0])
        {
            let results = document.getElementsByClassName('seasonal-anime js-seasonal-anime js-anime-type-all ');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].children[0].children[0].href
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = '.seasonal-anime.js-seasonal-anime.js-anime-type-all > .title > a[href="' + urlDecoded + '"]';
                    addTranslation('anime', i, url, id, selector, false, true, true);
                }
            }
        }

        // Seasonal View
        else if (document.getElementsByClassName('js-btn-view-style2 seasonal on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = 'a[href="' + urlDecoded + '"].link-title';
                    addTranslation('anime', i, url, id, selector, false, true);
                }
            }
        }

        // List View
        else if (document.getElementsByClassName('js-btn-view-style2 list on')[0])
        {
            let results = document.getElementsByClassName('seasonal-anime js-seasonal-anime js-anime-type-all');
            for (let i = 0; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let url = results[i].children[0].children[0].children[0].href;
                    let urlDecoded = decodeURIComponent(url);
                    let id = url.split('/')[4];
                    let selector = '.spaceit_pad > a[href="' + urlDecoded + '"]';
                    addTranslation('anime', i, url, id, selector);
                }
            }
        }
    }

    // Anime Shared
    else if (LOCATION_HREF.includes('https://myanimelist.net/shared.php') && !LOCATION_HREF.includes('&type=manga'))
    {
        let results = document.querySelectorAll('[href*="/anime/"]:not(.Lightbox_AddEdit):not([href*="anime/season"])');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                addTranslation('anime', i, url, id, selector);
            }
        }
    }

    // Manga Shared
    else if (LOCATION_HREF.includes('https://myanimelist.net/shared.php') && LOCATION_HREF.includes('&type=manga'))
    {
        let results = document.querySelectorAll('[href*="/manga/"]:not(.Lightbox_AddEdit)');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = results[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                addTranslation('manga', i, url, id, selector);
            }
        }
    }

    // History
    else if (LOCATION_HREF.includes('https://myanimelist.net/history'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[href*="/anime.php?id="]');
        let animeIds = new Set();
        for (let i = 0; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = resultsAnime[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('=')[1];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                if (!animeIds.has(id))
                {
                    addTranslation('anime', i, url, id, selector);
                }
                animeIds.add(id);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[href*="/manga.php?id="]');
        let mangaIds = new Set();
        for (let i = 0; i < resultsManga.length - 1; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = resultsManga[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('=')[1];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                if (!mangaIds.has(id))
                {
                    addTranslation('manga', i, url, id, selector);
                }
                mangaIds.add(id);
            }
        }
    }

    // People
    else if (LOCATION_HREF.includes('https://myanimelist.net/people'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[href*="/anime/"]:not(.Lightbox_AddEdit):not([href*="anime/season"])');
        let animeIds = new Set();
        for (let i = 0; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = resultsAnime[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"]:not(.picSurround > a)';
                if (!animeIds.has(id))
                {
                    addTranslation('anime', i, url, id, selector);
                }
                animeIds.add(id);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[href*="/manga/"]:not(.Lightbox_AddEdit)');
        let mangaIds = new Set();
        for (let i = 0; i < resultsManga.length; i += 2)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = resultsManga[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"]:not(.picSurround > a)';
                if (!mangaIds.has(id))
                {
                    addTranslation('manga', i, url, id, selector);
                }
                mangaIds.add(id);
            }
        }
    }
}

// English title element to be added to page
function createTranslationElement(styleId, englishTitle, styleIdEnd)
{
    const container = document.createElement('div');
    container.innerHTML = styleId + englishTitle + styleIdEnd;
    container.firstElementChild.title = englishTitle;
    return container.firstElementChild;
}

// Inject shared tile layout styles (stacks/producers/etc.)
function ensureTileLayoutStyles()
{
    if (document.getElementById('eng-tile-style'))
    {
        return;
    }
    const style = document.createElement('style');
    style.id = 'eng-tile-style';
    style.textContent =
        '.seasonal-anime{min-height:285px;}' +
        '.seasonal-anime .title{min-height:2.6em; line-height:1.15;}' +
        '.seasonal-anime .title > a{display:block; line-height:1.15;}' +
        '.seasonal-anime .title h3.h3_anime_subtitle{display:block; margin:0 0 2px 0; font-size:11px; line-height:1.4;}' +
        '.seasonal-anime .category{display:block !important; visibility:visible !important; margin-top:0;}' +
        '.eng-tile-title{font-size:11px; line-height:1.4; margin:0 0 2px 0;}';
    document.head.appendChild(style);
}

// Get English title (storedAnime and getEnglishTitle) and add to page
function addTranslation(type, count, url, id, selector, parent = false, tile = false, producer = false)
{
    let styleId = ""
    let styleIdEnd = ""
    if (tile)
    {
        styleId = '<h3 class="h3_anime_subtitle" id="' + type + count + '">';
        styleIdEnd = '</h3>';
    }
    else
    {
        styleId = '<div style="font-weight:bold" id="' + type + count + '">';
        styleIdEnd = '</div>';
    }
    const isAnime = type === 'anime';
    const hasCachedTitle = isAnime ? checkAnime : checkManga;
    const store = isAnime ? storedAnime : storedManga;

    function insertTranslations(englishTitle)
    {
        document.querySelectorAll(selector).forEach(function (element)
        {
            if (parent)
            {
                element = element.parentElement;
            }

            if (tile)
            {
                const titleTextContainer = element.closest('.title-text');
                if (titleTextContainer)
                {
                    const existingH3 = titleTextContainer.querySelector('h3.h3_anime_subtitle');
                    if (existingH3 && existingH3.textContent.trim() === englishTitle)
                    {
                        return;
                    }
                }
            }

            if (!tile)
            {
                const japaneseTitle = element.textContent.trim();
                if (japaneseTitle === englishTitle)
                {
                    return;
                }
            }

            const translation = createTranslationElement(styleId, englishTitle, styleIdEnd);
            element.parentNode.insertBefore(translation, element);
        });
    }

    if (hasCachedTitle(id))
    {
        const englishTitle = store[id][0];
        if (englishTitle === '')
        {
            return;
        }

        insertTranslations(englishTitle);

        if (producer && tile)
        {
            ensureTileLayoutStyles();
            const translationEl = document.getElementById('anime' + count);
            if (translationEl)
            {
                translationEl.classList.add('eng-tile-title');
            }
        }
    }
    else
    {
        getEnglishTitle(type, url, id, selector, parent, styleId, styleIdEnd);
    }
}

// Request English title from MAL and send to be stored (storeAnime)
function getEnglishTitle(type, url, id, selector, parent, styleId, styleIdEnd)
{
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'document';

    xhr.onload = async function ()
    {
        if (xhr.readyState === xhr.DONE && xhr.status === 200 && xhr.responseXML !== null)
        {
            let englishTitleElement = xhr.responseXML.querySelector('.title-english');

            let englishTitle;
            if (englishTitleElement)
            {
                englishTitle = englishTitleElement.innerText;
            }
            else
            {
                englishTitle = '';
            }

            if (type === 'anime')
            {
                await storeAnime(id, englishTitle);
            }
            else if (type === 'manga')
            {
                await storeManga(id, englishTitle);
            }

            if (englishTitle === '')
            {
                return;
            }

            document.querySelectorAll(selector).forEach(function (element)
            {
                if (parent)
                {
                    element = element.parentElement;
                }
                const translation = createTranslationElement(styleId, englishTitle, styleIdEnd);
                element.parentNode.insertBefore(translation, element);
            });
        }
    };

    xhr.open('GET', url);
    xhr.send();
}

// Store English titles for anime in cache
async function storeAnime(id, engTitle)
{
    storedAnime[id] = [engTitle, Date.now()];
    GM.setValue('anime', storedAnime);
}

// Store English titles for manga in cache
async function storeManga(id, engTitle)
{
    storedManga[id] = [engTitle, Date.now()];
    GM.setValue('manga', storedManga);
}

// Check if English title for anime is cached, and recheck if empty + last check was >3 weeks
function checkAnime(id)
{
    if (storedAnime.hasOwnProperty(id))
    {
        if (storedAnime[id][0] === '')
        {
            let dateNow = Date.now();
            let dateOld = storedAnime[id][1];
            if (dateNow - dateOld > 2628000000)
            {
                console.log('Updated anime ' + id);
                return false;
            }
        }
        return true;
    }
    console.log('New anime ' + id);
    return false;
}

// Check if English title for manga is cached, and recheck if empty + last check was >3 weeks
function checkManga(id)
{
    if (storedManga.hasOwnProperty(id))
    {
        if (storedManga[id][0] === '')
        {
            let dateNow = Date.now();
            let dateOld = storedManga[id][1];
            if (dateNow - dateOld > 2628000000)
            {
                console.log('Updated manga ' + id);
                return false;
            }
        }
        return true;
    }
    console.log('New manga ' + id);
    return false;
}
var storedAnime;
var storedManga;

(async () =>
{
    // Get cached English titles if they exist, else create empty dictionary
    storedAnime = await GM.getValue('anime');
    storedManga = await GM.getValue('manga');
    if (!storedAnime)
    {
        await GM.setValue('anime', {});
        storedAnime = {};
    }
    if (!storedManga)
    {
        await GM.setValue('manga', {});
        storedManga = {};
    }

    // Launch actual script
    await translate();
})();
