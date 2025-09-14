exports.sendResponseWithoutData = async (
  res,
  statusCode,
  statusResult,
  statusMessage
) => {
  res.status(statusCode).json({
    status: statusResult,
    message: statusMessage,
  })
}
exports.sendResponseWithData = async (res, statusCode, statusResult, data) => {
  res.status(statusCode).json({
    status: statusResult,
    data: data,
  })
}
