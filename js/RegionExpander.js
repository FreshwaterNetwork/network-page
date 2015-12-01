(function(N){
    N.regionExpander = function($el, options) {
        var options = _.extend({
            scroll: true,
            clickToClose: false
        }, options),
            // Call scroll after any animations have completed, so ensure the element
            // is in the final position.  This will scroll to the deepest child element
            // of the selected region
            scroller = function scrollToElement() {
                // Scroll if configured to do so and the container is off screen
                // (don't have it jumping around under your mouse if it doesn't
                // need to)
                if (options.scroll && !$el.parent('.region').visible()) {
                    // Scroll the window to make sure the last child is shown
                    var $dest = $($el.siblings().children().last()),
                        top = $dest.offset().top - $dest.height();

                    // This is called twice, once for ie+firefox, once for chrome
                    // In each case it is a noop for the browser it doesn't work
                    // in, so it's safe to call twice. This was required because
                    // document.documentElement is defined even in browsers where
                    // it will not scroll, so $(document.documentElement || 'body')
                    // will always select the documentElement.
                    $(document.documentElement).animate({scrollTop: top}, 400);
                    $('body').animate({scrollTop: top}, 400);

                }
            },

            collapseRegion = function() {
                // Selected element was already active, close it and remove active
                // status for any children
                $el.removeClass('active').siblings().slideUp().end()
                    .siblings().find('.region-header').removeClass('active');

            },
            expandRegion = function() {
                // Selected element is in a chain of nested active elements
                // don't close from the top, only close below.
                if ($el.parents().siblings('.region-header').hasClass('active')) {
                    expandNestedRegionWithActiveParent();
                } else {
                    expandInactiveRegion();
                }
            },

            expandNestedRegionWithActiveParent = function() {
                // Keep the parents open, and close only lateral nodes
                $el.parent().siblings()
                    .children('.region-header').removeClass('active')
                    .siblings().slideUp();

                // Apply activation to the selected region
                $el.addClass('active').siblings().slideDown(scroller);
            },

            expandInactiveRegion = function() {
                // Remove any current actives
                $('.row.content').find('.region-header')
                    .removeClass('active').siblings().slideUp();

                // If this is a nested region, the parents have to be activated
                var isChild = $el.parents().children('.region-header').length > 0;
                if (isChild) {
                    $el.parents().children('.region-header')
                        .addClass('active')
                        .siblings().slideDown(scroller);
                }
                // Apply activation to the selected regions, going down the tree
                $el.find('.region-header').first().addClass('active')
                    .siblings().slideDown(scroller);
            };

        // If already active but not closing, do nothing - otherwise, expand
        // the nested list to the selected region, closing any other non-parent
        // nodes.
        if ($el.hasClass('active') && options.clickToClose) {
            collapseRegion();
        } else if (!$el.hasClass('active')) {
            expandRegion();
        }
    }
})(TNC);
