import { Box, Button, Flex, Input, Select } from '@chakra-ui/react';
import { CheckboxTextInputFormField, ComparisonOperator, FormField, Option, RadioTextInputFormField } from '@team-apollo-forms/core';
import produce from 'immer';
import DebouncedInput from 'libs/core/src/components/DebouncedInput';
import React, { FC } from 'react';

interface QueryValueEditorProps {
    value: any;
    onChange: (value: any) => void;
    operator: ComparisonOperator;
    field: FormField;
}

const getType = (operator: ComparisonOperator, field: FormField): { type: 'text' | 'number' | 'select'; isMultiple: boolean } => {
    let isMultiple = false;
    let type: 'text' | 'number' | 'select' = 'text';
    if (['$in', '$nin'].includes(operator) || field.validationType === 'array') {
        isMultiple = true;
    }
    if (field.validationType === 'number') {
        type = 'number';
    }
    if (field.control === 'checkboxText' || field.control === 'radioText') {
        type = 'select';
    }
    return { type, isMultiple };
};

const getInitialValue = (value: any, isMultiple: boolean, type: 'text' | 'number' | 'select', field: FormField): any => {
    switch (type) {
        case 'text':
            if (isMultiple) {
                return value == null || !Array.isArray(value) || typeof value[0] != 'string' ? [''] : value;
            } else {
                return value == null || typeof value != 'string' ? '' : value;
            }
        case 'number':
            if (isMultiple) {
                return value == null || !Array.isArray(value) || typeof value[0] != 'number' ? [0] : value;
            } else {
                return value == null || typeof value != 'number' ? 0 : value;
            }
        case 'select':
            const option = (field as CheckboxTextInputFormField).options[0].value;
            if (isMultiple) {
                return value == null || !Array.isArray(value) || typeof value[0] != 'string' ? [option] : value;
            } else {
                return value == null || typeof value != 'string' ? option : value;
            }
    }
};

const QueryValueEditor: FC<QueryValueEditorProps> = ({ value, onChange, operator, field }) => {
    if (!field || !operator) return null;

    const { type, isMultiple } = getType(operator, field);
    value = getInitialValue(value, isMultiple, type, field);

    const addQueryValue = () => {
        onChange([...value, getInitialValue(value, false, type, field)]);
    };

    const onChangeQueryValueItem = (idx: number, queryValue: string | number) => {
        onChange(
            produce(value, (newValue) => {
                newValue[idx] = queryValue;
            })
        );
    };

    if (isMultiple) {
        return (
            <Flex direction="column" w="100%">
                {value.map((val, i) => (
                    <Box key={i} mb={2}>
                        {type === 'select' ? (
                            <Select size="sm" bg="white" value={val} onChange={(e) => onChangeQueryValueItem(i, e.target.value)}>
                                {(field as RadioTextInputFormField).options.map((opt: Option) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </Select>
                        ) : (
                            <DebouncedInput
                                debounceTime={300}
                                component={Input}
                                value={val}
                                onChange={(e) => onChangeQueryValueItem(i, e.target.value)}
                                size="sm"
                                bg="white"
                                type={type}
                            />
                        )}
                    </Box>
                ))}
                <Button mr="auto" size="sm" onClick={addQueryValue}>
                    Add value
                </Button>
            </Flex>
        );
    }

    return type != 'select' ? (
        <DebouncedInput
            debounceTime={300}
            component={Input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            size="sm"
            bg="white"
            type={type}
        />
    ) : (
        <Select size="sm" bg="white" value={value} onChange={(e) => onChange(e.target.value)}>
            {(field as RadioTextInputFormField).options.map((opt: Option) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </Select>
    );
};

export default QueryValueEditor;
