import { FieldInputProps, FormikProps } from 'formik';
import React from 'react';
import DebouncedInput from '../DebouncedInput';
import { FormControls, FormField, FormFieldValidation } from './types';

interface DynamicFormInputProps {
    item: FormField;
    field: FieldInputProps<any>;
    form: FormikProps<any>;
    controls: FormControls;
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
    controls,
    label,
    description,
    errorMsg,
    isRequired,
    isInvalid,
    onFocus,
    onBlur,
    placeholder,
}) => {
    const Controls = controls;
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
        if (!Controls.TextInput) throw Error('TextInput component undefined');
        return <Controls.TextInput {...props} />;
    }

    if (item.control === 'numberInput') {
        if (!Controls.NumberInput) throw Error('NumberInput component undefined');
        const min = item.validations?.find((val) => val.type === 'min')?.params[0] as number;
        const max = item.validations?.find((val) => val.type === 'max')?.params[0] as number;
        return <Controls.NumberInput {...props} min={min || -Infinity} max={max || Infinity} />;
    }

    if (item.control === 'textArea') {
        if (!Controls.TextareaInput) throw Error('TextAreaInput component undefined');
        return <Controls.TextareaInput {...props} />;
    }

    if (item.control === 'likert') {
        if (!Controls.LikertInput) throw Error('LikertInput component undefined');
        const anchorLabels = item.anchorLabels || ['', ''];
        return <Controls.LikertInput {...props} anchorLabels={anchorLabels} />;
    }

    if (item.control === 'radioText') {
        if (!Controls.RadioTextInput) throw Error('RadioTextInput component undefined');
        return <Controls.RadioTextInput options={item.options} {...props} />;
    }

    if (item.control === 'checkboxText') {
        if (!Controls.CheckboxTextInput) throw Error('CheckboxTextInput component undefined');
        return <Controls.CheckboxTextInput {...props} options={item.options} />;
    }

    if (item.control === 'slider') {
        if (!Controls.SliderInput) throw Error('SliderInput component undefined');
        const min = item.validations!.find((val) => val.type === 'min')?.params[0] as number;
        const max = item.validations!.find((val: FormFieldValidation<number>) => val.type === 'max')?.params[0] as number;
        return <DebouncedInput {...props} min={min || 0} max={max || 1000} debounceTime={300} component={Controls.SliderInput} />;
    }

    return null;
};
