define(function( require ) {
    "use strict";

    var $                  = require('jquery'),
        _                  = require('underscore'),
        bootstrap          = require('bootstrap'),
        Backbone           = require('backbone'),
        StickIt            = require('stickit'),
        Chat               = require('chat'),
        Customer           = require('customer'),
        FormVerifyCustomer = require('form_verify_customer'),
        Template           = require('text!/templates/verify_customer.html');

    var VerifyCustomer = Backbone.View.extend({
        template: _.template( Template ),
        events: {
            "click #verify_button" : "attempt_verification",
            "click #skip_button"   : "decline_verification",
            "click #close_button"  : "decline_verification"
        },
        bindings: {
            '[name=username]' : {
                observe: 'username',
                setOptions: { validate: true }
            },
            '[name=password]' : {
                observe: 'password',
                setOptions: { validate: true }
            }
        },
        initialize: function( options ) {
            this.options = options;

            _.extend(Backbone.Validation.callbacks, {
                valid: function (view, attr, selector) {
                    var $el = view.$('[name=' + attr + ']'),
                        $group = $el.closest('.form-group');

                    $group.addClass('has-success');
                    $group.removeClass('has-error');
                },
                invalid: function (view, attr, error, selector) {
                    var $el = view.$('[name=' + attr + ']'),
                        $group = $el.closest('.form-group');

                    $group.addClass('has-error');
                    $group.removeClass('has-success');
                }
            });

            _.bindAll( this, 'render' );
            Backbone.Validation.bind( this );

            this.render();
        },
        render: function() {
            // Make sure this brand supports verification
            if( !this.model.get('chat').get('brand').get('has_verification') ) {
                return;
            }

            this.$el.append( this.template() );

            // Do the search if enter is pressed in the input
            $("input").bind("keypress", {}, function (e) {
                var code = (e.keyCode ? e.keyCode : e.which );

                if( code == 13 ) {
                    e.preventDefault();
                    $('#verify_button').trigger('click');
                }
            });

            this.stickit();

            $('#verification_modal').on('hidden.bs.modal', function() {
                $('#verification_modal').remove();
            });

            // Show the modal right away
            $('#verification_modal').modal('show');
            return this;
        },
        attempt_verification: function() {
            if( this.model.isValid( true ) ) {
                var customer = App.chat.get('customer');

                this.listenToOnce( customer, 'sync', function() {
                    if( customer.get('is_verified') ) {
                        $('#verification_modal').modal('hide');
                        $('#verification_modal').remove();
                    }
                    else {
                        this.model.set('password', undefined );
                        this.model.validate();
                        $('#validation_error_message').html('Invalid username or password');
                    }
                });

                customer.attempt_verification( App.chat.get('id'), this.model.get('username'), this.model.get('password' ) );
            }
        },
        decline_verification: function() {
            var customer = App.chat.get('customer');
            customer.decline_verification( App.chat.get('id' ) );

            $('#verification_modal').modal('hide');
            $('#verification_modal').remove();
            this.undelegateEvents();
        }
    });

    return VerifyCustomer;
});
