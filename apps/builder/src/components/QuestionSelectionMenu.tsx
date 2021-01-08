import { AddIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    ChakraProps,
    Divider,
    HStack,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Portal,
    useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { FC, ReactElement, useState } from 'react';
import { BlockType, questionMenuOptions, QuestionSelectMenuOption, QuestionType } from '../types';
import { QuestionTypeLabel } from './QuestionTypeLabel';

const QuestionSelectMenu: FC<{ trigger?: ReactElement; onSelect: (type: QuestionType | BlockType) => void } & ChakraProps> = ({
    onSelect,
    trigger,
    ...props
}) => {
    const [selected, setSelected] = useState<QuestionSelectMenuOption>();
    const { onOpen, onClose, isOpen } = useDisclosure();

    const selectOption = (type: QuestionType | BlockType) => {
        onSelect(type);
        onClose();
    };

    return (
        <>
            <Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                modifiers={{ name: 'eventListeners', options: { scroll: false } } as any}
                {...props}
            >
                <PopoverTrigger>
                    {trigger !== undefined ? (
                        trigger
                    ) : (
                        <Button {...props} leftIcon={<AddIcon />} size="lg">
                            Add first question
                        </Button>
                    )}
                </PopoverTrigger>
                <Portal>
                    <PopoverContent>
                        <PopoverBody p={0}>
                            <div>
                                {questionMenuOptions.map((option) => (
                                    <Box key={option.value}>
                                        {option.value === 'section' && <Divider />}
                                        <HStack
                                            py={2}
                                            px={2}
                                            cursor="pointer"
                                            _hover={{ bg: 'gray.100' }}
                                            onMouseOver={() => setSelected(option)}
                                            onClick={() => selectOption(option.value)}
                                        >
                                            <QuestionTypeLabel type={option.value} />
                                            <span>{option.name}</span>
                                        </HStack>
                                    </Box>
                                ))}
                            </div>
                        </PopoverBody>
                    </PopoverContent>
                </Portal>
            </Popover>
        </>
    );
};

export default QuestionSelectMenu;
