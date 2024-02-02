import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import useBuqCommonForm from './useBuqCommonForm';
import useServerService from '../../../react-hooks/useServerService';

const useBuqSourceOfFundEditForm = (sourceOfFund, loadingModalService) => {
    const serverService = useServerService('adminBuq');
    const initialValues = {
        ...sourceOfFund,
        errors: []
    }

    const {
        values,
        setValues,
        setName,
        setDescription,
        setErrors,
        nameValidation,
        isSaveButtonDisabled
    } = useBuqCommonForm(initialValues);

    useEffect(() => {
        setValues({
            ...sourceOfFund,
            errors: []
        })
    }, [sourceOfFund]);

    const submitEditSourceOfFund = (onSubmit) => {
        const sourceOfFund = {
            id: values.id,
            name: values.name,
            description: values.description
        };

        loadingModalService.open();
        serverService.updateSourceOfFund(sourceOfFund).then((updatedSourceOfFund) => {
            onSubmit(updatedSourceOfFund);
            toast.success('Source of Fund has been edited successfully');
        }).finally(() => loadingModalService.close());
    };

    return { values, setName, setDescription, setErrors, nameValidation, submitEditSourceOfFund, isSaveButtonDisabled };
}

export default useBuqSourceOfFundEditForm;
