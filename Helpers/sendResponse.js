export default function snedResponse(status, err, data, res, msg) {
  res.status(status).json({
    status,
    err,
    data,
    res,
    msg,
  });
}
