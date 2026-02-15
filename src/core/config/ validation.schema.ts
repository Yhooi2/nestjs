import Joi from 'joi';
import ms, { type StringValue } from 'ms';

export const validationSchema = Joi.object({
  JWT_ACCESS_TOKEN: Joi.string()
    .required()
    .custom((value: string, helpers) => {
      const msValue = ms(value as StringValue);
      if (!(msValue > 0)) {
        return helpers.error('any.invalid', { value });
      }
      return value;
    })
    .message(
      'JWT_ACCESS_TOKEN must be a valid duration string (e.g. "15m", "2h", "7d")',
    ),

  JWT_REFRESH_TOKEN: Joi.string()
    .required()
    .custom((value: string, helpers) => {
      const msValue = ms(value as StringValue);
      if (!(msValue > 0)) {
        return helpers.error('any.invalid', { value });
      }
      return value;
    })
    .message(
      'JWT_REFRESH_TOKEN must be a valid duration string (e.g. "7d", "30d")',
    ),
});
