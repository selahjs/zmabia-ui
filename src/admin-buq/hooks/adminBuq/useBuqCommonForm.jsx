import React, { useState } from 'react';

const useBuqCommonForm = (initialValues) => {

    const [values, setValues] = useState(initialValues);

    const setInitialValues = () => {
        setValues({
            name: '',
            description: '',
            errors: []
        });
    };

    const setName = (name) => {
        setValues({
            ...values,
            name: name.trimStart()
        });
    };

    const setDescription = (description) => {
        setValues({
            ...values,
            description: description.trimStart()
        });
    };

    const setErrors = (errors) => {
        setValues({
            ...values,
            errors: errors
        });
    };

    const nameValidation = () => {
        if (!values.name) {
            setErrors(['This field is required']);
        }
    };

    const isSaveButtonDisabled = !values.name || values.errors.length;

    return { values, setValues, setInitialValues, setName, setDescription, setErrors, nameValidation, isSaveButtonDisabled };
}

export default useBuqCommonForm;
