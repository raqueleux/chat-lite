define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        _          = require('underscore'),
        Backbone   = require('backbone'),
        Validation = require('backbone_validation'),
        Session    = require('session');

    var SurveyResponse = Backbone.Model.extend({
        isa: 'SurveyResponse',
        defaults: {
            id:          undefined,
            type:        undefined,
            chat_id:     undefined,
            question_id: undefined,
            content:     undefined,
            is_required: undefined
        },
        validation: {
            id: {
                required: false,
                pattern: 'digits'
            },
            type: {
                required: true,
                oneOf: [ 'Enumerated', 'FreeForm' ]
            },
            chat_id: {
                required: true,
                pattern: 'digits'
            },
            question_id: {
                required: true,
                pattern: 'digits'
            },
            content: {
                required: function() {
                    return this.get('is_required');
                },
                minLength: 1
            }
        },
        initialize: function() {
            Backbone.Validation.configure({
                forceUpdate: true
            });
        },
        parse: function( response ) {
            return response;
        },
        sync: function( method, model, options ) {
            options = options || {};

            if( method.toLowerCase() == 'create' ) {
                options.url = "/" + this.get("chat_id") + "/survey/answer";

                return Backbone.sync.apply( this, arguments );
            }
        }
    });

    return SurveyResponse;
});
