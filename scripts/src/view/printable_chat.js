define( function( require ) {
    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        moment      = require('moment'),
        Backbone    = require('backbone'),
        Chat        = require('chat'),
        Session     = require('session'),
        Template    = require('text!/templates/printable_chat.html');

    var PrintableChat = Backbone.View.extend({
        template: _.template( Template ),
        render: function() {
            var new_window = window.open( '', 'Chat Transcript', 'toolbar=1,menubar=1,resizable=1,scrollbars=1' );

            new_window.document.write(
                this.template({
                    chat: this.model
                })
            );
        }
    });

    return PrintableChat;
});
