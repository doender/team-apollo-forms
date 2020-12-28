import { Textarea } from '@chakra-ui/react';
import * as React from 'react';
import { FC } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import DebouncedInput from './DebouncedInput';

const DebouncedTextArea: FC<{ value: any; onChange: any; placeholder?: string }> = ({ value, onChange, placeholder }) => {
    return (
        <DebouncedInput
            debounceTime={300}
            bg="white"
            component={Textarea}
            minH="unset"
            overflow="hidden"
            resize="none"
            w="100%"
            transition="height none"
            minRows={1}
            placeholder={placeholder}
            wordBreak="break-word"
            p={4}
            as={ResizeTextarea}
            variant="unstyled"
            value={value}
            onChange={onChange}
        />
    );
};

export default DebouncedTextArea;
