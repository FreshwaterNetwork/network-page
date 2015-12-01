(function (N) {
    N.RegionList = function regionList() {
        var _map;

        function renderListAndMap() {
            _map = N.Map().init(loadData);
        }

        function loadData() {
            $.ajax({
                url: 'sites.json',
                dataType: 'json',
                cache: false,
                success: showSiteData,
                error: function(resp) {
                    alert('Error getting site data');
                }
            });
        }

        function showSiteData(sites) {
            var regionsMarkup = _.map(sites.regions, renderRegion),
                $sitesList = $('#site-blocks');

            // Add global region to the top
            regionsMarkup.unshift(renderRegion(sites.global));

            $sitesList.append.apply($sitesList, regionsMarkup);

            // Collapse all regions, and toggle visibility on click
            $sitesList.find('.region-header')
                .on('click', function(evt) {
                    N.regionExpander($(evt.target), {scroll: true, clickToClose: true});
                })
                .siblings().hide();

            _.each(sites.layers, function(layer) {
                var agsLayer = new esri.layers.ArcGISDynamicMapServiceLayer(layer.url);
                _map.getEsriMap().addLayer(agsLayer);
            });
        }

        function renderRegion(region) {
            // Render a region template
            var $markup =  $(N.app.templates['template-region'](region));

            if (region.location) {
                _map.addMarker(region, $markup);
            }

            // Recursively render any sub-regions
            if (region.regions) {
                var subregions = _.map(region.regions, function renderSubRegions(subregion) {
                    return renderRegion(subregion);
                });

                var $sublist = $markup.find('.region-detail .sub-list');
                $sublist.append.apply($sublist, subregions);
            }

            $markup.find('.whatsnew').tipsy();

            // A complete nested region
            return $markup;
        }

        return {
            renderListAndMap: renderListAndMap
        };
    };

}(TNC));



