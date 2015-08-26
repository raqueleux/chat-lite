define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        _          = require('underscore'),
        Backbone   = require('backbone'),
        Department = require('department'),
        Session    = require('session');

    var Departments = Backbone.Collection.extend({
        isa: 'Departments',
        model: Department,
        urlRoot: '/departments',
        get_by_brand_id: function( brand_id ) {
            var options = {};
            options.url = '/brand/' + brand_id + this.urlRoot;

            Backbone.Collection.prototype.fetch.call( this, options );
        }
    });

    return Departments;
});
