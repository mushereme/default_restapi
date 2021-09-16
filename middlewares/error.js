const errorHandler = (err, req, res, next) => {
  // console.log(err.stack.cyan.underline);

  const error = { ...err };

  error.message = err.message;

  // console.log("ERRORORROROR: ", error)

  // if (error.name === "CastError") {
  //   error.message = "Энэ ID буруу бүтэцтэй ID байна!";
  //   error.statusCode = 400;
  // }

  if(err.name === "SequelizeForeignKeyConstraintError") {
    error.message = "Холбоотой мэдээлэл байгаа тул устгах боломжгүй байна.",
    error.statusCode = 400
  }

  if (error.name === "JsonWebTokenError" && error.message === "invalid token") {
    error.message = "Буруу токен дамжуулсан байна!";
    error.statusCode = 400;
  }

  if (error.code === 11000) {
    error.message = "Энэ талбарын утгыг давхардуулж өгч болохгүй!";
    error.statusCode = 400;
  }

  if (error.name === "SequelizeValidationError") {
    error.message = "SequelizeValidationError",
    error.statusCode = 408,
    error.data = error.errors
  }

  if(error.name === "SequelizeUniqueConstraintError") {
    error.message = error.fields.email ? error.fields.email : error.fields.register
    error.message += " давхардаж байна."
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error,
  });
};

module.exports = errorHandler;
