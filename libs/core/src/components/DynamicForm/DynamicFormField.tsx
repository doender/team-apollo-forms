import { Field, FieldProps } from 'formik';
import React from 'react';
import { FormLocale, FormLocaleKey, renderErrorMsg } from '../../locales';
import { renderTemplate } from '../../utils/renderTemplate';
import { DynamicFormInput } from './DynamicFormInput';
import { FormField, FormFieldValidation, FormUiControls } from './types';

const DynamicFormField: React.FC<{
    item: FormField;
    UiControls: FormUiControls;
    onFocus: () => void;
    onBlur: () => void;
    locale: FormLocale;
}> = ({ item, UiControls, onFocus, locale, onBlur }) => {
    const validations: FormFieldValidation<any>[] = (item.type === 'formField' ? item.validations : undefined) || [];
    const isRequired = validations.find((val) => val.type === 'required') != null;
    const placeholder = item.placeholder || locale[FormLocaleKey.PLACEHOLDER];
    const getLabel = (formValues) => item.label && renderTemplate(item.label, formValues);
    const getDescription = (formValues) => item.description && renderTemplate(item.description, formValues);
    return (
        <>
            <Field name={item.id}>
                {({ field, meta, form }: FieldProps) => (
                    <UiControls.FormField
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
                            UiControls={UiControls}
                        />
                    </UiControls.FormField>
                )}
            </Field>
        </>
    );
};

export default DynamicFormField;
