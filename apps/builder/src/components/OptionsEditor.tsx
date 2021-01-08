import { CloseIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack, IconButton } from '@chakra-ui/react';
import { Option } from '@team-apollo-forms/core';
import React, { FC } from 'react';
import { uid } from '../utils/id';
import DebouncedTextArea from './DebouncedTextArea';

interface OptionsEditorProps {
    value: Option[];
    onChange: (value: Option[]) => void;
}

const OptionsEditor: FC<OptionsEditorProps> = ({ value, onChange }) => {
    const handleChange = (idx: number, label: string) => {
        const newValue = [...value];
        newValue[idx] = { ...value[idx], label };
        onChange(newValue);
    };

    const addOption = () => {
        const newValue = [...value, { label: '', value: `option-${uid()}` }];
        onChange(newValue);
    };

    const removeOption = (idx: number) => {
        const newValue = [...value.slice(0, idx), ...value.slice(idx + 1)];
        onChange(newValue);
    };

    return (
        <Flex direction="column">
            {value?.map((opt: Option, i) => (
                <HStack key={opt.value} mb={2}>
                    <DebouncedTextArea
                        bg="white"
                        placeholder="Type a response"
                        value={opt.label}
                        onChange={(val) => handleChange(i, val.target.value)}
                    />
                    <IconButton size="xs" aria-label="remove option" icon={<CloseIcon />} onClick={() => removeOption(i)} />
                </HStack>
            ))}

            <Button mt={2} ml="auto" aria-label="add option" size="sm" onClick={addOption}>
                Add option
            </Button>
        </Flex>
    );
};

export default OptionsEditor;
