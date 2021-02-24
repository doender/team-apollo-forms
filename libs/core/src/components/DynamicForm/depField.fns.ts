import { ComparisonOperator, ComparisonOperatorCondition, FormField } from './types';

const compare = <T extends number | string | boolean>(op: ComparisonOperator, a: T, b: T): boolean => {
    switch (op) {
        case '$eq':
        case '$in':
            return a === b;
        case '$ne':
        case '$nin':
            return a !== b;
        case '$gt':
            return a > b;
        case '$gte':
            return a >= b;
        case '$lt':
            return a < b;
        case '$lte':
            return a <= b;
    }
};

const isQueryValueMatch = <T extends number | string | boolean>(op: ComparisonOperator, queryValue: T | T[], value: T | T[]): boolean => {
    if (Array.isArray(value) && !Array.isArray(queryValue)) {
        // Form field is array, so cast query value to array
        queryValue = [queryValue];
    }

    if (!Array.isArray(value) && !Array.isArray(queryValue)) {
        return compare(op, value, queryValue);
    } else if (!Array.isArray(value) && Array.isArray(queryValue)) {
        return queryValue.some((q) => compare(op, value, q));
    } else if (Array.isArray(value) && Array.isArray(queryValue)) {
        switch (op) {
            case '$eq':
            case '$in':
                return queryValue.some((q) => value.includes(q));
            case '$ne':
            case '$nin':
                return queryValue.some((q) => !value.includes(q));
        }
        throw new Error('Invalid operator: ' + op);
    }

    return false;
};

const matches = (query: ComparisonOperatorCondition, values: string | number | string[] | number[]): boolean => {
    const operators = Object.keys(query) as ComparisonOperator[];
    return operators.every((op) => isQueryValueMatch(op, query[op], values));
};

/**
 * Determines whether a field should be shown
 *
 * @param field
 * @param values
 */
export const shouldShowFormField = (field: FormField, values: { [key: string]: any }): boolean => {
    if (field.showWhen == null) return true;
    return Object.keys(field.showWhen).every((key) => matches(field.showWhen![key], values[key]));
};
