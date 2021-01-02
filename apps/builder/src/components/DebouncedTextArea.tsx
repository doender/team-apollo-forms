import { ChakraProps, Textarea } from '@chakra-ui/react';
import * as React from 'react';
import { FC } from 'react';
import ResizeTextarea from 'react-textarea-autosize';
import DebouncedInput from './DebouncedInput';

const DebouncedTextArea: FC<{ value: any; onChange: any; placeholder?: string } & ChakraProps> = ({
    value,
    onChange,
    placeholder,
    ...props
}) => {
    return (
        <DebouncedInput
            debounceTime={300}
            component={Textarea}
            minH="unset"
            overflow="hidden"
            resize="none"
            w="100%"
            transition="height none"
            minRows={1}
            placeholder={placeholder}
            wordBreak="break-word"
            p={2}
            as={ResizeTextarea}
            variant="unstyled"
            value={value}
            onChange={onChange}
            size="sm"
            {...props}
        />
    );
};

export default DebouncedTextArea;
