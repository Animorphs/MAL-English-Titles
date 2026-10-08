// ==UserScript==
// @name         MAL English Titles
// @version      3.0.1
// @description  Add English Titles to various MyAnimeList pages, whilst still displaying Japanese Titles
// @author       Animorphs
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace    https://github.com/Animorphs/MAL-English-Titles
// @icon         https://myanimelist.net/favicon.ico
// @match        https://myanimelist.net/*
// @updateURL    https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// @downloadURL  https://raw.githubusercontent.com/Animorphs/MAL-English-Titles/master/MAL_English_Titles.user.js
// ==/UserScript==

const CONFIG = {
    STORAGE: {
        ANIME: 'anime',
        MANGA: 'manga',
        MODE: 'titleDisplayMode',
        TITLE_MODE_NOTICE_SITE: 'titleModeUpdateNoticeSeenSite',
        TITLE_MODE_NOTICE_OWNLIST: 'titleModeUpdateNoticeSeenOwnList'
    },
    MODES: { COMBINED: 'prepend', ENGLISH: 'replace', JAPANESE: 'original' },
    EMPTY_CACHE_TTL: 2628000000,
    MAX_CONCURRENT_LOOKUPS: 4,
    REQUEST_TIMEOUT: 20000
};

const TITLE_MODE_OPTIONS = [
    { value: CONFIG.MODES.COMBINED, label: 'English and Japanese' },
    { value: CONFIG.MODES.ENGLISH, label: 'English only' },
    { value: CONFIG.MODES.JAPANESE, label: 'Japanese only' }
];

