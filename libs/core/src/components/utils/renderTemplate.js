export var renderTemplate = function(template, data) {
  return template.replace(/\$\{(\w+)\}/g, function(_, name) {
    return data[name] || '';
  });
};
//# sourceMappingURL=renderTemplate.js.map
