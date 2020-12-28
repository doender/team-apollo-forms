import { Box, Heading } from '@chakra-ui/react';
import { FormDefinition, FormField, PlaceholderBlock } from '@team-apollo-forms/core';
import React, { FC } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { BlockType, QuestionType } from '../types';
import QuestionAddButton from './QuestionAddButton';
import ShortFieldEditor from './ShortFieldEditor';

export interface FieldListProps {
    formDef: FormDefinition;
    addQuestion: (type: QuestionType | BlockType, sectionIdx?: number, fieldIdx?: number) => void;
    onDragEnd: (result: DropResult) => void;
    selectedField?: {
        field: FormField | PlaceholderBlock;
        sectionIdx: number;
        fieldIdx: number;
    };
    updateField: (sectionIdx: number, fieldIdx: number, field: FormField | PlaceholderBlock) => void;
}

const FieldList: FC<FieldListProps> = ({ formDef, addQuestion, onDragEnd, selectedField, updateField }) => {
    return (
        <>
            <Box m={2} my={4}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {formDef.sections.map((section, sectionIdx) => (
                        <Box m={2} mb={8} borderRadius={8} key={sectionIdx}>
                            <Droppable droppableId={`${sectionIdx}`}>
                                {(provided: any) => (
                                    <Box ref={provided.innerRef}>
                                        <Heading size="md" p={4} pb={2}>
                                            {section.title}
                                        </Heading>
                                        {section.fields.map((field, fieldIdx) => (
                                            <Box mb={2} key={field.id}>
                                                <Draggable index={fieldIdx} draggableId={field.id}>
                                                    {(provided: any) => (
                                                        <ShortFieldEditor
                                                            ref={provided.innerRef}
                                                            isSelected={field.id === selectedField?.field.id}
                                                            draggableProps={provided.draggableProps}
                                                            dragHandleProps={provided.dragHandleProps}
                                                            field={field}
                                                            setField={(field) => updateField(sectionIdx, fieldIdx, field)}
                                                        />
                                                    )}
                                                </Draggable>
                                            </Box>
                                        ))}
                                        <QuestionAddButton onSelect={(type) => addQuestion(type, sectionIdx, section.fields.length - 1)} />
                                    </Box>
                                )}
                            </Droppable>
                        </Box>
                    ))}
                </DragDropContext>
            </Box>
            {/* <QuestionSelectMenu m={4} onSelect={(type) => addQuestion(type)} /> */}
        </>
    );
};

export default FieldList;
