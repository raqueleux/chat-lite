define(function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone'),
        Brand    = require('brand');

    var Evergage = Backbone.View.extend({
        initialize: function( options ) {
            _.bindAll( this, 'render' );
        },
        render: function() {
            // Only include the evergage snippet if the brand has it.
            if( this.model.get('evergage_dataset') ) {
                var _aaq = window._aaq || (window._aaq = []);
                var evergageAccount = 'eig';
                var dataset = this.model.get('evergage_dataset');
                _aaq.push(['setEvergageAccount', evergageAccount], ['setDataset', dataset], ['setUseSiteConfig', true]);

                (function(){
                    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
                        g.type = 'text/javascript'; g.defer = true; g.async = true;
                        g.src = document.location.protocol + '//cdn.evergage.com/beacon/'
                                + evergageAccount + '/' + dataset + '/scripts/evergage.min.js';
                        s.parentNode.insertBefore(g, s);
                })();
            }
        }
    });

    return Evergage;
});