const TITLE_STYLES = `
    .eng-title-mode-ownlist { display: inline-block; position: relative; }
    .eng-title-mode-ownlist > .eng-title-mode-trigger {
        background: none; border: 0; color: #fff; cursor: pointer; font: inherit;
        margin-right: 8px; padding: 0;
    }
    .eng-title-mode-ownlist .eng-title-mode-dropdown {
        background: #fff; border: 1px solid #2e51a2; box-shadow: 0 2px 8px rgba(0, 0, 0, .25);
        display: none; line-height: normal; min-width: 180px; position: absolute;
        right: 7px; top: 31px; z-index: 20;
    }
    .eng-title-mode-ownlist:is(.hover, .open) .eng-title-mode-dropdown { display: block; }
    .eng-title-mode-ownlist .eng-title-mode-option {
        background: #fff; border: 0; color: #2e51a2; cursor: pointer; display: block;
        font: bold 12px Arial, sans-serif; padding: 9px 12px 9px 28px; position: relative;
        text-align: left; white-space: nowrap; width: 100%;
    }
    .eng-title-mode-ownlist .eng-title-mode-option:hover { background: #e1e7f5; }
    .eng-title-mode-ownlist .eng-title-mode-option::before {
        content: ''; left: 11px; position: absolute;
    }
    .eng-title-mode-ownlist .eng-title-mode-option[aria-checked="true"]::before { content: '\\2713'; }
    #menu_left #nav > li.eng-title-mode-nav {
        float: left; margin: 0; position: relative; width: 86px; z-index: 1000;
    }
    #menu_left #nav > li.eng-title-mode-nav > .eng-title-mode-nav-trigger {
        text-align: center; text-indent: 0; white-space: nowrap; width: auto;
    }
    #menu_left #nav > li.eng-title-mode-nav > ul { top: 34px; z-index: 1001; }
    .eng-title-mode-nav.hover > ul { display: block !important; }
    .eng-title-mode-nav .eng-title-mode-option { white-space: nowrap; }
    .eng-title-mode-nav .eng-title-mode-option::before {
        content: ''; display: inline-block; width: 17px;
    }
    .eng-title-mode-nav .eng-title-mode-option[aria-checked="true"]::before { content: '\\2713'; }

    .eng-title-mode-update-target {
        outline: 3px solid #f6c343 !important; outline-offset: 2px;
    }
    .eng-title-mode-update-popup {
        --eng-title-arrow-left: 50%;
        background: #fff; border: 2px solid #2e51a2; border-radius: 6px;
        box-shadow: 0 5px 18px rgba(0, 0, 0, .38); box-sizing: border-box;
        color: #323232 !important; font: 14px/1.45 Arial, sans-serif !important;
        max-width: calc(100vw - 24px); padding: 18px; position: fixed;
        text-align: left !important; width: 340px; z-index: 100000;
    }
    .eng-title-mode-update-popup::before,
    .eng-title-mode-update-popup::after {
        border-left: 9px solid transparent; border-right: 9px solid transparent;
        content: ''; left: var(--eng-title-arrow-left); position: absolute;
        transform: translateX(-50%);
    }
    .eng-title-mode-update-popup:not(.above)::before {
        border-bottom: 10px solid #2e51a2; top: -11px;
    }
    .eng-title-mode-update-popup:not(.above)::after {
        border-bottom: 9px solid #fff; top: -8px;
    }
    .eng-title-mode-update-popup.above::before {
        border-top: 10px solid #2e51a2; bottom: -11px;
    }
    .eng-title-mode-update-popup.above::after {
        border-top: 9px solid #fff; bottom: -8px;
    }
    .eng-title-mode-update-brand {
        color: #5b6472 !important; font: bold 10px/1.2 Arial, sans-serif !important;
        letter-spacing: .7px; margin: 0 0 5px !important; padding: 0 !important;
        text-align: left !important; text-transform: uppercase;
    }
    .eng-title-mode-update-heading {
        border: 0 !important; color: #2e51a2 !important; font: bold 18px/1.2 Arial, sans-serif !important;
        margin: 0 0 9px !important; padding: 0 !important; text-align: left !important;
    }
    .eng-title-mode-update-message {
        color: #323232 !important; font: 14px/1.45 Arial, sans-serif !important;
        margin: 0 0 10px !important; padding: 0 !important; text-align: left !important;
    }
    .eng-title-mode-update-options { margin: 0 0 15px; }
    .eng-title-mode-update-option {
        align-items: center; color: #323232 !important; display: flex;
        font: 14px/1.5 Arial, sans-serif !important; gap: 8px; text-align: left !important;
    }
    .eng-title-mode-update-option::before {
        color: #2e51a2; content: '\\2713'; font-weight: bold; width: 13px;
    }
    .eng-title-mode-update-actions { display: flex; justify-content: flex-end; }
    .eng-title-mode-update-popup .eng-title-mode-update-dismiss {
        background: #2e51a2; border: 0; border-radius: 3px; color: #fff; cursor: pointer;
        font: bold 13px Arial, sans-serif; margin: 0; padding: 7px 16px;
    }
    .eng-title-mode-update-popup .eng-title-mode-update-dismiss:hover { background: #1d439b; }
    .eng-title-mode-update-popup .eng-title-mode-update-dismiss:focus-visible {
        outline: 2px solid #f6c343; outline-offset: 2px;
    }

    .eng-title-translation { display: block; font-weight: bold; }
    .eng-title-context-related,
    .eng-title-context-ranking,
    .eng-title-context-table,
    .eng-title-context-profile,
    .eng-title-context-watch,
    .eng-title-source-related,
    .eng-title-source-ranking,
    .eng-title-source-table,
    .eng-title-source-profile,
    .eng-title-source-watch {
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .eng-title-context-table,
    .eng-title-source-table,
    .eng-title-context-profile,
    .eng-title-source-profile { display: block; max-width: 100%; }
    .eng-title-context-character,
    .eng-title-source-character {
        display: block; max-width: 100%; overflow-wrap: anywhere; white-space: normal;
    }
    .eng-title-context-blog { display: inline; font-weight: normal; }
    .user-statistics-stats:has(.eng-title-context-profile, .eng-title-source-profile) {
        table-layout: fixed;
        width: 100%;
    }
    .user-statistics-stats:has(.eng-title-context-profile, .eng-title-source-profile) .statistics-updates .data {
        overflow: hidden;
    }
    .eng-title-context-overlay {
        bottom: var(--eng-title-overlay-bottom, 2.4em); box-sizing: border-box; color: #fff; cursor: default;
        display: -webkit-box; font-family: Avenir, "lucida grande", tahoma, verdana, arial, sans-serif;
        font-size: 11px; left: 5px; line-height: 1.2;
        overflow: hidden; padding: 0 !important; position: absolute; right: 5px;
        text-shadow: 0 1px 2px #000; -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; z-index: 2;
    }
    .eng-title-source-overlay {
        display: -webkit-box !important; overflow: hidden;
        -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    }
    .widget.seasonal .eng-title-source-overlay {
        padding-top: var(--eng-title-source-padding-top, 15px) !important;
    }
    .seasonal-anime.eng-title-tile-layout { min-height: 285px; }
    .seasonal-anime.eng-title-tile-layout .title { min-height: 2.6em; line-height: 1.15; }
    .seasonal-anime.eng-title-tile-layout .title > a { display: block; line-height: 1.15; }
    .seasonal-anime.eng-title-tile-layout .title h3.h3_anime_subtitle {
        display: block; font-size: 11px; line-height: 1.4; margin: 0 0 2px;
    }
    .seasonal-anime.eng-title-tile-layout .category {
        display: block !important; margin-top: 0; visibility: visible !important;
    }
    .eng-tile-title { font-size: 11px; line-height: 1.4; margin: 0 0 2px; }
`;

let titleDisplayMode = CONFIG.MODES.COMBINED;
let storedAnime = {};
let storedManga = {};
let scanScheduled = false;
let currentPageTitleCached = false;
let activeLookups = 0;

const titlePresentations = new Map();
const processedTitleElements = new WeakSet();
const pendingLookups = new Map();
const lookupQueue = [];

function injectStyles()
{
    if (document.getElementById('eng-title-styles')) return;
    const style = document.createElement('style');
    style.id = 'eng-title-styles';
    style.textContent = TITLE_STYLES;
    document.head.appendChild(style);
}

