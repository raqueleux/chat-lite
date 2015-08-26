define(function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone'),
        Session  = require('session');

    var Department = Backbone.Model.extend({
        isa: 'Department',
        urlRoot: '/department',
        defaults: {
            id:        undefined,
            brand_id:  undefined,
            name:      undefined,
            is_active: undefined
        },
        parse: function( response ) {
            return response;
        },
        validate: function( attrs ) {
            // TODO: Add Validation
            return false;
        }
    });

    return Department;
});
