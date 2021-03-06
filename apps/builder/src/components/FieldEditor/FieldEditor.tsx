import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Switch,
    Text,
} from '@chakra-ui/react';
import { FormDefinition, FormField, isFormField, PlaceholderBlock } from '@team-apollo-forms/core';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { mapFormFieldToQuestionType, questionMenuOptions } from '../../types';
import DebouncedTextArea from '../DebouncedTextArea';
import OptionsEditor from '../OptionsEditor';
import { QuestionTypeLabel } from '../QuestionTypeLabel';
import DepFieldEditor from './DepFieldEditor/DepFieldEditor';
import { FormModel, mapFieldToFormValues, mapFormValuesToField } from './formModel';

export interface FieldEditorProps {
    formDef: FormDefinition;
    field: FormField | PlaceholderBlock;
    setField: (field: FormField | PlaceholderBlock, fieldId?: string) => void;
    deleteField: (fieldId: string) => void;
}

const isUniqueFieldId = (formDef: FormDefinition, fieldId: string) => {
    const fieldIds = formDef.sections.map((s) => s.fields.map((field) => field.id)).flat();
    return !fieldIds.includes(fieldId);
};

const isValidFieldId = (fieldId: string) => {
    const re = /^[A-Za-z]+[\w\-\:]*$/;
    return re.test(fieldId);
};

const getPrevQuestions = (fieldId: string, formDef: FormDefinition): FormField[] => {
    if (!formDef || !fieldId) return [];
    const fields = formDef.sections.map((s) => s.fields.filter(isFormField)).flat();
    const idx = fields.findIndex((f) => f.id === fieldId);
    if (idx >= 0) {
        return fields.slice(0, idx);
    }
    return [];
};

