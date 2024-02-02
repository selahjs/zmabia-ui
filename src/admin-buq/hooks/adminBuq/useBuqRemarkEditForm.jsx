import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import useBuqCommonForm from './useBuqCommonForm';
import useServerService from '../../../react-hooks/useServerService';

const useBuqRemarkEditForm = (remark, loadingModalService) => {
  const serverService = useServerService('adminBuq');
  const initialValues = {
    ...remark,
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
      ...remark,
      errors: []
    })
  }, [remark]);

  const submitEditRemark = (onSubmit) => {
    const remark = {
      id: values.id,
      name: values.name,
      description: values.description
    };

    loadingModalService.open();
    serverService.updateRemark(remark).then((updatedRemark) => {
      onSubmit(updatedRemark);
      toast.success('Remark has been edited successfully');
    }).finally(() => loadingModalService.close());
  };

  return { values, setName, setDescription, setErrors, nameValidation, submitEditRemark, isSaveButtonDisabled };
}

export default useBuqRemarkEditForm;
