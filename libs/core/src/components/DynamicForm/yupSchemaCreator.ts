import * as yup from 'yup';
import { shouldShowFormField } from './depField.fns';
import { FormField, FormFieldValidation } from './types';

export function createYupSchema(schema: any, field: FormField) {
    const validations = field.validations || [];
    if (!yup[field.validationType]) {
        return schema;
    }

    let validator: any = yup[field.validationType]();
    validations.forEach((validation: FormFieldValidation<any>) => {
        const { params, type } = validation;
        if (validator[type] == null) {
            return;
        }
        if (field.showWhen) {
            /**
             * Only apply validation when field is shown
             */
            const depFieldKeys = Object.keys(field.showWhen);
            validator = validator.when(depFieldKeys, {
                is: (...depFieldValues: any[]) => {
                    const valueMap = Object.fromEntries(depFieldKeys.map((_, i) => [depFieldKeys[i], depFieldValues[i]]));
                    return shouldShowFormField(field, valueMap);
                },
                then: validator[type](...params),
            });
        } else {
            validator = validator[type](...params);
        }
    });
    schema[field.id] = validator;
    return schema;
}
