import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    LinearProgress,
    OutlinedInput,
    Radio,
    RadioGroup,
    Slider,
} from '@material-ui/core';
import { FormUiControls } from '@team-apollo-forms/core';
import React from 'react';

export const MaterialUiControls: FormUiControls = {
    FormField: ({ isInvalid, label, description, errorMsg, children, isRequired }) => {
        return (
            <FormControl fullWidth error={isInvalid} required={isRequired} style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <FormLabel style={{ marginBottom: '12px' }}>{label}</FormLabel>
                {description && <FormHelperText dangerouslySetInnerHTML={{ __html: description }} />}
                {children}
                {isInvalid && <FormHelperText>{errorMsg}</FormHelperText>}
            </FormControl>
        );
    },

    TextInput: ({ field, placeholder, isRequired, isInvalid, onFocus }) => {
        return <OutlinedInput {...field} placeholder={placeholder} required={isRequired} error={isInvalid} fullWidth onFocus={onFocus} />;
    },

    NumberInput: ({ field, placeholder, min, max, isRequired, isInvalid, onFocus }) => {
        return (
            <OutlinedInput
                {...field}
                type="number"
                inputProps={{
                    max,
                    min,
                }}
                placeholder={placeholder}
                required={isRequired}
                error={isInvalid}
                fullWidth
                onFocus={onFocus}
            />
        );
    },

    LikertInput: ({ field, anchorLabels, onFocus }) => {
        return (
            <RadioGroup row {...field} style={{ justifyContent: 'space-between' }} onFocus={onFocus}>
                {[0, 1, 2, 3, 4].map((val) => (
                    <FormControlLabel
                        key={val}
                        value={val.toFixed(0)}
                        control={<Radio />}
                        label={val === 0 ? anchorLabels[0] : val === 4 ? anchorLabels[1] : null}
                        labelPlacement="bottom"
                    />
                ))}
            </RadioGroup>
        );
    },

    RadioTextInput: ({ field, options, onFocus }) => {
        return (
            <RadioGroup {...field} onFocus={onFocus}>
                {options.map((opt) => (
                    <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
                ))}
            </RadioGroup>
        );
    },

    CheckboxTextInput: ({ field, form, options, onFocus }) => {
        return (
            <FormGroup {...field} onFocus={onFocus}>
                {options.map((opt) => (
                    <FormControlLabel
                        key={opt.value}
                        value={opt.value}
                        control={
                            <Checkbox
                                checked={field.value.includes(opt.value)}
                                onChange={(e, value) => {
                                    if (value) {
                                        form.setFieldValue(field.name, [...field.value, opt.value]);
                                    } else {
                                        const idx = field.value.findIndex((val) => val === opt.value);
                                        form.setFieldValue(field.name, [...field.value.slice(0, idx), ...field.value.slice(idx + 1)]);
                                    }
                                }}
                                name={opt.label}
                            />
                        }
                        label={opt.label}
                    />
                ))}
            </FormGroup>
        );
    },

    SliderInput: ({ field, form, min, max, onFocus }) => {
        return (
            <Slider
                onFocus={onFocus}
                style={{ marginTop: '40px' }}
                marks={[
                    { value: min, label: min },
                    { value: max, label: max },
                ]}
                valueLabelDisplay="on"
                {...field}
                min={min}
                max={max}
                value={field.value || 0}
                onChange={(e, value) => form.setFieldValue(field.name, value)}
            />
        );
    },

    TextareaInput: ({ field, placeholder, isRequired, isInvalid, onFocus }) => {
        return (
            <OutlinedInput
                {...field}
                placeholder={placeholder}
                required={isRequired}
                error={isInvalid}
                fullWidth
                multiline
                onFocus={onFocus}
            />
        );
    },

    Progress: ({ value, max }) => <LinearProgress variant="determinate" value={100 * (value / max)} />,

    PrevButton: ({ onClick, children }) => {
        return <Button onClick={() => onClick()}>{children}</Button>;
    },

    NextButton: ({ onClick, isDisabled, children }) => {
        return (
            <Button variant="contained" color="primary" disabled={isDisabled} onClick={() => onClick()}>
                {children}
            </Button>
        );
    },

    SubmitButton: ({ isDisabled, isLoading, children }) => {
        return (
            <Button variant="contained" disabled={isDisabled || isLoading} type="submit">
                {children}
            </Button>
        );
    },
};
