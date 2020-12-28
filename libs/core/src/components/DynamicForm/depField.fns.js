var compare = function(op, a, b) {
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
var isQueryValueMatch = function(op, queryValue, value) {
  if (Array.isArray(value) && !Array.isArray(queryValue)) {
    throw new Error('If form field value is an array, showWhen query clause value should also be an array');
  }
  if (!Array.isArray(value) && !Array.isArray(queryValue)) {
    return compare(op, value, queryValue);
  } else if (!Array.isArray(value) && Array.isArray(queryValue)) {
    return queryValue.some(function(q) {
      return compare(op, value, q);
    });
  } else if (Array.isArray(value) && Array.isArray(queryValue)) {
    switch (op) {
      case '$eq':
      case '$in':
        return queryValue.some(function(q) {
          return value.includes(q);
        });
      case '$ne':
      case '$nin':
        return queryValue.some(function(q) {
          return !value.includes(q);
        });
    }
    throw new Error('Invalid operator: ' + op);
  }
  return false;
};
var matches = function(query, values) {
  if (typeof query === 'string') {
    return values === query || (Array.isArray(values) && values.includes(query));
  } else if (typeof query === 'number') {
    return values === query || (Array.isArray(values) && values.includes(query));
  } else {
    var operators = Object.keys(query);
    return operators.every(function(op) {
      return isQueryValueMatch(op, query[op], values);
    });
  }
};
/**
 * Determines whether a field should be shown
 *
 * @param field
 * @param values
 */
export var shouldShowFormField = function(field, values) {
  if (field.showWhen == null) return true;
  return Object.keys(field.showWhen).every(function(key) {
    return matches(field.showWhen[key], values[key]);
  });
};
//# sourceMappingURL=depField.fns.js.map
