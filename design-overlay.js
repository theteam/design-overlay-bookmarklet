(function(window, document, undefined) {
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
			'<div class="do-controls">' +
				'<div class="do-row"><label for="do-url" id="do-url-label">Image url</label> <input id="do-url" type="url" class="do-text" /> <select id="do-url-select"></select></div>' +
				'<div class="do-row"><label for="do-opacity">Opacity</label> <span id="do-slider"></span></div>' +
				'<div class="do-row do-toggle-row"><label for="do-toggle">Show</label> <input id="do-toggle" type="checkbox" class="checkbox" value="1" checked /></div>' +
				'<div class="do-row do-click-thru-row"><label for="do-click-thru" title="Pass mouse events through to elements beneath the overlay">Click-thru</label> <input id="do-click-thru" type="checkbox" value="1" class="checkbox" /></div>' +
				'<div class="do-footer">Design overlay</div>' +
			'</div>' +
		'').appendTo(document.body);
		
		// add jquery ui slider
		$slider = $('#do-slider').slider({
			min: 0,
			max: 1,
			step: 0.01,
			value: conf.opacity
		});
		
		function addFormEvents() {
			$slider.bind('slide', function(event, ui) {
				$overlay.css( 'opacity', ui.value );
			});
			
			$('#do-url, #do-url-select').change(function() {
				loadImg( $(this).val(), function(img) {
					$overlay.css({
						'background-image': 'url(' + img.src + ')',
						top: 0,
						left: ( $(window).width() - img.width ) / 2,
						width: img.width,
						height: img.height
					});
				});
			}).eq(0).val( $.isArray(conf.url) ? conf.url[0] : conf.url ).trigger('change');
						
			$('#do-toggle').change(function() {
				$overlay[this.checked ? 'show' : 'hide']();
			}).val( Number(conf.enabled) ).trigger('change');
			
			$('#do-click-thru').change(function() {
				$overlay[this.checked ? 'addClass' : 'removeClass']('do-click-thru');
			}).val( Number(conf.enabled) ).trigger('change');
			
			// detect support for pointer events, click-thru won't be used without it
			if ('pointerEvents' in $controls[0].style) {
				$controls.addClass('do-pointer-events');
			}
		}
		
		// make the controls show & hide on mouse enter & leave
		function addControlIntentEvents() {
			var $footer = $controls.find('div.do-footer'),
				shown;
			
			function closedPosition() {
				return -$controls.outerHeight() + $footer.outerHeight();
			}

			// initial closed position
			$controls.css( 'top', closedPosition() );
			
			// show the menu on hover
			$controls.mouseover(function() {
				if (!shown) {					
					$controls.stop(true).animate({
						top: 0
					}, {
						duration: 250
					});
					shown = true;
				}
			})
			
			// hide on click outside
			$( document ).mousedown(function(event) {
				if (shown && !$(event.target).closest('.do-controls')[0] ) {
					$controls.stop(true).animate({
						top: closedPosition()
					}, {
						duration: 250
					});
					shown = false;
				}
			});
		}
		
		function addOverlayKeyEvents() {
			var style = $overlay[0].style;
			
			$overlay.attr({
				tabindex: -1,
				hidefocus: 'true'
			}).mousedown(function() {
				this.focus();
			}).keydown(function(event) {
				var amount = event.shiftKey ? 10 : 1;
				
				// nudge keys
				switch( event.which ) {
					case 37: // left
						style.left = parseFloat( style.left ) - amount + 'px';
						return false;
					case 38: // up
						style.top = parseFloat( style.top ) - amount + 'px';
						return false;
					case 39: // right
						style.left = parseFloat( style.left ) + amount + 'px';
						return false;
					case 40: // down
						style.top = parseFloat( style.top ) + amount + 'px';
						return false;
				}
			});
		}
		
		function addUrlSelect() {
			if ( $.isArray(conf.url) ) {
				var $select = $('#do-url-select').show(),
					$urlInput = $('#do-url').hide(),
					optionTextLen = 20;
					
				$.each(conf.url, function(i, url) {
					var optionText = url.length > optionTextLen ? '...' + url.slice(-optionTextLen) : url;
					
					$('<option/>').attr('value', url).text(optionText).appendTo( $select );
				});
				
				// allow double click on label to revert to text input
				$('#do-url-label').one('dblclick', function(event) {
					$select.hide();
					$urlInput.val( $select.val() ).show()[0].focus();
					return false;
				});
			}
		}
		
		function loadImg(url, callback) {
			$('<img/>').load(function() {
				callback(this);
			}).attr('src', url);
		}
		
		addUrlSelect();
		addFormEvents();
		addControlIntentEvents();
		addOverlayKeyEvents();
	}
	
	// check that everything we need has loaded. Otherwise load it in.
	// init() is called once everything is ready
	(function() {
		var head = document.getElementsByTagName('head')[0],
			testElm = document.createElement('div'),
			thisBasePath,
			interval,
			loadingJqui;
		
		testElm.className = 'do-test';
		testElm.style.width = '200px';
		document.body.appendChild(testElm);
		
		function isReady() {
			return window.jQuery && hasJqui() && !testElm.offsetWidth;
		}
		function hasJqui() {
			return jQuery.fn.draggable && jQuery.fn.slider;
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
			else if (window.jQuery && !hasJqui() && !loadingJqui) {
				loadingJqui = true;
				loadScript('//ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/jquery-ui.min.js');
				loadCss('//ajax.googleapis.com/ajax/libs/jqueryui/1.8.11/themes/sunny/jquery-ui.css');
			}
		}, 200);
	})();
})(window, document, undefined);