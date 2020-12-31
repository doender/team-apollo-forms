import { setLocale } from 'yup';

export enum FormLocaleKey {
    FIELD_REQUIRED = 'field_required',
    STR_FIELD_VALID_EMAIL = 'str_field_valid_email',
    STR_FIELD_TOO_SHORT = 'str_field_too_short',
    STR_FIELD_TOO_LARGE = 'str_field_too_large',
    NUM_FIELD_TOO_SMALL = 'num_field_too_small',
    NUM_FIELD_TOO_LARGE = 'num_field_too_large',
    NEXT = 'next',
    PREVIOUS = 'previous',
    SUBMIT = 'submit',
    PLACEHOLDER = 'placeholder',
}

export interface FormLocale {
    [FormLocaleKey.FIELD_REQUIRED]: string;
    [FormLocaleKey.STR_FIELD_VALID_EMAIL]: string;
    [FormLocaleKey.STR_FIELD_TOO_SHORT]: (min: string) => string;
    [FormLocaleKey.STR_FIELD_TOO_LARGE]: (max: string) => string;
    [FormLocaleKey.NUM_FIELD_TOO_SMALL]: (min: string) => string;
    [FormLocaleKey.NUM_FIELD_TOO_LARGE]: (max: string) => string;
    [FormLocaleKey.NEXT]: string;
    [FormLocaleKey.PREVIOUS]: string;
    [FormLocaleKey.SUBMIT]: string;
    [FormLocaleKey.PLACEHOLDER]: string;
}

setLocale({
    mixed: {
        required: FormLocaleKey.FIELD_REQUIRED,
    },
    string: {
        min: ({ min }) => ({ key: FormLocaleKey.STR_FIELD_TOO_SHORT, params: [min] }),
        max: ({ max }) => ({ key: FormLocaleKey.STR_FIELD_TOO_LARGE, params: [max] }),
        email: FormLocaleKey.STR_FIELD_VALID_EMAIL,
    },
    number: {
        min: ({ min }) => ({ key: FormLocaleKey.NUM_FIELD_TOO_SMALL, params: [min] }),
        max: ({ max }) => ({ key: FormLocaleKey.NUM_FIELD_TOO_LARGE, params: [max] }),
    },
});

const renderErrorMsg = (obj: any, locale: FormLocale): string => {
    if (!obj) return;
    if (typeof obj === 'string') {
        return locale[obj];
    } else {
        const key = obj['key'];
        const params = obj['params'];
        return locale[key](...params);
    }
};

const en: FormLocale = {
    field_required: 'This field is required',
    str_field_valid_email: 'This field must be a valid email',
    str_field_too_short: (min) => `This field must be at least ${min} characters`,
    str_field_too_large: (max) => `This field must be at most ${max} characters`,
    num_field_too_small: (min) => `This field must be greater than or equal to ${min}`,
    num_field_too_large: (max) => `This field must be less than or equal to ${max}`,
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    placeholder: 'Type your answer here',
};

const nl: FormLocale = {
    field_required: 'Dit veld is verplicht',
    str_field_valid_email: 'Dit veld moet een geldig e-mailadres bevatten',
    str_field_too_short: (min) => `Dit veld moet ten minste ${min} karakters zijn`,
    str_field_too_large: (max) => `Dit veld moet ten hoogste ${max} karakters zijn`,
    num_field_too_small: (min) => `Dit veld moet groter of gelijk zijn aan ${min}`,
    num_field_too_large: (max) => `Dit veld moet kleiner of gelijk zijn aan ${max}`,
    next: 'Volgende',
    previous: 'Vorige',
    submit: 'Verzenden',
    placeholder: 'Typ je antwoord hier',
};

export { en, nl, renderErrorMsg };
