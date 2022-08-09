module.exports = (res, status, data, message) => {
  return res.status(status).json({ data, message });
};
