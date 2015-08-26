define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        _          = require('underscore'),
        Backbone   = require('backbone'),
        Validation = require('backbone_validation'),
        Session    = require('session'),
        Chat       = require('chat');

    var PredictWait = Backbone.Model.extend({
        isa: 'PredictWait',
        defaults: {
            chat:                       undefined,
            place_in_line:              undefined,
            initial_expected_wait_time: undefined,
            expected_wait_time:         undefined
        },
        validation: {
            chat: function( value ) {
                if( value.isa !== 'Chat' ) {
                    return 'chat is not a Chat';
                }
            },
            place_in_line: {
                required: true,
                pattern: 'digits',
            },
            expected_wait_time: {
                required: true,
                pattern: 'digits',
            }
        },
        initialize: function() {
            Backbone.Validation.configure({
                forceUpdate: true
            });
        },
        parse: function( response ) {
            return {
                chat:                       this.get('chat'),
                place_in_line:              response.place_in_line,
                initial_expected_wait_time: response.expected_wait_time,
                expected_wait_time:         response.expected_wait_time
            };
        },
        fetch: function() {
            var options = { };

            options.type = 'GET';
            options.url = '/' + this.get('chat').get('id') + '/predict_wait';

            Backbone.Model.prototype.fetch.call( this, options );
        }
    });

    return PredictWait;
});
