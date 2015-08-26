define( function( require ) {
    "use strict";

    var $              = require('jquery'),
        _              = require('underscore'),
        Backbone       = require('backbone'),
        Stickit        = require('stickit'),
        SurveyQuestion = require('survey_question'),
        SurveyResponse = require('survey_response'),
        Template       = require('text!/templates/survey_question/freeform.html');

    var SurveyQuestionFreeForm = Backbone.View.extend({
        template: _.template( Template ),
        events: {
        },
        initialize: function( options ) {
            this.options = options;

            _.extend(Backbone.Validation.callbacks, {
                valid: function (view, attr, selector) {
                    var $el = view.$('.response'),
                        $group = $el.closest('.form-group');

                    $group.addClass('has-success');
                    $group.removeClass('has-error');
                },
                invalid: function (view, attr, error, selector) {
                    var $el = view.$('.response'),
                        $group = $el.closest('.form-group');

                    $group.addClass('has-error');
                    $group.removeClass('has-success');
                }
            });

            _.bindAll( this, 'render' );
        },
        render: function() {
            this.$el.html( this.template() );

            this.stickit(this.model, {
                '.content' : {
                    observe: 'content'
                }
            });

            this.stickit( this.options.survey_response, {
                '.response' : {
                    observe: 'content',
                    setOptions: { validate: true }
                }
            });

            Backbone.Validation.bind(this, { model: this.options.survey_response } );
            return this;
        }
    });

    return SurveyQuestionFreeForm;
});
