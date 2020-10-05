# MyAnimeList English Titles
Add English titles for various Anime and Manga pages on MyAnimeList.net, whilst still retaining the Japanese titles.

<b>Note:</b> If you browse a lot of new pages in a short amount of time, <b>you may get temporarily timed out of MAL</b>. If this happens, click 'submit', wait for ~20 seconds, and then you can go back to browsing. Timeouts are most likely to happen when you first install, are browsing lots of pages at once, or for the first time are visiting a personal list with a lot of content.

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
1. Why are only some translations missing?</b> MAL does not have an official translation for that anime or manga.
2. <b>Why am I getting no translations at all on x page?</b> Currently, this script supports the following endpoints: animelist, mangalist, topanime, topmanga, search, anime, manga. If you have another page you would like translations for, please create a feature request.
3. <b>Why aren't you using Kitsu API so we don't get timed out?</b> Mostly because I wanted it done natively as the info is already on the website, and additionally I ran into a bug where if a title was too long on MAL ([such as this](https://myanimelist.net/anime/40496/Maou_Gakuin_no_Futekigousha__Shijou_Saikyou_no_Maou_no_Shiso_Tensei_shite_Shison-tachi_no_Gakkou_e_), it couldn't grab the translation from Kitsu. Last but not least, if Kitsu API goes down, the script will stop working during that period as well.
4. <b>I've encountered a bug?</b> Please submit a [bug report](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).
5. <b>I've got a great idea?</b> Please submit a [feature request](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).

## 📸 Examples / Screenshots <a name = "screenshots"></a>
### Personal Anime / Manga List
<img src='https://i.imgur.com/NsFRIOd.png'>

### Top Anime / Manga
<img src='https://i.imgur.com/3nlIbZn.png'>

### Search
<img src='https://i.imgur.com/V5Kt6Lr.png'>
