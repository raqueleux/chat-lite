define( function( require ) {
    "use strict";

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StickIt  = require('stickit'),
        Notification = require('notification'),
        Template     = require('text!/templates/notification.html');

    var Notification = Backbone.View.extend({
        template: _.template( Template ),
        bindings: {
            '#notification_content': 'content',
            '#notification_url': {
                observe: 'url',
                update: function( $el, value, model, options ) {
                    if( value ) {
                        $el.attr('href', value );
                        $el.closest('.row').removeClass('hidden');
                    }
                }
            }
        },
        initialize: function( options ) {
            var self = this;

            _.bindAll( this, 'render' );
            this.listenTo( this.model, 'sync', function() {
                if( self.model.get('id') ) {
                    self.render();
                }
            });
        },
        render: function() {
            this.$el.prepend( this.template() );

            this.stickit();
            return this;
        }
    });

    return Notification;
});
