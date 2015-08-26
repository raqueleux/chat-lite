define(function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone');

    var KBSearchResult = Backbone.Model.extend({
        isa: 'KBSearchResult',
        defaults: {
            text: undefined,
            url:  undefined
        }
    });

    return KBSearchResult;
});
