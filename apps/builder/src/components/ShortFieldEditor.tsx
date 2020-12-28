import { Box, HStack, Text, Textarea } from '@chakra-ui/react';
import { FormField, PlaceholderBlock } from '@team-apollo-forms/core';
import React, { forwardRef, useEffect, useRef } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import { mapFormFieldToQuestionType } from '../types';
import DebouncedInput from './DebouncedInput';
import { QuestionTypeLabel } from './QuestionTypeLabel';

export interface ShortFieldEditorProps {
    field: FormField | PlaceholderBlock;
    draggableProps: any;
    dragHandleProps: any;
    setField: (field: FormField | PlaceholderBlock) => void;
    isSelected: boolean;
}

const ShortFieldEditor: any = forwardRef(({ field, draggableProps, dragHandleProps, setField, isSelected }: any, ref) => {
    const inputRef = useRef<HTMLInputElement>();
    useEffect(() => {
        const elem = inputRef.current;
        if (isSelected && elem) {
            elem.focus();
        }
    }, [isSelected]);
    return (
        <Box ref={ref} {...draggableProps}>
            <HStack
                alignItems="flex-start"
                shadow={isSelected ? 'outline' : ''}
                onClick={() => setField(field)}
                p={4}
                mr={8}
                ml={4}
                bg="white"
                borderRadius={4}
            >
                <QuestionTypeLabel {...dragHandleProps} type={mapFormFieldToQuestionType(field)} />
                {field.type === 'placeholder' && <Text>Placeholder</Text>}
                {field.type === 'formField' && (
                    <DebouncedInput
                        debounceTime={300}
                        component={Textarea}
                        minH="unset"
                        ref={inputRef}
                        overflow="hidden"
                        w="100%"
                        resize="none"
                        transition="height none"
                        minRows={1}
                        as={ResizeTextarea}
                        variant="unstyled"
                        value={field.label || ''}
                        onChange={(value: any) => {
                            setField({ ...field, label: value.target.value });
                        }}
                        placeholder="Type your question here"
                    />
                )}
            </HStack>
        </Box>
    );
});

export default ShortFieldEditor;
