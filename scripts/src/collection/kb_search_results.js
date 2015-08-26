define(function( require ) {
    "use strict";

    var $              = require('jquery'),
        _              = require('underscore'),
        Backbone       = require('backbone'),
        KBSearchResult = require('kb_search_result');

    var KBSearchResults = Backbone.Collection.extend({
        isa: 'Languages',
        model: KBSearchResult
    });

    return KBSearchResults;
});
