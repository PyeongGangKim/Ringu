const {StatusCodes} = require("http-status-codes");

const statusCodes = {
    //duplicate때는 OK로 하고, message로 구별
    OK: StatusCodes.OK,
    DUPLICATE: StatusCodes.OK, 
    CREATED: StatusCodes.CREATED,
    ACCEPTED: StatusCodes.ACCEPTED,
    BAD_REQUEST: StatusCodes.BAD_REQUEST,
    NOT_FOUND: StatusCodes.NOT_FOUND,
    CONFILCT: StatusCodes.CONFLICT,
    INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
    NO_CONTENT: StatusCodes.NO_CONTENT,
    UNAUTHORIZED: StatusCodes.UNAUTHORIZED,
}

module.exports = statusCodes;