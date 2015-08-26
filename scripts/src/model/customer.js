define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        _          = require('underscore'),
        Validation = require('backbone_validation');

    var Customer = Backbone.Model.extend({
        isa: 'Customer',
        defaults: {
            name:        undefined,
            is_existing: undefined,
            is_verified: false,
        },
        validation: {
            name: {
                required: true
            },
            is_existing: function( value, attr, computedState ) {
                if( !_.isBoolean( value ) ) {
                    return 'is_existing must be boolean';
                }
            },
            is_verified: function( value, attr, computedState ) {
                if( !_.isBoolean( value ) ) {
                    return 'is_verified must be boolean';
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
                name:        this.get('name'),
                is_existing: this.get('is_existing'),
                is_verified: response.is_verified === true ? true : false
            };
        },
        attempt_verification: function( chat_id, username, password ) {
            var options = { };

            options.url  = '/' + chat_id + '/billing/verify';
            options.type = 'POST';
            options.error = function( model, response, options ) {
                model.trigger('sync');
            };

            options.data = JSON.stringify({
                username: username,
                password: password
            });

            return Backbone.Model.prototype.fetch.call( this, options );
        },
        decline_verification: function( chat_id ) {
            var options = { };

            options.url  = '/' + chat_id + '/billing/verify/decline';
            options.type = 'POST';

            options.data = JSON.stringify({ });

            return Backbone.Model.prototype.fetch.call( this, options );
        }
    });

    return Customer;
});
