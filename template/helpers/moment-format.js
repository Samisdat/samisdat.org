'use strict';

var moment = require('moment');

module.exports = function dateFormat(date, format, utc) {

    if(true === utc){
        return moment(date).utc().format(format);
    }

    return moment(date).format(format);
};

