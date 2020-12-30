import { Box, Button, Heading, HStack, VStack } from '@chakra-ui/react';
import { FormDefinition, FormField, PlaceholderBlock } from '@team-apollo-forms/core';
import { produce } from 'immer';
import React, { FC, useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import useFormCache from '../hooks/useFormCache';
import useFormImportExport from '../hooks/useFormImport';
import { BlockType, createQuestion, QuestionType } from '../types';
import FieldEditor from './FieldEditor';
import FieldList from './FieldList';
import FileUploader from './FileUploader';
import FormPreview from './FormPreview';

const findFieldInForm = (formDef: FormDefinition, field: FormField | PlaceholderBlock): { sectionIdx: number; fieldIdx: number } => {
    for (let sectionIdx = 0; sectionIdx < formDef.sections.length; sectionIdx++) {
        for (let fieldIdx = 0; fieldIdx < formDef.sections[sectionIdx].fields.length; fieldIdx++) {
            const f = formDef.sections[sectionIdx].fields[fieldIdx];
            if (f.id === field.id) {
                return { sectionIdx, fieldIdx };
            }
        }
    }
};

export const Builder: FC = () => {
    const { formDef, setFormDef } = useFormCache();
    const { importForm, exportForm } = useFormImportExport(formDef, setFormDef);
    const [selectedField, setSelectedField] = useState<{
        field: FormField | PlaceholderBlock;
        sectionIdx: number;
        fieldIdx: number;
    }>();

    // Set selected field
    useEffect(() => {
        if (!formDef || selectedField) return;
        if (formDef.sections.length > 0 && formDef.sections[0].fields.length > 0) {
            setSelectedField({
                field: formDef.sections[0].fields[0],
                fieldIdx: 0,
                sectionIdx: 0,
            });
        }
    }, [formDef]);

    const addQuestion = (type: QuestionType | BlockType, sectionIdx?: number, fieldIdx?: number) => {
        if (type === BlockType.SECTION) {
            createSection({ title: undefined });
            return;
        }
        setFormDef((formDef) =>
            produce(formDef, (newFormDef) => {
                const newField = createQuestion(type);
                sectionIdx = sectionIdx != null ? sectionIdx : formDef.sections.length - 1;
                fieldIdx = fieldIdx != null ? fieldIdx + 1 : formDef.sections[sectionIdx].fields.length - 1;
                newFormDef.sections[sectionIdx].fields.splice(fieldIdx, 0, newField);
                setSelectedField({
                    field: newField,
                    sectionIdx,
                    fieldIdx,
                });
            })
        );
    };

    const deleteField = (id: string) => {
        setFormDef((formDef) =>
            produce(formDef, (newFormDef) => {
                formDef.sections.forEach((section, sectionIdx) => {
                    const fieldIdx = section.fields.findIndex((field) => field.id === id);
                    if (fieldIdx != -1) {
                        newFormDef.sections[sectionIdx].fields.splice(fieldIdx, 1);
                        if (fieldIdx == 0) {
                            setSelectedField(undefined);
                        } else {
                            setSelectedField({
                                sectionIdx,
                                fieldIdx: fieldIdx - 1,
                                field: formDef.sections[sectionIdx].fields[fieldIdx - 1],
                            });
                        }
                    }
                });
            })
        );
    };

    const updateField = (field: FormField | PlaceholderBlock) => {
        const { sectionIdx, fieldIdx } = findFieldInForm(formDef, field);
        setFormDef((formDef) => {
            setSelectedField({ field, sectionIdx, fieldIdx });
            return produce(formDef, (newFormDef) => {
                newFormDef.sections[sectionIdx].fields[fieldIdx] = field;
            });
        });
    };

    const onDragEnd = (result: DropResult) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        setFormDef((formDef) => {
            return produce(formDef, (newFormDef) => {
                const sourceSectionIndex = parseInt(result.source.droppableId);
                const targetSectionIndex = parseInt(result.destination!.droppableId);

                if (sourceSectionIndex === targetSectionIndex) {
                    const [removed] = newFormDef.sections[sourceSectionIndex].fields.splice(result.source.index, 1);
                    newFormDef.sections[sourceSectionIndex].fields.splice(result.destination!.index, 0, removed);
                    //setField(newField);
                } else {
                    const [removed] = newFormDef.sections[sourceSectionIndex].fields.splice(result.source.index);
                    newFormDef.sections[targetSectionIndex].fields.splice(result.destination!.index, 0, removed);
                    //setField(newField);
                }
            });
        });
    };

    const createSection = ({ title }) => {
        setFormDef((formDef) => {
            return produce(formDef, (newFormDef) => {
                newFormDef.sections.push({ title, fields: [] });
            });
        });
    };

    const setSectionTitle = (sectionIdx: number, title: string) => {
        setFormDef((formDef) => {
            return produce(formDef, (newFormDef) => {
                newFormDef.sections[sectionIdx].title = title;
            });
        });
    };

    const removeSection = (sectionIdx: number) => {
        setFormDef((formDef) => {
            return produce(formDef, (newFormDef) => {
                newFormDef.sections.splice(sectionIdx, 1);
            });
        });
    };

    if (!formDef) return null;

    return (
        <>
            <VStack width="100vw" height="100vh" spacing={0}>
                <HStack h="60px" bg="white" w="100%" borderBottomWidth={1} alignItems="center" spacing="auto">
                    <VStack ml={4} spacing={0} alignItems="flex-start">
                        <Heading size="md" color="primary.500">
                            Form Builder
                        </Heading>
                    </VStack>

                    <HStack spacing={2} alignItems="center" mr={2}>
                        <FileUploader
                            onFilesSelected={importForm}
                            accept="application/json"
                            component={({ onClick }) => (
                                <Button marginLeft="auto" variant="outline" onClick={onClick}>
                                    Import
                                </Button>
                            )}
                        />
                        <Button marginLeft="auto" variant="outline" onClick={exportForm}>
                            Export
                        </Button>
                    </HStack>
                </HStack>
                <HStack flex="1" width="100%" alignItems="flex-start" height="100%" maxH="calc(100vh - 60px)" spacing={0}>
                    <Box flex="1.5" height="100%" overflow="scroll" borderRightWidth={1}>
                        <FieldList
                            selectedField={selectedField}
                            formDef={formDef}
                            addQuestion={addQuestion}
                            onDragEnd={onDragEnd}
                            updateField={updateField}
                            setSectionTitle={setSectionTitle}
                            removeSection={removeSection}
                        />
                    </Box>
                    {selectedField && (
                        <Box flex="1.5" overflow="scroll" wordBreak="break-all">
                            <FieldEditor
                                field={selectedField.field}
                                setField={(updatedField) => updateField(updatedField)}
                                deleteField={(fieldId) => deleteField(fieldId)}
                            />
                        </Box>
                    )}
                    <Box flex="3" height="100%" maxH="calc(100vh - 60px)" overflow="scroll" borderLeftWidth={1}>
                        <FormPreview formDef={formDef} selectedField={selectedField?.field} setSelectedField={setSelectedField} />
                    </Box>
                </HStack>
            </VStack>
        </>
    );
};

export default Builder;
