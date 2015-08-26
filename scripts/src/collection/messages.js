define(function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone'),
        Poller   = require('backbone_poller'),
        Message  = require('message'),
        Session  = require('session');

    var Messages = Backbone.Collection.extend({
        isa: 'Messages',
        model: Message,
        urlRoot: '/messages',
        initialize: function ( ) {
            _.bindAll(this, 'fetch' );
        },
        fetch: function ( options ) {
            if( this.length == 0 ) {
                options.url = '/' + options.chat_id + this.urlRoot;
                return Backbone.Collection.prototype.fetch.call( this, options );
            }
            else {
                var last_message = this.max(function( message ) {
                    return message.id;
                });

                options.url = '/' + options.chat_id + this.urlRoot + '?' + $.param({
                    since_message_id: last_message.get('id')
                });

                return Backbone.Collection.prototype.fetch.call( this, options );
            }
        },
        parse: function( response ) {
            return response;
        }
    });

    return Messages;
});
