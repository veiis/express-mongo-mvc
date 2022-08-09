const createHttpError = require("http-errors");

module.exports = (schema) => {
  return async (req, res, next) => {
    const errors = [];
    const sections = Object.keys(schema);
    for (const section of sections) {
      const { value, error } = schema[section].validate(req[section], {
        abortEarly: false,
      });

      if (error) {
        error.details.forEach((d) => {
          errors.push({ section, ...d });
        });
      }

      req[section] = value;
    }

    if (errors.length > 0) {
      const error = createHttpError(422, errorFormater(errors));
      return next(error);
    }

    next();
  };
};

const errorFormater = (errors) => {
  const e = { message: "Validation failed", fields: [] };
  for (const error of errors) {
    e.fields.push({
      path: error.section,
      label: error.context.label,
      error: messageReplacer(error.message, error.context.label),
    });
  }
  return e;
};

const messageReplacer = (message, label) =>
  message.replace(`\"${label}\"`, `${label}`);