function getModeOptionsHtml(elementName)
{
    return TITLE_MODE_OPTIONS.map(function (option)
    {
        if (elementName === 'a')
        {
            return `<li><a href="#" role="radio" class="eng-title-mode-option" data-title-mode="${option.value}">${option.label}</a></li>`;
        }
        return `<button type="button" role="radio" class="eng-title-mode-option" data-title-mode="${option.value}">${option.label}</button>`;
    }).join('');
}

function updateTitleModeControls()
{
    document.querySelectorAll('[data-title-mode]').forEach(function (option)
    {
        option.setAttribute('aria-checked', option.dataset.titleMode === titleDisplayMode ? 'true' : 'false');
    });
}

function bindTitleModeOptions(container)
{
    container.querySelectorAll('[data-title-mode]').forEach(function (option)
    {
        option.addEventListener('click', function (event)
        {
            event.preventDefault();
            setTitleDisplayMode(option.dataset.titleMode);
        });
    });
}

function initializeTitleModeControl()
{
    injectStyles();
    if (document.body.classList.contains('ownlist')) initializeOwnListTitleModeControl();
    else initializeNavigationTitleModeControl();
    updateTitleModeControls();
}

function initializeOwnListTitleModeControl()
{
    const host = document.querySelector('.list-status-title .stats');
    if (!host) return;
    const control = document.createElement('span');
    control.className = 'eng-title-mode-ownlist';
    control.innerHTML = `
        <button type="button" class="eng-title-mode-trigger" aria-haspopup="true" aria-expanded="false">
            <i class="fa-solid fa-language"></i>
            Language
            <i class="fa-solid fa-angle-down"></i>
        </button>
        <span class="eng-title-mode-dropdown" role="radiogroup" aria-label="Title display">
            ${getModeOptionsHtml('button')}
        </span>`;
    host.insertBefore(control, host.firstChild);
    bindTitleModeOptions(control);

    const trigger = control.querySelector('.eng-title-mode-trigger');
    let suppressHoverUntilLeave = false;

    function updateExpandedState()
    {
        trigger.setAttribute('aria-expanded', control.matches('.hover, .open') ? 'true' : 'false');
    }

    control.addEventListener('mouseenter', function ()
    {
        if (!suppressHoverUntilLeave) control.classList.add('hover');
        updateExpandedState();
    });
    control.addEventListener('mouseleave', function ()
    {
        control.classList.remove('hover');
        suppressHoverUntilLeave = false;
        updateExpandedState();
    });
    trigger.addEventListener('click', function (event)
    {
        event.stopPropagation();
        if (control.classList.contains('open'))
        {
            control.classList.remove('open', 'hover');
            suppressHoverUntilLeave = true;
        }
        else
        {
            control.classList.add('open');
        }
        updateExpandedState();
    });
    document.addEventListener('click', function (event)
    {
        if (!control.contains(event.target))
        {
            control.classList.remove('open', 'hover');
            suppressHoverUntilLeave = false;
            updateExpandedState();
        }
    });
}

function initializeNavigationTitleModeControl()
{
    const nav = document.getElementById('nav');
    if (!nav) return;
    const control = document.createElement('li');
    control.className = 'small2 eng-title-mode-nav';
    control.innerHTML = `
        <a href="#" class="non-link eng-title-mode-nav-trigger">Language</a>
        <ul class="x2-wider" role="radiogroup" aria-label="Title display">
            ${getModeOptionsHtml('a')}
        </ul>`;
    function placeAfterHelp()
    {
        const helpItem = Array.from(nav.children).find(function (item)
        {
            const link = item.querySelector(':scope > a.non-link');
            return link && link.textContent.trim() === 'Help';
        });
        if (helpItem && helpItem.nextElementSibling !== control)
        {
            nav.insertBefore(control, helpItem.nextElementSibling);
        }
        else if (!helpItem && control.parentElement !== nav)
        {
            nav.appendChild(control);
        }
    }

    placeAfterHelp();
    new MutationObserver(placeAfterHelp).observe(nav, { childList: true });
    bindTitleModeOptions(control);
    control.addEventListener('mouseenter', function () { control.classList.add('hover'); });
    control.addEventListener('mouseleave', function () { control.classList.remove('hover'); });
}

