import debounce from 'lodash.debounce';
import * as React from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';

interface DebouncedInputProps {
    value: string;
    onChange: (value: any) => void;
    debounceTime: number;
    component: React.ElementType;
}

const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps & any>(
    ({ value: defaultValue, onChange, component, debounceTime, ...props }, ref) => {
        const Component = component;
        const [value, setValue] = useState(defaultValue);

        useEffect(() => {
            setValue(defaultValue);
        }, [defaultValue]);

        const debouncedSave = useCallback(
            debounce((nextValue) => onChange(nextValue), debounceTime),
            [defaultValue, onChange]
        );

        const handleChange = (event: any) => {
            let nextValue;
            if (event.target) {
                event.persist();
                nextValue = event.target.value;
            } else {
                nextValue = event;
            }

            setValue(nextValue);
            debouncedSave(event);
        };

        return <Component ref={ref} {...props} value={value} onChange={handleChange} />;
    }
);

export default DebouncedInput;
