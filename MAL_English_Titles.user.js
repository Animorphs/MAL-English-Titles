// ==UserScript==
// @name         MAL English Titles
// @version      1.10
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
var translate = function()
{
    // Top Anime
    if (location.href.includes('https://myanimelist.net/topanime.php'))
    {
        let titles = document.getElementsByClassName('detail');
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleDetail = titles[i].getElementsByClassName('di-ib clearfix');
            let titleID = titleDetail[0].firstChild.firstChild.id;
            let titleURL = titleDetail[0].firstChild.firstChild.href;
            $(titleID).load(titleURL + ' .title-english').css('font-weight', 'bold');
        }
    }

    // Top Manga
    else if (location.href.includes('https://myanimelist.net/topmanga.php'))
    {
        let titles = document.getElementsByClassName('detail');
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleDetail = titles[i].getElementsByTagName('a');
            let titleID = titleDetail[0].id;
            let titleURL = titleDetail[0].href;
            $(titleID).load(titleURL + ' .title-english').css('font-weight', 'bold');
        }
    }

    // Anime List
    else if (location.href.includes('https://myanimelist.net/animelist'))
    {
        let titles = document.getElementsByClassName('list-item');
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleDetail = titles[i].getElementsByClassName('data title clearfix');
            let titleURL = titleDetail[0].firstChild.href;
            let titleURLSliced = titleURL.slice(23);
            let titleURLSlicedDecoded = decodeURIComponent(titleURLSliced)
            $('a[href="' + titleURLSlicedDecoded + '"]').before($('<p style="font-weight:bold">').last().load(titleURL + ' .title-english'));
        }
    }

    // Manga List
    else if (location.href.includes('https://myanimelist.net/mangalist'))
    {
        let titles = document.getElementsByClassName('list-item');
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleDetail = titles[i].getElementsByClassName('data title');
            let titleURL = titleDetail[0].firstChild.href;
            let titleURLSliced = titleURL.slice(23);
            let titleURLSlicedDecoded = decodeURIComponent(titleURLSliced)
            $('a[href="' + titleURLSlicedDecoded + '"]').before($('<p style="font-weight:bold">').last().load(titleURL + ' .title-english'));
        }
    }

    // Search
    else if (location.href.includes('https://myanimelist.net/search/'))
    {
        //Anime Results
        let titles = document.getElementsByClassName('hoverinfo_trigger fw-b fl-l');
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleID = titles[i].id;
            let titleIDsliced = titleID.slice(8);
            let titleURL = titles[i].href;
            $('a[href*="anime/' + titleIDsliced + '"]').slice(1, 2).before(jQuery('<p style="font-weight:bold">').load(titleURL + ' .title-english'));
        }

        //Manga Results
        let titlesManga = document.getElementsByClassName('hoverinfo_trigger fw-b');
        let j = 0;
        for (j = 0; j < titlesManga.length; j++)
        {
            if (titlesManga[j].className == 'hoverinfo_trigger fw-b')
            {
                let titleIDmanga = titlesManga[j].id;
                let titleIDslicedManga = titleIDmanga.slice(8);
                let titleURLmanga = titlesManga[j].href;
                $('a[href*="manga/' + titleIDslicedManga + '"]').slice(1, 2).before($('<p style="font-weight:bold">').load(titleURLmanga + ' .title-english'));
            }
        }
    }

    // Search Anime
    else if (location.href.includes('https://myanimelist.net/anime.php'))
    {
        let titles = document.getElementsByClassName('hoverinfo_trigger fw-b fl-l');
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleID = titles[i].id;
            let titleIDsliced = titleID.slice(5);
            let titleURL = titles[i].href;
            $('a[href*="' + titleIDsliced + '"]').slice(1, 2).before($('<p style="font-weight:bold">').load(titleURL + ' .title-english'));
        }
    }

    // Search Manga
    else if (location.href.includes('https://myanimelist.net/manga.php'))
    {
        let titles = document.getElementsByClassName('hoverinfo_trigger fw-b');
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleID = titles[i].id;
            let titleIDsliced = titleID.slice(5);
            let titleURL = titles[i].href;
            $('a[href*="' + titleIDsliced + '"]').slice(1, 2).before($('<p style="font-weight:bold">').load(titleURL + ' .title-english'));
        }
    }
};

var translationsDone = false;

// When page is first loaded, check checkbox stored value, translate page if pre-selected, and update checkbox visual
var getStoredToggle = function()
{
    let gmValue = GM_getValue('checkedGM');
    if (gmValue)
    {
        document.getElementById('engCheckbox').checked = true;
        translate();
        translationsDone = true;
    }

    else if (!gmValue)
    {
        GM_setValue('checkedGM', false);
        document.getElementById('engCheckbox').checked = false;
    }

    else
    {
        GM_setValue('checkedGM', false);
        document.getElementById('engCheckbox').checked = false;
        console.error('uWu, there\'s been a fucky wucky with the page load (′ꈍωꈍ‵)')
    }
}

// When checkbox is checked or unchecked, store value, and translate page if necessary
var toggleTranslation = function()
{
    let visibleValue = document.getElementById('engCheckbox').checked;
    if (visibleValue)
    {
        GM_setValue('checkedGM', true);
        document.getElementById('engCheckbox').checked = true;
        if (!translationsDone)
        {
            translate();
        }
        translationsDone = true;
    }

    else if (!visibleValue)
    {
        GM_setValue('checkedGM', false);
        document.getElementById('engCheckbox').checked = false;
    }

    else
    {
        GM_setValue('checkedGM', false);
        document.getElementById('engCheckbox').checked = false;
        console.error('uWu, there\'s been a fucky wucky with the checkbox (′ꈍωꈍ‵)')
    }
};

// Add draggable floating checkbox to page
$('body').prepend('<div class="draggable" id="engToggle" style="display: flex; align-items:center; justify-content:center; border: 3px dotted #2F52A2; width: 120px; position: fixed; top: 15%; left: 1px; z-index: 100; background-color: rgba(255,255,255,0.5);">Load English?<input type="checkbox" id="engCheckbox"></div>');
$('.draggable').draggable(
{
    axis: 'y'
});
$('#engToggle').click(toggleTranslation);

getStoredToggle();
