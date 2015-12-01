(function (N) {
    "use strict";
    N.app = {
        templates: {},

        init: function initializeApp() {
            N.RegionList().renderListAndMap();
        }
    };

    new N.TemplateLoader().load(N.app.templates);

}(TNC));
