define(function( require ) {
    "use strict";

    var $          = require('jquery'),
        _          = require('underscore'),
        Backbone   = require('backbone'),
        Validation = require('backbone_validation'),
        moment     = require('moment'),
        Session    = require('session');

    var ServerTime = Backbone.Model.extend({
        isa: 'ServerTime',
        url: '/server_time',
        defaults: {
            epoch:   undefined,
            utc:     undefined,
            central: undefined
        },
        validation: {
            epoch: {
                required: true,
                pattern: 'digits'
            },
            utc: function( value ) {
                if( !moment.isMoment( value ) ) {
                    return 'utc is not a moment';
                }
            },
            central: function( value ) {
                if( !moment.isMoment( value ) ) {
                    return 'utc is not a moment';
                }
            }
        },
        parse: function( response ) {
            return {
                epoch: response.epoch,
                utc: moment( response.utc ),
                central: moment( response.central )
            };
        }
    });

    return ServerTime;
});
