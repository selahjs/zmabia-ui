import React from 'react';
import { toast } from 'react-toastify';
import useBuqCommonForm from './useBuqCommonForm';
import useServerService from '../../../react-hooks/useServerService';

const useBuqRemarkAddForm = (loadingModalService) => {
  const serverService = useServerService('adminBuq');
  const initialValues = {
    name: '',
    description: '',
    errors: []
  };

  const {
    values,
    setInitialValues,
    setName,
    setDescription,
    setErrors,
    nameValidation,
    isSaveButtonDisabled
  } = useBuqCommonForm(initialValues);

  const submitAddRemark = (onSubmit) => {
    const remark = {
      name: values.name,
      description: values.description
    };

    loadingModalService.open();
    serverService.addRemark(remark).then((addedRemark) => {
      onSubmit(addedRemark);
      setInitialValues();
      toast.success('Remark has been created successfully');
    }).finally(() => loadingModalService.close());
  };

  return { values, setInitialValues, setName, setDescription, setErrors, nameValidation, submitAddRemark, isSaveButtonDisabled };
}

export default useBuqRemarkAddForm;
