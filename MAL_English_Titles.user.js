// ==UserScript==
// @name         MAL English Titles
// @version      2.0.1
// @description  Add English Titles to various MyAnimeList pages, whilst still displaying Japanese Titles
// @author       Animorphs
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://github.com/Animorphs/MAL-English-Titles
// @include      https://myanimelist.net/*
// @updateURL    https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// @downloadURL  https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// ==/UserScript==

// Get Japanese titles from page, and send to be translated (addTranslation)
function translate()
{
    // Anime/Manga Page (store only, don't display)
    if (location.href.match(/https:\/\/myanimelist\.net\/(anime|manga)\/([1-9][0-9]?[0-9]?[0-9]?[0-9]?[0-9]?)\/?.*/) || location.href.match(/https:\/\/myanimelist\.net\/(anime|manga)\.php\?id\=([1-9][0-9]?[0-9]?[0-9]?[0-9]?[0-9]?)\/?.*/))
    {
        let titleHtml = document.getElementsByClassName('title-english')[0];
        let id = 0;
        if (location.href.includes('.php'))
        {
            id = location.href.split('id=')[1];
        }
        else
        {
            id = location.href.split('/')[4];
        }
        if (location.href.includes('/anime'))
        {
            if (titleHtml)
            {
                let title = titleHtml.innerText;
                console.log('Updated anime ' + id + ': ' + title);
                storeAnime(id, title);
            }
            else if (storedAnime[id][0] === '' || !storedAnime.hasOwnProperty(id))
            {
                console.log('Updated anime ' + id);
                storeAnime(id, '');
            }
        }
        else if (location.href.includes('/manga'))
        {
            if (titleHtml)
            {
                let title = titleHtml.innerText;
                console.log('Updated manga ' + id + ': ' + title);
                storeManga(id, title);
            }
            else if (storedManga[id][0] === '' || !storedManga.hasOwnProperty(id))
            {
                console.log('Updated manga ' + id);
                storeManga(id, '');
            }
        }
    }

    // Top Anime
    else if (location.href.includes('https://myanimelist.net/topanime.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fl-l fs14 fw-b anime_ranking_h3');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].children[0].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = '.hoverinfo_trigger.fl-l.fs14.fw-b.anime_ranking_h3 > a[href="' + urlDecoded + '"]';
                addTranslation('anime', i, url, id, selector);
            }
        }
    }

    // Top Manga
    else if (location.href.includes('https://myanimelist.net/topmanga.php'))
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
    else if (location.href.includes('https://myanimelist.net/animelist') || location.href.includes('https://myanimelist.net/mangalist'))
    {
        let type = location.href.substring(24, 29);
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
            new MutationObserver(function(mutationsList, observer)
            {
                mutationsList.forEach(function(mutation)
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
                {childList: true}
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
            new MutationObserver(function(mutationsList, observer)
            {
                mutationsList.some(function(mutation)
                {
                    return Array.from(mutation.addedNodes).some(function(addedNode)
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
                {childList: true}
            );
        }
    }

    // Search Generic
    else if (location.href.includes('https://myanimelist.net/search/'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[class="hoverinfo_trigger fw-b fl-l"][href*="/anime/"]');
        for (let i = 0; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = resultsAnime[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b.fl-l';
                addTranslation('anime', i, url, id, selector);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[class="hoverinfo_trigger fw-b"][href*="/manga/"]');
        for (let i = 0; i < resultsManga.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = resultsManga[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b';
                addTranslation('manga', i, url, id, selector);
            }
        }
    }

    // Search Anime
    else if (location.href.includes('https://myanimelist.net/anime.php?q') || location.href.includes('https://myanimelist.net/anime.php?cat'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fw-b fl-l');
        for (let i = 0; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b.fl-l';
                addTranslation('anime', i, url, id, selector);
            }
        }
    }

    // Search Manga
    else if (location.href.includes('https://myanimelist.net/manga.php?q') || location.href.includes('https://myanimelist.net/manga.php?cat'))
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

    // Seasonal Anime
    else if (location.href.includes('https://myanimelist.net/anime/season'))
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
                addTranslation('anime', i, url, id, selector, true);
            }
        }
    }

    // Anime Genres
    else if (location.href.includes('https://myanimelist.net/anime/genre'))
    {
        // Tile View
        if (document.getElementsByClassName('btn-view-style js-btn-view-style tile on')[0])
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
                    addTranslation('anime', i, url, id, selector, true);
                }
            }
        }

        // List View
        else if (document.getElementsByClassName('btn-view-style js-btn-view-style list on')[0])
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
    else if (location.href.includes('https://myanimelist.net/manga/genre'))
    {
        // Tile View
        if (document.getElementsByClassName('btn-view-style js-btn-view-style tile on')[0])
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
                    addTranslation('manga', i, url, id, selector, true);
                }
            }
        }

        // List View
        else if (document.getElementsByClassName('btn-view-style js-btn-view-style list on')[0])
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

    // Anime Producers
    else if (location.href.includes('https://myanimelist.net/anime/producer'))
    {
        // Tile View
        if (document.getElementsByClassName('btn-view-style js-btn-view-style tile on')[0])
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
                    addTranslation('anime', i, url, id, selector, true);
                }
            }
        }

        // List View
        else if (document.getElementsByClassName('btn-view-style js-btn-view-style list on')[0])
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

    // Shared Anime
    else if (location.href.includes('https://myanimelist.net/shared.php') && !location.href.includes('&type=manga'))
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

    // Shared Manga
    else if (location.href.includes('https://myanimelist.net/shared.php') && location.href.includes('&type=manga'))
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
    else if (location.href.includes('https://myanimelist.net/history'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[href*="/anime.php?id="]');
        let animeIds = [];
        for (let i = 0; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = resultsAnime[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('=')[1];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                if (!animeIds.includes(id))
                {
                    addTranslation('anime', i, url, id, selector);
                }
                animeIds.push(id);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[href*="/manga.php?id="]');
        let mangaIds = [];
        for (let i = 0; i < resultsManga.length-1; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = resultsManga[i].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('=')[1];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                if (!mangaIds.includes(id))
                {
                    addTranslation('manga', i, url, id, selector);
                }
                mangaIds.push(id);
            }
        }
    }

    // People
    else if (location.href.includes('https://myanimelist.net/people'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[href*="/anime/"]:not(.Lightbox_AddEdit):not([href*="anime/season"])');
        let animeIds = [];
        for (let i = 0; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = resultsAnime[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"]:not(.picSurround > a)';
                if (!animeIds.includes(id))
                {
                    addTranslation('anime', i, url, id, selector);
                }
                animeIds.push(id);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[href*="/manga/"]:not(.Lightbox_AddEdit)');
        let mangaIds = [];
        for (let i = 0; i < resultsManga.length; i+=2)
        {
            if (!document.getElementById('manga' + i))
            {
                let url = resultsManga[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"]:not(.picSurround > a)';
                if (!mangaIds.includes(id))
                {
                    addTranslation('manga', i, url, id, selector);
                }
                mangaIds.push(id);
            }
        }
    }
}

// Get English title (storedAnime and getEnglishTitle) and add to page
function addTranslation(type, count, url, id, selector, parent=false)
{
    let styleId = '<div style="font-weight:bold" id="' + type + count + '">';
    let styleIdEnd = '</div>';
    if (type === 'anime')
    {
        if (checkAnime(id))
        {
            document.querySelectorAll(selector).forEach(function(element)
            {
                if (parent)
                {
                    element = element.parentElement;
                }
                element.insertAdjacentHTML('beforebegin', styleId + storedAnime[id][0] + styleIdEnd);
            });
        }
        else
        {
            getEnglishTitle(type, count, url, id, selector, parent);
        }
    }
    else if (type === 'manga')
    {
        if (checkManga(id))
        {
            document.querySelectorAll(selector).forEach(function(element)
            {
                if (parent)
                {
                    element = element.parentElement;
                }
                element.insertAdjacentHTML('beforebegin', styleId + storedManga[id][0] + styleIdEnd);
            });
        }
        else
        {
            getEnglishTitle(type, count, url, id, selector, parent);
        }
    }
}

// Request English title from MAL and send to be stored (storeAnime)
function getEnglishTitle(type, count, url, id, selector, parent)
{
    // Create new request
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'document';

    // Set the callback
    xhr.onload = function()
    {
        if (xhr.readyState === xhr.DONE && xhr.status === 200 && xhr.responseXML !== null)
        {
            let styleId = '<div style="font-weight: bold" id="' + type + count + '">';
            let styleIdEnd = '</div>';
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
                storeAnime(id, englishTitle);
            }
            else if (type === 'manga')
            {
                storeManga(id, englishTitle);
            }

            document.querySelectorAll(selector).forEach(function(element)
            {
                if (parent)
                {
                    element = element.parentElement;
                }
                element.insertAdjacentHTML('beforebegin', styleId + englishTitle + styleIdEnd);
            });
        }
    };

    // Send the request
    xhr.open('GET', url);
    xhr.send();
}

// Store English titles for anime in cache
function storeAnime(id, engTitle)
{
    storedAnime[id] = [engTitle, Date.now()];
    GM_setValue('anime', storedAnime);
}

// Store English titles for manga in cache
function storeManga(id, engTitle)
{
    storedManga[id] = [engTitle, Date.now()];
    GM_setValue('manga', storedManga);
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

// Get cached English titles if they exist, else create empty dictionary
var storedAnime = GM_getValue('anime');
var storedManga = GM_getValue('manga');
if (!storedAnime)
{
    GM_setValue('anime',{});
    storedAnime = {};
}
if (!storedManga)
{
    GM_setValue('manga',{});
    storedManga = {};
}

// Launch actual script
translate();
