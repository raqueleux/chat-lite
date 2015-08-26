define(function( require ) {
    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        Session     = require('session'),
        Department  = require('department'),
        Departments = require('departments'),
        Language    = require('language'),
        Languages   = require('languages');

    var Brand = Backbone.Model.extend({
        isa: 'Brand',
        urlRoot: '/brand',
        defaults: {
            id:               undefined,
            name:             undefined,
            css_url:          undefined,
            has_kb:           undefined,
            has_verification: undefined,
            departments:      undefined,
            languages:        undefined,
            evergage_dataset: undefined
        },
        parse: function( response ) {
            var departments = new Departments();
            response.departments.forEach(function( json_department ) {
                var department = new Department( json_department );
                departments.add( department );
            });

            var languages = new Languages();
            response.languages.forEach(function( json_language ) {
                var language = new Language( json_language );
                languages.add( language );
            });

            return {
                id:               response.id,
                name:             response.name,
                css_url:          response.css_url,
                has_kb:           response.has_kb,
                has_verification: response.has_verification,
                departments:      departments,
                languages:        languages,
                evergage_dataset: response.evergage_dataset
            };
        },
        get_by_chat_domain: function( chat_domain ) {
            var options = {};
            options.url = this.urlRoot + '/' + chat_domain;

            Backbone.Model.prototype.fetch.call( this, options );
        },
        validate: function( attrs ) {
            // TODO: Add Validation
            return false;
        }
    });

    return Brand;
});
