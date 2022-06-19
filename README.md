# MyAnimeList English Titles
Add English titles for various Anime and Manga pages on MyAnimeList.net, whilst still displaying the Japanese titles.

<b>Note:</b> If you are getting timed out of MAL after installation, please see the [FAQ](#faq).

## 📝 Table of Contents
  * [Note](#note)
  * [How to Install](#install)
  * [FAQ](#faq)
  * [Examples / Screenshots](#screenshots)

## ❗ Note <a name = "note"></a>
MAL has recently implemented the ability to view English titles, but did a half-hearted job with it. <b>This MAL setting is not (nicely) compatible with my script.</b> If you would like to enable it, you can do so by setting the "Anime Titles" and "Manga Titles" to "English" under the [Default Settings here](https://myanimelist.net/editprofile.php?go=listpreferences). This appears to change personal anime and manga lists to just English, and appends the English title underneath the Japanese title in some views (such as the Seasonal view), but does nothing to most pages, leaving them still in Japanese. On the personal anime and manga lists, it also does not retain the Japanese title. If you have this enabled, <b>it will not work well with my script</b>, so I recommend leaving them set to "Main Title". The script will continue adding English titles regardless of your settings, so you will just see the English title twice if you have the MAL settings set to English.

## 💻 How to Install <a name = "install"></a>
1. Download and install [Tampermonkey](https://www.tampermonkey.net/). Note: this script may not work properly with Greasemonkey or Violentmonkey.
2. [Click Here](https://greasyfork.org/en/scripts/420200-mal-english-titles) to open the script on Greasy Fork.
3. Click "Install this script" ([image](https://i.imgur.com/j2vhMKI.png)).
4. Click "Install" ([image](https://i.imgur.com/AcVa6C0.png)).
5. Open [MAL](https://myanimelist.net/), and navigate to any of the pages pictured below.
6. Done, see your translations!

## ❓ FAQ <a name = "faq"></a>
1. <b>MAL is timing out / [thinks I'm a bot](https://i.imgur.com/wShsC6I.png)?</b> When you browse a lot of new pages in a short amount of time, you may get temporarily timed out of MAL. If this happens, click 'Submit', wait for ~20 seconds, and then you can go back to browsing. Timeouts are most likely to happen when you <b>first install</b>, are browsing lots of pages at once, or for the first time are visiting a personal list with a lot of content. If it happens everytime you load a page, please submit a [bug report](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).
2. <b>Why are some translations missing?</b> Most likely, MAL does not have an official translation for that anime or manga. Alternatively, if the script is retrieving lots of new translations, MAL may time you out, and the script will be unable to load the remaining translations on the page. To fix this, refresh and see point 1 above.
3. <b>Why am I not getting translations on 'x' page?</b> Currently the script supports various pages throughout MAL, but not all, as it is manually coded for each endpoint. If you are not getting translations on <b>any</b> pages at all, submit a bug report. If you are getting translations, and have a specific page that is not currently supported, submit a feature request.
4. <b>Why aren't you using Kitsu API so we don't get timed out?</b> Primarily because I couldn't be bothered figuring it out, and I wanted it done natively as the info is already on MAL. Also if Kitsu goes down, the script won't have a good time.
5. <b>I've encountered a bug?</b> Please submit a [bug report](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).
6. <b>I've got a great idea?</b> Please submit a [feature request](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).

## 📸 Examples / Screenshots <a name = "screenshots"></a>
### Personal Anime / Manga List
<img src='https://i.imgur.com/KbTKPZW.png'>

### Top Anime / Manga
<img src='https://i.imgur.com/QBBR33t.png'>

### Seasonal Anime
<img src='https://i.imgur.com/gTFfCad.png'>

### Search
<img src='https://i.imgur.com/pXIEkdO.png'>

<i>Special thanks to nicegamer7 for their code contributions.</i>
