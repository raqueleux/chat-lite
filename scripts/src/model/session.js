define(function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone');

    var Session = Backbone.Model.extend({
        initialize: function() {
            $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
                options.xhrFields = {
                    withCredentials: true
                };

                options.url = window.chat_api_url + options.url;
            });
        }
    });

    return Session;
});
