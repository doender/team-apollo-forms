import { FieldInputProps, FormikProps } from 'formik';
import React from 'react';
import DebouncedInput from '../DebouncedInput';
import { FormField, FormFieldValidation, FormUiControls } from './types';

interface DynamicFormInputProps {
    item: FormField;
    field: FieldInputProps<any>;
    form: FormikProps<any>;
    UiControls: FormUiControls;
    isInvalid: boolean;
    label?: string;
    id: string;
    description?: string;
    errorMsg: string;
    isRequired: boolean;
    onFocus: () => void;
    onBlur: () => void;
    placeholder: string;
}

// Todo: make controls optional and throw error if not available

export const DynamicFormInput: React.FC<DynamicFormInputProps> = ({
    item,
    field,
    form,
    UiControls,
    label,
    description,
    errorMsg,
    isRequired,
    isInvalid,
    onFocus,
    onBlur,
    placeholder,
}) => {
    const props = {
        field,
        form,
        isRequired,
        isInvalid,
        errorMsg,
        description,
        onFocus,
        label,
        placeholder,
        onChange: (val) => form.setFieldValue(field.name, val),
        name: field.name,
        value: field.value,
        onBlur: (e) => {
            field.onBlur(e);
            onBlur();
        },
    };

    if (item.control === 'textInput') {
        if (!UiControls.TextInput) throw Error('TextInput component undefined');
        return <UiControls.TextInput {...props} />;
    }

    if (item.control === 'numberInput') {
        if (!UiControls.NumberInput) throw Error('NumberInput component undefined');
        const min = item.validations?.find((val) => val.type === 'min')?.params[0] as number;
        const max = item.validations?.find((val) => val.type === 'max')?.params[0] as number;
        return <UiControls.NumberInput {...props} min={min || -Infinity} max={max || Infinity} />;
    }

    if (item.control === 'textArea') {
        if (!UiControls.TextareaInput) throw Error('TextAreaInput component undefined');
        return <UiControls.TextareaInput {...props} />;
    }

    if (item.control === 'likert') {
        if (!UiControls.LikertInput) throw Error('LikertInput component undefined');
        const anchorLabels = item.anchorLabels || ['', ''];
        return <UiControls.LikertInput {...props} anchorLabels={anchorLabels} />;
    }

    if (item.control === 'radioText') {
        if (!UiControls.RadioTextInput) throw Error('RadioTextInput component undefined');
        return <UiControls.RadioTextInput options={item.options} {...props} />;
    }

    if (item.control === 'checkboxText') {
        if (!UiControls.CheckboxTextInput) throw Error('CheckboxTextInput component undefined');
        return <UiControls.CheckboxTextInput {...props} options={item.options} />;
    }

    if (item.control === 'slider') {
        if (!UiControls.SliderInput) throw Error('SliderInput component undefined');
        const min = item.validations!.find((val) => val.type === 'min')?.params[0] as number;
        const max = item.validations!.find((val: FormFieldValidation<number>) => val.type === 'max')?.params[0] as number;
        return <DebouncedInput {...props} min={min || 0} max={max || 1000} debounceTime={300} component={UiControls.SliderInput} />;
    }

    return null;
};