async function maybeShowTitleModeUpdateNotice()
{
    const ownList = document.body.classList.contains('ownlist');
    const noticeKey = ownList
        ? CONFIG.STORAGE.TITLE_MODE_NOTICE_OWNLIST
        : CONFIG.STORAGE.TITLE_MODE_NOTICE_SITE;
    if (await GM.getValue(noticeKey)) return;

    const target = document.querySelector('.eng-title-mode-trigger, .eng-title-mode-nav-trigger');
    if (!target) return;

    const popup = document.createElement('aside');
    popup.className = 'eng-title-mode-update-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-labelledby', 'eng-title-mode-update-heading');
    const locationText = ownList
        ? 'above the list'
        : 'in the blue navigation bar';
    popup.innerHTML = `
        <div class="eng-title-mode-update-brand">MAL English Titles browser extension</div>
        <div id="eng-title-mode-update-heading" class="eng-title-mode-update-heading">New title language options</div>
        <div class="eng-title-mode-update-message">
            This extension now lets you use the highlighted <strong>Language</strong> menu
            ${locationText} to choose:
        </div>
        <div class="eng-title-mode-update-options">
            <div class="eng-title-mode-update-option">English + Japanese</div>
            <div class="eng-title-mode-update-option">English only</div>
            <div class="eng-title-mode-update-option">Japanese only</div>
        </div>
        <div class="eng-title-mode-update-actions">
            <button type="button" class="eng-title-mode-update-dismiss">Got it</button>
        </div>`;
    document.body.appendChild(popup);
    target.classList.add('eng-title-mode-update-target');

    function positionPopup()
    {
        const targetRect = target.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const gap = 12;
        const pageMargin = 12;
        const showAbove = targetRect.bottom + gap + popupRect.height > window.innerHeight
            && targetRect.top - gap - popupRect.height >= pageMargin;
        const top = showAbove
            ? targetRect.top - gap - popupRect.height
            : targetRect.bottom + gap;
        const idealLeft = targetRect.left + targetRect.width / 2 - popupRect.width / 2;
        const left = Math.max(pageMargin, Math.min(idealLeft, window.innerWidth - popupRect.width - pageMargin));
        const arrowLeft = Math.max(14, Math.min(
            targetRect.left + targetRect.width / 2 - left,
            popupRect.width - 14
        ));

        popup.classList.toggle('above', showAbove);
        popup.style.left = left + 'px';
        popup.style.top = Math.max(pageMargin, top) + 'px';
        popup.style.setProperty('--eng-title-arrow-left', arrowLeft + 'px');
    }

    function dismissPopup()
    {
        window.removeEventListener('resize', positionPopup);
        window.removeEventListener('scroll', positionPopup, true);
        document.removeEventListener('keydown', handleKeydown);
        target.removeEventListener('click', dismissPopup);
        target.classList.remove('eng-title-mode-update-target');
        popup.remove();
    }

    function handleKeydown(event)
    {
        if (event.key === 'Escape') dismissPopup();
    }

    popup.querySelector('.eng-title-mode-update-dismiss').addEventListener('click', dismissPopup);
    target.addEventListener('click', dismissPopup);
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', positionPopup);
    window.addEventListener('scroll', positionPopup, true);
    positionPopup();
    await GM.setValue(noticeKey, true);
}

async function setTitleDisplayMode(mode)
{
    if (!TITLE_MODE_OPTIONS.some(function (option) { return option.value === mode; }) || mode === titleDisplayMode) return;
    titleDisplayMode = mode;
    updateTitleModeControls();
    refreshPresentedTitles();
    await GM.setValue(CONFIG.STORAGE.MODE, titleDisplayMode);
}

function removePresentationArtifacts(presentation)
{
    if (presentation.placement === 'overlay')
    {
        const link = presentation.element.closest('a');
        const host = link && link.parentElement;
        if (host)
        {
            Array.from(host.children).forEach(function (child)
            {
                if (!child.classList.contains('eng-title-translation')) return;
                const translationKey = child.dataset.engTitleKey;
                if (!translationKey || translationKey === presentation.translationKey) child.remove();
            });
        }
    }
    if (presentation.translation)
    {
        presentation.translation.remove();
        presentation.translation = null;
    }
    if (presentation.replaced)
    {
        presentation.element.innerHTML = presentation.originalHtml;
        presentation.replaced = false;
    }
    if (presentation.context)
    {
        presentation.element.classList.remove('eng-title-source-' + presentation.context);
    }
    if (presentation.seasonalOverlay)
    {
        presentation.element.style.removeProperty('--eng-title-source-padding-top');
    }
    if (presentation.tileHost)
    {
        presentation.tileHost.classList.remove('eng-title-tile-layout');
        presentation.tileHost = null;
    }
}

function createTranslationElement(presentation)
{
    const translation = document.createElement(presentation.tile ? 'h3' : 'span');
    translation.className = 'eng-title-translation';
    if (presentation.tile) translation.classList.add('h3_anime_subtitle');
    if (presentation.tileTitle) translation.classList.add('eng-tile-title');
    if (presentation.context) translation.classList.add('eng-title-context-' + presentation.context);
    translation.dataset.engTitleKey = presentation.translationKey;
    translation.title = presentation.englishTitle;
    translation.textContent = presentation.parenthetical
        ? ` (${presentation.englishTitle})`
        : presentation.englishTitle;
    return translation;
}

