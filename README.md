# MyAnimeList English Titles
Add English titles for various Anime and Manga pages on MyAnimeList.net, whilst still retaining the Japanese titles.

<b>Note:</b> If you are getting timed out of MAL after installation, please see the [FAQ](#faq).

## 📝 Table of Contents
  * [How to Install](#install)
  * [FAQ](#faq)
  * [Examples / Screenshots](#screenshots)

## 💻 How to Install <a name = "install"></a>
1. Download and install [Tampermonkey](https://www.tampermonkey.net/). Note: this script may not work properly with Greasemonkey or Violentmonkey.
2. [Click Here](https://github.com/Animorphs/MAL-English-Titles/raw/master/MAL_English_Titles.user.js) to open the script for download.
3. Click "Install".
4. Open [MAL](https://myanimelist.net/), and navigate to any of the pages pictured below.
5. Done, see your translations!

## ❓ FAQ <a name = "faq"></a>
1. <b>MAL is timing out / [thinks I'm a bot](https://i.imgur.com/wShsC6I.png)?</b> When you browse a lot of new pages in a short amount of time, you may get temporarily timed out of MAL. If this happens, click 'Submit', wait for ~20 seconds, and then you can go back to browsing. Timeouts are most likely to happen when you <b>first install</b>, are browsing lots of pages at once, or for the first time are visiting a personal list with a lot of content. If it happens everytime you load a page, please submit a [bug report](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).
2. <b>Why are some translations missing?</b> Option 1: MAL does not have an official translation for that anime or manga. Option 2: The script may have accidentally saved the blank title before it properly loaded. This will fix itself within 3 weeks, or you can force it immediately by [following these steps](https://pastebin.com/5XbdGT8u).
3. <b>Why am I not getting translations on 'x' page?</b> Currently the script supports various pages throughout MAL, but not all, as it is manually coded for each endpoint. If you are not getting translations on <b>any</b> pages, please create a bug report. If you are getting translations, and have a specific page that is not currently supported, please create a feature request.
4. <b>Why aren't you using Kitsu API so we don't get timed out?</b> Mostly because I wanted it done natively as the info is already on the website, and additionally I ran into a bug where if a title was too long on MAL ([such as this](https://myanimelist.net/anime/40496/Maou_Gakuin_no_Futekigousha__Shijou_Saikyou_no_Maou_no_Shiso_Tensei_shite_Shison-tachi_no_Gakkou_e_)), it couldn't grab the translation from Kitsu. Last but not least, if Kitsu API goes down, the script will stop working during that period as well.
5. <b>I've encountered a bug?</b> Please submit a [bug report](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).
6. <b>I've got a great idea?</b> Please submit a [feature request](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).

## 📸 Examples / Screenshots <a name = "screenshots"></a>
### Personal Anime / Manga List
<img src='https://i.imgur.com/KbTKPZW.png'>

### Top Anime / Manga
<img src='https://i.imgur.com/QBBR33t.png'>

### Search
<img src='https://i.imgur.com/pXIEkdO.png'>

Plus many more pages!
