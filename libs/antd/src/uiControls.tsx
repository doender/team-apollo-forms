import { FormUiControls } from '@team-apollo-forms/core';
import { Button, Checkbox, Form, Input, InputNumber, Progress, Radio, Row, Slider, Typography } from 'antd';
import React from 'react';

export const AntdControls: FormUiControls = {
    FormField: ({ isInvalid, label, description, errorMsg, children, isRequired }) => {
        return (
            <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
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

    TextInput: ({ field, placeholder, isRequired, onFocus }) => {
        return <Input onFocus={onFocus} {...field} placeholder={placeholder} required={isRequired} />;
    },

    NumberInput: ({ form, field, placeholder, min, max, isRequired, onFocus }) => {
        return (
            <InputNumber
                {...field}
                min={min}
                max={max}
                onFocus={onFocus}
                placeholder={placeholder}
                required={isRequired}
                onChange={(val) => form.setFieldValue(field.name, val)}
            />
        );
    },

    LikertInput: ({ field, anchorLabels }) => {
        const radioStyle = {
            display: 'flex',
            flexDirection: 'column' as 'column',
            alignItems: 'center',
        };
        return (
            <Radio.Group {...field} style={{ display: 'flex', justifyContent: 'space-between' }} size="large">
                {[0, 1, 2, 3, 4].map((val) => (
                    <Radio key={val} style={radioStyle} value={val.toFixed(0)}>
                        {val === 0 ? anchorLabels[0] : val === 4 ? anchorLabels[1] : null}
                    </Radio>
                ))}
            </Radio.Group>
        );
    },

    RadioTextInput: ({ field, options }) => {
        return (
            <Radio.Group {...field}>
                {options.map((opt) => (
                    <Row key={opt.value} style={{ marginBottom: '12px' }}>
                        <Radio value={opt.value}>{opt.label}</Radio>
                    </Row>
                ))}
            </Radio.Group>
        );
    },

    CheckboxTextInput: ({ field, form, options }) => {
        return (
            <Checkbox.Group {...field} onChange={(val) => form.setFieldValue(field.name, val)}>
                {options.map((opt) => (
                    <Row key={opt.value} style={{ marginBottom: '12px' }}>
                        <Checkbox value={opt.value}>{opt.label}</Checkbox>
                    </Row>
                ))}
            </Checkbox.Group>
        );
    },

    SliderInput: ({ field, form, min, max }) => {
        return (
            <Slider
                style={{ marginTop: '40px' }}
                {...field}
                min={min}
                max={max}
                marks={{ [min]: min, [max]: max }}
                onChange={(val) => form.setFieldValue(field.name, val)}
            />
        );
    },

    TextareaInput: ({ field, placeholder, isRequired, onFocus }) => {
        return <Input.TextArea onFocus={onFocus} {...field} placeholder={placeholder} required={isRequired} />;
    },

    Progress: ({ value, max }) => (
        <Progress style={{ padding: '10px' }} percent={100 * (value / max)} strokeLinecap="square" showInfo={false} status="active" />
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
