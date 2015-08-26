define(function( require ) {
    "use strict";

    var $         = require('jquery'),
        _         = require('underscore'),
        bootstrap = require('bootstrap'),
        Backbone  = require('backbone'),
        Chat      = require('chat'),
        Template  = require('text!/templates/end_chat.html');

    var EndChat = Backbone.View.extend({
        template: _.template( Template ),
        events: {
            "click #end_chat_now_button" : "end_chat",
        },
        initialize: function( ) {
            _.bindAll( this, 'end_chat' );
            this.render();
        },
        render: function( ) {
            this.$el.append( this.template() );

            $('#end_chat_modal').on('hidden.bs.modal', function() {
                $('#end_chat_modal').remove();
            });

            $('#end_chat_modal').modal('show');
            return this;
        },
        end_chat: function( ) {
            $('#end_chat_now_button').attr("disabled", true );

            if( this.model.get('status') === 'Active' ) {
                this.model.end_chat();
            }

            $('#end_chat_modal').modal('hide');
            $('#end_chat_modal').remove();

            App.router.navigate('survey', { trigger: true } );
        }
    });

    return EndChat;
});
