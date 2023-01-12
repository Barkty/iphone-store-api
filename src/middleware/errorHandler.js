import { CustomAPIError } from "../utils/customError";

const errorResponse = (res, statusCode, msg) =>
  res.status(statusCode).json({ message: msg, success: 0 });

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return errorResponse(res, err.statusCode, err.message);
  } if (err.name === "ValidationError") {
    let msg = "";
    Object.keys(err.errors).forEach((key) => {
      msg += `${err.errors[key].message}.`;
    });

    return errorResponse(res, 400, msg);
  } if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Not authorized: token expired");
  }
  // eslint-disable-next-line no-console
  console.log(err);
  return errorResponse(res, 500, "Something went wrong, please try again");
};

export default errorHandlerMiddleware;
