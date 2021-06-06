// ==UserScript==
// @name         MAL English Titles
// @version      1.31.4
// @description  Add English Titles to various MyAnimeList pages, whilst still displaying Japanese Titles
// @author       Animorphs
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://github.com/Animorphs/MAL-English-Titles
// @include      https://myanimelist.net/*
// @updateURL    https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// @downloadURL  https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// ==/UserScript==

/* globals $ */

// Get the translations and display on page
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
            console.log('Updated anime ' + id);
            if (titleHtml)
            {
                let title = titleHtml.innerText;
                storeAnime(id, title);
            }
            else
            {
                storeAnime(id, '');
            }
        }
        else if (location.href.includes('/manga'))
        {
            console.log('Updated manga ' + id);
            if (titleHtml)
            {
                let title = titleHtml.innerText;
                storeManga(id, title);
            }
            else
            {
                storeManga(id, '');
            }
        }
    }

    // Top Anime
    else if (location.href.includes('https://myanimelist.net/topanime.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fl-l fs14 fw-b anime_ranking_h3');
        let i = 0;
        for (i; i < results.length; i++)
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
        let i = 0;
        for (i; i < results.length; i++)
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

    // Anime List
    else if (location.href.includes('https://myanimelist.net/animelist'))
    {
        let results = document.getElementsByClassName('data title clearfix');
        let i = 0;
        for (i; i < results.length; i++)
        {
            if (!document.getElementById('anime' + i))
            {
                let url = results[i].children[0].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('/')[4];
                let selector = '.data.title.clearfix > a[href="' + urlShortDecoded + '"]';
                addTranslation('anime', i, url, id, selector);
            }
        }
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
                let url = results[i].children[0].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('/')[4];
                let selector = '.data.title > a[href="' + urlShortDecoded + '"]';
                addTranslation('manga', i, url, id, selector);
            }
        }
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
                let url = resultsAnime[i].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"].hoverinfo_trigger.fw-b.fl-l';
                addTranslation('anime', i, url, id, selector);
            }
        }

        // Manga Results
        let resultsManga = document.getElementsByClassName('hoverinfo_trigger fw-b');
        for (let i = 10; i < 20; i++)
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
        let i = 0;
        for (i; i < results.length; i++)
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
        let i = 0;
        for (i; i < results.length; i++)
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
        let i = 0;
        for (i; i < results.length; i++)
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
        let i = 0;

        // Tile View
        if (document.getElementsByClassName('btn-view-style js-btn-view-style tile on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (i; i < results.length; i++)
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
            for (i; i < results.length; i++)
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
        let i = 0;

        // Tile View
        if (document.getElementsByClassName('btn-view-style js-btn-view-style tile on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (i; i < results.length; i++)
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
            for (i; i < results.length; i++)
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
        let i = 0;

        // Tile View
        if (document.getElementsByClassName('btn-view-style js-btn-view-style tile on')[0])
        {
            let results = document.getElementsByClassName('link-title');
            for (i; i < results.length; i++)
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
            for (i; i < results.length; i++)
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
        let results = document.querySelectorAll('[href*="/anime/"]:not(.Lightbox_AddEdit)');
        let i = 1;
        for (i; i < results.length; i++)
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
        let i = 0;
        for (i; i < results.length; i++)
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
        let i = 1;
        for (i; i < resultsAnime.length; i++)
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
        let j = 1;
        for (j; j < resultsManga.length-1; j++)
        {
            if (!document.getElementById('manga' + j))
            {
                let url = resultsManga[j].href;
                let urlShort = url.slice(23);
                let urlShortDecoded = decodeURIComponent(urlShort);
                let id = url.split('=')[1];
                let selector = 'a[href="' + urlShortDecoded + '"]';
                if (!mangaIds.includes(id))
                {
                    addTranslation('manga', j, url, id, selector);
                }
                mangaIds.push(id);
            }
        }
    }

    // People
    else if (location.href.includes('https://myanimelist.net/people'))
    {
        // Anime Results
        let resultsAnime = document.querySelectorAll('[href*="/anime/"]:not(.Lightbox_AddEdit)');
        let animeIds = [];
        let i = 1;
        for (i; i < resultsAnime.length; i++)
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
        let j = 0;
        for (j; j < resultsManga.length; j+=2)
        {
            if (!document.getElementById('manga' + j))
            {
                let url = resultsManga[j].href;
                let urlDecoded = decodeURIComponent(url);
                let id = url.split('/')[4];
                let selector = 'a[href="' + urlDecoded + '"]:not(.picSurround > a)';
                if (!mangaIds.includes(id))
                {
                    addTranslation('manga', j, url, id, selector);
                }
                mangaIds.push(id);
            }
        }
    }
}

function addTranslation(type, count, url, id, selector, parent=false)
{
    let styleId = '<div style="font-weight:bold" id="' + type + count + '">';
    let styleIdEnd = '</div>';
    if (type == 'manga')
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
    else if (type == 'anime')
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
}

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
    }

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

// Check if English title for anime is cached
function checkAnime(id, print=true)
{
    if (storedAnime.hasOwnProperty(id))
    {
        if (storedAnime[id][0] == '')
        {
            let dateNow = Date.now();
            let dateOld = storedAnime[id][1];
            if (dateNow - dateOld > 2628000000)
            {
                if (print)
                {
                    console.log('Updated anime ' + id);
                }
                return false;
            }
        }
        return true;
    }
    if (print)
    {
        console.log('New anime ' + id);
    }
    return false;
}

// Check if English title for manga is cached
function checkManga(id, print=true)
{
    if (storedManga.hasOwnProperty(id))
    {
        if (storedManga[id][0] == '')
        {
            let dateNow = Date.now();
            let dateOld = storedManga[id][1];
            if (dateNow - dateOld > 2628000000)
            {
                if (print)
                {
                    console.log('Updated manga ' + id);
                }
                return false;
            }
        }
        return true;
    }
    if (print)
    {
        console.log('New manga ' + id);
    }
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

// Detect AJAX calls upon infinite scroll, and load new translations
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
                    setTimeout(translate, 2000);
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
}

// Launch actual script
translate();
