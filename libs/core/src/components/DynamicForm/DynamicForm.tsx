import { Form as FormikForm, Formik, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import DynamicFormSection from './DynamicFormSection';
import { FormDefinition, FormField, FormSection, FormUiControls, isFormField, PlaceholderBlock } from './types';
import { createYupSchema } from './yupSchemaCreator';

export interface DynamicFormProps {
    formDefinition: FormDefinition;
    placeholders?: {
        [key: string]: (form: FormikProps<any>) => React.ReactChild;
    };
    UiControls: FormUiControls;
    selectedField?: FormField | PlaceholderBlock;
    onSelectField?: (formField: FormField | PlaceholderBlock, sectionIdx: number, fieldIdx: number) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formDefinition, placeholders, UiControls, selectedField, onSelectField }) => {
    const [sectionIndex, setSectionIndex] = useState(0);

    useEffect(() => {
        scrollToTop();
    }, [sectionIndex]);

    useEffect(() => {
        if (formDefinition && selectedField) {
            const sectionIdxFromSelected = getSectionIdxFromField(formDefinition, selectedField);
            setSectionIndex(sectionIdxFromSelected == null ? -1 : sectionIdxFromSelected);
        }
    }, [formDefinition, selectedField]);

    const fields = formDefinition.sections.map((s) => s.fields.filter(isFormField)).flat();
    const initialValues = getInitialValues(fields);
    const validationSchema = getValidationSchema(fields);

    const goToNextSection = () => {
        setSectionIndex((i) => i + 1);
    };

    const goToPrevSection = () => {
        setSectionIndex((i) => i - 1);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
                console.log('values', values);
                console.log('actions', actions);
                setTimeout(() => {
                    actions.setSubmitting(false);
                    setSectionIndex((i) => i + 1);
                }, 1000);
            }}
        >
            {(props) => (
                <FormikForm>
                    {formDefinition.sections.length > 1 && (
                        <UiControls.Progress value={sectionIndex + 1} max={formDefinition.sections.length} />
                    )}
                    <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                        {onIntroScreen(sectionIndex) && (
                            <div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', lineHeight: 1.2 }}>
                                    {formDefinition.intro?.heading}
                                </h1>
                                <div
                                    style={{ marginTop: '2rem', fontSize: '1.125rem' }}
                                    dangerouslySetInnerHTML={{
                                        __html: formDefinition.intro?.text,
                                    }}
                                ></div>
                            </div>
                        )}
                        {onSectionScreen(sectionIndex, formDefinition) && (
                            <DynamicFormSection
                                UiControls={UiControls}
                                form={props}
                                placeholders={placeholders}
                                onFocus={(field, fieldIndex) => onSelectField && onSelectField(field, sectionIndex, fieldIndex)}
                                section={formDefinition.sections[sectionIndex]}
                            />
                        )}
                        {onOutroScreen(sectionIndex, formDefinition) && (
                            <div style={{ padding: '24px' }}>
                                <h1>{formDefinition.outro?.heading}</h1>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: formDefinition.outro?.text,
                                    }}
                                ></div>
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            padding: '0 2rem 2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            width: '100% ',
                        }}
                    >
                        <div>
                            {onSectionScreen(sectionIndex, formDefinition) && (
                                <UiControls.PrevButton onClick={() => goToPrevSection()}>Vorige</UiControls.PrevButton>
                            )}
                        </div>
                        <div>
                            {shouldShowProceedButton(sectionIndex, formDefinition) && (
                                <UiControls.NextButton
                                    onClick={() => goToNextSection()}
                                    isDisabled={!canContinueToNextSection(formDefinition.sections[sectionIndex], props)}
                                >
                                    {onIntroScreen(sectionIndex) ? 'Starten' : 'Volgende'}
                                </UiControls.NextButton>
                            )}
                            {onLastSectionScreen(sectionIndex, formDefinition) && (
                                <UiControls.SubmitButton isDisabled={!props.isValid} isLoading={props.isSubmitting}>
                                    Verzend
                                </UiControls.SubmitButton>
                            )}
                        </div>
                    </div>
                </FormikForm>
            )}
        </Formik>
    );
};

const getSectionIdxFromField = (form: FormDefinition, field?: FormField | PlaceholderBlock): number | undefined => {
    if (field == null) return undefined;
    return form.sections.findIndex((s) => s.fields.map((f) => f.id).includes(field.id));
};

const getInitialValues = (fields: FormField[]) => {
    const initialValues: { [key: string]: any } = {};
    fields.forEach((item) => {
        let defaultValue;
        switch (item.validationType) {
            case 'array':
                defaultValue = [];
                break;
            case 'boolean':
                defaultValue = false;
                break;
            default:
                defaultValue = '';
                break;
        }
        initialValues[item.id] = item.value || defaultValue;
    });
    return initialValues;
};

const getValidationSchema = (fields: FormField[]) => {
    const yupSchema = fields.reduce(createYupSchema, {});
    return yup.object().shape(yupSchema);
};

const canContinueToNextSection = (section: FormSection, form: FormikProps<any>) => {
    if (section == null) return true;
    const fieldIds = section.fields.filter(isFormField).map((field) => field.id);
    return form.dirty && !Object.keys(form.errors).some((fieldId) => fieldIds.includes(fieldId));
};

const scrollToTop = () => {
    window.scrollTo({ top: 0 });
};

const onIntroScreen = (sectionIndex: number) => {
    return sectionIndex === -1;
};

const onOutroScreen = (sectionIndex: number, formDef: FormDefinition) => {
    return sectionIndex === formDef.sections.length;
};

const onSectionScreen = (sectionIndex: number, formDef: FormDefinition) => {
    return sectionIndex > -1 && sectionIndex < formDef.sections.length;
};

const onLastSectionScreen = (sectionIndex: number, formDef: FormDefinition) => {
    return sectionIndex === formDef.sections.length - 1;
};

const shouldShowProceedButton = (sectionIndex: number, formDef: FormDefinition) => {
    return sectionIndex < formDef.sections.length - 1;
};

export default DynamicForm;
