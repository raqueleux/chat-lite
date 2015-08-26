define(function( require ) {
    "use strict";

    var $             = require('jquery'),
        _             = require('underscore'),
        Backbone      = require('backbone'),
        StickIt       = require('stickit'),
        FormStartChat = require('form_start_chat'),
        Chat          = require('chat'),
        Customer      = require('customer'),
        Departments   = require('departments'),
        Brand         = require('brand'),
        Template      = require('text!/templates/start_chat.html');

    var StartChat = Backbone.View.extend({
        template: _.template( Template ),
        events: {
            "click #continue_button": "continue",
        },
        bindings: {
            '[name=customer_name]' : {
                observe: 'customer_name',
                setOptions: { validate: true }
            },
            '[name=department]' : {
                observe: 'department',
                selectOptions: {
                    collection: function() {
                        var active_departments = new Departments(
                            this.model.get('brand').get('departments').where({ is_active: true })
                        );

                        return active_departments;
                    },
                    defaultOption: { value: null, label: '--- Select ---' },
                    labelPath: 'name',
                    valuePath: 'id'
                },
                setOptions: { validate: true }
            },
            '[name=language]': {
                observe: 'language',
                selectOptions: {
                    collection: function() { return this.model.get('brand').get('languages') },
                    defaultOption: { value: null, label: '--- Select ---' },
                    labelPath: 'name',
                    valuePath: 'id'
                },
                setOptions: { validate: true }
            },
            '[name=domain]': {
                observe: 'domain',
                setOptions: { validate: true }
            },
            '[name=existing_customer]': {
                observe: 'existing_customer',
                setOptions: { validate: true }
            },
            '[name=initial_question]': {
                observe: 'initial_question',
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
            Backbone.Validation.bind(this);
        },
        render: function() {
            this.$el.html(
                this.template({ brand: this.model.get('brand') })
            );

            // Change the Title
            document.title = this.model.get('brand').get('name') + " Live Chat";

            // Load the Brand's CSS File
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = this.model.get('brand').get('css_url');
            document.getElementsByTagName("head")[0].appendChild(link);

            this.stickit();
            return this;
        },
        continue: function() {
            if( this.model.isValid(true) ) {
                var customer = new Customer({
                    name:        $('#customer_name').val(),
                    is_existing: $('form input[name=existing_customer]:checked').val() === "1" ? true : false,
                });

                App.chat.set('customer', customer );
                App.chat.set('department', App.chat.get('brand').get('departments').get( this.model.get('department') ) );
                App.chat.set('language', App.chat.get('brand').get('languages').get( this.model.get('language') ) );
                if( this.model.get('domain' ) ) {
                    App.chat.set('domain', this.model.get('domain') );
                }
                App.chat.set('initial_question', this.model.get('initial_question') );

                App.router.navigate( 'search_kb', { trigger: true } );
            }
       }
    });

    return StartChat;
});
