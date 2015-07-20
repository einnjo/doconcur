'use strict';

function AuthorizationError(status, message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
}

Object.setPrototypeOf(AuthorizationError, Error.prototype);

module.exports = AuthorizationError;
