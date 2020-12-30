import { AddIcon } from '@chakra-ui/icons';
import { Box, Button } from '@chakra-ui/react';
import * as React from 'react';
import { FC } from 'react';
import { BlockType, QuestionType } from '../types';
import QuestionSelectionMenu from './QuestionSelectionMenu';

const QuestionAddButton: FC<{ onSelect: (type: QuestionType | BlockType) => void }> = ({ onSelect }) => {
    return (
        // borderTopWidth={4} borderColor="gray.200"
        <Box position="relative">
            <QuestionSelectionMenu
                onSelect={onSelect}
                trigger={
                    <Button colorScheme="primary" w={6} borderRadius="50%" aria-label="add question" size="sm">
                        <AddIcon />
                    </Button>
                }
            />
        </Box>
    );
};

export default QuestionAddButton;