function insertTranslation(presentation, translation)
{
    if (presentation.placement === 'inside-before')
    {
        presentation.element.insertBefore(translation, presentation.element.firstChild);
        presentation.translation = translation;
        return;
    }

    let reference = presentation.element;
    if (presentation.placement === 'before-parent') reference = presentation.element.parentElement;
    else if (presentation.placement === 'overlay') reference = presentation.element.closest('a');
    if (!reference || !reference.parentNode) return;
    reference.parentNode.insertBefore(
        translation,
        presentation.placement === 'after' ? reference.nextSibling : reference
    );
    presentation.translation = translation;
}

function positionSeasonalOverlayTranslation(presentation)
{
    if (!presentation.translation || !presentation.seasonalOverlay) return;
    const sourceStyle = getComputedStyle(presentation.element);
    const sourceHeight = presentation.element.getBoundingClientRect().height;
    const gradientPadding = parseFloat(sourceStyle.paddingTop) || 0;
    const visibleTitleHeight = Math.max(0, sourceHeight - gradientPadding);
    const translationHeight = presentation.translation.getBoundingClientRect().height;
    const titleGap = 2;
    presentation.translation.style.setProperty(
        '--eng-title-overlay-bottom',
        Math.ceil(visibleTitleHeight + titleGap) + 'px'
    );
    presentation.element.style.setProperty(
        '--eng-title-source-padding-top',
        Math.ceil(gradientPadding + translationHeight + titleGap) + 'px'
    );
}

function replaceTitleText(element, englishTitle)
{
    const titleNode = Array.from(element.childNodes).find(function (node)
    {
        return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
    });
    if (titleNode)
    {
        const leadingWhitespace = titleNode.textContent.match(/^\s*/)[0];
        const trailingWhitespace = titleNode.textContent.match(/\s*$/)[0];
        titleNode.textContent = leadingWhitespace + englishTitle + trailingWhitespace;
        return;
    }

    const preferredSelectors = ['strong', 'b', '.title'];
    for (const selector of preferredSelectors)
    {
        const candidates = Array.from(element.querySelectorAll(selector)).filter(function (candidate)
        {
            return candidate.textContent.trim();
        });
        if (candidates.length === 1)
        {
            replaceTitleText(candidates[0], englishTitle);
            return;
        }
    }

    const textChildren = Array.from(element.children).filter(function (child)
    {
        return child.textContent.trim();
    });
    if (textChildren.length === 1)
    {
        replaceTitleText(textChildren[0], englishTitle);
        return;
    }

    element.textContent = englishTitle;
}

function renderTitlePresentation(presentation)
{
    removePresentationArtifacts(presentation);
    if (titleDisplayMode === CONFIG.MODES.JAPANESE) return;
    if (presentation.englishTitle === null)
    {
        ensureEnglishTitle(presentation);
        return;
    }
    if (!presentation.englishTitle) return;
    if (titleDisplayMode === CONFIG.MODES.ENGLISH)
    {
        replaceTitleText(presentation.element, presentation.englishTitle);
        presentation.replaced = true;
        return;
    }

    const translation = createTranslationElement(presentation);
    insertTranslation(presentation, translation);
    positionSeasonalOverlayTranslation(presentation);
    if (presentation.translation && presentation.context)
    {
        presentation.element.classList.add('eng-title-source-' + presentation.context);
    }
    if (presentation.translation && presentation.tile)
    {
        presentation.tileHost = presentation.element.closest('.seasonal-anime');
        if (presentation.tileHost) presentation.tileHost.classList.add('eng-title-tile-layout');
    }
}

function registerTitle(element, info, options = {})
{
    if (!element || !info || processedTitleElements.has(element)) return;
    processedTitleElements.add(element);
    const cachedTitle = readCachedTitle(info);
    const presentation = {
        context: options.context || '',
        element: element,
        englishTitle: cachedTitle === undefined ? null : cachedTitle,
        info: info,
        lookupStarted: false,
        originalHtml: element.innerHTML,
        parenthetical: Boolean(options.parenthetical),
        placement: options.placement || 'before',
        replaced: false,
        seasonalOverlay: Boolean(options.seasonalOverlay),
        tile: Boolean(options.tile),
        tileHost: null,
        tileTitle: Boolean(options.tileTitle),
        translation: null,
        translationKey: info.type + ':' + info.id
    };
    titlePresentations.set(element, presentation);
    renderTitlePresentation(presentation);
}

function refreshPresentedTitles()
{
    titlePresentations.forEach(renderTitlePresentation);
}

function ensureEnglishTitle(presentation)
{
    if (presentation.lookupStarted || titleDisplayMode === CONFIG.MODES.JAPANESE) return;
    presentation.lookupStarted = true;
    resolveEnglishTitle(presentation.info).then(function (englishTitle)
    {
        presentation.englishTitle = englishTitle;
        if (presentation.element.isConnected) renderTitlePresentation(presentation);
    });
}

