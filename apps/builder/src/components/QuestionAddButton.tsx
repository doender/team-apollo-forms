import { AddIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import * as React from 'react';
import { FC } from 'react';
import { BlockType, QuestionType } from '../types';
import QuestionSelectionMenu from './QuestionSelectionMenu';

const QuestionAddButton: FC<{ onSelect: (type: QuestionType | BlockType) => void }> = ({ onSelect }) => {
    return (
        // borderTopWidth={4} borderColor="gray.200"
        <Box position="relative" pt={2} pb={1} mt={2}>
            <QuestionSelectionMenu
                onSelect={onSelect}
                trigger={
                    <IconButton
                        bg="gray.400"
                        color="white"
                        borderRadius="50%"
                        position="absolute"
                        top="-14px"
                        right="4px"
                        aria-label="add question"
                        icon={<AddIcon />}
                        size="sm"
                    />
                }
            />
        </Box>
    );
};

export default QuestionAddButton;
