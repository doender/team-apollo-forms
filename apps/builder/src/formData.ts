import { FormDefinition } from '@team-apollo-forms/core';

export const formData: FormDefinition = {
    sections: [
        {
            title: 'Jouw gegevens',
            fields: [
                {
                    id: 'bla',
                    type: 'formField',
                    control: 'slider',
                    validationType: 'number',
                    validations: [
                        {
                            type: 'min',
                            params: [0],
                        },
                        {
                            type: 'max',
                            params: [100],
                        },
                    ],
                },
                {
                    id: 'naam',
                    type: 'formField',
                    label: 'Wat is je naam?',
                    placeholder: 'Je volledige naam',
                    control: 'textInput',
                    validationType: 'string',
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                        {
                            type: 'max',
                            params: [50],
                        },
                    ],
                },
                {
                    id: 'email',
                    type: 'formField',
                    label: 'Wat is je werk e-mailadres?',
                    placeholder: 'Je werk e-mailadres',
                    control: 'textInput',
                    validationType: 'string',
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                        {
                            type: 'email',
                            params: [],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Hoe ziet jouw werkplek eruit?',
            fields: [
                {
                    id: 'sectionImage1',
                    type: 'placeholder',
                },
                {
                    id: 'correctChair',
                    type: 'formField',
                    label: 'Heeft jouw werkplek een geschikte (bureau)stoel?',
                    description:
                        'Bij een geschikte bureaustoel kun je de zithoogte, armleuningen en rugleuning instellen. Belangrijk is dat je voeten plat op de grond kunnen staan als je op de stoel zit.',
                    control: 'radioText',
                    validationType: 'string',
                    options: [
                        { value: 'yes', label: 'Ja' },
                        { value: 'no', label: 'Nee' },
                    ],
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },
                {
                    id: 'correctDesk',
                    type: 'formField',
                    label: 'Heeft jouw werkplek een geschikt bureau?',
                    description:
                        'Je bureau is geschikt als je voldoende ruimte hebt om comfortabel te zitten terwijl je je computerscherm, toetsenbord en muis of trackpad gebruikt. De hoogte van het bureau is erg belangrijk, deze moet net zo hoog of net iets onder je ellebogen uitkomen.',
                    control: 'radioText',
                    validationType: 'string',
                    options: [
                        { value: 'yes', label: 'Ja' },
                        { value: 'no', label: 'Nee' },
                    ],
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },
                {
                    id: 'displayHeightCorrect',
                    type: 'formField',
                    label: 'Heeft jouw werkplek een geschikt beeldscherm?',
                    description:
                        'Je moet je beeldscherm goed kunnen lezen zonder naar voren te hoeven buigen. De bovenkant van je scherm staat op ooghoogte of net daaronder.',
                    control: 'radioText',
                    validationType: 'string',
                    options: [
                        { value: 'yes', label: 'Ja' },
                        { value: 'no', label: 'Nee' },
                    ],
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },
                {
                    id: 'workplaceDevices',
                    type: 'formField',
                    label: 'Heeft jouw werkplek een geschikt toetsenbord en muis of trackpad?',
                    description:
                        'Bij een muis, trackpad en toetsenbord is het belangrijk dat de kabels lang genoeg zijn, want dan kun je ze in de houding gebruiken die voor jou fijn is. Als je meer dan 2 uur per dag ‘computerwerk’ doet mogen het beeldscherm en toetsenbord niet aan elkaar vast zitten. Bij het gebruik van een laptop moet je dus gebruik maken van een los beeldscherm en/of toetsenbord en muis.',
                    control: 'radioText',
                    validationType: 'string',
                    options: [
                        {
                            value: 'sepMouseAndKeyboard',
                            label: 'Ik gebruik zowel een los toetsenbord als een losse muis of trackpad',
                        },
                        {
                            value: 'onlySepMouse',
                            label: 'Ik gebruik alleen een los toetsenbord',
                        },
                        {
                            value: 'onlySepKeyboard',
                            label: 'Ik gebruik alleen een losse muis of trackpad',
                        },
                        {
                            value: 'laptop',
                            label: 'Ik gebruik het toetsenbord en de trackpad van mijn laptop',
                        },
                    ],
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },

                {
                    id: 'enoughLight',
                    type: 'formField',
                    label: 'Heb je voldoende verlichting op je werkplek?',
                    description:
                        'Bij beeldschermwerk is het belangrijk dat het licht een passend contrast geeft tussen het beeldscherm en de omgeving.',
                    control: 'radioText',
                    validationType: 'string',
                    options: [
                        { value: 'yes', label: 'Ja' },
                        { value: 'no', label: 'Nee' },
                    ],
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Wat vind je van je werkplek?',
            fields: [
                {
                    id: 'workplaceConcentration',
                    type: 'formField',
                    label: 'Ik kan me op mijn werkplek goed concentreren',
                    control: 'likert5',
                    anchorLabels: ['Helemaal oneens', 'Helemaal eens'],
                    validationType: 'number',
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },
                {
                    id: 'workplaceSatisfation',
                    type: 'formField',
                    label: 'Ik ben tevreden met mijn werkplek',
                    control: 'likert5',
                    anchorLabels: ['Helemaal oneens', 'Helemaal eens'],
                    validationType: 'number',
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },
                {
                    id: 'workplaceChanges',
                    type: 'formField',
                    label: 'Wat zou je aan je werkplek willen veranderen wanneer je in de toekomst nog regelmatig thuis zal werken?',
                    control: 'textArea',
                    validationType: 'string',
                    validations: [
                        {
                            type: 'max',
                            params: [1000],
                        },
                        {
                            type: 'required',
                            params: ['Dit is een verplicht veld'],
                        },
                    ],
                },
            ],
        },
        {
            title: 'Ervaar je momenteel klachten?',
            fields: [
                {
                    id: 'howOftenComplaints',
                    type: 'formField',
                    label: 'Heb je weleens houdingsgerelateerde klachten?',
                    description: ' Bijvoorbeeld aan polsen, rug, schouders, etc.',
                    control: 'radioText',
                    validationType: 'string',
                    options: [
                        { value: 'often', label: 'Vaak' },
                        { value: 'regularly', label: 'Regelmatig' },
                        { value: 'sometimes', label: 'Soms' },
                        { value: 'never', label: 'Nooit' },
                    ],
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },
                {
                    id: 'actionsToReduceComplaints',
                    type: 'formField',
                    label: 'Doe je al iets aan je klachten?',
                    control: 'checkboxText',
                    validationType: 'array',
                    options: [
                        { value: 'exercises', label: 'Zelf oefeningen' },
                        { value: 'reminders', label: 'Reminders om voldoende te bewegen' },
                        { value: 'physicalTherapy', label: 'Fysiotherapie' },
                        { value: 'other', label: 'Anders, namelijk:' },
                    ],
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                    showWhen: {
                        howOftenComplaints: {
                            $eq: ['often', 'regularly', 'sometimes'],
                            $ne: 'never',
                        },
                    },
                },
                {
                    id: 'actionsToReduceComplaintsOther',
                    type: 'formField',
                    control: 'textArea',
                    validationType: 'string',
                    showWhen: {
                        actionsToReduceComplaints: 'other',
                    },
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },
                {
                    id: 'preventWorseComplaints',
                    type: 'formField',
                    label: 'Zijn er dingen die je wilt doen om (ergere) klachten te voorkomen?',
                    control: 'radioText',
                    validationType: 'string',
                    options: [
                        { value: 'yes', label: 'Ja' },
                        { value: 'no', label: 'Nee' },
                    ],
                    validations: [
                        {
                            type: 'required',
                            params: [],
                        },
                    ],
                },
                {
                    id: 'preventWorseComplaintsComments',
                    type: 'formField',
                    label: 'Toelichting:',
                    control: 'textArea',
                    validationType: 'string',
                    showWhen: {
                        preventWorseComplaints: 'yes',
                    },
                },
            ],
        },
        {
            title: 'Afsluiting',
            fields: [
                {
                    id: 'wfhComments',
                    type: 'formField',
                    label: 'Zijn er dingen die je graag kwijt wilt over thuiswerken?',
                    description: 'Vragen, opmerkingen, etc.',
                    control: 'textArea',
                    validationType: 'string',
                },
            ],
        },
    ],
};
