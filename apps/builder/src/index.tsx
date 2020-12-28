import {
  Box,
  Button,
  ChakraProvider,
  Container,
  extendTheme,
  Heading,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { ChakraUiControls } from '@team-apollo-forms/chakra-ui';
import {
  DynamicForm,
  FormDefinition,
  FormField,
  PlaceholderBlock,
} from '@team-apollo-forms/core';
import 'focus-visible/dist/focus-visible';
import produce from 'immer';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';
import FieldEditor from './components/FieldEditor';
import QuestionAddButton from './components/QuestionAddButton';
import QuestionSelectMenu from './components/QuestionSelectionMenu';
import ShortFieldEditor from './components/ShortFieldEditor';
import { formData } from './formData';
// import images from './img/*.*';
import { createQuestion } from './types';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        overflowY: 'hidden',
      },
    },
  },
  shadows: {
    outline: '0 0 0 3px #81E6D9',
  },
  colors: {
    primary: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795',
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    },
  },
});

const App = () => {
  const [formDef, setFormDef] = useState<FormDefinition>(formData);
  const [selectedField, setSelectedField] = useState<{
    field: FormField | PlaceholderBlock;
    sectionIdx: number;
    fieldIdx: number;
  }>({
    field: formDef.sections[0].fields[0],
    fieldIdx: 0,
    sectionIdx: 0,
  });

  useEffect(() => {
    // scroll to field
  }, [selectedField]);

  const addQuestion = (type: any, sectionIdx?: number, fieldIdx?: number) => {
    setFormDef((formDef) =>
      produce(formDef, (newFormDef) => {
        const newField: FormField = createQuestion(type);
        sectionIdx =
          sectionIdx != null ? sectionIdx : formDef.sections.length - 1;
        fieldIdx =
          fieldIdx != null
            ? fieldIdx + 1
            : formDef.sections[sectionIdx].fields.length - 1;
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

            // Find prev field
            //setField(newField);
          }
        });
      })
    );
  };

  const updateField = (
    sectionIdx: number,
    fieldIdx: number,
    field: FormField | PlaceholderBlock
  ) => {
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
          const [removed] = newFormDef.sections[
            sourceSectionIndex
          ].fields.splice(result.source.index, 1);
          newFormDef.sections[sourceSectionIndex].fields.splice(
            result.destination!.index,
            0,
            removed
          );
          //setField(newField);
        } else {
          const [removed] = newFormDef.sections[
            sourceSectionIndex
          ].fields.splice(result.source.index);
          newFormDef.sections[targetSectionIndex].fields.splice(
            result.destination!.index,
            0,
            removed
          );
          //setField(newField);
        }
      });
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <VStack width="100vw" height="100vh" spacing={0}>
        <HStack h="60px" bg="white" w="100%" borderBottomWidth={1}>
          <Button m={2} colorScheme="primary" marginLeft="auto">
            Export to JSON
          </Button>
        </HStack>
        <HStack
          flex="1"
          width="100%"
          alignItems="flex-start"
          height="100%"
          maxH="calc(100vh - 60px)"
          spacing={0}
        >
          <Box flex="1.5" height="100%" overflow="scroll" borderRightWidth={1}>
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
                              <Draggable
                                index={fieldIdx}
                                draggableId={field.id}
                              >
                                {(provided: any) => (
                                  <ShortFieldEditor
                                    ref={provided.innerRef}
                                    isSelected={
                                      field.id === selectedField.field.id
                                    }
                                    draggableProps={provided.draggableProps}
                                    dragHandleProps={provided.dragHandleProps}
                                    field={field}
                                    setField={(field) =>
                                      updateField(sectionIdx, fieldIdx, field)
                                    }
                                  />
                                )}
                              </Draggable>
                            </Box>
                          ))}
                          <QuestionAddButton
                            onSelect={(type) =>
                              addQuestion(
                                type,
                                sectionIdx,
                                section.fields.length - 1
                              )
                            }
                          />
                        </Box>
                      )}
                    </Droppable>
                  </Box>
                ))}
              </DragDropContext>
            </Box>
            <QuestionSelectMenu m={4} onSelect={(type) => addQuestion(type)} />
          </Box>
          {selectedField && (
            <Box flex="1.5" overflow="scroll" wordBreak="break-all">
              <FieldEditor
                field={selectedField.field}
                setField={(updatedField) =>
                  updateField(
                    selectedField.sectionIdx,
                    selectedField.fieldIdx,
                    updatedField
                  )
                }
                deleteField={(fieldId) => deleteField(fieldId)}
              />
            </Box>
          )}
          <Box
            flex="3"
            height="100%"
            maxH="calc(100vh - 60px)"
            overflow="scroll"
            borderLeftWidth={1}
          >
            <Container mt={4} maxW={768} p={0}>
              <Box bg="white" overflow="hidden">
                <DynamicForm
                  formDefinition={formDef}
                  UiControls={ChakraUiControls}
                  selectedField={selectedField?.field}
                  onSelectField={(field, sectionIdx, fieldIdx) =>
                    setSelectedField({ field, sectionIdx, fieldIdx })
                  }
                  placeholders={{
                    //     sectionImage1: () => (
                    //       <Image
                    //         maxH={375}
                    //         objectFit="cover"
                    //         width="100%"
                    //         objectPosition="top"
                    //         src={images[10]['jpg']}
                    //       />
                    //     ),
                    placeholder2: () => <div>Hello there</div>,
                  }}
                />
              </Box>
            </Container>
          </Box>
        </HStack>
      </VStack>
    </ChakraProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