function getMediaInfo(link, expectedType)
{
    let url;
    try { url = new URL(link.href, location.origin); }
    catch (error) { return null; }
    if (url.origin !== location.origin) return null;

    let match = url.pathname.match(/^\/(anime|manga)\/([1-9][0-9]*)(?:\/.*)?$/);
    if (!match)
    {
        const phpMatch = url.pathname.match(/^\/(anime|manga)\.php$/);
        const id = url.searchParams.get('id');
        if (!phpMatch || !/^[1-9][0-9]*$/.test(id || '')) return null;
        match = [null, phpMatch[1], id];
    }
    if (expectedType && match[1] !== expectedType) return null;
    return { type: match[1], id: match[2], url: `${location.origin}/${match[1]}/${match[2]}` };
}

function getRecommendationMediaInfo(link, currentMedia)
{
    const directInfo = getMediaInfo(link);
    if (directInfo) return directInfo;
    let url;
    try { url = new URL(link.href, location.origin); }
    catch (error) { return null; }
    const match = url.pathname.match(/^\/recommendations\/(anime|manga)\/([1-9][0-9]*)-([1-9][0-9]*)\/?$/);
    if (!match || !currentMedia || match[1] !== currentMedia.type) return null;
    const id = match[2] === currentMedia.id ? match[3] : match[2];
    return { type: match[1], id: id, url: `${location.origin}/${match[1]}/${id}` };
}

function getCurrentMediaInfo()
{
    return getMediaInfo({ href: location.href });
}

function findMediaTitleElement(link)
{
    const nestedTitle = link.querySelector(':scope > span.title, :scope > h3 > span.title');
    if (nestedTitle) return nestedTitle;
    return Array.from(link.childNodes).some(function (node)
    {
        return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
    }) ? link : null;
}

function registerLinks(selector, options = {})
{
    document.querySelectorAll(selector).forEach(function (link)
    {
        if (options.filter && !options.filter(link)) return;
        const info = options.infoGetter ? options.infoGetter(link) : getMediaInfo(link, options.type);
        const element = options.elementGetter ? options.elementGetter(link) : link;
        registerTitle(element, info, options);
    });
}

function registerTextMediaLinks(selector, options = {})
{
    registerLinks(selector, Object.assign({}, options, { elementGetter: findMediaTitleElement }));
}

function getTitleStore(type)
{
    return type === 'anime' ? storedAnime : storedManga;
}

function hasFreshCachedTitle(info)
{
    const store = getTitleStore(info.type);
    if (!Object.prototype.hasOwnProperty.call(store, info.id)) return false;
    return store[info.id][0] !== '' || Date.now() - store[info.id][1] <= CONFIG.EMPTY_CACHE_TTL;
}

function readCachedTitle(info)
{
    return hasFreshCachedTitle(info) ? getTitleStore(info.type)[info.id][0] : undefined;
}

async function storeEnglishTitle(info, englishTitle)
{
    const store = getTitleStore(info.type);
    store[info.id] = [englishTitle, Date.now()];
    await GM.setValue(info.type === 'anime' ? CONFIG.STORAGE.ANIME : CONFIG.STORAGE.MANGA, store);
}

function fetchEnglishTitle(info)
{
    return new Promise(function (resolve)
    {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'document';
        xhr.timeout = CONFIG.REQUEST_TIMEOUT;
        xhr.onload = async function ()
        {
            if (xhr.status !== 200 || !xhr.responseXML)
            {
                resolve('');
                return;
            }
            const titleElement = xhr.responseXML.querySelector('.title-english');
            const englishTitle = titleElement ? titleElement.textContent.trim() : '';
            await storeEnglishTitle(info, englishTitle);
            resolve(englishTitle);
        };
        xhr.onerror = function () { resolve(''); };
        xhr.ontimeout = function () { resolve(''); };
        xhr.open('GET', info.url);
        xhr.send();
    });
}

function drainLookupQueue()
{
    while (activeLookups < CONFIG.MAX_CONCURRENT_LOOKUPS && lookupQueue.length)
    {
        const job = lookupQueue.shift();
        activeLookups++;
        fetchEnglishTitle(job.info).then(job.resolve).finally(function ()
        {
            activeLookups--;
            drainLookupQueue();
        });
    }
}

function resolveEnglishTitle(info)
{
    const cachedTitle = readCachedTitle(info);
    if (cachedTitle !== undefined) return Promise.resolve(cachedTitle);
    const key = info.type + ':' + info.id;
    if (pendingLookups.has(key)) return pendingLookups.get(key);
    const lookup = new Promise(function (resolve)
    {
        lookupQueue.push({ info: info, resolve: resolve });
        drainLookupQueue();
    });
    pendingLookups.set(key, lookup);
    lookup.finally(function () { pendingLookups.delete(key); });
    return lookup;
}

async function cacheCurrentMediaTitle()
{
    if (currentPageTitleCached) return;
    const info = getCurrentMediaInfo();
    if (!info) return;
    currentPageTitleCached = true;
    const titleElement = document.querySelector('.title-english');
    if (titleElement) await storeEnglishTitle(info, titleElement.textContent.trim());
    else if (!hasFreshCachedTitle(info)) await storeEnglishTitle(info, '');
}

