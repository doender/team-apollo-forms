import { Form as FormikForm, Formik, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { en, FormLocale, FormLocaleKey } from '../../locales';
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
    onAfterSubmit: (form: FormikProps<any>) => React.ReactChild;
    onSubmit: (values: { [key: string]: any }) => Promise<void>;
    locale?: FormLocale;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    formDefinition,
    placeholders,
    UiControls,
    selectedField,
    onSelectField,
    onSubmit,
    onAfterSubmit,
    locale,
}) => {
    const [sectionIndex, setSectionIndex] = useState(0);

    useEffect(() => {
        scrollToTop();
    }, [sectionIndex]);

    useEffect(() => {
        if (formDefinition && selectedField) {
            const sectionIdxFromSelected = getSectionIdxFromField(formDefinition, selectedField);
            setSectionIndex(sectionIdxFromSelected == null ? 0 : sectionIdxFromSelected);
        }
    }, [formDefinition, selectedField]);

    const fields = formDefinition.sections.map((s) => s.fields.filter(isFormField)).flat();
    const initialValues = getInitialValues(fields);
    const validationSchema = getValidationSchema(fields);
    locale = locale || en;

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
            validateOnMount={true}
            enableReinitialize={true}
            isInitialValid={true}
            onSubmit={async (values, actions) => {
                await onSubmit(values);
                actions.setSubmitting(false);
                setSectionIndex((i) => i + 1);
            }}
        >
            {(props) => (
                <FormikForm>
                    {formDefinition.sections.length > 1 && onSectionScreen(sectionIndex, formDefinition) && (
                        <UiControls.Progress value={sectionIndex + 1} max={formDefinition.sections.length} />
                    )}
                    <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                        {onSectionScreen(sectionIndex, formDefinition) && (
                            <DynamicFormSection
                                UiControls={UiControls}
                                form={props}
                                placeholders={placeholders}
                                locale={locale}
                                onFocus={(field, fieldIndex) => onSelectField && onSelectField(field, sectionIndex, fieldIndex)}
                                section={formDefinition.sections[sectionIndex]}
                            />
                        )}
                        {onOutroScreen(sectionIndex, formDefinition) && <div style={{ padding: '24px' }}>{onAfterSubmit(props)}</div>}
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
                            {sectionIndex > 0 && onSectionScreen(sectionIndex, formDefinition) && (
                                <UiControls.PrevButton onClick={() => goToPrevSection()}>
                                    {locale[FormLocaleKey.PREVIOUS]}
                                </UiControls.PrevButton>
                            )}
                        </div>
                        <div>
                            {onSectionScreen(sectionIndex, formDefinition) &&
                                (onLastSectionScreen(sectionIndex, formDefinition) ? (
                                    <UiControls.SubmitButton isDisabled={!props.isValid} isLoading={props.isSubmitting}>
                                        {locale[FormLocaleKey.SUBMIT]}
                                    </UiControls.SubmitButton>
                                ) : (
                                    <UiControls.NextButton
                                        onClick={() => goToNextSection()}
                                        isDisabled={!canContinueToNextSection(formDefinition.sections[sectionIndex], props)}
                                    >
                                        {locale[FormLocaleKey.NEXT]}
                                    </UiControls.NextButton>
                                ))}
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
    return !Object.keys(form.errors).some((fieldId) => fieldIds.includes(fieldId));
};

const scrollToTop = () => {
    window.scrollTo({ top: 0 });
};

const onOutroScreen = (sectionIndex: number, formDef: FormDefinition) => {
    return sectionIndex === formDef.sections.length;
};

const onSectionScreen = (sectionIndex: number, formDef: FormDefinition) => {
    return sectionIndex < formDef.sections.length;
};

const onLastSectionScreen = (sectionIndex: number, formDef: FormDefinition) => {
    return sectionIndex === formDef.sections.length - 1;
};

export default DynamicForm;
