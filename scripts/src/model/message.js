define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        _          = require('underscore'),
        moment     = require('moment'),
        Backbone   = require('backbone'),
        Validation = require('backbone_validation'),
        Session    = require('session');

    var Message = Backbone.Model.extend({
        isa: 'Message',
        defaults: {
            id:               undefined,
            chat_id:          undefined,
            staff_id:         undefined,
            created_datetime: undefined,
            sender_name:      undefined,
            content:          undefined,
            is_internal:      undefined,
            is_customer:      undefined,
            is_staff:         undefined
        },
        validation: {
            id: {
                required: false,
                pattern: 'digits'
            },
            chat_id: {
                required: true,
                pattern: 'digits'
            },
            staff_id: {
                required: false,
                pattern: 'digits'
            },
            created_datetime: function( value ) {
                // Only moments should have this function
                if( typeof value.format !== 'function' ) {
                    return 'created_datetime is not a moment';
                }
            },
            sender_name: {
                required: true,
                maxLength: 20
            },
            content: {
                required: true
            },
            is_internal: function( value ) {
                if( ! _.isBoolean( value ) ) {
                    return 'is_internal is not a boolean';
                }
            }
        },
        initialize: function() {
            Backbone.Validation.configure({
                forceUpdate: true
            });
        },
        parse: function( response ) {
            return {
                id:               response.id,
                chat_id:          response.chat_id,
                staff_id:         response.staff_id,
                created_datetime: moment.utc( response.created_datetime ),
                sender_name:      response.sender_name,
                content:          response.content,
                is_internal:      response.is_internal,
                is_staff:         !response.is_internal && response.staff_id  ? true : false,
                is_customer:      !response.is_internal && !response.staff_id ? true : false
            }
        },
        sync: function( method, model, options ) {
            options = options || {};

            if( method.toLowerCase() === 'create' ) {
                options.url = "/" + this.get('chat_id') + '/message/customer';

                options.data = JSON.stringify({
                    sender_name: encodeURIComponent( this.get('sender_name') ),
                    content:     encodeURIComponent( this.get('content') )
                });

                return Backbone.sync.apply( this, arguments );
            }
        }
    });

    return Message;
});
