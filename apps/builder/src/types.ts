import {
    FormField,
    LikertInputFormField,
    NumberInputFormField,
    PlaceholderBlock,
    RadioTextInputFormField,
    TextAreaFormField,
    TextInputFormField,
} from '@team-apollo-forms/core';
import { uid } from './utils/id';

export enum QuestionType {
    MULTIPLE_CHOICE = 'multiple-choice',
    SHORT_TEXT = 'short-text',
    LONG_TEXT = 'long-text',
    EMAIL = 'email',
    OPINION_SCALE = 'opinion-scale',
    NUMBER = 'number',
}

export enum BlockType {
    PLACEHOLDER = 'placeholder',
    SECTION = 'section',
}

export interface QuestionSelectMenuOption {
    value: QuestionType | BlockType;
    name: string;
}

export const questionMenuOptions: QuestionSelectMenuOption[] = [
    { name: 'Multiple choice', value: QuestionType.MULTIPLE_CHOICE },
    { name: 'Short text', value: QuestionType.SHORT_TEXT },
    { name: 'Long text', value: QuestionType.LONG_TEXT },
    { name: 'Email', value: QuestionType.EMAIL },
    { name: 'Opinion scale', value: QuestionType.OPINION_SCALE },
    { name: 'Number', value: QuestionType.NUMBER },
    { name: 'Placeholder', value: BlockType.PLACEHOLDER },
    { name: 'New Section', value: BlockType.SECTION },
];

export const mapFormFieldToQuestionType = (field: FormField | PlaceholderBlock): QuestionType | BlockType | undefined => {
    if (field.type === 'placeholder') {
        return BlockType.PLACEHOLDER;
    }
    if (field.control === 'textInput') {
        if (field.validations?.map((val) => val.type).includes('email')) {
            return QuestionType.EMAIL;
        }
        return QuestionType.SHORT_TEXT;
    }
    if (field.control === 'textArea') {
        return QuestionType.LONG_TEXT;
    }
    if (field.control === 'slider' || field.control === 'numberInput') {
        return QuestionType.NUMBER;
    }
    if (field.control === 'likert') {
        return QuestionType.OPINION_SCALE;
    }
    if (field.control === 'checkboxText' || field.control === 'radioText') {
        return QuestionType.MULTIPLE_CHOICE;
    }
    return undefined;
};

export const createQuestion = (questionType: QuestionType | BlockType): FormField | PlaceholderBlock => {
    const id = `field-${uid()}`;

    if (questionType === BlockType.PLACEHOLDER) {
        return { type: 'placeholder', id };
    }

    const type = 'formField';
    if (questionType === QuestionType.EMAIL) {
        return {
            id,
            type,
            control: 'textInput',
            validationType: 'string',
            validations: [{ type: 'email', params: [] }],
        } as TextInputFormField;
    } else if (questionType === QuestionType.LONG_TEXT) {
        return {
            type,
            id,
            control: 'textArea',
            validationType: 'string',
        } as TextAreaFormField;
    } else if (questionType === QuestionType.SHORT_TEXT) {
        return {
            type,
            id,
            control: 'textInput',
            validationType: 'string',
        } as TextInputFormField;
    } else if (questionType === QuestionType.MULTIPLE_CHOICE) {
        return {
            type,
            id,
            control: 'radioText',
            validationType: 'string',
            options: [
                { label: 'Yes', value: `option-${uid()}` },
                { label: 'No', value: `option-${uid()}` },
            ],
        } as RadioTextInputFormField;
    } else if (questionType === QuestionType.NUMBER) {
        return {
            type,
            id,
            control: 'numberInput',
            validationType: 'number',
            validations: [
                { type: 'min', params: [0] },
                { type: 'max', params: [1000] },
            ],
        } as NumberInputFormField;
    } else if (questionType === QuestionType.OPINION_SCALE) {
        return {
            type,
            id,
            control: 'likert',
            validationType: 'number',
            anchorLabels: ['Disagree', 'Agree'],
        } as LikertInputFormField;
    }
};
