define(function( require ) {
    "use strict";

    var $              = require('jquery'),
        _              = require('underscore'),
        Backbone       = require('backbone'),
        SurveyQuestion = require('survey_question'),
        Session        = require('session');

    var SurveyQuestions = Backbone.Collection.extend({
        isa: 'SurveyQuestions',
        model: SurveyQuestion,
        urlRoot: '/survey',
        get_by_chat_id: function( chat_id ) {
            var options = {};
            options.url = '/' + chat_id + this.urlRoot;

            Backbone.Collection.prototype.fetch.call( this, options );
        }
    });

    return SurveyQuestions;
});
