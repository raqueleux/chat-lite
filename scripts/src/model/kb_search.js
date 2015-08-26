define(function( require ) {
    "use strict";

    var $               = require('jquery'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        Session         = require('session'),
        KBSearchResults = require('kb_search_results');

    var KBSearch = Backbone.Model.extend({
        isa: 'KBSearch',
        urlRoot: '/kb/search',
        defaults: {
            brand:        undefined,
            search_query: undefined,
            num_results:  15,
            results:      undefined
        },
        initialize: function() {
            this.listenTo( this, 'change:search_query', this.search );
        },
        parse: function( response ) {
            var kb_search_results = new KBSearchResults( response );

            return {
                brand:        this.get('brand'),
                search_query: this.get('search_query'),
                num_results:  this.get('num_results'),
                results:      kb_search_results
            };
        },
        search: function( search_query ) {
            var options = {};

            // The API Treats this a post a POST request
            options.type = 'POST';
            options.url = '/brand/' + this.get('brand').get('id') + this.urlRoot
                + '?' + $.param({
                    search_query: this.get('search_query'),
                    num_results: this.get('num_results')
                });

            Backbone.Model.prototype.fetch.call( this, options );
        }
    });

    return KBSearch;
});

