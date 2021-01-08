import { Box, Button, HStack, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { FormDefinition, FormField, PlaceholderBlock } from '@team-apollo-forms/core';
import React, { FC } from 'react';
import { DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import { FaEllipsisV, FaTrashAlt } from 'react-icons/fa';
import { BlockType, QuestionType } from '../types';
import DebouncedTextArea from './DebouncedTextArea';
import QuestionAddButton from './QuestionAddButton';
import QuestionSelectMenu from './QuestionSelectionMenu';
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
    setSectionTitle: (sectionIdx: number, title: string) => void;
    updateField: (field: FormField | PlaceholderBlock) => void;
    removeSection: (sectionIdx: number) => void;
}

const FieldList: FC<FieldListProps> = ({ formDef, addQuestion, onDragEnd, selectedField, updateField, setSectionTitle, removeSection }) => {
    return (
        <>
            <Box m={2} my={4}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {formDef.sections.map((section, sectionIdx) => (
                        <Box m={2} mb={8} borderRadius={8} key={sectionIdx}>
                            <Droppable droppableId={`${sectionIdx}`}>
                                {(provided: DroppableProvided) => (
                                    <Box ref={provided.innerRef}>
                                        <HStack>
                                            <DebouncedTextArea
                                                p={4}
                                                pb={2}
                                                fontWeight={700}
                                                fontSize="1.25rem"
                                                lineHeight={1.2}
                                                value={section.title || ''}
                                                placeholder="Section Title"
                                                onChange={(value) => setSectionTitle(sectionIdx, value.target.value)}
                                            />
                                        </HStack>
                                        {section.fields.map((field, fieldIdx) => (
                                            <Box mb={2} key={field.id}>
                                                <Draggable index={fieldIdx} draggableId={field.id}>
                                                    {(provided: DraggableProvided) => (
                                                        <ShortFieldEditor
                                                            ref={provided.innerRef}
                                                            isSelected={field.id === selectedField?.field.id}
                                                            draggableProps={provided.draggableProps}
                                                            dragHandleProps={provided.dragHandleProps}
                                                            field={field}
                                                            setField={(field) => updateField(field)}
                                                        />
                                                    )}
                                                </Draggable>
                                            </Box>
                                        ))}
                                        <HStack justifyContent="flex-end">
                                            {section.fields.length > 0 ? (
                                                <>
                                                    {sectionIdx > 0 && (
                                                        <Menu modifiers={{ name: 'eventListeners', options: { scroll: false } } as any}>
                                                            <MenuButton
                                                                w={6}
                                                                as={Button}
                                                                size="sm"
                                                                color="gray.600"
                                                                borderRadius="50%"
                                                                aria-label="more"
                                                            >
                                                                <FaEllipsisV />
                                                            </MenuButton>
                                                            <MenuList>
                                                                <MenuItem onClick={() => removeSection(sectionIdx)} icon={<FaTrashAlt />}>
                                                                    Remove Section
                                                                </MenuItem>
                                                            </MenuList>
                                                        </Menu>
                                                    )}
                                                    <QuestionAddButton
                                                        onSelect={(type) => addQuestion(type, sectionIdx, section.fields.length - 1)}
                                                    />
                                                </>
                                            ) : (
                                                <QuestionSelectMenu
                                                    m={4}
                                                    onSelect={(type) => addQuestion(type, sectionIdx, section.fields.length - 1)}
                                                />
                                            )}
                                        </HStack>
                                    </Box>
                                )}
                            </Droppable>
                        </Box>
                    ))}
                </DragDropContext>
            </Box>
        </>
    );
};

export default FieldList;