const FieldEditor: FC<FieldEditorProps> = ({ field, setField, deleteField, formDef }) => {
    const type = mapFormFieldToQuestionType(field);
    const questionType = questionMenuOptions.find((q) => q.value === type)?.name;
    const prevQuestions = getPrevQuestions(field.id, formDef);

    const [formValues, setFormValues] = useState<FormModel>({
        id: '',
        isRequired: false,
        description: undefined,
        label: '',
    });

    const [fieldIdError, setFieldIdError] = useState<string | undefined>();

    useEffect(() => {
        if (field.type === 'placeholder') return;
        const newFormValues = mapFieldToFormValues(field);
        setFormValues(newFormValues);
        setFieldIdError(undefined);
    }, [field]);

    const updateFormValue = <T extends keyof FormModel>(prop: T, value: FormModel[T]) => {
        if (field.type === 'placeholder') return;
        const values = {
            ...formValues,
            [prop]: value,
        };
        const newField = mapFormValuesToField(field, values);
        setField(newField, field.id);
    };

    return (
        <Box mt={4} p={4}>
            <Text mb={4} color="gray.500" letterSpacing={1} fontWeight={700} textTransform="uppercase">
                field settings
            </Text>

            <HStack my={4} pb={4} borderBottomWidth={1}>
                <QuestionTypeLabel type={type} />
                <Text>{questionType}</Text>
            </HStack>

            {field.type === 'formField' && (
                <>
                    <FormControl my={4} pb={4} borderBottomWidth={1}>
                        <FormLabel fontSize="0.86rem">Label</FormLabel>
                        <DebouncedTextArea
                            bg="white"
                            value={formValues.label}
                            placeholder="Type your question here"
                            onChange={(e) => updateFormValue('label', e.target.value)}
                        />
                    </FormControl>

                    <Box borderBottomWidth={1}>
                        <FormControl mt={4} pb={4} display="flex" alignItems="center" justifyContent="space-between">
                            <FormLabel fontSize="0.86rem" mb="0" htmlFor="required">
                                Description
                            </FormLabel>
                            <Switch
                                size="sm"
                                colorScheme="primary"
                                isChecked={formValues.description !== undefined}
                                onChange={() => updateFormValue('description', formValues.description === undefined ? '' : undefined)}
                            />
                        </FormControl>

                        {formValues.description !== undefined && (
                            <DebouncedTextArea
                                bg="white"
                                value={formValues.description}
                                placeholder="Type your description here"
                                onChange={(e) => updateFormValue('description', e.target.value)}
                            />
                        )}
                    </Box>

                    {['textInput', 'textArea'].includes(field.control) && (
                        <>
                            <Box borderBottomWidth={1}>
                                <FormControl mt={4} pb={4} display="flex" alignItems="center" justifyContent="space-between">
                                    <FormLabel fontSize="0.86rem" mb="0" htmlFor="required">
                                        Placeholder
                                    </FormLabel>
                                    <Switch
                                        size="sm"
                                        colorScheme="primary"
                                        isChecked={formValues.placeholder !== undefined}
                                        onChange={() =>
                                            updateFormValue('placeholder', formValues.placeholder === undefined ? '' : undefined)
                                        }
                                    />
                                </FormControl>

                                {formValues.placeholder !== undefined && (
                                    <DebouncedTextArea
                                        bg="white"
                                        value={formValues.placeholder}
                                        placeholder="Type your placeholder here"
                                        onChange={(e) => updateFormValue('placeholder', e.target.value)}
                                    />
                                )}
                            </Box>
                        </>
                    )}

                    <FormControl my={4} pb={4} display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth={1}>
                        <FormLabel fontSize="0.86rem" mb="0" htmlFor="required">
                            Required
                        </FormLabel>
                        <Switch
                            size="sm"
                            colorScheme="primary"
                            isChecked={formValues.isRequired}
                            onChange={() => updateFormValue('isRequired', !formValues.isRequired)}
                        />
                    </FormControl>

                    {formValues.options != null && (
                        <FormControl my={4} pb={4} borderBottomWidth={1}>
                            <FormLabel fontSize="0.86rem" mb={2} htmlFor="required">
                                Response options
                            </FormLabel>
                            <OptionsEditor value={formValues.options} onChange={(val) => updateFormValue('options', val)} />
                        </FormControl>
                    )}

                    {formValues.isMultiple != null && (
                        <FormControl my={4} pb={4} display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth={1}>
                            <FormLabel fontSize="0.86rem" mb="0" htmlFor="required">
                                Multiple selection
                            </FormLabel>
                            <Switch
                                size="sm"
                                colorScheme="primary"
                                isChecked={formValues.isMultiple}
                                onChange={() => updateFormValue('isMultiple', !formValues.isMultiple)}
                            />
                        </FormControl>
                    )}

                    {formValues.anchorLabelLeft != null && (
                        <FormControl my={4} pb={4} borderBottomWidth={1}>
                            <FormLabel fontSize="0.86rem" mb={2} htmlFor="required">
                                Anchors
                            </FormLabel>
                            <DebouncedTextArea
                                bg="white"
                                value={formValues.anchorLabelLeft}
                                placeholder="Type your description here"
                                onChange={(e) => updateFormValue('anchorLabelLeft', e.target.value)}
                            />
                            <DebouncedTextArea
                                bg="white"
                                value={formValues.anchorLabelRight}
                                placeholder="Type your description here"
                                onChange={(e) => updateFormValue('anchorLabelRight', e.target.value)}
                            />
                        </FormControl>
                    )}

                    {formValues.isSlider != null && (
                        <FormControl my={4} pb={4} display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth={1}>
                            <FormLabel fontSize="0.86rem" mb="0" htmlFor="required">
                                Slider
                            </FormLabel>
                            <Switch
                                size="sm"
                                colorScheme="primary"
                                isChecked={formValues.isSlider}
                                onChange={() => updateFormValue('isSlider', !formValues.isSlider)}
                            />
                        </FormControl>
                    )}

                    {formValues.min != null && (
                        <FormControl my={4} pb={4} borderBottomWidth={1}>
                            <FormLabel fontSize="0.86rem" mb={2} htmlFor="required">
                                Min and max value
                            </FormLabel>
                            <HStack spacing={2}>
                                <NumberInput
                                    bg="white"
                                    size="sm"
                                    value={formValues.min.toFixed(0)}
                                    onChange={(e) => updateFormValue('min', parseInt(e))}
                                    max={formValues.max}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <NumberInput
                                    bg="white"
                                    size="sm"
                                    value={formValues.max.toFixed(0)}
                                    onChange={(e) => updateFormValue('max', parseInt(e))}
                                    min={formValues.min}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </HStack>
                        </FormControl>
                    )}

                    {['textInput', 'textArea'].includes(field.control) && (
                        <>
                            <Box borderBottomWidth={1} mb={2}>
                                <FormControl mt={4} pb={4} display="flex" alignItems="center" justifyContent="space-between">
                                    <FormLabel fontSize="0.86rem" mb="0" htmlFor="required">
                                        Minimum length
                                    </FormLabel>
                                    <Switch
                                        size="sm"
                                        colorScheme="primary"
                                        isChecked={formValues.minLength !== undefined}
                                        onChange={() => updateFormValue('minLength', formValues.minLength === undefined ? 0 : undefined)}
                                    />
                                </FormControl>

                                {formValues.minLength !== undefined && (
                                    <NumberInput
                                        mb={4}
                                        bg="white"
                                        size="sm"
                                        value={formValues.minLength.toFixed(0)}
                                        onChange={(e) => updateFormValue('minLength', parseInt(e))}
                                        min={formValues.minLength}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
                            </Box>
                            <Box borderBottomWidth={1} mb={2}>
                                <FormControl mt={4} pb={4} display="flex" alignItems="center" justifyContent="space-between">
                                    <FormLabel fontSize="0.86rem" mb="0" htmlFor="required">
                                        Maximum length
                                    </FormLabel>
                                    <Switch
                                        size="sm"
                                        colorScheme="primary"
                                        isChecked={formValues.maxLength !== undefined}
                                        onChange={() => updateFormValue('maxLength', formValues.maxLength === undefined ? 100 : undefined)}
                                    />
                                </FormControl>

                                {formValues.maxLength !== undefined && (
                                    <NumberInput
                                        size="sm"
                                        mb={4}
                                        bg="white"
                                        value={formValues.maxLength.toFixed(0)}
                                        onChange={(e) => updateFormValue('maxLength', parseInt(e))}
                                        min={formValues.maxLength}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
                            </Box>
                        </>
                    )}

                    {/* <FormControl my={4} pb={4} borderBottomWidth={1} isInvalid={!!fieldIdError}>
                        <FormLabel fontSize="0.86rem">ID</FormLabel>
                        <DebouncedTextArea
                            bg="white"
                            value={formValues.id}
                            onChange={(e) => {
                                const fieldId = e.target.value;
                                if (!isValidFieldId(fieldId)) {
                                    setFieldIdError('Invalid ID');
                                    return;
                                }
                                if (!isUniqueFieldId(formDef, fieldId)) {
                                    setFieldIdError('ID is not unique within this form, please choose another');
                                    return;
                                }

                                setFieldIdError(undefined);
                                updateFormValue('id', fieldId);
                            }}
                        />
                        {!fieldIdError && <FormHelperText>This ID uniquely identifies this field</FormHelperText>}
                        <FormErrorMessage>{fieldIdError}</FormErrorMessage>
                    </FormControl> */}

                    {prevQuestions.length > 0 && (
                        <FormControl my={4} pb={4} borderBottomWidth={1}>
                            <FormLabel fontSize="0.86rem">Display conditions</FormLabel>
                            <DepFieldEditor
                                value={formValues.showWhen}
                                onChange={(val) => updateFormValue('showWhen', val)}
                                prevQuestions={prevQuestions}
                            />
                        </FormControl>
                    )}
                </>
            )}

            <Button colorScheme="red" onClick={() => deleteField(field.id)}>
                Delete Field
            </Button>
        </Box>
    );
};

export default FieldEditor;
