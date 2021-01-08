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
        try {
            // Do something with form values
        } catch (err) {
            throw new Error('This will be displayed as an error message');
        }
    };

    return (
        <DynamicForm
            formDefinition={formDef}
            controls={MaterialUiControls}
            onSubmit={onSubmit}
            showAfterSubmit={() => <div>Thank you!</div>}
        />
    );
}

export default App;
```

## `DynamicForm` props

### `formDefinition: FormDefinition`

The JSON file exported from the Form Builder.

### `controls: FormControls`

The form control components to be displayed. Typically, you'd use one of the available packages `@team-apollo-forms/material-ui`, `@team-apollo-forms/chakra-ui` and `@team-apollo-forms/antd`, but you can also use your own. See [this file](libs/material-ui/src/controls.tsx) for the Material UI example.

_Note: Please leave a PR when you've implemented another UI library!_

### `onSubmit: (values: { [key: string]: any }) => Promise<void>`

Callback to handle the submitted form values, e.g. sending them to your API. Any error thrown here will be shown as an error message.

### `showAfterSubmit: (form: FormikProps<any>) => React.ReactChild`

The component to be displayed after a successful form submission

### `locale?: FormLocale`

Right now both `en` and `nl` are supported. If no locale is passed `en` is used by default. You can also use your own: see [this file](libs/core/src/locales.ts) for an example.

_Note: Please leave a PR when you've implemented another locale!_

### `placeholders?: { [key: string]: (form: FormikProps<any>) => React.ReactChild; }`

In the Form Builder you can add placeholders, which you can fill with any component you'd like. This is handy for displaying things like images and video _between_ questions. You can also let these depend on the form state and its values:

```tsx
<DynamicForm
    formDefinition={formDef}
    controls={MaterialUiControls}
    onSubmit={onSubmit}
    placeholders={{
        placeholder1: () => <img src="path/to/1.jpg" />,
        placeholder2: form => form.values.field1 === 'X' ? <div>Displayed when field1 is X</div> : null

            }
        }
    }
/>
```

## Runing the form builder locally

Run `nx serve builder` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.
