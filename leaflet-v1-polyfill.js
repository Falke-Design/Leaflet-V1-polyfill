/* eslint-disable */
L.Browser.canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

const style = document.documentElement.style;
L.Browser.webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix());
L.Browser.gecko3d = 'MozPerspective' in style;
L.Browser.mobileWebkit3d = L.Browser.mobile && L.Browser.webkit3d;

L.Browser.svg = !!(document.createElementNS && L.SVG.create('svg').createSVGRect);
L.Browser.inlineSvg = !!L.Browser.svg && (function () {
	const div = document.createElement('div');
	div.innerHTML = '<svg/>';
	return (div.firstChild && div.firstChild.namespaceURI) === 'http://www.w3.org/2000/svg';
})();

L.Browser.any3d = !window.L_DISABLE_3D && (L.Browser.webkit3d || L.Browser.gecko3d);
L.Browser.vml = false;

const setPosCore = L.DomUtil.setPosition;
L.DomUtil.setPosition = function (el, point) {
	el._leaflet_pos = point;
	setPosCore(el, point);
};

const getPosCore = L.DomUtil.getPosition;
L.DomUtil.getPosition = function (el) {
	return el._leaflet_pos || getPosCore(el);
};
L.noConflict = function () {
	console.error('noConflict doesn\'t work anymore');
	return this;
};

L.DomUtil.getStyle = function (el, style) {
	let value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

	if ((!value || value === 'auto') && document.defaultView) {
		const css = document.defaultView.getComputedStyle(el, null);
		value = css ? css[style] : null;
	}
	return value === 'auto' ? null : value;
};

L.DomUtil.testProp = function (props) {
	const style = document.documentElement.style;

	for (let i = 0; i < props.length; i++) {
		if (props[i] in style) {
			return props[i];
		}
	}
	return false;
};

L.DomUtil.empty = function (el) {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}

};

L.DomUtil.remove = function (el) {
	const parent = el.parentNode;
	if (parent) {
		parent.removeChild(el);
	}
};

L.DomUtil.TRANSITION = L.DomUtil.testProp(['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

L.DomUtil.TRANSITION_END = L.DomUtil.TRANSITION === 'webkitTransition' || L.DomUtil.TRANSITION === 'OTransition' ? `${L.DomUtil.TRANSITION}End` : 'transitionend';

L.DomUtil.TRANSFORM = L.DomUtil.testProp(['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

L.DomUtil.removeClass = (el, name) => el.classList.remove(name);

// @function setOpacity(el: HTMLElement, opacity: Number)
// Set the opacity of an element (including old IE support).
// `opacity` must be a number from `0` to `1`.
L.DomUtil.setOpacity = function (el, value) {
	if ('opacity' in el.style) {
		el.style.opacity = value;
	} else if ('filter' in el.style) {
		_setOpacityIE(el, value);
	}
};

function _setOpacityIE(el, value) {
	let filter = false;
	const filterName = 'DXImageTransform.Microsoft.Alpha';

	// filters collection throws an error if we try to retrieve a filter that doesn't exist
	try {
		filter = el.filters.item(filterName);
	} catch (e) {
		// don't set opacity to 1 if we haven't already set an opacity,
		// it isn't needed and breaks transparent pngs.
		if (value === 1) { return; }
	}

	value = Math.round(value * 100);

	if (filter) {
		filter.Enabled = (value !== 100);
		filter.Opacity = value;
	} else {
		el.style.filter += ` progid:${filterName}(opacity=${value})`;
	}
}

L.DomUtil.addClass = function (el, name) {
	const classes = L.Util.splitWords(name);
	el.classList.add(...classes);
};

L.DomUtil.setClass = (el, name) => { el.classList.value = name; };
L.DomUtil.getClass = el => el.classList.value;
L.DomUtil.hasClass = (el, name) => el.classList.contains(name);

L.Util.trim = function (str) {
	return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
};

L.Util.create = Object.create || (function () {
	function F() { }
	return function (proto) {
		F.prototype = proto;
		return new F();
	};
})();

L.Util.isArray = Array.isArray || function (obj) {
	return (Object.prototype.toString.call(obj) === '[object Array]');
};

L.Util.bind = function (fn, obj) {
	const slice = Array.prototype.slice;

	if (fn.bind) {
		return fn.bind.apply(fn, slice.call(arguments, 1));
	}

	const args = slice.call(arguments, 2);

	return function () {
		return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
	};
};

L.DomEvent.getMousePosition = L.DomEvent.getPointerPosition;

const _super_findEventTargets = L.Map.prototype._findEventTargets;
const _super_initEvents = L.Map.prototype._initEvents;
L.Map.include({
	mouseEventToContainerPoint(e) {
		return this.pointerEventToContainerPoint(e);
	},
	mouseEventToLayerPoint(e) {
		return this.pointerEventToLayerPoint(e);
	},
	mouseEventToLatLng(e) {
		return this.pointerEventToLatLng(e);
	},

	// Fallback bubblingMouseEvents
	_findEventTargets(e, type) {
		const targets = _super_findEventTargets.call(this, e, type);
		for (let i = 0; i < targets.length; i++) {
			if (targets[i].options.bubblingMouseEvents !== undefined) {
				targets[i].options.bubblingPointerEvents = targets[i].options.bubblingMouseEvents;
			}
		}
		return targets;
	},

	// Add support for mouse events
	_initEvents(remove) {
		_super_initEvents.call(this, remove);
		const onOff = remove ? L.DomEvent.off : L.DomEvent.on;
		onOff(this._container, 'mousedown mouseup mouseover mouseout mousemove', this._handleDOMEvent, this);
	}
});

const _super_disableClickPropagation = L.DomEvent.disableClickPropagation;
L.DomEvent.disableClickPropagation = function disableClickPropagation(el) {
	L.DomEvent.on(el, 'mousedown touchstart', L.DomEvent.stopPropagation);
	return _super_disableClickPropagation(el);
}