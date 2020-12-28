import * as yup from 'yup';
import { shouldShowFormField } from './depField.fns';
export function createYupSchema(schema, field) {
  var validations = field.validations || [];
  if (!yup[field.validationType]) {
    return schema;
  }
  var validator = yup[field.validationType]();
  validations.forEach(function(validation) {
    var params = validation.params,
      type = validation.type;
    if (validator[type] == null) {
      return;
    }
    if (field.showWhen) {
      /**
       * Only apply validation when field is shown
       */
      var depFieldKeys_1 = Object.keys(field.showWhen);
      validator = validator.when(depFieldKeys_1, {
        is: function() {
          var depFieldValues = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            depFieldValues[_i] = arguments[_i];
          }
          var valueMap = Object.fromEntries(
            depFieldKeys_1.map(function(_, i) {
              return [depFieldKeys_1[i], depFieldValues[i]];
            })
          );
          return shouldShowFormField(field, valueMap);
        },
        then: validator[type].apply(validator, params),
      });
    } else {
      validator = validator[type].apply(validator, params);
    }
  });
  schema[field.id] = validator;
  return schema;
}
//# sourceMappingURL=yupSchemaCreator.js.map
