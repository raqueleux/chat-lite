define( function( require ) {
    "use strict";

    var $                            = require('jquery'),
        _                            = require('underscore'),
        Backbone                     = require('backbone'),
        Survey                       = require('survey'),
        SurveyQuestion               = require('survey_question'),
        SurveyResponse               = require('survey_response'),
        ViewSurveyQuestionFreeForm   = require('view_survey_question_freeform'),
        ViewSurveyQuestionEnumerated = require('view_survey_question_enumerated'),
        Template                     = require('text!/templates/survey.html');

    var Survey = Backbone.View.extend({
        template: _.template( Template ),
        events: {
            'click #submit_survey_button': "submit_survey"
        },
        initialize: function( ) {
            _.bindAll( this, 'render', "submit_survey" );
        },
        render: function( ) {
            this.$el.html( this.template() );

            var self = this;
            this.model.get('survey_questions').each(function( survey_question ) {
                var survey_response      = new SurveyResponse({
                    type:        survey_question.get('type'),
                    chat_id:     self.model.get('chat').get('id'),
                    question_id: survey_question.get('id'),
                    is_required: survey_question.get('is_required')
                });

                self.model.get('survey_responses').add( survey_response );

                var $div = $('<div class="survey_question"></div>');
                $('#survey_questions_container').append( $div );

                var view_survey_question;
                if( survey_question.get('type') === 'FreeForm' ) {
                    view_survey_question = new ViewSurveyQuestionFreeForm({
                        model:           survey_question,
                        survey_response: survey_response,
                        el:              $div
                    })
                }
                else if( survey_question.get('type') === 'Enumerated' ) {
                    view_survey_question = new ViewSurveyQuestionEnumerated({
                        model:           survey_question,
                        survey_response: survey_response,
                        el:              $div
                    })
                }
                else {
                    return;
                }

                view_survey_question.render();
            });
        },
        submit_survey: function() {
            var is_valid = 1;

            this.model.get('survey_responses').each( function( survey_response ) {
                if( !survey_response.isValid(true) ) {
                    is_valid = 0;
                }
            });

            if( is_valid ) {
                this.model.get('survey_responses').each( function( survey_response ) {
                    if( survey_response.get('content') ) {
                        survey_response.save();
                    }
                });

                $('#survey').html('<div class="row header-row"><div class="col-md-12 text-center"><h1>Thank you for your feedback!</h1></div></div>');
            }

        }
    });

    return Survey;
});
