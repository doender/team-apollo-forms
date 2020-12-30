import { FieldInputProps, FormikProps } from 'formik';
import React from 'react';
import { FormField, FormFieldValidation, FormUiControls } from './types';

interface DynamicFormInputProps {
    item: FormField;
    field: FieldInputProps<any>;
    form: FormikProps<any>;
    UiControls: FormUiControls;
}

// Todo: make controls optional and throw error if not available

export const DynamicFormInput: React.FC<DynamicFormInputProps> = ({ item, field, form, UiControls }) => {
    if (item.control === 'textInput') {
        return <UiControls.TextInput field={field} form={form} placeholder={item.placeholder} />;
    }

    if (item.control === 'numberInput') {
        const min = item.validations?.find((val) => val.type === 'min')?.params[0] as number;
        const max = item.validations?.find((val) => val.type === 'max')?.params[0] as number;
        return (
            <UiControls.NumberInput field={field} form={form} placeholder={item.placeholder} min={min || -Infinity} max={max || Infinity} />
        );
    }

    if (item.control === 'textArea') {
        return <UiControls.TextareaInput field={field} form={form} placeholder={item.placeholder} />;
    }

    if (item.control === 'likert5') {
        const anchorLabels = item.anchorLabels || ['', ''];
        return <UiControls.LikertInput field={field} form={form} anchorLabels={anchorLabels} />;
    }

    if (item.control === 'radioText') {
        return <UiControls.RadioTextInput field={field} form={form} options={item.options} />;
    }

    if (item.control === 'checkboxText') {
        return <UiControls.CheckboxTextInput field={field} form={form} options={item.options} />;
    }

    if (item.control === 'slider') {
        const min = item.validations!.find((val) => val.type === 'min')?.params[0] as number;
        const max = item.validations!.find((val: FormFieldValidation<number>) => val.type === 'max')?.params[0] as number;
        return <UiControls.SliderInput field={field} form={form} min={min || 0} max={max || 1000} />;
    }

    if (item.control === 'switch') {
        return <UiControls.SwitchInput field={field} form={form} />;
    }

    return null;
};
