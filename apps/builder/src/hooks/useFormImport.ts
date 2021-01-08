import { FormDefinition } from '@team-apollo-forms/core';
import produce from 'immer';
import { Dispatch, SetStateAction } from 'react';
import { uuid } from '../utils/id';

const useFormImportExport = (formDef: FormDefinition, setFormDef: Dispatch<SetStateAction<FormDefinition>>) => {
    const exportForm = () => {
        // Bump version
        const currVersion = formDef.version || 0;
        const newVersion = currVersion + 1;
        const UUID = formDef.uuid || uuid();
        setFormDef((formDef) => {
            return produce(formDef, (newFormDef) => {
                newFormDef.version = newVersion;
                newFormDef.uuid = UUID;
            });
        });
        const toExport = { ...formDef, version: newVersion, uuid: UUID };

        // Build and download file
        let filename = 'export.json';
        let contentType = 'application/json;charset=utf-8;';
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(toExport, null, 4));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const importForm = (files: FileList) => {
        if (!files.length) {
            return;
        }
        let file = files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            const json = e.target.result as string;
            const formDef = JSON.parse(json);
            setFormDef(formDef);

            // TODO handle error and validate form definition
        };
        reader.readAsText(file);
    };

    return { exportForm, importForm };
};

export default useFormImportExport;
