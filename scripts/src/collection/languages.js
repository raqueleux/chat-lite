define(function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone'),
        Language = require('language'),
        Session  = require('session');

    var Languages = Backbone.Collection.extend({
        isa: 'Languages',
        model: Language,
        urlRoot: '/languages',
        get_by_brand_id: function( brand_id ) {
            var options = {};
            options.url = '/brand/' + brand_id + this.urlRoot;

            Backbone.Collection.prototype.fetch.call( this, options );
        }
    });

    return Languages;
});
