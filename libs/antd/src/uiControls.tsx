import { FormUiControls } from '@team-apollo-forms/core';
import { Button, Checkbox, Form, Input, InputNumber, Progress, Radio, Row, Slider, Typography } from 'antd';
import React from 'react';

/**
 * Form UI controls from the Ant Design framework
 */
export const AntdControls: FormUiControls = {
    FormField: ({ isInvalid, label, description, errorMsg, children, isRequired }) => {
        return (
            <div style={{ marginBottom: '2.0rem' }}>
                <Form.Item
                    label={label}
                    labelCol={{ span: 24 }}
                    required={isRequired}
                    validateStatus={isInvalid ? 'error' : null}
                    help={isInvalid && errorMsg}
                >
                    {description && (
                        <Typography.Paragraph style={{ marginTop: '-10px' }} type="secondary">
                            {description}
                        </Typography.Paragraph>
                    )}
                    {children}
                </Form.Item>
            </div>
        );
    },

    TextInput: ({ placeholder, isRequired, onFocus, value, onChange, onBlur, name }) => {
        return (
            <Input
                size="large"
                onFocus={onFocus}
                placeholder={placeholder}
                required={isRequired}
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
            />
        );
    },

    NumberInput: ({ placeholder, min, max, isRequired, onFocus, value, onChange, onBlur, name }) => {
        return (
            <InputNumber
                min={min}
                max={max}
                onFocus={onFocus}
                placeholder={placeholder}
                required={isRequired}
                size="large"
                style={{ width: '100%' }}
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
            />
        );
    },

    LikertInput: ({ anchorLabels, value, onChange, onBlur, name }) => {
        const radioStyle = {
            display: 'flex',
            flexDirection: 'column' as 'column',
            alignItems: 'center',
        };
        return (
            <Radio.Group
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ display: 'flex', justifyContent: 'space-between' }}
                size="large"
            >
                {[0, 1, 2, 3, 4].map((val) => (
                    <Radio key={val} style={radioStyle} value={val.toFixed(0)}>
                        {val === 0 ? anchorLabels[0] : val === 4 ? anchorLabels[1] : null}
                    </Radio>
                ))}
            </Radio.Group>
        );
    },

    RadioTextInput: ({ options, value, onChange, onBlur, name }) => {
        return (
            <Radio.Group name={name} value={value} onChange={(e) => onChange(e.target.value)} size="large">
                {options.map((opt) => (
                    <Row key={opt.value} style={{ marginBottom: '12px' }}>
                        <Radio value={opt.value}>{opt.label}</Radio>
                    </Row>
                ))}
            </Radio.Group>
        );
    },

    CheckboxTextInput: ({ options, value, onChange, onBlur, name }) => {
        return (
            <Checkbox.Group name={name} value={value} onChange={onChange}>
                {options.map((opt) => (
                    <Row key={opt.value} style={{ marginBottom: '12px' }}>
                        <Checkbox value={opt.value}>{opt.label}</Checkbox>
                    </Row>
                ))}
            </Checkbox.Group>
        );
    },

    SliderInput: ({ min, max, value, onChange, onBlur, name }) => {
        return (
            <Slider
                style={{ marginTop: '40px' }}
                min={min}
                max={max}
                marks={{ [min]: min, [max]: max }}
                value={value}
                onChange={onChange}
            />
        );
    },

    TextareaInput: ({ placeholder, isRequired, onFocus, value, onChange, onBlur, name }) => {
        return (
            <Input.TextArea
                size="large"
                onFocus={onFocus}
                placeholder={placeholder}
                required={isRequired}
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
            />
        );
    },

    Progress: ({ value, max }) => (
        <Progress
            style={{ paddingLeft: '10px', paddingRight: '10px' }}
            percent={100 * (value / max)}
            strokeLinecap="square"
            showInfo={false}
            status="active"
        />
    ),

    PrevButton: ({ onClick, children }) => {
        return (
            <Button size="large" onClick={() => onClick()}>
                {children}
            </Button>
        );
    },

    NextButton: ({ onClick, isDisabled, children }) => {
        return (
            <Button size="large" type="primary" disabled={isDisabled} onClick={() => onClick()}>
                {children}
            </Button>
        );
    },

    SubmitButton: ({ isDisabled, isLoading, children }) => {
        return (
            <Button size="large" disabled={isDisabled} type="primary" key="submit" loading={isLoading} htmlType="submit">
                {children}
            </Button>
        );
    },
};
