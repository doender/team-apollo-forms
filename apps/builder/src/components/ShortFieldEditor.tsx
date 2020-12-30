import { Box, HStack, Text } from '@chakra-ui/react';
import { FormField, PlaceholderBlock } from '@team-apollo-forms/core';
import React, { forwardRef, useEffect, useRef } from 'react';
import { DraggableProps, DragHandleProps } from 'react-beautiful-dnd';
import { mapFormFieldToQuestionType } from '../types';
import DebouncedTextArea from './DebouncedTextArea';
import { QuestionTypeLabel } from './QuestionTypeLabel';

export interface ShortFieldEditorProps {
    field: FormField | PlaceholderBlock;
    draggableProps: DraggableProps;
    dragHandleProps: DragHandleProps;
    setField: (field: FormField | PlaceholderBlock) => void;
    isSelected: boolean;
}

const ShortFieldEditor = forwardRef<HTMLElement, ShortFieldEditorProps>(
    ({ field, draggableProps, dragHandleProps, setField, isSelected }, ref) => {
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
                        <DebouncedTextArea
                            p={1}
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
    }
);

export default ShortFieldEditor;
