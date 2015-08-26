define(function( require ) {
    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Session  = require('session'),
        Brand    = require('brand');

    var Notification = Backbone.Model.extend({
        isa: 'Notification',
        urlRoot: '/notification',
        defaults: {
            brand:   undefined,
            id:      undefined,
            content: undefined,
            url:     undefined
        },
        initialize: function() {
            this.listenTo( this.get('brand'), 'sync', this.get_by_brand );
        },
        get_by_brand: function( brand ) {
            var options = {};
            options.url = '/brand/' + brand.get('id') + this.urlRoot;

            Backbone.Model.prototype.fetch.call( this, options );
        }
    });

    return Notification;
});
