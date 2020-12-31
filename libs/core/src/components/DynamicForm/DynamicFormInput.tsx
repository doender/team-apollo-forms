import { FieldInputProps, FormikProps } from 'formik';
import React from 'react';
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
    placeholder: string;
}

// Todo: make controls optional and throw error if not available

export const DynamicFormInput: React.FC<DynamicFormInputProps> = ({
    item,
    field,
    form,
    UiControls,
    id,
    label,
    description,
    errorMsg,
    isRequired,
    isInvalid,
    onFocus,
    placeholder,
}) => {
    if (item.control === 'textInput') {
        return (
            <UiControls.TextInput
                isRequired={isRequired}
                isInvalid={isInvalid}
                errorMsg={errorMsg}
                description={description}
                label={label}
                id={id}
                field={field}
                onFocus={onFocus}
                form={form}
                placeholder={placeholder}
            />
        );
    }

    if (item.control === 'numberInput') {
        const min = item.validations?.find((val) => val.type === 'min')?.params[0] as number;
        const max = item.validations?.find((val) => val.type === 'max')?.params[0] as number;
        return (
            <UiControls.NumberInput
                isRequired={isRequired}
                isInvalid={isInvalid}
                errorMsg={errorMsg}
                description={description}
                label={label}
                onFocus={onFocus}
                id={id}
                field={field}
                form={form}
                placeholder={placeholder}
                min={min || -Infinity}
                max={max || Infinity}
            />
        );
    }

    if (item.control === 'textArea') {
        return (
            <UiControls.TextareaInput
                isRequired={isRequired}
                isInvalid={isInvalid}
                errorMsg={errorMsg}
                description={description}
                onFocus={onFocus}
                label={label}
                id={id}
                field={field}
                form={form}
                placeholder={placeholder}
            />
        );
    }

    if (item.control === 'likert5') {
        const anchorLabels = item.anchorLabels || ['', ''];
        return (
            <UiControls.LikertInput
                isRequired={isRequired}
                isInvalid={isInvalid}
                errorMsg={errorMsg}
                description={description}
                onFocus={onFocus}
                label={label}
                id={id}
                field={field}
                form={form}
                placeholder={placeholder}
                anchorLabels={anchorLabels}
            />
        );
    }

    if (item.control === 'radioText') {
        return (
            <UiControls.RadioTextInput
                field={field}
                form={form}
                options={item.options}
                isRequired={isRequired}
                onFocus={onFocus}
                isInvalid={isInvalid}
                errorMsg={errorMsg}
                description={description}
                label={label}
                id={id}
                placeholder={placeholder}
            />
        );
    }

    if (item.control === 'checkboxText') {
        return (
            <UiControls.CheckboxTextInput
                isRequired={isRequired}
                isInvalid={isInvalid}
                errorMsg={errorMsg}
                description={description}
                onFocus={onFocus}
                label={label}
                id={id}
                field={field}
                form={form}
                placeholder={placeholder}
                options={item.options}
            />
        );
    }

    if (item.control === 'slider') {
        const min = item.validations!.find((val) => val.type === 'min')?.params[0] as number;
        const max = item.validations!.find((val: FormFieldValidation<number>) => val.type === 'max')?.params[0] as number;
        return (
            <UiControls.SliderInput
                isRequired={isRequired}
                isInvalid={isInvalid}
                errorMsg={errorMsg}
                description={description}
                onFocus={onFocus}
                label={label}
                id={id}
                field={field}
                form={form}
                placeholder={placeholder}
                min={min || 0}
                max={max || 1000}
            />
        );
    }

    return null;
};
