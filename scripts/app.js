requirejs.config({
    baseUrl: "/scripts",
    paths: {
        'jquery'              : 'lib/jquery',
        'jquery_raty'         : 'lib/jquery.raty',
        'backbone'            : 'lib/backbone',
        'backbone_validation' : 'lib/backbone-validation-amd',
        'backbone_poller'     : 'lib/backbone.poller',
        'bootstrap'           : 'lib/bootstrap',
        'moment'              : 'lib/moment',
        'stickit'             : 'lib/backbone.stickit',
        'underscore'          : 'lib/underscore',
        'howler'              : 'lib/howler',
        'text'                : 'lib/text',

        'session'             : 'src/model/session',
        'router'              : 'src/router',

        'server_time'            : 'src/model/server_time',
        'chat'                   : 'src/model/chat',
        'customer'               : 'src/model/customer',
        'department'             : 'src/model/department',
        'departments'            : 'src/collection/departments',
        'language'               : 'src/model/language',
        'languages'              : 'src/collection/languages',
        'brand'                  : 'src/model/brand',
        'notification'           : 'src/model/notification',
        'view_notification'      : 'src/view/notification',
        'kb_search'              : 'src/model/kb_search',
        'kb_search_result'       : 'src/model/kb_search_result',
        'kb_search_results'      : 'src/collection/kb_search_results',
        'view_kb_search'         : 'src/view/kb_search',
        'form_start_chat'        : 'src/model/form_start_chat',
        'view_start_chat'        : 'src/view/start_chat',
        'predict_wait'           : 'src/model/predict_wait',
        'view_waiting_for_staff' : 'src/view/waiting_for_staff',
        'form_verify_customer'   : 'src/model/form_verify_customer',
        'view_verify_customer'   : 'src/view/verify_customer',
        'message'                : 'src/model/message',
        'messages'               : 'src/collection/messages',
        'view_chat_window'       : 'src/view/chat_window',
        'view_message'           : 'src/view/message',
        'view_printable_chat'    : 'src/view/printable_chat',
        'view_end_chat'          : 'src/view/end_chat',
        'survey'                 : 'src/model/survey',
        'survey_question'        : 'src/model/survey_question',
        'survey_questions'       : 'src/collection/survey_questions',
        'survey_response'        : 'src/model/survey_response',
        'survey_responses'       : 'src/collection/survey_responses',
        'view_survey'            : 'src/view/survey',
        'view_survey_question_freeform'   : 'src/view/survey_question_freeform',
        'view_survey_question_enumerated' : 'src/view/survey_question_enumerated',

        'evergage'              : 'src/tracker/evergage'
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps:    ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: [ 'jquery' ],
        },
        jquery_raty: {
            deps: [ 'jquery' ]
        }
    }
});

// Global App variable contains stateful data
var App = {};

define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        Session    = require('session'),
        Router     = require('router'),
        ServerTime = require('server_time');

    // Prevent backspace from actually going back
    $(document).on("keydown", function (e) {
        if (e.which === 8 && !$(e.target).is("input, textarea") ) {
            e.preventDefault();
        }
    });

    var session = new Session();

    App.server_time = new ServerTime();
    App.server_time.fetch();

    App.router = new Router();
    Backbone.history.start({
        pushState: false
    });

    App.router.navigate('start_chat', { trigger: true });
});
