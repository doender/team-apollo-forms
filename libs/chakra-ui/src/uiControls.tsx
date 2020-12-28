import {
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Radio,
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { FormUiControls } from '@team-apollo-forms/core';
import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ResizeTextarea from 'react-textarea-autosize';

export const ChakraUiControls: FormUiControls = {
  FormField: ({
    isInvalid,
    label,
    id,
    description,
    errorMsg,
    onFocus,
    children,
    isRequired,
  }) => {
    return (
      <FormControl
        my={10}
        isInvalid={isInvalid}
        onFocus={onFocus}
        isRequired={isRequired}
      >
        {label && (
          <FormLabel htmlFor={id} fontWeight={600} fontSize="lg" mb={3}>
            {label}
          </FormLabel>
        )}
        {description && (
          <Text
            pl={3}
            pb={1}
            borderLeftWidth={2}
            fontSize="sm"
            mt={-1}
            mb={4}
            color="gray.600"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        )}
        {children}
        <FormErrorMessage>{errorMsg}</FormErrorMessage>
      </FormControl>
    );
  },

  TextInput: ({ field, placeholder }) => (
    <Input
      focusBorderColor="primary.300"
      placeholder={placeholder}
      {...field}
    />
  ),

  NumberInput: ({ field, form, placeholder, min, max }) => {
    return (
      <NumberInput
        focusBorderColor="primary.400"
        placeholder={placeholder}
        {...field}
        onChange={(e) => form.setFieldValue(field.name, e)}
        min={min || -Infinity}
        max={max || Infinity}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberIncrementStepper />
        </NumberInputStepper>
      </NumberInput>
    );
  },

  LikertInput: ({ field, form, anchorLabels }) => {
    return (
      <RadioGroup
        colorScheme="primary"
        mt={8}
        {...field}
        onChange={(e) => form.setFieldValue(field.name, e)}
      >
        <Stack direction="row" width="100%">
          {[0, 1, 2, 3, 4].map((val) => (
            <Radio
              flexDirection="column"
              cursor="pointer"
              key={val}
              justifyContent="flex-start"
              size="lg"
              flex={1}
              value={val.toFixed(0)}
            >
              {val === 0 && (
                <Text fontSize="sm" mt={2} textAlign="center">
                  {anchorLabels[0]}
                </Text>
              )}
              {val === 4 && (
                <Text fontSize="sm" mt={2} textAlign="center">
                  {anchorLabels[1]}
                </Text>
              )}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    );
  },

  RadioTextInput: ({ field, form, options }) => {
    return (
      <RadioGroup
        colorScheme="primary"
        {...field}
        onChange={(e) => form.setFieldValue(field.name, e)}
      >
        <Stack>
          {options.map((opt) => (
            <Radio cursor="pointer" key={opt.value} value={opt.value}>
              {opt.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    );
  },

  CheckboxTextInput: ({ field, form, options }) => {
    return (
      <CheckboxGroup
        colorScheme="primary"
        {...field}
        onChange={(e) => form.setFieldValue(field.name, e)}
      >
        <Stack>
          {options.map((opt) => (
            <Checkbox cursor="pointer" key={opt.value} value={opt.value}>
              {opt.label}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    );
  },

  SliderInput: ({ field, form, min, max }) => {
    return (
      <Slider
        colorScheme="primary"
        my={6}
        value={field.value}
        onChange={(e) => form.setFieldValue(field.name, e)}
        min={min}
        max={max}
        focusThumbOnChange={false}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Text position="absolute" left={0} bottom={-6}>
          {min}
        </Text>
        <Text position="absolute" right={0} bottom={-6}>
          {max}
        </Text>
        <SliderThumb boxSize={6}>
          <Badge position="absolute" left={0} top={-6}>
            {field.value}
          </Badge>
        </SliderThumb>
      </Slider>
    );
  },

  TextareaInput: ({ field, placeholder }) => {
    return (
      <AutoResizeTextarea
        focusBorderColor="primary.400"
        placeholder={placeholder}
        {...field}
      />
    );
  },

  SwitchInput: ({ field }) => {
    return <Switch size="lg" colorScheme="primary" {...field} />;
  },

  Progress: ({ value, max }) => (
    <Progress size="sm" colorScheme="primary" value={value} min={0} max={max} />
  ),

  PrevButton: ({ onClick, children }) => {
    return (
      <Button
        variant="ghost"
        size="lg"
        leftIcon={<FaArrowLeft />}
        onClick={() => onClick()}
      >
        {children}
      </Button>
    );
  },

  NextButton: ({ onClick, isDisabled, children }) => {
    return (
      <Button
        isDisabled={isDisabled}
        rightIcon={<FaArrowRight />}
        size="lg"
        onClick={onClick}
      >
        {children}
      </Button>
    );
  },

  SubmitButton: ({ isDisabled, isLoading, children }) => {
    return (
      <Button
        size="lg"
        colorScheme="primary"
        isDisabled={isDisabled}
        isLoading={isLoading}
        type="submit"
      >
        {children}
      </Button>
    );
  },
};

/**
 * As recommended by: https://github.com/chakra-ui/chakra-ui/issues/670
 */
const AutoResizeTextarea: React.FC<any> = React.forwardRef((props, ref) => {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      transition="height none"
      ref={ref}
      minRows={3}
      as={ResizeTextarea}
      {...props}
    />
  );
});
