// ==UserScript==
// @name         MAL English Titles
// @version      1.20
// @description  Add English Titles to various MyAnimeList pages, whilst still retaining Japanese Titles
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

// Get the translations and display on page
function translate()
{
    // Top Anime
    if (location.href.includes('https://myanimelist.net/topanime.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fl-l fs14 fw-b anime_ranking_h3');
        let i = 0;
        for (i = 0; i < results.length; i++)
        {
            let Url = results[i].children[0].href;
            let UrlDecoded = decodeURIComponent(Url);
            let ID = Url.split('/')[4];
            if (checkAnime(ID))
            {
                $('.hoverinfo_trigger.fl-l.fs14.fw-b.anime_ranking_h3 > a[href="' + UrlDecoded + '"]').before('<div style="font-weight:bold" id="anime' + i + '">' + storedAnime[ID] + '</div>')
            }
            else
            {
                $('.hoverinfo_trigger.fl-l.fs14.fw-b.anime_ranking_h3 > a[href="' + UrlDecoded + '"]').before($('<div style="font-weight:bold" id="anime' + i + '">').load(Url + ' .title-english'));
            }
        }
        storeTranslated('anime', i);
    }

    // Top Manga
    else if (location.href.includes('https://myanimelist.net/topmanga.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fs14 fw-b');
        let i = 0;
        for (i = 0; i < results.length; i++)
        {
            let Url = results[i].href;
            let UrlDecoded = decodeURIComponent(Url);
            let ID = Url.split('/')[4];
            if (checkManga(ID))
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fs14.fw-b').before('<div style="font-weight:bold" id="manga' + i + '">' + storedManga[ID] + '</div>')
            }
            else
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fs14.fw-b').before($('<div style="font-weight:bold" id="manga' + i + '">').load(Url + ' .title-english'));
            }
        }
        storeTranslated('manga', i);
    }

    // Anime List
    else if (location.href.includes('https://myanimelist.net/animelist'))
    {
        let results = document.getElementsByClassName('data title clearfix');
        let i = 0;
        for (i = 0; i < results.length; i++)
        {
            let Url = results[i].children[0].href;
            let UrlShort = Url.slice(23);
            let UrlShortDecoded = decodeURIComponent(UrlShort);
            let ID = Url.split('/')[4];
            if (checkAnime(ID))
            {
                $('.data.title.clearfix > a[href="' + UrlShortDecoded + '"]').before('<div style="font-weight:bold" id="anime' + i + '">' + storedAnime[ID] + '</div>')
            }
            else
            {
                $('.data.title.clearfix > a[href="' + UrlShortDecoded + '"]').before($('<div style="font-weight:bold" id="anime' + i + '">').load(Url + ' .title-english'));
            }
        }
        storeTranslated('anime', i);
    }

    // Manga List
    else if (location.href.includes('https://myanimelist.net/mangalist'))
    {
        let results = document.getElementsByClassName('data title');
        let i = 0;
        for (i = 0; i < results.length; i++)
        {
            let Url = results[i].children[0].href;
            let UrlShort = Url.slice(23);
            let UrlShortDecoded = decodeURIComponent(UrlShort);
            let ID = Url.split('/')[4];
            if (checkManga(ID))
            {
                $('.data.title > a[href="' + UrlShortDecoded + '"]').before('<div style="font-weight:bold" id="manga' + i + '">' + storedManga[ID] + '</div>')
            }
            else
            {
                $('.data.title > a[href="' + UrlShortDecoded + '"]').before($('<div style="font-weight:bold" id="manga' + i + '">').load(Url + ' .title-english'));
            }
        }
        storeTranslated('manga', i);
    }

    // Search Generic
    else if (location.href.includes('https://myanimelist.net/search/'))
    {
        //Anime Results
        let resultsAnime = document.getElementsByClassName('hoverinfo_trigger fw-b fl-l');
        for (let i = 0; i < 10; i++)
        {
            let Url = resultsAnime[i].href;
            let UrlDecoded = decodeURIComponent(Url);
            let ID = Url.split('/')[4];
            if (checkAnime(ID))
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b.fl-l').before('<div style="font-weight:bold" id="anime' + i + '">' + storedAnime[ID] + '</div>');
            }
            else
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b.fl-l').before($('<div style="font-weight:bold" id="anime' + i + '">').load(Url + ' .title-english'));
            }
        }

        //Manga Results
        let resultsManga = document.getElementsByClassName('hoverinfo_trigger fw-b');
        for (let j = 10; j < 20; j++)
        {
            let Url = resultsManga[j].href;
            let UrlDecoded = decodeURIComponent(Url);
            let ID = Url.split('/')[4];
            if (checkManga(ID))
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b').before('<div style="font-weight:bold" id="manga' + j + '">' + storedManga[ID] + '</div>');
            }
            else
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b').before($('<div style="font-weight:bold" id="manga' + j + '">').load(Url + ' .title-english'));
            }
        }
        storeTranslated('anime', 9);
        storeTranslated('manga', -1);
    }

    // Search Anime
    else if (location.href.includes('https://myanimelist.net/anime.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fw-b fl-l');
        let i = 0;
        for (i = 0; i < results.length; i++)
        {
            let Url = results[i].href;
            let UrlDecoded = decodeURIComponent(Url);
            let ID = Url.split('/')[4];
            if (checkAnime(ID))
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b.fl-l').before('<div style="font-weight:bold" id="anime' + i + '">' + storedAnime[ID] + '</div>')
            }
            else
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b.fl-l').before($('<div style="font-weight:bold" id="anime' + i + '">').load(Url + ' .title-english'));
            }
        }
        storeTranslated('anime', i);
    }

    // Search Manga
    else if (location.href.includes('https://myanimelist.net/manga.php'))
    {
        let results = document.getElementsByClassName('hoverinfo_trigger fw-b');
        let i = 0;
        for (i = 0; i < results.length; i++)
        {
            let Url = results[i].href;
            let UrlDecoded = decodeURIComponent(Url);
            let ID = Url.split('/')[4];
            if (checkManga(ID))
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b').before('<div style="font-weight:bold" id="manga' + i + '">' + storedManga[ID] + '</div>')
            }
            else
            {
                $('a[href="' + UrlDecoded + '"].hoverinfo_trigger.fw-b').before($('<div style="font-weight:bold" id="manga' + i + '">').load(Url + ' .title-english'));
            }
        }
        storeTranslated('manga', i);
    }
};

