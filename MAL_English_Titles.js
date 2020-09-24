// ==UserScript==
// @name         MAL English Titles
// @version      1.01
// @description  Add English Titles to various MyAnimeList pages, whilst still retaining Japanese Titles
// @author       https://github.com/Animorphs
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @include      https://myanimelist.net/*
// @updateURL    https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.js
// @downloadURL  https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.js
// ==/UserScript==

var myFunc = function() {
    // Top Anime
    if (location.href.includes('https://myanimelist.net/topanime.php'))
    {
        let titles = document.getElementsByClassName("detail"); // get table of all anime
        let i = 0;
        for (i = 0; i < titles.length; i++) { // for each show on page
            let titleDetail = titles[i].getElementsByClassName("di-ib clearfix"); // get anime ID, URL, etc.
            let titleID = titleDetail[0].firstChild.firstChild.id; // get ID (#area12345)
            let titleURL = titleDetail[0].firstChild.firstChild.href; // get url (https://myanimelist.net/anime/12345/Anime_Show_Link)
            jQuery(titleID).load(titleURL + ' .title-english').css("font-weight","bold"); // replace empty ID div with english title grabbed from anime page
        }
    }

    // Top Manga
    else if (location.href.includes('https://myanimelist.net/topmanga.php'))
    {
        let titles = document.getElementsByClassName("detail");
        let i = 0;
        for(i = 0; i < titles.length; i++)
        {
            let titleDetail = titles[i].getElementsByTagName("a");
            let titleID = titleDetail[0].id;
            let titleURL = titleDetail[0].href;
            jQuery(titleID).load(titleURL + ' .title-english').css("font-weight","bold");
        }
    }

     // Anime List
    else if (location.href.includes('https://myanimelist.net/animelist'))
    {
        let titles = document.getElementsByClassName("list-item");
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleDetail = titles[i].getElementsByClassName("data title clearfix"); // get url, and other stuff
            let titleURL = titleDetail[0].firstChild.href; // get url (https://myanimelist.net/anime/12345/Anime_Show_Link)
            let titleURLSliced = titleURL.slice(23); // get end part of url (/anime/12345/Anime_Show_Link)
            let titleURLSlicedDecoded = decodeURIComponent(titleURLSliced) // convert any UTF-8 (such as /gintama%C2%B0) to ASCII (such as /gintama°)
            jQuery('a[href="'+ titleURLSlicedDecoded +'"]').before(jQuery('<p style="font-weight:bold">').last().load(titleURL + " .title-english")); // find link match in code (last one), prepend english title in front of japanese title
        }
    }

    // Manga List
    else if (location.href.includes('https://myanimelist.net/mangalist'))
    {
        let titles = document.getElementsByClassName("list-item");
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleDetail = titles[i].getElementsByClassName("data title");
            let titleURL = titleDetail[0].firstChild.href;
            let titleURLSliced = titleURL.slice(23);
            let titleURLSlicedDecoded = decodeURIComponent(titleURLSliced)
            jQuery('a[href="'+ titleURLSlicedDecoded +'"]').before(jQuery('<p style="font-weight:bold">').last().load(titleURL + " .title-english"));
        }
    }

    // Search
    else if (location.href.includes('https://myanimelist.net/search/'))
    {
        //Anime Results
        let titles = document.getElementsByClassName("hoverinfo_trigger fw-b fl-l");
        let i = 0;
        for (i = 0; i < titles.length; i++)
        {
            let titleID = titles[i].id; // get div ID (#revArea12345)
            let titleIDsliced = titleID.slice(8); // get just the anime ID (12345)
            let titleURL = titles[i].href; // full URL of anime (https://myanimelist.net/anime/12345/Anime_Show_Link)
            jQuery('a[href*="anime/'+ titleIDsliced + '"]').slice(1,2).before(jQuery('<p style="font-weight:bold">').load(titleURL + ' .title-english')); // find link match for anime/id, get second element (title rather than picture), prepend english title
        }
        //Manga Results
        let titlesManga = document.getElementsByClassName("hoverinfo_trigger fw-b");
        let j = 0;
        for (j = 0; j < titlesManga.length; j++)
        {
            if (titlesManga[j].className == 'hoverinfo_trigger fw-b') { //ensure exact match (otherwise will match anime class too)
                let titleIDmanga = titlesManga[j].id;
                let titleIDslicedManga = titleIDmanga.slice(8);
                let titleURLmanga = titlesManga[j].href;
                jQuery('a[href*="manga/'+ titleIDslicedManga + '"]').slice(1,2).before(jQuery('<p style="font-weight:bold">').load(titleURLmanga + ' .title-english'));
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
            jQuery('a[href*="'+ titleIDsliced + '"]').slice(1,2).before(jQuery('<p style="font-weight:bold">').load(titleURL + ' .title-english'));
        }
    }

    // Search Manga
    else if (location.href.includes('https://myanimelist.net/manga.php'))
    {
        let titles = document.getElementsByClassName('hoverinfo_trigger fw-b')
        let i = 0
        for (i = 0; i < titles.length; i++)
        {
            let titleID = titles[i].id; //sinfo12345
            let titleIDsliced = titleID.slice(5) //cut off "sinfo"
            let titleURL = titles[i].href;
            jQuery('a[href*="'+ titleIDsliced + '"]').slice(1,2).before(jQuery('<p style="font-weight:bold">').load(titleURL + ' .title-english'));
        }
    }
};

setTimeout(myFunc, 1000); //pause 1 second to allow for loading of page before executing script
