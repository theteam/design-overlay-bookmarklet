(function(window, document, undefined) {
	function loadImg(url, callback) {
		$('<img/>').load(function() {
			callback(this);
		}).attr('src', url);
	}
	
	function init() {
		var $ = jQuery,
			$controls,
			$slider,
			conf = $.extend({
				opacity: 0.5,
				url: '',
				enabled: true,
				clickThru: false
			}, window.designOverlayConf || {}),
			$overlay = $('<div class="design-overlay"/>').appendTo(document.body).draggable().css( 'opacity', conf.opacity );
		
		$controls = $(
			'<div class="design-overlay-controls">' +
				'<div class="design-overlay-row"><label for="design-overlay-url">Image url</label> <input id="design-overlay-url" type="url" class="design-overlay-text" /></div>' +
				'<div class="design-overlay-row"><label for="design-overlay-opacity">Opacity</label> <span id="design-overlay-slider"></span></div>' +
				'<div class="design-overlay-row"><label for="design-overlay-toggle">Enable</label> <input id="design-overlay-toggle" type="checkbox" class="checkbox" value="1" checked /></div>' +
				'<div class="design-overlay-row"><label for="design-overlay-click-thru">Click-thru</label> <input id="design-overlay-click-thru" type="checkbox" value="1" class="checkbox" /></div>' +
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
		}).val( conf.url ).trigger('change');
		
		$slider = $('#design-overlay-slider').slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: conf.opacity
		}).bind('slide', function(event, ui) {
			$overlay.css( 'opacity', ui.value );
		});
		
		$('#design-overlay-click-thru').change(function() {
			$overlay[this.checked ? 'addClass' : 'removeClass']('design-overlay-click-thru');
		}).val( Number(conf.enabled) ).trigger('change');
		
		$('#design-overlay-toggle').change(function() {
			$overlay[this.checked ? 'show' : 'hide']();
		}).val( Number(conf.enabled) ).trigger('change');
	}
	
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
			loadCss( thisBasePath + 'design-overlay.css?' + new Date().valueOf() );
			
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
})(window, document, undefined);