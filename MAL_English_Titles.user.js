// ==UserScript==
// @name         MAL English Titles
// @version      1.31.0
// @description  Add English Titles to various MyAnimeList pages, whilst still displaying Japanese Titles
// @author       Animorphs
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://github.com/Animorphs/MAL-English-Titles
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @include      https://myanimelist.net/*
// @updateURL    https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// @downloadURL  https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// ==/UserScript==

/* globals $ */

// Get the translations and display on page
function translate()
{
    // Top Anime
    if (location.href.includes('https://myanimelist.net/topanime.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fl-l fs14 fw-b anime_ranking_h3');
        let i = 0;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let Url = results[i].children[0].href;
                let UrlDecoded = decodeURIComponent(Url);
                let ID = Url.split('/')[4];
                let selector = '.hoverinfo_trigger.fl-l.fs14.fw-b.anime_ranking_h3 > a[href="' + UrlDecoded + '"]';
                addTranslation('anime', i, Url, ID, selector);
            }
        }
        storeTranslated('anime', i);
    }

    // Top Manga
    else if (location.href.includes('https://myanimelist.net/topmanga.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fs14 fw-b');
        let i = 0;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let Url = results[i].href;
                let UrlDecoded = decodeURIComponent(Url);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlDecoded + '"].hoverinfo_trigger.fs14.fw-b';
                addTranslation('manga', i, Url, ID, selector);
            }
        }
        storeTranslated('manga', i);
    }

    // Anime List
    else if (location.href.includes('https://myanimelist.net/animelist'))
    {
        let results = document.getElementsByClassName('data title clearfix');
        let i = 0;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let Url = results[i].children[0].href;
                let UrlShort = Url.slice(23);
                let UrlShortDecoded = decodeURIComponent(UrlShort);
                let ID = Url.split('/')[4];
                let selector = '.data.title.clearfix > a[href="' + UrlShortDecoded + '"]';
                addTranslation('anime', i, Url, ID, selector);
            }
        }
        storeTranslated('anime', i);
    }

    // Manga List
    else if (location.href.includes('https://myanimelist.net/mangalist'))
    {
        let results = document.getElementsByClassName('data title');
        let i = 0;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let Url = results[i].children[0].href;
                let UrlShort = Url.slice(23);
                let UrlShortDecoded = decodeURIComponent(UrlShort);
                let ID = Url.split('/')[4];
                let selector = '.data.title > a[href="' + UrlShortDecoded + '"]';
                addTranslation('manga', i, Url, ID, selector);
            }
        }
        storeTranslated('manga', i);
    }

    // Search Generic
    else if (location.href.includes('https://myanimelist.net/search/'))
    {
        // Anime Results
        let resultsAnime = document.getElementsByClassName('hoverinfo_trigger fw-b fl-l');
        for (let i = 0; i < 10; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let Url = resultsAnime[i].href;
                let UrlDecoded = decodeURIComponent(Url);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b.fl-l';
                addTranslation('anime', i, Url, ID, selector);
            }
        }

        // Manga Results
        let resultsManga = document.getElementsByClassName('hoverinfo_trigger fw-b');
        for (let i = 10; i < 20; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let Url = resultsManga[i].href;
                let UrlDecoded = decodeURIComponent(Url);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b';
                addTranslation('manga', i, Url, ID, selector);
            }
        }
        storeTranslated('anime', 10);
        storeTranslated('manga', -1);
    }

    // Search Anime
    else if (location.href.includes('https://myanimelist.net/anime.php?q'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fw-b fl-l');
        let i = 0;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let Url = results[i].href;
                let UrlDecoded = decodeURIComponent(Url);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b.fl-l';
                addTranslation('anime', i, Url, ID, selector);
            }
        }
        storeTranslated('anime', i);
    }

    // Search Manga
    else if (location.href.includes('https://myanimelist.net/manga.php?q'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
        let i = 0;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let Url = results[i].href;
                let UrlDecoded = decodeURIComponent(Url);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b';
                addTranslation('manga', i, Url, ID, selector);
            }
        }
        storeTranslated('manga', i);
    }

    // Seasonal Anime
    else if (location.href.includes('https://myanimelist.net/anime/season'))
    {
        let results = document.getElementsByClassName('link-title');
        let i = 0;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let Url = results[i].href;
                let UrlDecoded = decodeURIComponent(Url);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlDecoded + '"].link-title';
                addTranslation('anime', i, Url, ID, selector);
            }
        }
        storeTranslated('anime', i);
    }

    // Anime Genres
    else if (location.href.includes('https://myanimelist.net/anime/genre'))
    {
        let i = 0;

        // Tile View
        if ($('.btn-view-style.js-btn-view-style.tile.on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (i; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let Url = results[i].href;
                    let UrlDecoded = decodeURIComponent(Url);
                    let ID = Url.split('/')[4];
                    let selector = 'a[href="' + UrlDecoded + '"].link-title';
                    addTranslation('anime', i, Url, ID, selector);
                }
            }
        }

        // List View
        else if ($('.btn-view-style.js-btn-view-style.list.on')[0])
        {
            let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
            for (i; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let Url = results[i].href;
                    let UrlDecoded = decodeURIComponent(Url);
                    let ID = Url.split('/')[4];
                    let selector = 'a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b';
                    addTranslation('anime', i, Url, ID, selector);
                }
            }
        }
        storeTranslated('anime', i);
    }

    // Manga Genres
    else if (location.href.includes('https://myanimelist.net/manga/genre'))
    {
        let i = 0;

        // Tile View
        if ($('.btn-view-style.js-btn-view-style.tile.on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (i; i < results.length; i++)
            {
                if (!document.getElementById('manga' + i))
                {
                    let Url = results[i].href;
                    let UrlDecoded = decodeURIComponent(Url);
                    let ID = Url.split('/')[4];
                    let selector = 'a[href="' + UrlDecoded + '"].link-title';
                    addTranslation('manga', i, Url, ID, selector);
                }
            }
        }

        // List View
        else if ($('.btn-view-style.js-btn-view-style.list.on')[0])
        {
            let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
            for (i; i < results.length; i++)
            {
                if (!document.getElementById('manga' + i))
                {
                    let Url = results[i].href;
                    let UrlDecoded = decodeURIComponent(Url);
                    let ID = Url.split('/')[4];
                    let selector = 'a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b';
                    addTranslation('manga', i, Url, ID, selector);
                }
            }
        }
        storeTranslated('manga', i);
    }

    // Anime Producers
    else if (location.href.includes('https://myanimelist.net/anime/producer'))
    {
        let i = 0;

        // Tile View
        if ($('.btn-view-style.js-btn-view-style.tile.on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (i; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let Url = results[i].href;
                    let UrlDecoded = decodeURIComponent(Url);
                    let ID = Url.split('/')[4];
                    let selector = 'a[href="' + UrlDecoded + '"].link-title';
                    addTranslation('anime', i, Url, ID, selector);
                }
            }
        }

        // List View
        else if ($('.btn-view-style.js-btn-view-style.list.on')[0])
        {
            let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
            for (i; i < results.length; i++)
            {
                if (!document.getElementById('anime' + i))
                {
                    let Url = results[i].href;
                    let UrlDecoded = decodeURIComponent(Url);
                    let ID = Url.split('/')[4];
                    let selector = 'a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b';
                    addTranslation('anime', i, Url, ID, selector);
                }
            }
        }
        storeTranslated('anime', i);
    }

    // Shared Anime
    else if (location.href.includes('https://myanimelist.net/shared.php') && !location.href.includes('&type=manga'))
    {
        let results = document.querySelectorAll('[href*="/anime/"]:not(.Lightbox_AddEdit)');
        let i = 1;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let Url = results[i].href;
                let UrlShort = Url.slice(23);
                let UrlShortDecoded = decodeURIComponent(UrlShort);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlShortDecoded + '"]';
                addTranslation('anime', i, Url, ID, selector);
            }
        }
        storeTranslated('anime', i);
    }

    // Shared Manga
    else if (location.href.includes('https://myanimelist.net/shared.php') && location.href.includes('&type=manga'))
    {
        let results = document.querySelectorAll('[href*="/manga/"]:not(.Lightbox_AddEdit)');
        let i = 0;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('manga' + i))
            {
                let Url = results[i].href;
                let UrlShort = Url.slice(23);
                let UrlShortDecoded = decodeURIComponent(UrlShort);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlShortDecoded + '"]';
                addTranslation('manga', i, Url, ID, selector);
            }
        }
        storeTranslated('manga', i);
    }

    // History
    else if (location.href.includes('https://myanimelist.net/history'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[href*="/anime.php"]');
        let AnimeIDs = [];
        let i = 1;
        for (i; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let Url = resultsAnime[i].href;
                let UrlShort = Url.slice(23);
                let UrlShortDecoded = decodeURIComponent(UrlShort);
                let ID = Url.split('=')[1];
                let selector = 'a[href="' + UrlShortDecoded + '"]';
                if (!AnimeIDs.includes(ID))
                {
                    addTranslation('anime', i, Url, ID, selector);
                }
                AnimeIDs.push(ID);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[href*="/manga.php"]');
        let MangaIDs = [];
        let j = 1;
        for (j; j < resultsManga.length-1; j++)
        {
            if (!document.getElementById('manga' + j))
            {
                let Url = resultsManga[j].href;
                let UrlShort = Url.slice(23);
                let UrlShortDecoded = decodeURIComponent(UrlShort);
                let ID = Url.split('=')[1];
                let selector = 'a[href="' + UrlShortDecoded + '"]';
                if (!MangaIDs.includes(ID))
                {
                    addTranslation('manga', j, Url, ID, selector);
                }
                MangaIDs.push(ID);
            }
        }
        storeTranslated('anime', i);
        storeTranslated('manga', j);
    }

    // People
    else if (location.href.includes('https://myanimelist.net/people'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[href*="/anime/"]:not(.Lightbox_AddEdit)');
        let AnimeIDs = [];
        let i = 1;
        for (i; i < resultsAnime.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let Url = resultsAnime[i].href;
                let UrlDecoded = decodeURIComponent(Url);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlDecoded + '"]:not(.picSurround > a)';
                if (!AnimeIDs.includes(ID))
                {
                    addTranslation('anime', i, Url, ID, selector);
                }
                AnimeIDs.push(ID);
            }
        }

        // Manga Results
        let resultsManga = document.querySelectorAll('[href*="/manga/"]:not(.Lightbox_AddEdit)');
        let MangaIDs = [];
        let j = 0;
        for (j; j < resultsManga.length; j+=2)
        {
            if (!document.getElementById('manga' + j))
            {
                let Url = resultsManga[j].href;
                let UrlDecoded = decodeURIComponent(Url);
                let ID = Url.split('/')[4];
                let selector = 'a[href="' + UrlDecoded + '"]:not(.picSurround > a)';
                if (!MangaIDs.includes(ID))
                {
                    addTranslation('manga', j, Url, ID, selector);
                }
                MangaIDs.push(ID);
            }
        }
        storeTranslated('anime', i);
        storeTranslated('manga', j);
    }
};

function addTranslation(type, count, url, ID, selector)
{
    let styleId = '<div style="font-weight:bold" id="' + type + count + '">'
    let styleIdEnd = '</div>';
    if (type == 'manga')
    {
        if (checkManga(ID))
        {
            $(selector).before(styleId + storedManga[ID][0] + styleIdEnd);
        }
        else
        {
            $(selector).before($(styleId).load(url + ' .title-english'));
        }
    }
    else if (type == 'anime')
    {
        if (checkAnime(ID))
        {
            $(selector).before(styleId + storedAnime[ID][0] + styleIdEnd);
        }
        else
        {
            $(selector).before($(styleId).load(url + ' .title-english'));
        }
    }
}

// Get anime/manga IDs and English titles from page, and send to be cached. Repeat storage so as to not store blank still-loading results
function storeTranslated(type, count)
{
    setTimeout(function()
    {
        if (type == 'anime')
        {
            for (let i = 0; i < count; i++)
            {
                if (document.getElementById('anime' + i))
                {
                    let animeTitle = document.getElementById('anime' + i).innerText;
                    let animeID = '';
                    if (location.href.includes('https://myanimelist.net/history'))
                    {
                        animeID = document.getElementById('anime' + i).nextSibling.href.split('id=')[1];
                    }
                    else
                    {
                        animeID = document.getElementById('anime' + i).nextSibling.href.split('/')[4];
                    }
                    if (!(animeTitle == '' && checkAnime(animeID)))
                    {
                        storeAnime(animeID, animeTitle);
                    }
                }
            }
        }
        else if (type == 'manga')
        {
            if (count == -1)
            {
                for (let i = 10; i < 20; i++)
                {
                    let mangaTitle = document.getElementById('manga' + i).innerText;
                    let mangaID = document.getElementById('manga' + i).nextSibling.href.split('/')[4];
                    if (!(mangaTitle == '' && checkManga(mangaID)))
                    {
                        storeManga(mangaID, mangaTitle);
                    }
                }
            }
            else
            {
                for (let i = 0; i < count; i++)
                {
                    if (document.getElementById('manga' + i))
                    {
                        let mangaTitle = document.getElementById('manga' + i).innerText;
                        let mangaID = '';
                        if (location.href.includes('https://myanimelist.net/history'))
                        {
                            mangaID = document.getElementById('manga' + i).nextSibling.href.split('id=')[1];
                        }
                        else
                        {
                            mangaID = document.getElementById('manga' + i).nextSibling.href.split('/')[4];
                        }
                        if (!(mangaTitle == '' && checkManga(mangaID)))
                        {
                            storeManga(mangaID, mangaTitle);
                        }
                    }
                }
            }
        }
        if (repeat < 10)
        {
            repeat++;
            storeTranslated(type, count);
        }
    }, 5000);
}

// Store English titles for anime in cache
function storeAnime(ID, engTitle)
{
    storedAnime[ID] = [engTitle, Date.now()];
    GM_setValue('anime', storedAnime);
}

// Store English titles for manga in cache
function storeManga(ID, engTitle)
{
    storedManga[ID] = [engTitle, Date.now()];
    GM_setValue('manga', storedManga);
}

// Check if English title for anime is cached
function checkAnime(ID)
{
    if (storedAnime.hasOwnProperty(ID))
    {
        if (storedAnime[ID][0] == '')
        {
            let dateNow = Date.now();
            let dateOld = storedAnime[ID][1];
            if (dateNow - dateOld > 2628000000)
            {
                console.log('Updated anime ' + ID);
                return false;
            }
        }
        return true;
    }
    console.log('New anime ' + ID);
    return false;
}

// Check if English title for manga is cached
function checkManga(ID)
{
    if (storedManga.hasOwnProperty(ID))
    {
        if (storedManga[ID][0] == '')
        {
            let dateNow = Date.now();
            let dateOld = storedManga[ID][1];
            if (dateNow - dateOld > 2628000000)
            {
                console.log('Updated manga ' + ID);
                return false;
            }
        }
        return true;
    }
    console.log('New manga ' + ID);
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

// Save English title of current anime or manga page
if (location.href.match(/https:\/\/myanimelist\.net\/(anime|manga)\/([1-9][0-9]?[0-9]?[0-9]?[0-9]?[0-9]?)\/.*/))
{
    let title = document.getElementsByClassName('title-english')[0].innerText;
    let id = location.href.split('/')[4];
    if (location.href.includes('/anime/'))
    {
        storeAnime(id, title);
    }
    else if (location.href.includes('/manga/'))
    {
        storeManga(id, title);
    }
}

// Detect AJAX calls upon infinite scroll, and load new translations
var repeat = 0;
if (location.href.includes('https://myanimelist.net/animelist') || location.href.includes('https://myanimelist.net/mangalist'))
{
    (function(open)
    {
        XMLHttpRequest.prototype.open = function()
        {
            this.addEventListener("readystatechange", function()
            {
                if (this.readyState == 4 && this.status == 200 && (this.responseURL.startsWith('https://myanimelist.net/animelist') || this.responseURL.startsWith('https://myanimelist.net/mangalist')))
                {
                    repeat = 0;
                    setTimeout(translate, 2000);
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
}

// Launch actual script
setTimeout(translate, 2000);
