import { FormikProps } from 'formik';
import { ReactNode } from 'react';

export interface FormFieldValidation<T extends number | string | boolean | Array<number | string>> {
    params: (string | number)[];
    type: T extends number
        ? NumberFieldValidation
        : T extends string
        ? StringFieldValidation
        : T extends Array<number | string>
        ? ArrayFieldValidation
        : BooleanFieldValidation;
}

type NumberFieldValidation = 'required' | 'min' | 'max' | 'lessThan' | 'moreThan' | 'positive' | 'negative';
type StringFieldValidation = 'required' | 'min' | 'max' | 'length' | 'email';
type ArrayFieldValidation = 'required' | 'min' | 'max' | 'length';
type BooleanFieldValidation = 'required' | 'isTrue' | 'isFalse';

export type ComparisonOperator = '$eq' | '$gt' | '$gte' | '$lt' | '$lte' | '$ne' | '$in' | '$nin';
export type FormFieldValue = number | number[] | string | string[] | boolean;
export type ComparisonOperatorCondition = { [key in ComparisonOperator]?: FormFieldValue };

export type Option = { value: string; label: string };

interface BaseFormField {
    type: 'formField';
    id: string;
    label?: string;
    description?: string;
    placeholder?: string;
    showWhen?: { [key: string]: ComparisonOperatorCondition };
}

export interface TextInputFormField extends BaseFormField {
    control: 'textInput';
    validationType: 'string';
    value?: string;
    validations?: FormFieldValidation<string>[];
}

export interface TextAreaFormField extends BaseFormField {
    control: 'textArea';
    validationType: 'string';
    value?: string;
    validations?: FormFieldValidation<string>[];
}

export interface NumberInputFormField extends BaseFormField {
    control: 'numberInput';
    validationType: 'number';
    value?: number;
    validations?: FormFieldValidation<number>[];
}

export interface LikertInputFormField extends BaseFormField {
    control: 'likert';
    validationType: 'number';
    anchorLabels?: [string, string];
    value?: number;
    validations?: FormFieldValidation<number>[];
}

export interface RadioTextInputFormField extends BaseFormField {
    control: 'radioText';
    value?: string;
    validationType: 'string';
    options: Option[];
    validations?: FormFieldValidation<string>[];
}

export interface CheckboxTextInputFormField extends BaseFormField {
    control: 'checkboxText';
    value?: string[];
    validationType: 'array';
    options: Option[];
    validations?: FormFieldValidation<Array<string>>[];
}

export interface SwitchFormField extends BaseFormField {
    control: 'switch';
    validationType: 'boolean';
    value?: boolean;
    validations?: FormFieldValidation<boolean>[];
}

export interface SliderFormField extends BaseFormField {
    control: 'slider';
    validationType: 'number';
    value?: number;
    validations?: FormFieldValidation<number>[];
}

export type FormField =
    | TextInputFormField
    | TextAreaFormField
    | NumberInputFormField
    | LikertInputFormField
    | RadioTextInputFormField
    | CheckboxTextInputFormField
    | SwitchFormField
    | SliderFormField;

export interface PlaceholderBlock {
    type: 'placeholder';
    id: string;
}

export interface FormSection {
    title?: string;
    fields: (FormField | PlaceholderBlock)[];
}

export type FormDefinition = {
    uuid: string;
    version: number;
    sections: FormSection[];
};

export const isFormField = (item: FormField | PlaceholderBlock): item is FormField => {
    return item.type === 'formField';
};

export const isPlaceholder = (item: FormField | PlaceholderBlock): item is PlaceholderBlock => {
    return item.type === 'placeholder';
};

type DeepReadonly<T> = T extends Function ? T : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;

export type ModelFromDef<T extends DeepReadonly<FormDefinition>> = {
    [K in Extract<T['sections'][number]['fields'][number], { type: 'formField' }>['id']]: FormFieldValue;
};

export type PlaceholderFnsFromDef<T extends DeepReadonly<FormDefinition>> = {
    [K in Extract<T['sections'][number]['fields'][number], { type: 'placeholder' }>['id']]: (
        form: FormikProps<ModelFromDef<T>>
    ) => ReactNode;
};

interface BaseFormUiControlProps<T> {
    isInvalid: boolean;
    label?: string;
    description?: string;
    errorMsg: string;
    placeholder: string | undefined;
    isRequired: boolean;
    onFocus: () => void;
    onBlur: (e: any) => void;
    value: T;
    onChange: (val: T) => void;
    name: string;
}

interface FormFieldProps {
    isInvalid: boolean;
    label?: string;
    description?: string;
    errorMsg: string;
    placeholder: string | undefined;
    isRequired: boolean;
    onFocus: () => void;
    onBlur: (e: any) => void;
    id: string;
}

export interface FormControls {
    ErrorMessage: React.FC<{ msg: string }>;
    FormField: React.FC<FormFieldProps>;
    TextInput?: React.FC<BaseFormUiControlProps<any>>;
    NumberInput?: React.FC<BaseFormUiControlProps<any> & { min: number; max: number }>;
    LikertInput?: React.FC<BaseFormUiControlProps<any> & { anchorLabels: [string, string] }>;
    RadioTextInput?: React.FC<BaseFormUiControlProps<any> & { options: Option[] }>;
    CheckboxTextInput?: React.FC<BaseFormUiControlProps<any> & { options: Option[] }>;
    SliderInput?: React.FC<BaseFormUiControlProps<any> & { min: number; max: number }>;
    TextareaInput?: React.FC<BaseFormUiControlProps<any>>;
    Progress: React.FC<{ value: number; max: number }>;
    PrevButton: React.FC<{ onClick: () => void }>;
    NextButton: React.FC<{ onClick: () => void; isDisabled?: boolean }>;
    SubmitButton: React.FC<{ isDisabled: boolean; isLoading: boolean }>;
}
