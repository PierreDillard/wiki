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
  handleSearchPageCollapse();
    });

    // Open all colapse section if it's a search page
    function handleSearchPageCollapse() {
      const isSearchPage = new URLSearchParams(window.location.search).has('h');
      const wasCollapsed = localStorage.getItem('wasCollapsed');
  
      if (isSearchPage) {
          // Si c'est une page de recherche, ouvrir tous les collapse
          if (localStorage.getItem('collapseAll') === 'true') {
              localStorage.setItem('wasCollapsed', 'true');
              toggleAllSections(false);
          }
      } else if (wasCollapsed === 'true') {
          // Si ce n'est pas une page de recherche et que les sections étaient précédemment fermées
          localStorage.removeItem('wasCollapsed');
          toggleAllSections(true);
      }
  }
  window.addEventListener('load', handleSearchPageCollapse);