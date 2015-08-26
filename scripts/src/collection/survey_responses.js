define(function( require ) {
    "use strict";

    var $              = require('jquery'),
        _              = require('underscore'),
        Backbone       = require('backbone'),
        SurveyResponse = require('survey_response');

    var SurveyResponses = Backbone.Collection.extend({
        isa: 'SurveyResponses',
        model: SurveyResponse,
    });

    return SurveyResponses;
});
