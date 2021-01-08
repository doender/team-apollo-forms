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
import { Alert } from '@material-ui/lab';
import { FormControls } from '@team-apollo-forms/core';
import React from 'react';

export const MaterialUiControls: FormControls = {
    FormField: ({ isInvalid, label, description, errorMsg, children, isRequired }) => {
        return (
            <FormControl fullWidth error={isInvalid} required={isRequired} style={{ marginBottom: '2rem' }}>
                <FormLabel style={{ marginBottom: '12px' }}>{label}</FormLabel>
                {description && <FormHelperText dangerouslySetInnerHTML={{ __html: description }} />}
                {children}
                {isInvalid && <FormHelperText>{errorMsg}</FormHelperText>}
            </FormControl>
        );
    },

    ErrorMessage: ({ msg }) => {
        return <Alert severity="error">{msg}</Alert>;
    },

    TextInput: ({ placeholder, isRequired, isInvalid, value, onFocus, name, onChange, onBlur }) => {
        return (
            <OutlinedInput
                placeholder={placeholder}
                required={isRequired}
                error={isInvalid}
                fullWidth
                value={value}
                onFocus={onFocus}
                name={name}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
            />
        );
    },

    NumberInput: ({ placeholder, min, max, isRequired, value, isInvalid, onFocus, name, onChange, onBlur }) => {
        return (
            <OutlinedInput
                type="number"
                inputProps={{
                    max,
                    min,
                }}
                placeholder={placeholder}
                required={isRequired}
                error={isInvalid}
                value={value}
                fullWidth
                onFocus={onFocus}
                name={name}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
            />
        );
    },

    LikertInput: ({ anchorLabels, onFocus, name, value, onChange, onBlur }) => {
        return (
            <RadioGroup
                row
                style={{ justifyContent: 'space-between' }}
                onFocus={onFocus}
                name={name}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                onBlur={onBlur}
            >
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

    RadioTextInput: ({ options, onFocus, value, name, onChange, onBlur }) => {
        return (
            <RadioGroup onFocus={onFocus} name={name} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} value={value}>
                {options.map((opt) => (
                    <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
                ))}
            </RadioGroup>
        );
    },

    CheckboxTextInput: ({ options, onFocus, name, onChange, onBlur, value }) => {
        return (
            <FormGroup onFocus={onFocus} onBlur={onBlur}>
                {options.map((opt) => (
                    <FormControlLabel
                        key={opt.value}
                        value={opt.value}
                        name={name}
                        control={
                            <Checkbox
                                checked={value.includes(opt.value)}
                                onChange={(e, isChecked) => {
                                    if (isChecked) {
                                        onChange([...value, opt.value]);
                                    } else {
                                        const idx = value.findIndex((val) => val === opt.value);
                                        onChange([...value.slice(0, idx), ...value.slice(idx + 1)]);
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

    SliderInput: ({ min, max, onFocus, value, name, onChange, onBlur }) => {
        return (
            <Slider
                onFocus={onFocus}
                style={{ marginTop: '40px' }}
                marks={[
                    { value: min, label: min },
                    { value: max, label: max },
                ]}
                valueLabelDisplay="on"
                min={min}
                max={max}
                value={value || 0}
                onChange={(e, value) => {
                    onChange(value);
                }}
                name={name}
                onBlur={onBlur}
            />
        );
    },

    TextareaInput: ({ placeholder, isRequired, isInvalid, onFocus, name, onChange, onBlur, value }) => {
        return (
            <OutlinedInput
                placeholder={placeholder}
                required={isRequired}
                error={isInvalid}
                fullWidth
                multiline
                onFocus={onFocus}
                name={name}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                value={value}
            />
        );
    },

    Progress: ({ value, max }) => <LinearProgress variant="determinate" value={100 * (value / max)} />,

    PrevButton: ({ onClick, children }) => {
        return (
            <Button size="large" onClick={() => onClick()}>
                {children}
            </Button>
        );
    },

    NextButton: ({ onClick, isDisabled, children }) => {
        return (
            <Button size="large" variant="contained" color="primary" disabled={isDisabled} onClick={() => onClick()}>
                {children}
            </Button>
        );
    },

    SubmitButton: ({ isDisabled, isLoading, children }) => {
        return (
            <Button size="large" variant="contained" color="primary" disabled={isDisabled || isLoading} type="submit">
                {children}
            </Button>
        );
    },
};
