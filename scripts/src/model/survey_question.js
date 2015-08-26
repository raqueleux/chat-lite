define(function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone'),
        Session  = require('session');

    var SurveyQuestion = Backbone.Model.extend({
        isa: 'SurveyQuestion',
        defaults: {
            id:               undefined,
            type:             undefined,
            brand_ids:        undefined,
            sort_order:       undefined,
            is_required:      undefined,
            content:          undefined,
            possible_answers: undefined
        },
        parse: function( response ) {
            return response;
        }
    });

    return SurveyQuestion;
});