// Get anime/manga IDs and English titles from page, and send to be cached
function storeTranslated(type, count)
{
    if (type == 'anime')
    {
        setTimeout(function()
        {
            for (let i = 0; i < count; i++)
            {
                try
                {
                    let animeTitle = document.getElementById('anime' + i).innerText;
                    let animeID = document.getElementById('anime' + i).nextSibling.href.split('/')[4];
                    if (animeTitle)
                    {
                        storeAnime(animeID, animeTitle);
                    }
                }
                catch (err)
                {
                    console.log('anime' + err + ' ' + i)
                }
            }
        }, 3000);
    }

    else if (type == 'manga')
    {
        setTimeout(function()
        {
            if (count == -1)
            {
                for (let i = 10; i < 20; i++)
                {
                    try
                    {
                        let mangaTitle = document.getElementById('manga' + i).innerText;
                        let mangaID = document.getElementById('manga' + i).nextSibling.href.split('/')[4];
                        if (mangaTitle)
                        {
                            storeManga(mangaID, mangaTitle);
                        }
                    }
                    catch (err)
                    {
                        console.log('manga' + err + ' ' + i)
                    }
                }
            }
            else
            {
                for (let i = 0; i < count; i++)
                {
                    try
                    {
                        let mangaTitle = document.getElementById('manga' + i).innerText;
                        let mangaID = document.getElementById('manga' + i).nextSibling.href.split('/')[4];
                        if (mangaTitle)
                        {
                            storeManga(mangaID, mangaTitle);
                        }
                    }
                    catch (err)
                    {
                        console.log('manga' + err + ' ' + i)
                    }
                }
            }
        }, 3000);
    }
}

// Store English titles for anime in cache
function storeAnime(ID, engTitle)
{
    storedAnime[ID] = engTitle;
    GM_setValue('anime', storedAnime);
}

// Store English titles for manga in cache
function storeManga(ID, engTitle)
{
    storedManga[ID] = engTitle;
    GM_setValue('manga', storedManga);
}

// Check if English title for anime is cached
function checkAnime(ID)
{
    return storedAnime.hasOwnProperty(ID);
}

// Check if English title for manga is cached
function checkManga(ID)
{
    return storedManga.hasOwnProperty(ID);
}

// Get cached English titles if they exist, else create empty dictionary
var storedAnime = GM_getValue('anime');
var storedManga = GM_getValue('manga');
if (!storedAnime)
{
    GM_setValue('anime',{});
}
if (!storedManga)
{
    GM_setValue('manga',{});
}

// Launch actual script
translate();
