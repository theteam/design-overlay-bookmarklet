(function(window, document, undefined) {
	// check that everything we need has loaded. Otherwise load it in.
	// init() is called once everything is ready
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
					$(init);
				}
				else if (window.jQuery && !loadingJqui) {
					loadingJqui = true;
					loadScript('//ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/jquery-ui.min.js');
					loadCss('//ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/sunny/jquery-ui.css');
				}
			}, 200);
		}
	})();
	
	function loadImg(url, callback) {
		$('<img/>').load(function() {
			callback(this);
		}).attr('src', url);
	}
	
	function init() {
		var $ = jQuery,
			$controls,
			$overlay = $('<div class="design-overlay"/>').appendTo(document.body).draggable(),
			$slider;
			
		$controls = $(
			'<div class="design-overlay-controls">' +
				'<div><label for="design-overlay-url">Image URL</label> <input id="design-overlay-url" type="url" class="design-overlay-text" /></div>' +
				'<div><label for="design-overlay-opacity">Opacity</label> <div id="design-overlay-slider"></div></div>' +
				'<div><input id="design-overlay-toggle" type="checkbox" class="checkbox" checked /> <label for="design-overlay-toggle">Enable</label></div>' +
			'</div>' +
		'').appendTo(document.body);
		
		$('#design-overlay-url').change(function() {
			loadImg(this.value, function(img) {
				$overlay.css({
					'background-image': 'url(' + img.src + ')',
					top: 0,
					left: ( $(window).width() - img.width ) / 2,
					width: img.width,
					height: img.height
				});
			});
		});
		
		$slider = $('#design-overlay-slider').slider({
			min: 0,
			max: 1,
			step: 0.01
		}).bind('slide', function(event, ui) {
			$overlay.css( 'opacity', ui.value );
		});
		
		$('#design-overlay-toggle').change(function() {
			$overlay[this.checked ? 'show' : 'hide']();
		});
	}
})(window, document, undefined);