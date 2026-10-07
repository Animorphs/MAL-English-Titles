# MyAnimeList English Titles

Add English titles across MyAnimeList's anime and manga pages, with the option to display them alongside the Japanese titles or on their own.

**Note:** If MAL shows a CAPTCHA or temporarily times you out after installation, please see the [FAQ](#faq).

## 📝 Table of Contents

- [How to Install](#install)
- [FAQ](#faq)
- [Examples / Screenshots](#screenshots)

## 💻 How to Install <a name="install"></a>

1. Download and install [Tampermonkey](https://www.tampermonkey.net/). This script should also work with Greasemonkey and Violentmonkey, but has not been tested with them.
2. If you use a Chromium-based browser such as Google Chrome, Microsoft Edge, Brave, or Opera, open `chrome://extensions`, select **Details** for Tampermonkey, and enable **Allow user scripts**.
3. Open this script on [Greasy Fork](https://greasyfork.org/en/scripts/420200-mal-english-titles).
4. Click **Install this script**.
5. Click **Install**.
6. Open [MyAnimeList](https://myanimelist.net/) and navigate to a supported page.
7. Use the **Language** menu to choose whether English titles appear alongside Japanese titles or on their own.

## ❓ FAQ <a name="faq"></a>

1. **Why is MAL showing a CAPTCHA or timing me out?**  
   When you visit a page containing many uncached titles, the script may need to send numerous requests to MAL. MAL may temporarily rate-limit these requests. Complete the CAPTCHA, if shown, and then return to browsing. This is most likely to happen when you first install the script, open many pages at once, or visit a large personal list for the first time.

2. **Why am I seeing the English title twice instead of the Japanese title?**  
   In your [MAL Default Settings](https://myanimelist.net/editprofile.php?go=listpreferences), set both **Anime Titles** and **Manga Titles** to **Main Title**.

3. **Why are some English titles missing?**  
   MAL may not have an official English title for that anime or manga. Alternatively, MAL may have temporarily rate-limited the script while it was retrieving many new titles. Try refreshing the page later and see question 1 above.

4. **Why aren't titles being translated on a particular page?**  
   First, ensure you completed step 2 of the [installation instructions](#install) if you use a Chromium-based browser. The script supports many pages throughout MAL, but support is implemented separately for each type of page. If translations do not work anywhere, please submit a bug report. If only a particular page is unsupported, please submit a feature request.

5. **I found a bug. What should I do?**  
   Please submit a [bug report](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).

6. **I have an idea for the script. Where can I suggest it?**  
   Please submit a [feature request](https://github.com/Animorphs/MAL-English-Titles/issues/new/choose).

## 📸 Examples / Screenshots <a name="screenshots"></a>

### Personal Anime / Manga List

<img src="https://i.imgur.com/12iQQDJ.png">

### Top Anime / Manga

<img src="https://i.imgur.com/jz4U7pk.png">

Many more pages are supported throughout MyAnimeList!

*Special thanks to nicegamer7 for their code contributions.*

*Parts of this script were developed with the assistance of AI.*
