document.addEventListener('DOMContentLoaded', function () {

    initializeSettings();
    initializeLevelManagement();

   

 
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
    
      // Handle navigation via browser back/forward buttons
      window.addEventListener('popstate', function() {
        if (!isSearchResultPage() && revertFromTemporaryExpertMode()) {
          filterContent('beginner');
          updateTOCVisibility('beginner');
          updateOptionsVisibility('beginner');
        }
      });
      const contributeIcon = document.querySelector('.md-feedback__contribute');
  const contributeNote = document.querySelector('.md-feedback__contribute-note');

  if (contributeIcon && contributeNote) {
    contributeIcon.addEventListener('mouseenter', function() {
      contributeNote.hidden = false;
    });

    contributeIcon.addEventListener('mouseleave', function() {
      contributeNote.hidden = true;
    });
  }
    });