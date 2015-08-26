define( function( require ) {
    "use strict";

    var $                  = require('jquery'),
        _                  = require('underscore'),
        Backbone           = require('backbone'),
        FormVerifyCustomer = require('form_verify_customer'),
        ViewVerifyCustomer = require('view_verify_customer'),
        StickIt            = require('stickit'),
        PredictWait        = require('predict_wait'),
        Template           = require('text!/templates/waiting_for_staff.html');

    var WaitingForStaff = Backbone.View.extend({
        template: _.template( Template ),
        events: {
        },
        bindings: {
            '#expected_wait_time' : {
                observe: 'expected_wait_time',
                update: function( $el, expected_wait_time, model ) {
                    if( expected_wait_time > 20 ) {
                        $('#expected_wait_time').html( 'We are experiencing higher than normal chat volume.  We will be with you as soon as possible, but please consider submitting a ticket or calling us instead.' );
                    }
                    else if( expected_wait_time > 1 ) {
                        $('#expected_wait_time').html( 'Your expected wait time is about ' + expected_wait_time + ' minutes.' );

                    }
                    else {
                        $('#expected_wait_time').html( 'Your expected wait time is about ' + expected_wait_time + ' minute.' );
                    }

                    var progress = 100 -
                        ( ( model.get('expected_wait_time') / model.get('initial_expected_wait_time') ) * 100 );

                    if( progress < 5 ) {
                        progress = 5;
                    }

                    $('.progress-bar').css( 'width', progress + '%').attr( 'aria-valuenow', progress );
                }
            }
        },
        initialize: function( options ) {
            _.bindAll( this, 'render' );
            this.listenTo( this.model, 'sync', this.render );
        },
        render: function() {
            this.$el.html( this.template() );

            // Tick the expected_wait_time down...
            var self = this;
            this.interval = setInterval(function() {
                if( self.model.get('expected_wait_time') >= 1 ) {
                    self.model.set('expected_wait_time', self.model.get('expected_wait_time') - 1 );
                }
            }, 60000 );

            this.stickit();

            // If this is an existing customer attempt to verify them
            if( App.chat.get('brand').get('has_verification') && App.chat.get('customer').get('is_existing') ) {
                var form_verify_customer = new FormVerifyCustomer({
                    chat: App.chat
                });

                var view_verify_customer = new ViewVerifyCustomer({
                    model: form_verify_customer,
                    el: $('body')
                });
            }

            return this;
        }
    });

    return WaitingForStaff;
});
