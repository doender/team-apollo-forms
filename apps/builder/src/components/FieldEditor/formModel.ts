import { FormField, FormFieldValidation, LikertInputFormField } from '@team-apollo-forms/core';

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
}

export const mapFieldToFormValues = (field: FormField): FormModel => {
    const validations: FormFieldValidation<any>[] = (field.type === 'formField' ? field.validations : undefined) || [];
    const isRequired = validations.find((val) => val.type === 'required') != null;
    const model: FormModel = {
        isRequired,
        description: field.description,
        label: field.label || '',
    };

    if (field.control === 'checkboxText' || field.control === 'radioText') {
        model.isMultiple = field.control === 'checkboxText';
    }

    if (field.control === 'likert5') {
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

    // Remove or add required validation
    let validations: FormFieldValidation<any>[] = field.validations != null ? [...field.validations] : [];
    const requiredValIdx = validations.map((val) => val.type).findIndex((type) => type === 'required');
    if (values.isRequired && requiredValIdx == -1) {
        validations = [...validations, { type: 'required', params: [] }];
    } else if (!values.isRequired && requiredValIdx != -1) {
        console.log(validations, requiredValIdx);
        validations = [...validations.slice(0, requiredValIdx), ...validations.slice(requiredValIdx + 1)];
    }

    if (values.min != null || values.minLength != null) {
        const minValIdx = validations.map((val) => val.type).findIndex((type) => type === 'min');
        if (minValIdx === -1) {
            validations.push({ type: 'min', params: [values.min || values.minLength] });
        } else {
            validations[minValIdx] = { type: 'min', params: [values.min || values.minLength] };
        }
    }

    if (values.max != null || values.maxLength != null) {
        const maxValIdx = validations.map((val) => val.type).findIndex((type) => type === 'max');
        if (maxValIdx === -1) {
            validations.push({ type: 'max', params: [values.max || values.maxLength] });
        } else {
            validations[maxValIdx] = { type: 'max', params: [values.max || values.maxLength] };
        }
    }

    newField.validations = validations;

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
