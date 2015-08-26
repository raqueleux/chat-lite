define(function( require ) {
    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        Chat                = require('chat'),
        Brand               = require('brand'),
        Notification        = require('notification'),
        ViewNotification    = require('view_notification'),
        FormStartChat       = require('form_start_chat'),
        ViewStartChat       = require('view_start_chat'),
        KBSearch            = require('kb_search'),
        ViewKBSearch        = require('view_kb_search'),
        PredictWait         = require('predict_wait'),
        ViewWaitingForStaff = require('view_waiting_for_staff'),
        ViewChatWindow      = require('view_chat_window'),
        Messages            = require('messages'),
        Poller              = require('backbone_poller'),
        Survey              = require('survey'),
        ViewSurvey          = require('view_survey'),
        Evergage            = require('evergage');

    var Router = Backbone.Router.extend({
        routes: {
            "start_chat"        : "start_chat",
            "search_kb"         : "search_kb",
            "waiting_for_staff" : "waiting_for_staff",
            "chatting"          : "chatting",
            "survey"            : "survey"
        },
        start_chat: function() {
            App.chat = new Chat({
                brand: new Brand()
            });

            var form_start_chat = new FormStartChat({
                brand: App.chat.get('brand')
            });

            var view_start_chat = new ViewStartChat({
                model: form_start_chat,
                el:    $('#content')
            });

            var notification = new Notification({
                brand: App.chat.get('brand')
            });

            var view_notification = new ViewNotification({
                model: notification,
                el: $('#content')
            });

            this.listenTo( App.chat.get('brand'), 'sync', function( brand ) {
                var evergage = new Evergage({
                    model: App.chat.get('brand')
                });

                evergage.render();
                view_start_chat.render();
            });

            App.chat.get('brand').get_by_chat_domain( window.location.hostname );
        },
        search_kb: function() {
            if( !App.chat ) {
                return App.router.navigate('start_chat', { trigger: true } );
            }

            if( App.chat.get('brand').get('has_kb') ) {
                // If the brand has a KB, search it
                var kb_search = new KBSearch({
                    brand: App.chat.get('brand')
                });

                var view_kb_search = new ViewKBSearch({
                    model: kb_search,
                    el:    $('#content')
                });

                kb_search.set('search_query', App.chat.get('initial_question') );
            }
            else {
                //Otherwise go strait to waiting for staff
                App.router.navigate('waiting_for_staff', { trigger: true } );
            }
        },
        waiting_for_staff: function() {
            if( !App.chat ) {
                return App.router.navigate('start_chat', { trigger: true } );
            }

            var predict_wait = new PredictWait({
                chat: App.chat
            });

            var view_waiting_for_staff = new ViewWaitingForStaff({
                model: predict_wait,
                el:    $('#content')
            });

            predict_wait.listenToOnce( App.chat, 'sync', predict_wait.fetch );

            App.chat.set('messages', new Messages() );
            App.chat.get('messages').listenToOnce( App.chat, 'sync', function() {
                App.poller = Poller.get( App.chat.get('messages'), {
                    delay:           10000,
                    continueOnError: true,
                    chat_id:         App.chat.get('id'),
                    remove:          false
                } ).start();
            });

            this.listenTo( App.chat.get('messages'), 'add', function( message ) {
                if( !message.get('is_internal') ) {
                    return App.router.navigate('chatting', { trigger: true } );
                }
            });

            App.chat.save();
        },
        chatting: function() {
            if( !App.chat ) {
                return App.router.navigate('start_chat', { trigger: true } );
            }

            var view_chat_window = new ViewChatWindow({
                model: App.chat,
                el:    $('#content')
            });

            view_chat_window.render();

            this.listenTo( App.chat, 'change:status', function( chat ) {
                if( chat.get('status') === 'Ended' ) {
                    App.poller.destroy();
                }
            });
        },
        survey: function() {
            if( !App.chat ) {
                return App.router.navigate('start_chat', { trigger: true } );
            }

            var survey = new Survey({
                chat: App.chat
            });

            var view_survey = new ViewSurvey({
                model: survey,
                el:    $('#content')
            });

            this.listenTo( survey.get('survey_questions'), 'sync', function() {
                view_survey.render();
            });

            survey.get('survey_questions').get_by_chat_id( App.chat.get('id') );
        }
    });

    return Router;
});
