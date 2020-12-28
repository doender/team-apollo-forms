import { Field, FieldProps } from 'formik';
import React from 'react';
import { capitalize } from '../utils/capitalize';
import { renderTemplate } from '../utils/renderTemplate';
import { DynamicFormInput } from './DynamicFormInput';
import { FormField, FormFieldValidation, FormUiControls } from './types';

const DynamicFormField: React.FC<{ item: FormField; UiControls: FormUiControls; onFocus: () => void }> = ({
    item,
    UiControls,
    onFocus,
}) => {
    const validations: FormFieldValidation<any>[] = (item.type === 'formField' ? item.validations : undefined) || [];
    const isRequired = validations.find((val) => val.type === 'required') != null;
    return (
        <>
            <Field name={item.id}>
                {({ field, meta, form }: FieldProps) => (
                    <UiControls.FormField
                        isRequired={isRequired}
                        onFocus={onFocus}
                        id={item.id}
                        isInvalid={!!meta.touched && !!meta.error}
                        label={item.label && renderTemplate(item.label, form.values)}
                        description={item.description && renderTemplate(item.description, form.values)}
                        errorMsg={capitalize(meta.error)}
                    >
                        <DynamicFormInput item={item} field={field} form={form} UiControls={UiControls} />
                    </UiControls.FormField>
                )}
            </Field>
        </>
    );
};

export default DynamicFormField;
