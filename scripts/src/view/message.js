define( function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        moment   = require('moment'),
        Backbone = require('backbone'),
        Message  = require('message'),
        Template = require('text!/templates/message.html');

    var ViewMessage = Backbone.View.extend({
        template: _.template( Template ),
        bindings: {
            '.time:last' : {
                observe: 'created_datetime',
                update: function( $el, created_datetime, model ) {
                    $el.text( created_datetime.local().format("LTS") );
                }
            },
            '.sender_name:last' : {
                observe: 'sender_name',
                update: function( $el, message, model ) {
                    $el.text( message );
                    if( model.get('is_staff') ) {
                        $el.addClass('staff_message');
                    }
                    else if( model.get('is_customer') ) {
                        $el.addClass('customer_message');
                    }
                }
            },
            '.content:last' : {
                observe: 'content',
                update: function( $el, content, model ) {
                    var escaped_content = content.replace(/(?:\r\n|\r|\n)/g, '<br />');
                    $el.html( escaped_content );
                }
            }
        },
        initialize: function() {
            _.bindAll( this, 'render' );
        },
        render: function() {
            this.$el.append( this.template() );
            this.stickit();
            return this;
        }
    });

    return ViewMessage;
});
