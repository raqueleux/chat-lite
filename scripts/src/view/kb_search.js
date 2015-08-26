define( function( require ) {
    "use strict";

    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone'),
        StickIt  = require('stickit'),
        KbSearch = require('kb_search'),
        Template = require('text!/templates/kb_search.html');

    var KBSearch = Backbone.View.extend({
        template: _.template( Template ),
        events: {
            "click #search_button" : function() {
                $('[name=search_query]').trigger('search');
            },
            "click #start_chat_button" : "create_chat"
        },
        bindings: {
            '[name=search_query]' : {
                observe: 'search_query',
                events: ['search'],
            },
            '#kb_search_results' : {
                observe: 'results',
                update: function( $el, kb_search_results, model, options ) {
                    $('#kb_search_results').html();

                    if( kb_search_results.length > 0 ) {
                        $('#no_kb_search_results').addClass('hidden');
                        $('#kb_search_results').removeClass('hidden');

                        kb_search_results.each(function( kb_search_result ) {
                            // TODO: This should really be it's own view
                            $('#kb_search_results_list').append(
                                '<li><a href="'
                                + kb_search_result.get('url') + '" target="_blank" class="search-result-link">'
                                + kb_search_result.get('text') + '</a></li>'
                            );
                        });
                    }
                    else {
                        $('#no_kb_search_results').removeClass('hidden');
                        $('#kb_search_results').addClass('hidden');
                    }

                    $('#search_query').focus();
                }
            }
        },
        initialize: function( options ) {
            _.bindAll( this, 'render' );
            this.listenTo( this.model, 'sync', this.render );
        },
        render: function() {
            this.$el.html( this.template() );

            // Do the search if enter is pressed in the input
            $("#search_query").bind("keypress", {}, function (e) {
                var code = (e.keyCode ? e.keyCode : e.which );

                if( code == 13 ) {
                    e.preventDefault();
                    $('#search_button').trigger('click');
                }
            });

            this.stickit();
            return this;
        },
        create_chat: function() {
            App.router.navigate( 'waiting_for_staff', { trigger: true } );
        }
    });

    return KBSearch;
});