function scanHomePage()
{
    document.querySelectorAll('#contentWrapper a[href]').forEach(function (link)
    {
        const info = getMediaInfo(link);
        const element = findMediaTitleElement(link);
        if (!info || !element) return;
        const overlay = element.matches('span.title') && element.closest('a') === link;
        registerTitle(element, info, {
            context: overlay ? 'overlay' : 'home',
            placement: overlay ? 'overlay' : 'before',
            seasonalOverlay: Boolean(overlay && element.closest('.widget.seasonal'))
        });
    });
}

function scanMediaDetailPage(currentMedia)
{
    registerLinks('.entries-tile .entry .content .title > a[href], td.borderClass ul.entries > li > a[href]', {
        context: 'related'
    });
    registerLinks('#anime_recommendation li.btn-anime > a.link, #manga_recommendation li.btn-manga > a.link, #manga_recommendation li.btn-anime > a.link', {
        context: 'overlay',
        elementGetter: function (link) { return link.querySelector(':scope > span.title'); },
        infoGetter: function (link) { return getRecommendationMediaInfo(link, currentMedia); },
        placement: 'overlay'
    });
    if (location.pathname.includes('/userrecs'))
    {
        document.querySelectorAll('[style*="margin-bottom: 2px"]').forEach(function (container)
        {
            const link = container.querySelector(':scope > a[href]');
            if (link) registerTitle(link, getMediaInfo(link, currentMedia.type));
        });
    }
}

function scanRecommendationsPage()
{
    registerLinks('.spaceit.borderClass a[href]', {
        filter: function (link)
        {
            const next = link.nextElementSibling;
            return Boolean(link.querySelector('strong')) && !(next && next.getAttribute('style') === 'font-weight:bold');
        }
    });
}

function scanSearchPages(path)
{
    if (path.startsWith('/search/'))
    {
        registerLinks('a.fw-b.fl-l[href*="/anime/"]', { type: 'anime', placement: 'before-parent' });
        registerLinks('a.fw-b[href*="/manga/"]', { type: 'manga' });
    }
    else if (path === '/anime.php')
    {
        registerLinks('a.fw-b.fl-l[href*="/anime/"]', { type: 'anime', placement: 'before-parent' });
        registerLinks('#contentWrapper li.btn-anime > a.link[href*="/anime/"]', {
            type: 'anime',
            context: 'overlay',
            elementGetter: function (link) { return link.querySelector(':scope > span.title, :scope > h3 > span.title'); },
            placement: 'overlay'
        });
        registerLinks('#contentWrapper .auto-recommendations[data-category="anime"] .items > a.item[href*="/anime/"]', {
            type: 'anime',
            context: 'auto-carousel',
            elementGetter: function (link) { return link.querySelector(':scope > span.title'); },
            placement: 'inside-before'
        });
    }
    else if (path === '/manga.php') registerLinks('a.fw-b[href*="/manga/"]', { type: 'manga' });
}

function scanBrowsePages(path)
{
    if (path === '/topanime.php') registerLinks('.fl-l.fs14.fw-b.anime_ranking_h3 > a[href]', { type: 'anime' });
    else if (path === '/topmanga.php') registerLinks('a.hoverinfo_trigger.fs14.fw-b[href]', { type: 'manga' });
    else if (path.startsWith('/anime/season')) registerLinks('a.link-title[href]', { type: 'anime', tile: true });
    else if (path === '/reviews.php') registerLinks('.review-element .titleblock a.title[href]');
}

function scanViewStylePage(path)
{
    const type = path.startsWith('/anime/') ? 'anime' : 'manga';
    if (document.querySelector('.js-btn-view-style.seasonal.on'))
    {
        registerLinks('a.link-title[href]', {
            type: type,
            placement: type === 'anime' ? 'before-parent' : 'before',
            tile: true
        });
    }
    else if (document.querySelector('.js-btn-view-style.list.on'))
    {
        registerLinks('a.hoverinfo_trigger.fw-b[href]', { type: type });
    }
}

function scanCommunityPages(path)
{
    if (path === '/clubs.php')
    {
        registerTextMediaLinks('.borderClass > a[href]', { context: 'table' });
    }
    else if (/^\/character\/[1-9][0-9]*(?:\/|$)/.test(path))
    {
        registerTextMediaLinks('td.borderClass a[href*="/anime/"], td.borderClass a[href*="/manga/"]', { context: 'character' });
    }
    else if (path === '/blog.php')
    {
        registerLinks(
            'a.dark_text[href*="/anime/"], a.dark_text[href*="/manga/"], ' +
            '#content > div > a[href*="/anime/"], #content > div > a[href*="/manga/"]',
            { context: 'blog', parenthetical: true, placement: 'after' }
        );
    }
}

