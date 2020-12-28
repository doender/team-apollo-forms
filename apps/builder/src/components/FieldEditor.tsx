import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Switch,
  Text,
} from '@chakra-ui/react';
import {
  FormField,
  FormFieldValidation,
  PlaceholderBlock,
} from '@team-apollo-forms/core';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { mapFormFieldToQuestionType, questionMenuOptions } from '../types';
import DebouncedTextArea from './DebouncedTextArea';
import { QuestionTypeLabel } from './QuestionTypeLabel';

export interface FieldEditorProps {
  field: FormField | PlaceholderBlock;
  setField: (field: FormField | PlaceholderBlock) => void;
  deleteField: (fieldId: string) => void;
}

interface FormModel {
  isRequired: boolean;
  description: string | undefined;
  label: string;
  isMultiple?: boolean;
}

const mapFieldToFormValues = (field: FormField): FormModel => {
  const validations: FormFieldValidation<any>[] =
    (field.type === 'formField' ? field.validations : undefined) || [];
  const isRequired = validations.find((val) => val.type === 'required') != null;
  const model: FormModel = {
    isRequired,
    description: field.description,
    label: field.label || '',
  };

  if (field.control === 'checkboxText' || field.control === 'radioText') {
    model.isMultiple = field.control === 'checkboxText';
  }
  return model;
};

const mapFormValuesToField = (
  field: FormField,
  values: FormModel
): FormField => {
  const newField = { ...field };

  newField.description = values.description;
  newField.label = values.label;

  // Remove or add required validation
  let validations: FormFieldValidation<any>[] =
    (field.type === 'formField' ? field.validations : undefined) || [];
  const requiredValIdx = validations
    .map((val) => val.type)
    .findIndex((type) => type === 'required');
  if (values.isRequired && requiredValIdx == -1) {
    validations = [...validations, { type: 'required', params: [] }];
  } else if (!values.isRequired && requiredValIdx != -1) {
    console.log(validations, requiredValIdx);
    validations = [
      ...validations.slice(0, requiredValIdx),
      ...validations.slice(requiredValIdx + 1),
    ];
  }
  newField.validations = validations;

  if (values.isMultiple != null) {
    const control = values.isMultiple ? 'checkboxText' : 'radioText';
    const validationType = values.isMultiple ? 'array' : 'string';
    newField.control = control;
    newField.validationType = validationType;
  }

  return newField;
};

const FieldEditor: FC<FieldEditorProps> = ({
  field,
  setField,
  deleteField,
}) => {
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

  const updateFormValue = <T extends keyof FormModel>(
    prop: T,
    value: FormModel[T]
  ) => {
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
              onChange={(e) => updateFormValue('label', e.target.value)}
            />
          </FormControl>

          <Box borderBottomWidth={1}>
            <FormControl
              mt={4}
              pb={4}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel mb="0" htmlFor="required">
                Description
              </FormLabel>
              <Switch
                size="md"
                colorScheme="primary"
                isChecked={formValues.description !== undefined}
                onChange={() =>
                  updateFormValue(
                    'description',
                    formValues.description === undefined ? '' : undefined
                  )
                }
              />
            </FormControl>

            {formValues.description !== undefined && (
              <DebouncedTextArea
                value={formValues.description}
                onChange={(e) => updateFormValue('description', e.target.value)}
              />
            )}
          </Box>

          <FormControl
            my={4}
            pb={4}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={1}
          >
            <FormLabel mb="0" htmlFor="required">
              Required
            </FormLabel>
            <Switch
              size="md"
              colorScheme="primary"
              isChecked={formValues.isRequired}
              onChange={() =>
                updateFormValue('isRequired', !formValues.isRequired)
              }
            />
          </FormControl>

          {formValues.isMultiple != null && (
            <FormControl
              my={4}
              pb={4}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderBottomWidth={1}
            >
              <FormLabel mb="0" htmlFor="required">
                Multiple selection
              </FormLabel>
              <Switch
                size="md"
                colorScheme="primary"
                isChecked={formValues.isMultiple}
                onChange={() =>
                  updateFormValue('isMultiple', !formValues.isMultiple)
                }
              />
            </FormControl>
          )}
        </>
      )}

      <Button colorScheme="red" onClick={() => deleteField(field.id)}>
        Delete
      </Button>
    </Box>
  );
};

export default FieldEditor;
