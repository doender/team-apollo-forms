# Team Apollo Forms

Fully customizable forms in your React app, using your favorite UI component library, built on top of Formik and Yup.

## Features

-   Online WYSIWYG form builder
-   Supports Material UI, Chakra UI, Ant Design or your own components
-   Customizable locales

## Quickstart

Use the online form builder at https://doender.github.io/team-apollo-forms/ to create your form and export it as JSON.

Install the core library and one of the UI control libraries (`material-ui`, `chara-ui`, `antd`):

```sh
npm i @team-apollo-forms/core @team-apollo-forms/material-ui
```

and use the exported form definition file:

```tsx
import React from 'react';

import { MaterialUiControls } from '@team-apollo-forms/material-ui';
import { DynamicForm, FormDefinition } from '@team-apollo-forms/core';

import formDef from './forms/form.json';

function App() {
    const onSubmit = async (values) => {
        // Do something with form values
    };

    return (
        <DynamicForm
            formDefinition={formDef}
            UiControls={MaterialUiControls}
            onSubmit={onSubmit}
            onAfterSubmit={() => <div>Thank you!</div>}
        />
    );
}

export default App;
```

## Runing the form builder locally

Run `nx serve builder` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.
