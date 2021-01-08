import { FormDefinition } from '@team-apollo-forms/core';
import { useEffect, useState } from 'react';
import { uuid } from '../utils/id';

const CACHE_NAME = 'json-cache';
const FORM_URL = '/myform';

export const storeForm = async (data: FormDefinition) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(FORM_URL, new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } }));
};

export const getForm = async () => {
    const cache = await caches.open(CACHE_NAME);
    return cache.match(FORM_URL);
};

const useFormCache = () => {
    const [formDef, setFormDef] = useState<FormDefinition>();

    // Store form in cache on change
    useEffect(() => {
        if (!formDef) return;
        storeForm(formDef);
    }, [formDef]);

    // Initialize form from cache
    useEffect(() => {
        getForm()
            .then((result) => result.json())
            .then((json) => setFormDef(json))
            .catch((_) => {
                setFormDef({
                    uuid: uuid(),
                    version: 0,
                    sections: [
                        {
                            title: 'My New Form',
                            fields: [],
                        },
                    ],
                });
            });
    }, []);

    return { formDef, setFormDef };
};

export default useFormCache;
