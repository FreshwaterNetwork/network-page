(function(N) {

    // This wrapper allows for greater compatibility between components that expect HTML
    // elements rather than SVG elements.
    //
    // Some properties on the original DOM element will be mutated.
    //
    // The idea for this originated here:
    // http://stackoverflow.com/questions/3294553/jquery-selector-svg-incompatible
    //
    var SvgDomWrapper = function(svgEl) {
        var className = svgEl.className,
            width = svgEl.width,
            height = svgEl.height,
            x = svgEl.x,
            y = svgEl.y;

        if (svgEl.isSvgDomWrapper) {
            return svgEl;
        }

        Object.defineProperty(svgEl, "className", {
            get:  function() { return className.baseVal; },
            set: function(value) { className.baseVal = value; }
        });
        Object.defineProperty(svgEl, "width", {
            get:  function() { return width.baseVal.value; },
            set: function(value) { width.baseVal.value = value; }
        });
        Object.defineProperty(svgEl, "height", {
            get:  function() { return height.baseVal.value; },
            set: function(value) { height.baseVal.value = value; }
        });
        Object.defineProperty(svgEl, "x", {
            get:  function() { return x.baseVal.value; },
            set: function(value) { x.baseVal.value = value; }
        });
        Object.defineProperty(svgEl, "y", {
            get:  function() { return y.baseVal.value; },
            set: function(value) { y.baseVal.value = value; }
        });
        Object.defineProperty(svgEl, "offsetWidth", {
            get:  function() { return width.baseVal.value; },
            set: function(value) { width.baseVal.value = value; }
        });
        Object.defineProperty(svgEl, "offsetHeight", {
            get:  function() { return height.baseVal.value; },
            set: function(value) { height.baseVal.value = value; }
        });

        svgEl.isSvgDomWrapper = true;
        return svgEl;
    };

    TNC.SvgDomWrapper = SvgDomWrapper;

}(TNC));