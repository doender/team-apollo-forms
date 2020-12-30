import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    LinearProgress,
    Radio,
    RadioGroup,
    Slider,
    TextField,
} from '@material-ui/core';
import { FormUiControls } from '@team-apollo-forms/core';
import React from 'react';

export const MaterialUiControls: FormUiControls = {
    FormField: ({ isInvalid, label, id, description, errorMsg, onFocus, children, isRequired }) => {
        return <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>{children}</div>;
    },

    TextInput: ({ field, placeholder, label, isRequired, isInvalid, errorMsg }) => {
        return (
            <TextField
                {...field}
                label={label}
                placeholder={placeholder}
                required={isRequired}
                error={isInvalid}
                helperText={isInvalid && errorMsg}
                variant="outlined"
                fullWidth
            />
        );
    },

    NumberInput: ({ field, form, placeholder, min, max, isRequired, label, isInvalid, errorMsg }) => {
        return (
            <TextField
                {...field}
                type="number"
                InputProps={{
                    inputProps: {
                        max,
                        min,
                    },
                }}
                label={label}
                placeholder={placeholder}
                required={isRequired}
                error={isInvalid}
                helperText={isInvalid && errorMsg}
                variant="outlined"
                fullWidth
            />
        );
    },

    LikertInput: ({ field, form, anchorLabels, isInvalid, isRequired, label, errorMsg }) => {
        return (
            <FormControl fullWidth error={isInvalid} required={isRequired}>
                <FormLabel style={{ marginBottom: '12px' }}>{label}</FormLabel>
                <RadioGroup row {...field} style={{ justifyContent: 'space-between' }}>
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
                {isInvalid && <FormHelperText>{errorMsg}</FormHelperText>}
            </FormControl>
        );
    },

    RadioTextInput: ({ field, form, options, isInvalid, label, errorMsg, isRequired }) => {
        return (
            <FormControl error={isInvalid} required={isRequired}>
                <FormLabel style={{ marginBottom: '12px' }}>{label}</FormLabel>
                <RadioGroup {...field}>
                    {options.map((opt) => (
                        <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
                    ))}
                </RadioGroup>
                {isInvalid && <FormHelperText>{errorMsg}</FormHelperText>}
            </FormControl>
        );
    },

    CheckboxTextInput: ({ field, form, options, isInvalid, isRequired, errorMsg, label }) => {
        return (
            <FormControl error={isInvalid} required={isRequired}>
                <FormLabel style={{ marginBottom: '12px' }}>{label}</FormLabel>
                <FormGroup {...field}>
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
                {isInvalid && <FormHelperText>{errorMsg}</FormHelperText>}
            </FormControl>
        );
    },

    SliderInput: ({ field, form, min, max, isInvalid, isRequired, label, errorMsg }) => {
        return (
            <FormControl fullWidth error={isInvalid} required={isRequired}>
                <FormLabel style={{ marginBottom: '12px' }}>{label}</FormLabel>
                <Slider
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
                {isInvalid && <FormHelperText>{errorMsg}</FormHelperText>}
            </FormControl>
        );
    },

    TextareaInput: ({ field, placeholder, label, isRequired, isInvalid, errorMsg }) => {
        return (
            <TextField
                {...field}
                label={label}
                placeholder={placeholder}
                required={isRequired}
                error={isInvalid}
                helperText={isInvalid && errorMsg}
                variant="outlined"
                fullWidth
                multiline
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
