import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Text,
} from '@chakra-ui/react';
import { AntdControls } from '@team-apollo-forms/antd';
import { ChakraUiControls } from '@team-apollo-forms/chakra-ui';
import { DynamicForm, FormDefinition, FormField, PlaceholderBlock } from '@team-apollo-forms/core';
import { MaterialUiControls } from '@team-apollo-forms/material-ui';
import { en, nl } from 'libs/core/src/locales';
import React, { FC, useState } from 'react';
import { FaCog } from 'react-icons/fa';

interface FormPreviewProps {
    formDef: FormDefinition;
    selectedField: FormField | PlaceholderBlock;
    setSelectedField: (field: { field: FormField | PlaceholderBlock; sectionIdx: number; fieldIdx: number }) => void;
}

const uiControlsMap = {
    chakra: ChakraUiControls,
    material: MaterialUiControls,
    ant: AntdControls,
};

const localeMap = {
    nl: nl,
    en: en,
};

const FormPreview: FC<FormPreviewProps> = ({ formDef, selectedField, setSelectedField }) => {
    const [UI, setUI] = useState<string>('chakra');
    const [locale, setLocale] = useState<string>('en');
    const uiControls = uiControlsMap[UI];
    const formLocale = localeMap[locale];
    return (
        <Box mt={6}>
            <Container mt={4} maxW={768} p={0} fontFamily={UI === 'material' ? 'Roboto' : null}>
                <HStack justifyContent="space-between" m={2} mb={4}>
                    <Text color="gray.500" letterSpacing={1} fontWeight={700} textTransform="uppercase">
                        preview
                    </Text>
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button} bg="transparent" color="gray.500" borderRadius="50%" w={6}>
                            <FaCog />
                        </MenuButton>
                        <MenuList minWidth="240px">
                            <MenuOptionGroup defaultValue={UI} title="UI Library" type="radio">
                                <MenuItemOption value="chakra" onClick={() => setUI('chakra')}>
                                    Chakra UI
                                </MenuItemOption>
                                <MenuItemOption value="material" onClick={() => setUI('material')}>
                                    Material UI
                                </MenuItemOption>
                                <MenuItemOption value="ant" onClick={() => setUI('ant')}>
                                    Ant Design
                                </MenuItemOption>
                            </MenuOptionGroup>
                            <MenuDivider />
                            <MenuOptionGroup defaultValue={locale} title="Locale" type="radio">
                                <MenuItemOption value="en" onClick={() => setLocale('en')}>
                                    English
                                </MenuItemOption>
                                <MenuItemOption value="material" onClick={() => setLocale('nl')}>
                                    Nederlands
                                </MenuItemOption>
                            </MenuOptionGroup>
                        </MenuList>
                    </Menu>
                </HStack>
                <Box bg="white" overflow="hidden">
                    <DynamicForm
                        formDefinition={formDef}
                        controls={uiControls}
                        selectedField={selectedField}
                        onSelectField={(field, sectionIdx, fieldIdx) => setSelectedField({ field, sectionIdx, fieldIdx })}
                        showAfterSubmit={() => <Heading>Bedankt!</Heading>}
                        onSubmit={(values) => {
                            console.log(values);
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve();
                                }, 1000);
                            });
                        }}
                        locale={formLocale}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default FormPreview;
