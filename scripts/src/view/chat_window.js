define( function( require ) {
    "use strict";

    var $                  = require('jquery'),
        _                  = require('underscore'),
        moment             = require('moment'),
        Raty               = require('jquery_raty'),
        HowlerAMD          = require('howler'),
        Backbone           = require('backbone'),
        Chat               = require('chat'),
        Message            = require('message'),
        Messages           = require('messages'),
        ViewMessage        = require('view_message'),
        Session            = require('session'),
        FormVerifyCustomer = require('form_verify_customer'),
        ViewVerifyCustomer = require('view_verify_customer'),
        ViewPrintableChat  = require('view_printable_chat'),
        ViewEndChat        = require('view_end_chat'),
        Template           = require('text!/templates/chat_window.html');

    var ChatWindow = Backbone.View.extend({
        template: _.template( Template ),
        events: {
            'click #send_message_button'    : 'send_message',
            'click #verify_account_button'  : 'prompt_for_verification',
            'click #sound_indicator_button' : 'toggle_sounds',
            'click #print_button'           : 'show_printable_transcript',
            'click #end_chat_button'        : 'prompt_for_end_chat'
        },
        bindings: {
            '#verify_account_button': {
                observe: 'is_verified',
                update: function( $button, is_verified ) {
                    if( is_verified ) {
                        this.$el.off('click', '#verify_account_button');
                        $button.html('<span>Verified!</span>');
                    }
                    else {
                        $button.html('<span>Verify Account</span>');
                    }
                }
            }
        },
        initialize: function( options ) {
            _.bindAll( this, 'render', 'add_message', 'toggle_sounds', 'show_printable_transcript',
                'update_realtime_rating', 'prompt_for_verification', 'prompt_for_end_chat' );

            this.sound = new Howl({
                urls: [ "sounds/msg_rcvd.m4a", "sounds/msg_rcvd.mp3", "sounds/msg_rcvd.ogg", "sounds/msg_rcvd.wav" ]
            });

            this.listenTo( this.model.get('messages'), 'add', this.add_message );
        },
        render: function( ) {
            this.$el.html( this.template({ brand: this.model.get('brand') }) );
            this.model.get('messages').each( this.add_message );

            // Send message on enter pressed
            $("#message_input").bind("keypress", {}, function (e) {
                var code = (e.keyCode ? e.keyCode : e.which );

                if( code == 13 ) {
                    e.preventDefault();
                    $('#send_message_button').trigger('click');
                }
            });

            $('#happiness_rating').raty({
                number : 5,
                cancel : true,
                path   : '/img/',
                click  : this.update_realtime_rating
            });

            this.stickit();
            this.stickit(this.model.get('customer'));
            return this;
        },
        send_message: function ( message ) {
            var message = new Message({
                chat_id:          this.model.get('id'),
                sender_name:      this.model.get('customer').get('name'),
                content:          $('#message_input').val()
            });


            this.listenToOnce( message, 'sync', function( message ) {
                $('#message_input').val('');
                this.model.get('messages').fetch({
                    chat_id: message.get('chat_id'),
                    remove: false
                });
            });

            message.save();
        },
        add_message: function( message ) {
            if( message.get('is_internal') ) {
                if( message.get('sender_name') === 'AccountVerifyRequest' ) {
                    this.prompt_for_verification();
                }

                else if( message.get('sender_name') === 'ChatClosedByStaff' ) {
                    this.model.set('status', 'Ended' );
                    message = new Message({
                        chat_id:          this.model.get('id'),
                        sender_name:      'System',
                        created_datetime: moment(),
                        content:          'This chat session has ended.'
                    });
                }

                else if( message.get('sender_name') === 'System'
                      && message.get('content').match('Chat session closed due to lack of network response')  ) {

                    this.model.set('status', 'Ended' );
                    message = new Message({
                        chat_id:          this.model.get('id'),
                        sender_name:      'System',
                        created_datetime: moment(),
                        content:          'Seems like your browser is having trouble talking to our chat system.  This chat session has ended, but you are welcome to start a new one if you need more assistance.',
                    });

                    // Since they can't do a survey (these chats are unrateable) remove the 'Rate and Exit' button
                    $('#end_chat_button').remove();
                    $('#print_and_rate_button_divider').remove();
                }

                else {
                    // Just to be safe, don't display any other internal message
                    return;
                }
            }

            var view_message = new ViewMessage({
                model: message,
                el: $('#messages_container')
            });

            view_message.render();

            $(".chat-window-inner").animate({
                scrollTop: $('#messages_container')[0].scrollHeight
            }, 1000);

            if( message.get('is_staff') ) {
                this.sound.play();
            }
        },
        toggle_sounds: function( ) {
            var $sound_indicator_button = $('#sound_indicator_button');

            if( $sound_indicator_button.hasClass('sound_on') ) {
                Howler.mute();

                $sound_indicator_button.removeClass('sound_on');
                $sound_indicator_button.addClass('sound_off');
            }
            else {
                Howler.unmute();

                $sound_indicator_button.removeClass('sound_off');
                $sound_indicator_button.addClass('sound_on');
            }
        },
        prompt_for_verification: function( ) {
            var form_verify_customer = new FormVerifyCustomer({
                chat: this.model,
            });

            var view_verify_customer = new ViewVerifyCustomer({
                model: form_verify_customer,
                el: $('body')
            });
        },
        show_printable_transcript: function() {
            var printable_chat = new ViewPrintableChat({
                model: this.model
            });

            printable_chat.render();
        },
        update_realtime_rating: function( rating, event ) {
            this.model.set('realtime_rating', rating );
            this.model.update_realtime_rating();
        },
        prompt_for_end_chat: function() {
            var view_end_chat = new ViewEndChat({
                model: this.model,
                el: this.el
            });
        }
    });

    return ChatWindow;
});
