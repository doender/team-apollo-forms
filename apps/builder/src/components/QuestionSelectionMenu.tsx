import { AddIcon } from '@chakra-ui/icons';
import { Button, ChakraProps, HStack, Popover, PopoverBody, PopoverContent, PopoverTrigger, Portal, useDisclosure } from '@chakra-ui/react';
import * as React from 'react';
import { FC, useState } from 'react';
import { BlockType, questionMenuOptions, QuestionSelectMenuOption, QuestionType } from '../types';
import { QuestionTypeLabel } from './QuestionTypeLabel';

const QuestionSelectMenu: FC<{ trigger?: any; onSelect: (type: QuestionType | BlockType) => void } & ChakraProps> = ({
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
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} {...props}>
                <PopoverTrigger>
                    {trigger !== undefined ? (
                        trigger
                    ) : (
                        <Button {...props} leftIcon={<AddIcon />} size="lg">
                            Add question
                        </Button>
                    )}
                </PopoverTrigger>
                <Portal>
                    <PopoverContent>
                        <PopoverBody p={0}>
                            <div>
                                {questionMenuOptions.map(option => (
                                    <HStack
                                        py={2}
                                        px={2}
                                        cursor="pointer"
                                        key={option.value}
                                        _hover={{ bg: 'gray.100' }}
                                        onMouseOver={() => setSelected(option)}
                                        onClick={() => selectOption(option.value)}
                                    >
                                        <QuestionTypeLabel type={option.value} />
                                        <span>{option.name}</span>
                                    </HStack>
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
