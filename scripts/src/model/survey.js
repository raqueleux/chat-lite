define(function( require ) {
    "use strict";

    var $               = require('jquery'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        SurveyResponses = require('survey_responses'),
        SurveyQuestions = require('survey_questions');

    var Survey = Backbone.Model.extend({
        isa: 'Survey',
        defaults: {
            chat:             undefined,
            survey_questions: undefined,
            survey_responses: undefined
        },
        initialize: function() {
            this.set('survey_questions', new SurveyQuestions() );
            this.set('survey_responses', new SurveyResponses() );
        }
    });

    return Survey;
});
