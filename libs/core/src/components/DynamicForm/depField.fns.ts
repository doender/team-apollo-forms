import {
  ComparisonOperator,
  ComparisonOperatorClause,
  FormField,
} from './types';

const compare = <T extends number | string | boolean>(
  op: ComparisonOperator,
  a: T,
  b: T
): boolean => {
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

const isQueryValueMatch = <T extends number | string | boolean>(
  op: ComparisonOperator,
  queryValue: T | T[],
  value: T | T[]
): boolean => {
  if (Array.isArray(value) && !Array.isArray(queryValue)) {
    throw new Error(
      'If form field value is an array, showWhen query clause value should also be an array'
    );
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

const matches = (
  query: string | number | ComparisonOperatorClause,
  values: string | number | string[] | number[]
): boolean => {
  if (typeof query === 'string') {
    return (
      values === query ||
      (Array.isArray(values) && (values as string[]).includes(query))
    );
  } else if (typeof query === 'number') {
    return (
      values === query ||
      (Array.isArray(values) && (values as number[]).includes(query))
    );
  } else {
    const operators = Object.keys(query) as ComparisonOperator[];
    return operators.every((op) => isQueryValueMatch(op, query[op]!, values));
  }
};

/**
 * Determines whether a field should be shown
 *
 * @param field
 * @param values
 */
export const shouldShowFormField = (
  field: FormField,
  values: { [key: string]: any }
): boolean => {
  if (field.showWhen == null) return true;
  return Object.keys(field.showWhen).every((key) =>
    matches(field.showWhen![key], values[key])
  );
};
