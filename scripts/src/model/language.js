define(function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone'),
        Session  = require('session');

    var Language = Backbone.Model.extend({
        isa: 'Language',
        urlRoot: '/language',
        defaults: {
            id:   undefined,
            name: undefined
        },
        parse: function( response ) {
            return {
                id: response.id,
                name: response.name
            };
        },
        validate: function( attrs ) {
            // TODO: Add validation
            return false;
        }
    });

    return Language;
});
