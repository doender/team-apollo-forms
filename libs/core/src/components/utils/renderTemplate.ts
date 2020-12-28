export const renderTemplate = (template: string | undefined, data: { [key: string]: string }) =>
    template && template.replace(/\$\{(\w+)\}/g, (_, name) => data[name] || '');
