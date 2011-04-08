(function(window, document, undefined) {
	// check that everything we need has loaded. Otherwise load it in
	(function() {
		var head = document.getElementsByTagName('head')[0],
			thisBasePath,
			interval,
			loadingJqui;
		
		function isReady() {
			return window.jQuery && jQuery.fn.draggable && jQuery.fn.slider;
		}
		
		function loadScript(url) {
			var script = document.createElement('script');
			script.src = url;
			head.appendChild(script);
		}
		
		function loadCss(url) {
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = url;
			head.appendChild(link);
		}
		
		if ( isReady() ) {
			init();
		}
		else {
			thisBasePath = (function() {
				var scripts = document.getElementsByTagName('script'),
					i = scripts.length,
					scriptSrc,
					index
					
				while (i--) {
					scriptSrc = scripts[i].src;
					index = scriptSrc.indexOf('design-overlay.js');
					if ( ~index ) {
						return scriptSrc.slice(0, index);
					}
				}
				throw Error('Could not find design-overlay script');
			})();
			
			(!window.jQuery) && loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js');
			loadCss( thisBasePath + 'design-overlay.css' );
			
			// extremely crude loading...
			interval = setInterval(function() {
				if ( isReady() ) {
					clearInterval(interval);
					init();
				}
				else if (window.jQuery && !loadingJqui) {
					loadingJqui = true;
					loadScript('//ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/jquery-ui.min.js');
					loadCss('//ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/sunny/jquery-ui.css');
				}
			}, 200);
		}
	})();
	
	function init() {
		console.log('init')
	}
})(window, document, undefined);