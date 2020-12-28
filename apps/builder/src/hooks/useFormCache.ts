import { FormDefinition } from '@team-apollo-forms/core';
import { useEffect, useState } from 'react';

export const storeForm = async (data: FormDefinition) => {
    const cache = await caches.open('json-cache');
    await cache.put(
        '/myform',
        new Response(JSON.stringify(data), {
            headers: {
                'content-type': 'application/json',
            },
        })
    );
};

export const getForm = async () => {
    const cache = await caches.open('json-cache');
    return cache.match('/myform');
};

const useFormCache = () => {
    const [formDef, setFormDef] = useState<FormDefinition>();

    // Store form on cache change
    useEffect(() => {
        if (!formDef) return;
        storeForm(formDef);
    }, [formDef]);

    // Initialize form to default
    useEffect(() => {
        getForm()
            .then((result) => result.json())
            .then((json) => {
                console.log('JSON:', json);
                setFormDef(json);
            })
            .catch((err) => {
                setFormDef({
                    intro: null,
                    outro: null,
                    sections: [
                        {
                            fields: [],
                        },
                    ],
                });
            });
    }, []);

    return { formDef, setFormDef };
};

export default useFormCache;
