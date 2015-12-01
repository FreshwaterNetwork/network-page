(function(N) {
    N.Map = function networkMap() {
        var _map,
            _markers = [],
            pointSymbol = new esri.symbol.SimpleMarkerSymbol(
                esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 2,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([105, 105, 105]), 1),
                new dojo.Color([80, 80, 80, 0.35]));

        function initializeMap(callback) {
            _map = new esri.Map('map', {
                basemap: 'topo',
                center: [-91.3, 32.6],
                zoom: 5,
                sliderStyle: 'small',
                logo: false
            });

            dojo.connect(_map, 'onLoad', function() {
                dojo.connect(_map, 'onPan', updateTooltips);
                dojo.connect(_map, 'onZoomStart', hideTooltips);
                dojo.connect(_map, 'onZoomEnd', showTooltips);
                dojo.connect(_map, 'onExtentChange', showTooltips);
                dojo.connect(_map.graphics,'onClick', scrollToRegion);
                dojo.connect(_map.graphics, 'onMouseOver', markerMouseOver);
                dojo.connect(_map.graphics, 'onMouseOut', markerMouseOut);

                // Proceed only when the map has loaded, when layers are ready
                callback();
            });

            return this;
        }

        function markerMouseOver(evt) {
            _map.setMapCursor('pointer');
            if (evt.graphic && evt.graphic.attributes) {
                displayTooltip(evt.target, evt.graphic.attributes.name);
            }
        }

        function markerMouseOut(evt) {
            _map.setMapCursor('default');
            if (evt.graphic && evt.graphic.attributes) {
                if (!evt.graphic.attributes.isSticky) {
                    hideTooltip(evt.target);
                }
            }
        }

        function displayTooltip(el, tooltipText) {
            if (!el) {
                return;
            }
            el = N.SvgDomWrapper(el);
            $(el).tipsy({
                gravity: 's',
                title: function() {
                    return tooltipText;
                },
                trigger: 'manual'
            }).tipsy('show');
        }

        function hideTooltip(el) {
            $(el).tipsy('hide');
        }

        function hideTooltips(evt) {
            $.fn.tipsy.revalidate();
            $.each(_markers, function(i, graphic) {
                hideTooltip(graphic.getNode());
            });
        }

        // Tooltips end up in weird places if we call updateTooltips immediately
        // when handling the map onZoomEnd and onExtentChange events.
        function showTooltips(evt) {
            _.defer(updateTooltips);
        }

        function updateTooltips(evt) {
            $.fn.tipsy.revalidate();
            $.each(_markers, function(i, graphic) {
                if (graphic.attributes.isSticky) {
                    displayTooltip(graphic.getNode(), graphic.attributes.name);
                }
            });
        }

        function scrollToRegion(evt) {
            if (evt.graphic && evt.graphic.attributes && evt.graphic.attributes.$el) {
                var $el = evt.graphic.attributes.$el.children('.region-header');
                N.regionExpander($el, {scroll: true, clickToClose: false});
            }
        }

        function addMarker(region, el) {
            var marker = new esri.symbol.PictureMarkerSymbol({
                    "url":"img/map_marker.png",
                    "height":28,  // Scaled image to look nice, beware offsets
                    "width":35,  // below
                    "type":"esriPMS",
                    "xoffset": 7,  // Manual offsets center the 'pin-point' of
                    "yoffset": 14  // the marker to reflect the actual point.
                }),
                point = new esri.geometry.geographicToWebMercator(
                  new esri.geometry.Point(region.location[0],region.location[1])
                ),
                tooltipText = region.name,
                isSticky = !!region.stickyTooltip,
                attributes = {name: tooltipText, $el: $(el), isSticky: isSticky},
                graphic = new esri.Graphic(point, marker, attributes),
                smallPoint = new esri.Graphic(point, pointSymbol);

            _markers.push(graphic);

            _map.graphics.add(graphic);
            _map.graphics.add(smallPoint);

            if (isSticky) {
                displayTooltip(graphic.getNode(), tooltipText);
            }
        }

        function getEsriMap() {
            return _map;
        }

        return {
            init: initializeMap,
            addMarker: addMarker,
            getEsriMap: getEsriMap
        }
    }
}(TNC));