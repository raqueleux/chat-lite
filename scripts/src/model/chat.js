define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        _          = require('underscore'),
        Backbone   = require('backbone'),
        Validation = require('backbone_validation'),
        Brand      = require('brand'),
        Customer   = require('customer'),
        Department = require('department'),
        Language   = require('language'),
        Messages   = require('messages'),
        Session    = require('session');

    var Chat = Backbone.Model.extend({
        isa: 'Chat',
        defaults: {
            id:               undefined,
            status:           undefined,
            brand:            undefined,
            customer:         undefined,
            department:       undefined,
            language:         undefined,
            domain:           undefined,
            initial_question: undefined,
            messages:         undefined,
            realtime_rating:  undefined
        },
        validation: {
            brand: function( value ) {
                if( value.isa !== 'Brand' ) {
                    return 'brand is not a Brand';
                }
            },
            customer: function( value ) {
                if( value.isa !== 'Customer' ) {
                    return 'customer is not a Customer';
                }
            },
            department: function( value ) {
                if( value.isa !== 'Department' ) {
                    return 'department is not a Department';
                }
            },
            language: function( value ) {
                if( value.isa !== 'Language' ) {
                    return 'language is not a Language';
                }
            },
            domain: function( value ) {
                if( value && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test( value ) ) {
                    return 'domain is not a valid domain';
                }
            },
            initial_question: {
                required: true
            },
            realtime_rating: {
                range: [1, 5]
            },
            status: {
                oneOf: ['Active', 'Ended']
            },
        },
        initialize: function() {
            Backbone.Validation.configure({
                forceUpdate: true
            });
        },
        parse: function( response, options ) {
            if( options.xhr.status === 304 ) {
                return this.attributes;
            }

            return {
                id:               response.chat_id,
                brand:            this.get('brand'),
                customer:         this.get('customer'),
                department:       this.get('department'),
                language:         this.get('language'),
                domain:           this.get('domain'),
                initial_question: this.get('initial_question'),
                messages:         this.get('messages'),
                realtime_rating:  response.realtime_rating,
                status:           response.status
            };
        },
        sync: function( method, model, options ) {
            options = options || {};

            if( method.toLowerCase() === 'create' ) {
                options.url = '/create';

                options.data = JSON.stringify({
                    brand_id:         this.get('brand').get('id'),
                    department_id:    this.get('department').get('id'),
                    language_id:      this.get('language').get('id'),
                    customer_name:    encodeURIComponent( this.get('customer').get('name') ),
                    domain:           this.get('domain'),
                    initial_question: encodeURIComponent( this.get('initial_question') )
                });

            }

            return Backbone.sync.apply( this, arguments );
        },
        update_realtime_rating: function( ) {
            var options = {};

            options.type = 'POST';
            options.url = '/' + this.get('id') + '/rating/realtime';
            options.data = JSON.stringify({
                id:              this.get('id'),
                realtime_rating: this.get('realtime_rating') ? this.get('realtime_rating') : 0
            });

            Backbone.Model.prototype.fetch.call( this, options );
        },
        end_chat: function() {
            var options = {};

            options.type = 'POST';
            options.url = '/' + this.get('id') + '/end';

            Backbone.Model.prototype.fetch.call( this, options );
        }
    });

    return Chat;
});
