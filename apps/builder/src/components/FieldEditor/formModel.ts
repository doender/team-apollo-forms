import {
    CheckboxTextInputFormField,
    ComparisonOperatorCondition,
    FormField,
    FormFieldValidation,
    LikertInputFormField,
    Option,
} from '@team-apollo-forms/core';

export interface FormModel {
    isRequired: boolean;
    description: string | undefined;
    label: string;
    isMultiple?: boolean;
    anchorLabelLeft?: string;
    anchorLabelRight?: string;
    isSlider?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    id: string;
    options?: Option[];
    showWhen?: { [key: string]: ComparisonOperatorCondition };
}

export const mapFieldToFormValues = (field: FormField): FormModel => {
    const validations: FormFieldValidation<any>[] = (field.type === 'formField' ? field.validations : undefined) || [];
    const isRequired = validations.find((val) => val.type === 'required') != null;
    const model: FormModel = {
        id: field.id,
        isRequired,
        description: field.description,
        label: field.label || '',
        showWhen: field.showWhen as { [key: string]: ComparisonOperatorCondition },
    };

    if (field.control === 'checkboxText' || field.control === 'radioText') {
        model.isMultiple = field.control === 'checkboxText';
        model.options = [...field.options];
    }

    if (field.control === 'likert') {
        model.anchorLabelLeft = field.anchorLabels[0];
        model.anchorLabelRight = field.anchorLabels[1];
    }

    if (['numberInput', 'slider'].includes(field.control)) {
        model.isSlider = field.control === 'slider';
        model.min = validations.find((val) => val.type === 'min')?.params[0] as number;
        model.max = validations.find((val) => val.type === 'max')?.params[0] as number;
    }

    if (['textInput', 'textArea'].includes(field.control)) {
        model.minLength = validations.find((val) => val.type === 'min')?.params[0] as number;
        model.maxLength = validations.find((val) => val.type === 'max')?.params[0] as number;
    }

    return model;
};

export const mapFormValuesToField = (field: FormField, values: FormModel): FormField => {
    const newField = { ...field };

    newField.description = values.description;
    newField.label = values.label;
    newField.id = values.id;
    newField.showWhen = values.showWhen;

    // Remove or add required validation
    let validations: FormFieldValidation<any>[] = field.validations != null ? [...field.validations] : [];
    const requiredValIdx = validations.map((val) => val.type).findIndex((type) => type === 'required');
    if (values.isRequired && requiredValIdx == -1) {
        validations = [...validations, { type: 'required', params: [] }];
    } else if (!values.isRequired && requiredValIdx != -1) {
        validations = [...validations.slice(0, requiredValIdx), ...validations.slice(requiredValIdx + 1)];
    }

    if (values.min != null || values.minLength != null) {
        const minValIdx = validations.map((val) => val.type).findIndex((type) => type === 'min');
        const minVal = values.min != null ? values.min : values.minLength;
        if (minValIdx === -1) {
            validations.push({ type: 'min', params: [minVal] });
        } else {
            validations[minValIdx] = { type: 'min', params: [minVal] };
        }
    }

    if (values.max != null || values.maxLength != null) {
        const maxValIdx = validations.map((val) => val.type).findIndex((type) => type === 'max');
        const maxVal = values.max != null ? values.max : values.maxLength;
        if (maxValIdx === -1) {
            validations.push({ type: 'max', params: [maxVal] });
        } else {
            validations[maxValIdx] = { type: 'max', params: [maxVal] };
        }
    }

    newField.validations = validations;

    if (values.options != null) {
        (newField as CheckboxTextInputFormField).options = [...values.options];
    }

    if (values.isMultiple != null) {
        const control = values.isMultiple ? 'checkboxText' : 'radioText';
        const validationType = values.isMultiple ? 'array' : 'string';
        newField.control = control;
        newField.validationType = validationType;
    }

    if (values.isSlider != null) {
        const control = values.isSlider ? 'slider' : 'numberInput';
        newField.control = control;
    }

    if (values.anchorLabelLeft != null) {
        (newField as LikertInputFormField).anchorLabels = [values.anchorLabelLeft, (newField as LikertInputFormField).anchorLabels[1]];
    }
    if (values.anchorLabelRight != null) {
        (newField as LikertInputFormField).anchorLabels = [(newField as LikertInputFormField).anchorLabels[0], values.anchorLabelRight];
    }

    return newField;
};
