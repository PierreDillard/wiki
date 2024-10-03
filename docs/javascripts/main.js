
const EXPERT_LEVEL = 'expert';
const BEGINNER_LEVEL = 'beginner';

// initialize functions
function initializeApp() {
    initializeSettings();
    initializeLevelManagement();
    initializeFeedback('.md-nav__feedback--desktop');
    initializeFeedback('.md-feedback--mobile');
    initializeTagNavigation();
    setupEventListeners();
    handleInitialPageLoad();
}

function setupEventListeners() {
    document.body.addEventListener('click', handleNavigation);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('load', handleSearchPageCollapse);
}

function handleInitialPageLoad() {
    const savedLevel = localStorage.getItem("userLevel") || EXPERT_LEVEL;
    updateTOCVisibility(savedLevel);
    updateOptionsVisibility(savedLevel);

    const currentPagePath = getCurrentPagePath();
    const cachedKeywords = getCache('keywordsCache');
    const cachedDefinitions = getCache('definitionsCache');

    fetchKeywords(currentPagePath, cachedKeywords, cachedDefinitions);
}

// Handlers
function handleNavigation(event) {
    const target = event.target.closest('a');
    if (!isValidNavigationTarget(target)) return;

    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(target.href);

    if (shouldHandleNavigation(currentUrl, targetUrl)) {
        handleNavigationChange(event, target);
    }
}

function isValidNavigationTarget(target) {
    return target && target.href && !target.href.startsWith('javascript:');
}

function shouldHandleNavigation(currentUrl, targetUrl) {
    return currentUrl.pathname !== targetUrl.pathname || !targetUrl.searchParams.has('h');
}

function handleNavigationChange(event, target) {
    if (localStorage.getItem('tempExpertMode') === 'true') {
        event.preventDefault();
        revertFromTemporaryExpertMode();
        updateContentVisibility(BEGINNER_LEVEL);
        setTimeout(() => {
            window.location.href = target.href;
        }, 0);
    }
}

function handlePopState() {
    if (!isSearchResultPage() && revertFromTemporaryExpertMode()) {
        updateContentVisibility(BEGINNER_LEVEL);
    }
}

// feddback
function initializeFeedback(selector) {
    const feedback = document.querySelector(selector);
    if (!feedback) return;

    const buttons = feedback.querySelectorAll('.md-feedback__icon:not(.md-feedback__contribute)');
    const note = getFeedbackNote(feedback);

    buttons.forEach(button => {
        button.addEventListener('click', () => handleFeedbackClick(button, buttons, note));
    });

    initializeContributeIcon(feedback);
}

function getFeedbackNote(feedback) {
    let note = feedback.querySelector('.md-feedback__note');
    if (!note) {
        note = document.createElement('div');
        note.className = 'md-feedback__note';
        note.hidden = true;
        feedback.querySelector('.md-feedback__inner').appendChild(note);
    }
    return note;
}

function handleFeedbackClick(button, allButtons, note) {
    const data = button.getAttribute('data-md-value');
    const url = `/${window.location.pathname}`;
    const title = document.querySelector('.md-content__inner h1')?.textContent || '';

    console.log(`Feedback: ${data} for page ${url} (${title})`);

    note.textContent = `Thank you for your feedback!`;
    note.hidden = false;

    allButtons.forEach(btn => btn.disabled = true);
}

function initializeContributeIcon(feedback) {
    const contributeIcon = feedback.querySelector('.md-feedback__contribute');
    const contributeNote = feedback.querySelector('.md-feedback__contribute-note');

    if (contributeIcon && contributeNote) {
        contributeIcon.addEventListener('mouseenter', () => contributeNote.hidden = false);
        contributeIcon.addEventListener('mouseleave', () => contributeNote.hidden = true);
    }
}

// Collapse sections
function handleSearchPageCollapse() {
    const isSearchPage = new URLSearchParams(window.location.search).has('h');
    const wasCollapsed = localStorage.getItem('wasCollapsed');

    if (isSearchPage && localStorage.getItem('collapseAll') === 'true') {
        localStorage.setItem('wasCollapsed', 'true');
        toggleAllSections(false);
    } else if (wasCollapsed === 'true') {
        localStorage.removeItem('wasCollapsed');
        toggleAllSections(true);
    }
}

// Tags navigation
function initializeTagNavigation() {
    const wordCloudLinks = document.querySelectorAll('#dynamic-words-cloud a');
    wordCloudLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            navigateToTagPage(event.target.textContent);
        });
    });
}

function navigateToTagPage(keyword) {
    window.location.href = `/tags/#${keyword.toLowerCase()}`;
}

// Utils
function getCurrentPagePath() {
    let currentPagePath = window.location.pathname;
    if (currentPagePath.endsWith('/')) {
        currentPagePath = currentPagePath.slice(0, -1);
    }
    return currentPagePath.replace('.html', '.md');
}

function updateContentVisibility(level) {
    filterContent(level);
    updateTOCVisibility(level);
    updateOptionsVisibility(level);
}

document.addEventListener('DOMContentLoaded', initializeApp);