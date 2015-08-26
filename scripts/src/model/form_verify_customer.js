define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        _          = require('underscore'),
        Backbone   = require('backbone'),
        Validation = require('backbone_validation');

    var FormVerifyCustomer = Backbone.Model.extend({
        isa: 'FormVerifyCustomer',
        defaults: {
            chat:     undefined,
            username: undefined,
            password: undefined
        },
        validation: {
            chat: function( value ) {
                if( value.isa !== 'Chat' ) {
                    return 'chat is not a Chat';
                }
            },
            username: {
                required: true
            },
            password: {
                required: true
            }
        },
        initialize: function() {
            Backbone.Validation.configure({
                forceUpdate: true
            });
        }
    });

    return FormVerifyCustomer;
});
