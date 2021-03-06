import { FormikProps } from 'formik';
import React from 'react';
import { FormLocale } from '../../locales';
import { renderTemplate } from '../../utils/renderTemplate';
import { shouldShowFormField } from './depField.fns';
import DynamicFormField from './DynamicFormField';
import { FormControls, FormField, FormSection, isFormField, isPlaceholder } from './types';

const DynamicFormSection: React.FC<{
    form: FormikProps<any>;
    section: FormSection;
    placeholders: any;
    controls: FormControls;
    onFocus: (field: FormField, fieldIdx: number) => void;
    onBlur?: (field: FormField, fieldIdx: number) => void;
    locale: FormLocale;
}> = ({ form, section, placeholders, controls, onFocus, locale, onBlur }) => {
    if (!section) return null;
    return (
        <>
            {section.title && (
                <h1
                    style={{
                        fontSize: '1.875rem',
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        padding: '0 2rem 2.5rem 2rem',
                    }}
                >
                    {renderTemplate(section.title, form.values)}
                </h1>
            )}
            {section.fields.map((item, idx) => {
                if (isFormField(item)) {
                    // Show form fields conditionally based on other responses
                    const showField = shouldShowFormField(item, form.values);
                    if (!showField) {
                        return null;
                    }

                    return (
                        <div key={item.id} style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                            <DynamicFormField
                                locale={locale}
                                item={item}
                                controls={controls}
                                onFocus={() => onFocus(item, idx)}
                                onBlur={() => onBlur && onBlur(item, idx)}
                            />
                        </div>
                    );
                } else if (isPlaceholder(item) && placeholders && item.id in placeholders) {
                    // Render placeholder
                    return <div key={item.id}>{placeholders[item.id](form)}</div>;
                }

                return null;
            })}
        </>
    );
};

export default DynamicFormSection;
