'use strict';

var bcrypt = require('bcrypt');
var Promise = require('bluebird');

module.exports = Promise.promisifyAll(bcrypt);