function scanProfilePage(path)
{
    if (!/^\/profile\/[^/]+(?:\/|$)/.test(path)) return;

    registerLinks('.statistics-updates .data > a[href*="/anime/"], .statistics-updates .data > a[href*="/manga/"]', {
        context: 'profile'
    });
    registerLinks('.review-element .titleblock a.title[href]');

    if (/\/recommendations\/?$/.test(path))
    {
        registerLinks('#contentWrapper a[href*="/anime/"] > strong, #contentWrapper a[href*="/manga/"] > strong', {
            elementGetter: function (strong) { return strong.parentElement; },
            infoGetter: function (strong) { return getMediaInfo(strong.parentElement); }
        });
    }
}

function scanStackPage()
{
    const viewButton = document.querySelector('.view-style2 a.on');
    const tileView = Boolean(viewButton && viewButton.classList.contains('tile'));
    const seasonalView = Boolean(viewButton && viewButton.classList.contains('seasonal'));
    if (tileView)
    {
        registerLinks('.seasonal-anime .title > a[href*="/anime/"], .seasonal-anime .title > a[href*="/manga/"]', {
            tile: true, tileTitle: true
        });
    }
    else
    {
        registerLinks('a.link-title[href*="/anime/"], a.link-title[href*="/manga/"]', {
            placement: seasonalView ? 'before' : 'before-parent', tile: seasonalView
        });
    }
}

function scanProducerPage()
{
    if (document.querySelector('.js-btn-view-style2.tile.on'))
    {
        registerLinks('.seasonal-anime.js-seasonal-anime.js-anime-type-all > .title > a[href]', {
            type: 'anime', tile: true, tileTitle: true
        });
    }
    else if (document.querySelector('.js-btn-view-style2.seasonal.on'))
    {
        registerLinks('a.link-title[href]', { type: 'anime', tile: true });
    }
    else if (document.querySelector('.js-btn-view-style2.list.on'))
    {
        registerLinks('.spaceit_pad > a[href]', { type: 'anime' });
    }
}

function scanLegacyPages(path)
{
    if (path === '/shared.php')
    {
        const type = new URL(location.href).searchParams.get('type') === 'manga' ? 'manga' : 'anime';
        registerTextMediaLinks(`a[href*="/${type}/"]:not(.Lightbox_AddEdit)`, { type: type });
    }
    else if (path.startsWith('/history'))
    {
        registerTextMediaLinks('a[href*="/anime.php?id="]', { type: 'anime' });
        registerTextMediaLinks('a[href*="/manga.php?id="]', { type: 'manga' });
    }
    else if (path.startsWith('/people'))
    {
        registerTextMediaLinks('a[href*="/anime/"]:not(.Lightbox_AddEdit), a[href*="/manga/"]:not(.Lightbox_AddEdit)');
    }
}

function scanRequestedPages(path)
{
    if (path === '/character.php')
    {
        registerLinks('td.animeography div.title > a[href], td.mangaography div.title > a[href]', { context: 'table' });
    }
    else if (path === '/company' || path === '/company/')
    {
        registerLinks('tr.ranking-list td.score p > a[href], tr.ranking-list td.popularity p > a[href]', { context: 'table' });
    }
    else if (/^\/watch\/(episode|promotion)(?:\/|$)/.test(path))
    {
        registerLinks('.video-info-title > a.mr4[href]', { context: 'watch' });
    }
}

function scanPageTitles()
{
    const path = location.pathname;
    const currentMedia = getCurrentMediaInfo();
    if (path === '/') scanHomePage();
    if (currentMedia) scanMediaDetailPage(currentMedia);
    if (path === '/recommendations.php') scanRecommendationsPage();
    if (path.startsWith('/animelist/') || path.startsWith('/mangalist/')) registerLinks('.data.title > a[href]');
    scanSearchPages(path);
    scanBrowsePages(path);
    if (path.startsWith('/anime/genre/') || path.startsWith('/manga/genre/') || path.startsWith('/manga/adapted') || path.startsWith('/manga/magazine/')) scanViewStylePage(path);
    if (path.startsWith('/stacks/')) scanStackPage();
    if (path.startsWith('/anime/producer')) scanProducerPage();
    scanCommunityPages(path);
    scanProfilePage(path);
    scanLegacyPages(path);
    scanRequestedPages(path);
    registerLinks('.ranking-container ol > li > a[href]', { context: 'ranking' });
}

function scheduleTitleScan()
{
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(function ()
    {
        scanScheduled = false;
        scanPageTitles();
    });
}

function observeDynamicTitles()
{
    const root = document.getElementById('contentWrapper') || document.body;
    new MutationObserver(scheduleTitleScan).observe(root, { childList: true, subtree: true });
}

(async function initialize()
{
    storedAnime = await GM.getValue(CONFIG.STORAGE.ANIME) || {};
    storedManga = await GM.getValue(CONFIG.STORAGE.MANGA) || {};
    const savedMode = await GM.getValue(CONFIG.STORAGE.MODE);
    if (TITLE_MODE_OPTIONS.some(function (option) { return option.value === savedMode; })) titleDisplayMode = savedMode;
    initializeTitleModeControl();
    await maybeShowTitleModeUpdateNotice();
    await cacheCurrentMediaTitle();
    scanPageTitles();
    observeDynamicTitles();
})();
