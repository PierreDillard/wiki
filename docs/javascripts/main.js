document.addEventListener('DOMContentLoaded', function () {
  initializeSettings();
  initializeLevelManagement();
  initializeFeedback('.md-nav__feedback--desktop');
  initializeFeedback('.md-feedback--mobile');

  const savedLevel = localStorage.getItem("userLevel") || "expert";
  updateTOCVisibility(savedLevel);
  updateOptionsVisibility(savedLevel);

  let currentPagePath = window.location.pathname;

  if (currentPagePath.endsWith('/')) {
      currentPagePath = currentPagePath.slice(0, -1);
  }

  currentPageMdPath = currentPagePath.replace('.html', '.md');

  let cachedKeywords = getCache('keywordsCache');
  let cachedDefinitions = getCache('definitionsCache');

  fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);

  document.body.addEventListener('click', function(event) {
      const target = event.target.closest('a');
      if (target && target.href && !target.href.startsWith('javascript:')) {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(target.href);
  
        if (currentUrl.pathname !== targetUrl.pathname || !targetUrl.searchParams.has('h')) {
          if (localStorage.getItem('tempExpertMode') === 'true') {
            event.preventDefault();
            revertFromTemporaryExpertMode();
            filterContent('beginner');
            updateTOCVisibility('beginner');
            updateOptionsVisibility('beginner');
            
            setTimeout(() => {
              window.location.href = target.href;
            }, 0);
          }
        }
      }
  });
  
  window.addEventListener('popstate', function() {
      if (!isSearchResultPage() && revertFromTemporaryExpertMode()) {
        filterContent('beginner');
        updateTOCVisibility('beginner');
        updateOptionsVisibility('beginner');
      }
  });

  const contributeIcons = document.querySelectorAll('.md-feedback__contribute');
  contributeIcons.forEach(icon => {
      const contributeNote = icon.closest('.md-feedback__inner').querySelector('.md-feedback__contribute-note');
      if (contributeNote) {
          icon.addEventListener('mouseenter', function() {
              contributeNote.hidden = false;
          });
          icon.addEventListener('mouseleave', function() {
              contributeNote.hidden = true;
          });
      }
  });

  handleSearchPageCollapse();
});

function initializeFeedback(selector) {
  const feedback = document.querySelector(selector);
  if (feedback) {
      const buttons = feedback.querySelectorAll('.md-feedback__icon:not(.md-feedback__contribute)');
      const note = feedback.querySelector('.md-feedback__note') || document.createElement('div');
      note.className = 'md-feedback__note';
      note.hidden = true;
      feedback.querySelector('.md-feedback__inner').appendChild(note);

      buttons.forEach(button => {
          button.addEventListener('click', () => {
              const data = button.getAttribute('data-md-value');
              const url = `/${window.location.pathname}`;
              const title = document.querySelector('.md-content__inner h1')?.textContent || '';
              
              // Here you would typically send this data to your analytics service
              console.log(`Feedback: ${data} for page ${url} (${title})`);

              // Show thank you message
              note.textContent = `Thank you for your feedback!`;
              note.hidden = false;

              // Disable buttons
              buttons.forEach(btn => btn.disabled = true);
          });
      });
  }
}

    // Open all colapse section if it's a search page
    function handleSearchPageCollapse() {
      const isSearchPage = new URLSearchParams(window.location.search).has('h');
      const wasCollapsed = localStorage.getItem('wasCollapsed');
  
      if (isSearchPage) {
  
          if (localStorage.getItem('collapseAll') === 'true') {
              localStorage.setItem('wasCollapsed', 'true');
              toggleAllSections(false);
          }
      } else if (wasCollapsed === 'true') {
     
          localStorage.removeItem('wasCollapsed');
          toggleAllSections(true);
      }
  }
  window.addEventListener('load', handleSearchPageCollapse);