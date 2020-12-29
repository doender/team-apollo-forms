import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Switch,
    Text,
} from '@chakra-ui/react';
import { FormField, PlaceholderBlock } from '@team-apollo-forms/core';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { mapFormFieldToQuestionType, questionMenuOptions } from '../../types';
import DebouncedTextArea from '../DebouncedTextArea';
import { QuestionTypeLabel } from '../QuestionTypeLabel';
import { FormModel, mapFieldToFormValues, mapFormValuesToField } from './formModel';

export interface FieldEditorProps {
    field: FormField | PlaceholderBlock;
    setField: (field: FormField | PlaceholderBlock) => void;
    deleteField: (fieldId: string) => void;
}

const FieldEditor: FC<FieldEditorProps> = ({ field, setField, deleteField }) => {
    const type = mapFormFieldToQuestionType(field);
    const questionType = questionMenuOptions.find((q) => q.value === type)?.name;

    const [formValues, setFormValues] = useState<FormModel>({
        isRequired: false,
        description: undefined,
        label: '',
    });

    useEffect(() => {
        if (field.type === 'placeholder') return;
        const newFormValues = mapFieldToFormValues(field);
        setFormValues(newFormValues);
    }, [field]);

    const updateFormValue = <T extends keyof FormModel>(prop: T, value: FormModel[T]) => {
        if (field.type === 'placeholder') return;
        const values = {
            ...formValues,
            [prop]: value,
        };
        const newField = mapFormValuesToField(field, values);
        setField(newField);
    };

    return (
        <Box mt={4} p={4}>
            <Heading size="md">Field Settings</Heading>

            <HStack my={4} pb={4} borderBottomWidth={1}>
                <QuestionTypeLabel type={type} />
                <Text>{questionType}</Text>
            </HStack>

            {field.type === 'formField' && (
                <>
                    <FormControl my={4} pb={4} borderBottomWidth={1}>
                        <FormLabel>Label</FormLabel>
                        <DebouncedTextArea
                            value={formValues.label}
                            placeholder="Type your question here"
                            onChange={(e) => updateFormValue('label', e.target.value)}
                        />
                    </FormControl>

                    <Box borderBottomWidth={1}>
                        <FormControl mt={4} pb={4} display="flex" alignItems="center" justifyContent="space-between">
                            <FormLabel mb="0" htmlFor="required">
                                Description
                            </FormLabel>
                            <Switch
                                size="md"
                                colorScheme="primary"
                                isChecked={formValues.description !== undefined}
                                onChange={() => updateFormValue('description', formValues.description === undefined ? '' : undefined)}
                            />
                        </FormControl>

                        {formValues.description !== undefined && (
                            <DebouncedTextArea
                                value={formValues.description}
                                placeholder="Type your description here"
                                onChange={(e) => updateFormValue('description', e.target.value)}
                            />
                        )}
                    </Box>

                    <FormControl my={4} pb={4} display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth={1}>
                        <FormLabel mb="0" htmlFor="required">
                            Required
                        </FormLabel>
                        <Switch
                            size="md"
                            colorScheme="primary"
                            isChecked={formValues.isRequired}
                            onChange={() => updateFormValue('isRequired', !formValues.isRequired)}
                        />
                    </FormControl>

                    {formValues.isMultiple != null && (
                        <FormControl my={4} pb={4} display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth={1}>
                            <FormLabel mb="0" htmlFor="required">
                                Multiple selection
                            </FormLabel>
                            <Switch
                                size="md"
                                colorScheme="primary"
                                isChecked={formValues.isMultiple}
                                onChange={() => updateFormValue('isMultiple', !formValues.isMultiple)}
                            />
                        </FormControl>
                    )}

                    {formValues.anchorLabelLeft != null && (
                        <FormControl my={4} pb={4} borderBottomWidth={1}>
                            <FormLabel mb={2} htmlFor="required">
                                Anchors
                            </FormLabel>
                            <DebouncedTextArea
                                value={formValues.anchorLabelLeft}
                                placeholder="Type your description here"
                                onChange={(e) => updateFormValue('anchorLabelLeft', e.target.value)}
                            />
                            <DebouncedTextArea
                                value={formValues.anchorLabelRight}
                                placeholder="Type your description here"
                                onChange={(e) => updateFormValue('anchorLabelRight', e.target.value)}
                            />
                        </FormControl>
                    )}

                    {formValues.isSlider != null && (
                        <FormControl my={4} pb={4} display="flex" alignItems="center" justifyContent="space-between" borderBottomWidth={1}>
                            <FormLabel mb="0" htmlFor="required">
                                Slider
                            </FormLabel>
                            <Switch
                                size="md"
                                colorScheme="primary"
                                isChecked={formValues.isSlider}
                                onChange={() => updateFormValue('isSlider', !formValues.isSlider)}
                            />
                        </FormControl>
                    )}

                    {formValues.min != null && (
                        <FormControl my={4} pb={4} borderBottomWidth={1}>
                            <FormLabel mb={2} htmlFor="required">
                                Min and max value
                            </FormLabel>
                            <HStack spacing={2}>
                                <NumberInput
                                    bg="white"
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
                                    <FormLabel mb="0" htmlFor="required">
                                        Minimum length
                                    </FormLabel>
                                    <Switch
                                        size="md"
                                        colorScheme="primary"
                                        isChecked={formValues.minLength !== undefined}
                                        onChange={() => updateFormValue('minLength', formValues.minLength === undefined ? 0 : undefined)}
                                    />
                                </FormControl>

                                {formValues.minLength !== undefined && (
                                    <NumberInput
                                        mb={4}
                                        bg="white"
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
                                    <FormLabel mb="0" htmlFor="required">
                                        Maximum length
                                    </FormLabel>
                                    <Switch
                                        size="md"
                                        colorScheme="primary"
                                        isChecked={formValues.maxLength !== undefined}
                                        onChange={() => updateFormValue('maxLength', formValues.maxLength === undefined ? 100 : undefined)}
                                    />
                                </FormControl>

                                {formValues.maxLength !== undefined && (
                                    <NumberInput
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
                </>
            )}

            <Button colorScheme="red" onClick={() => deleteField(field.id)}>
                Delete Field
            </Button>
        </Box>
    );
};

export default FieldEditor;