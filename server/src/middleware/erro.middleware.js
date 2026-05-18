const duplicateFieldMessages = {
  domain: "This website domain is already added. Please use a different domain or select the existing website.",
  email: "This email is already registered. Please log in or use another email.",
  userName: "This username is already taken. Please choose another username.",
};

const statusMessages = {
  400: "We could not process that request. Please check the details and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You do not have permission to perform this action.",
  404: "We could not find the requested resource.",
  409: "These details already exist. Please use different information.",
  422: "We could not complete the request with the details provided.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our side. Please try again in a moment.",
  502: "A connected service is not responding. Please try again shortly.",
  503: "This service is temporarily unavailable. Please try again shortly.",
};

const getDuplicateKeyMessage = (error) => {
  const field = Object.keys(error.keyPattern || error.keyValue || {})[0];

  return duplicateFieldMessages[field] || "This record already exists. Please use different details.";
};

const normalizeError = (error) => {
  if (error?.code === 11000) {
    return {
      statusCode: 409,
      message: getDuplicateKeyMessage(error),
      errors: [],
    };
  }

  if (error?.name === "ValidationError") {
    const validationErrors = Object.values(error.errors || {})
      .map((item) => item.message)
      .filter(Boolean);

    return {
      statusCode: 400,
      message: validationErrors[0] || "Please check the highlighted fields and try again.",
      errors: validationErrors,
    };
  }

  if (error?.name === "CastError") {
    return {
      statusCode: 400,
      message: "Invalid request value. Please refresh and try again.",
      errors: [],
    };
  }

  const statusCode = error.statusCode || error.status || 500;
  const isOperationalError = statusCode < 500 && error.message;

  return {
    statusCode,
    message: isOperationalError ? error.message : statusMessages[statusCode] || statusMessages[500],
    errors: error.errors || [],
  };
};

const errorMiddleware = (err, req, res, next) => {
  const normalizedError = normalizeError(err);

  return res.status(normalizedError.statusCode).json({
    success: false,
    message: normalizedError.message,
    errors: normalizedError.errors,
  });
};

export default errorMiddleware;
export { normalizeError };
