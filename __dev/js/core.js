'use strict';

// Create a global 'awd' wrapper
window.awd = {};

// Set a relative URL for JavaScript
awd.url = '/';

// Preload 'loading' image
awd.preloader_image = new Image();
awd.preloader_image.src = awd.url + 'images/loading.svg';

// Import modules
(function() {
  console.log('Page loaded...');
})();
