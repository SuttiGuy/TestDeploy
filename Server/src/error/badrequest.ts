import { StatusCodes } from "http-status-codes";

class BadRequestError extends Error {
    public statusCode : number;

    constructor(message: string){
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
        this.name = 'BadRequestError';
        Object.setPrototypeOf(this, new.target.prototype)
    }
}
export default BadRequestError;