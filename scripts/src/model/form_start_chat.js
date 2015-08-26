define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        _          = require('underscore'),
        Backbone   = require('backbone'),
        Validation = require('backbone_validation');

    var FormStartChat = Backbone.Model.extend({
        isa: 'FormStartChat',
        defaults: {
            customer_name:     undefined,
            department:        undefined,
            language:          undefined,
            domain:            undefined,
            existing_customer: undefined,
            initial_question:  undefined
        },
        initialize: function() {
            Backbone.Validation.configure({
                forceUpdate: true
            });
        },
        validation: {
            customer_name: {
                required: true,
                rangeLength: [ 1, 20 ],
                msg: "Your name is required"
            },
            department: function( value, attr, computedState ) {
                if( !this.get('brand').get('departments').findWhere({ id: value }) ) {
                    return "Please select a valid department";
                }
                this.set('department', value );
            },
            language: function( value, attr, computedState ) {
                if( !this.get('brand').get('languages').findWhere({ id: value }) ) {
                    return "Please select a valid language";
                }
            },
            domain: function( value, attr, computedState ) {
                if( value && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test( value ) ) {
                    return "Please enter a valid domain";
                }
            },
            existing_customer: {
                required: true
            },
            initial_question: {
                required: true,
                minLength: 5
            }
        }
    });

    return FormStartChat;
});
