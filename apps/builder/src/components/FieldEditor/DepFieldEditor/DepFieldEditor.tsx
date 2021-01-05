import { CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, IconButton, Select, Text, VStack } from '@chakra-ui/react';
import { ComparisonOperator, ComparisonOperatorCondition, FormField } from '@team-apollo-forms/core';
import { produce } from 'immer';
import React, { FC, useEffect, useState } from 'react';
import QueryValueEditor from './QueryValueEditor';

interface DepFieldEditorProps {
    value?: { [key: string]: ComparisonOperatorCondition };
    onChange: (value: { [key: string]: ComparisonOperatorCondition }) => void;
    prevQuestions: FormField[];
}

const isValid = (value: { [key: string]: ComparisonOperatorCondition }): boolean => {
    for (const fieldId of Object.keys(value)) {
        if (fieldId === '') return false;
        for (const op of Object.keys(value[fieldId])) {
            if (value[fieldId][op] == null) {
                return false;
            }
        }
    }
    return true;
};

const undefinedIfEmpty = (value: { [key: string]: ComparisonOperatorCondition }) => {
    return Object.keys(value).length === 0 ? undefined : value;
};

/**
 * Removes keys with empty values from the object
 *
 * @param value
 */
const removeEmptyKeys = (value: { [key: string]: ComparisonOperatorCondition }) => {
    for (const key in value) {
        if (Object.keys(value[key]).length === 0) {
            delete value[key];
        }
    }
};

const DepFieldEditor: FC<DepFieldEditorProps> = ({ value: propValue, onChange, prevQuestions }) => {
    const [value, setValue] = useState<{ [key: string]: ComparisonOperatorCondition } | undefined>();

    useEffect(() => {
        setValue(propValue);
    }, [propValue]);

    useEffect(() => {
        if (value != propValue) {
            if (isValid(value)) {
                const newValue = undefinedIfEmpty(value);
                onChange(newValue);
            }
        }
    }, [value]);

    const addCondition = () => {
        const condition: ComparisonOperatorCondition = { $eq: null };
        const newValue = produce(value, (newValue) => {
            newValue = newValue || {};
            newValue[''] = condition;
            return newValue;
        });
        setValue(newValue);
    };

    const removeCondition = (fieldId: string, op: ComparisonOperator) => {
        setValue(
            produce(value, (newValue) => {
                delete newValue[fieldId][op];
                removeEmptyKeys(newValue);
            })
        );
    };

    const onChangeField = (oldFieldId: string, newFieldId: string, operator: ComparisonOperator, queryValue: any) => {
        setValue(
            produce(value, (newValue) => {
                if (!(newFieldId in newValue)) {
                    newValue[newFieldId] = {};
                }
                newValue[newFieldId][operator] = queryValue;
                if (oldFieldId === '') {
                    delete newValue[oldFieldId];
                } else {
                    delete newValue[oldFieldId][operator];
                }
                removeEmptyKeys(newValue);
            })
        );
    };

    const onChangeOperator = (oldOp: ComparisonOperator, newOp: ComparisonOperator, fieldId: string, queryValue: any) => {
        setValue(
            produce(value, (newValue) => {
                newValue[fieldId][newOp] = queryValue;
                if (oldOp) {
                    delete newValue[fieldId][oldOp];
                    removeEmptyKeys(newValue);
                }
            })
        );
    };

    const onChangeQueryValue = (fieldId: string, op: ComparisonOperator, queryValue: any) => {
        setValue(
            produce(value, (newValue) => {
                newValue[fieldId][op] = queryValue;
            })
        );
    };

    const getField = (fieldId): FormField => {
        return prevQuestions.find((f) => f.id === fieldId);
    };

    const isLastCondition = (fieldIdx: number, fieldId: string, operatorIdx: number): boolean => {
        if (fieldIdx < Object.keys(value).length - 1) return false;
        if (operatorIdx < Object.keys(value[fieldId]).length - 1) return false;
        return true;
    };

    return (
        <Flex direction="column">
            {value != null &&
                Object.keys(value).map((fieldId: string, fieldIdx: number) => (
                    <React.Fragment key={fieldId}>
                        {Object.keys(value[fieldId]).map((operator: ComparisonOperator, operatorIdx: number) => (
                            <React.Fragment key={operator}>
                                <HStack alignItems="flex-start">
                                    <VStack flex="1">
                                        <HStack width="100%">
                                            <Select
                                                flex="1"
                                                size="sm"
                                                bg="white"
                                                placeholder="Select field"
                                                value={fieldId}
                                                onChange={(e) => onChangeField(fieldId, e.target.value, operator, value[fieldId][operator])}
                                            >
                                                {prevQuestions.map((field) => (
                                                    <option key={field.id} value={field.id}>
                                                        {field.label}
                                                    </option>
                                                ))}
                                            </Select>
                                            <Select
                                                size="sm"
                                                bg="white"
                                                value={operator}
                                                minW="81px"
                                                w="81px"
                                                onChange={(e) =>
                                                    onChangeOperator(
                                                        operator,
                                                        e.target.value as ComparisonOperator,
                                                        fieldId,
                                                        value[fieldId][operator]
                                                    )
                                                }
                                            >
                                                <option value="$eq">=</option>
                                                <option value="$ne">≠</option>
                                                <option value="$gt">&gt;</option>
                                                <option value="$gte">&#8805;</option>
                                                <option value="$lt">&lt;</option>
                                                <option value="$lte">&#8804;</option>
                                                <option value="$in">in</option>
                                                <option value="$nin">not in</option>
                                            </Select>
                                        </HStack>

                                        <QueryValueEditor
                                            field={getField(fieldId)}
                                            value={value[fieldId][operator]}
                                            operator={operator}
                                            onChange={(e) => onChangeQueryValue(fieldId, operator, e)}
                                        />
                                    </VStack>
                                    <IconButton
                                        size="xs"
                                        aria-label="remove option"
                                        icon={<CloseIcon />}
                                        onClick={() => removeCondition(fieldId, operator)}
                                    />
                                </HStack>
                                {!isLastCondition(fieldIdx, fieldId, operatorIdx) && (
                                    <Box position="relative" textAlign="center" my={4}>
                                        <Text color="gray.500" textTransform="uppercase" letterSpacing={1}>
                                            and
                                        </Text>
                                    </Box>
                                )}
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}

            <Button mt={4} ml="auto" aria-label="add condition" size="sm" onClick={addCondition}>
                Add condition
            </Button>
        </Flex>
    );
};

export default DepFieldEditor;
