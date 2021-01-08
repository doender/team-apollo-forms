import { Field, FieldProps } from 'formik';
import React from 'react';
import { FormLocale, FormLocaleKey, renderErrorMsg } from '../../locales';
import { renderTemplate } from '../../utils/renderTemplate';
import { DynamicFormInput } from './DynamicFormInput';
import { FormControls, FormField, FormFieldValidation } from './types';

const DynamicFormField: React.FC<{
    item: FormField;
    controls: FormControls;
    onFocus: () => void;
    onBlur: () => void;
    locale: FormLocale;
}> = ({ item, controls, onFocus, locale, onBlur }) => {
    const Controls = controls;
    const validations: FormFieldValidation<any>[] = (item.type === 'formField' ? item.validations : undefined) || [];
    const isRequired = validations.find((val) => val.type === 'required') != null;
    const placeholder = item.placeholder || locale[FormLocaleKey.PLACEHOLDER];
    const getLabel = (formValues) => item.label && renderTemplate(item.label, formValues);
    const getDescription = (formValues) => item.description && renderTemplate(item.description, formValues);
    return (
        <>
            <Field name={item.id}>
                {({ field, meta, form }: FieldProps) => (
                    <Controls.FormField
                        isRequired={isRequired}
                        id={item.id}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        isInvalid={!!meta.touched && !!meta.error}
                        label={getLabel(form.values)}
                        description={getDescription(form.values)}
                        errorMsg={renderErrorMsg(meta.error, locale)}
                    >
                        <DynamicFormInput
                            id={item.id}
                            isRequired={isRequired}
                            isInvalid={!!meta.touched && !!meta.error}
                            label={getLabel(form.values)}
                            description={getDescription(form.values)}
                            errorMsg={renderErrorMsg(meta.error, locale)}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            item={item}
                            field={field}
                            form={form}
                            controls={controls}
                        />
                    </Controls.FormField>
                )}
            </Field>
        </>
    );
};

export default DynamicFormField;
