import React from 'react';
import useBuqRemarkAddForm from '../../hooks/adminBuq/useBuqRemarkAddForm';
import AdminBuqForm from '../AdminBuqForm/AdminBuqForm';

const AdminBuqRemarksAddForm = ({ onSubmit, onCancel, loadingModalService }) => {
  const {
    values,
    setInitialValues,
    setName,
    setDescription,
    setErrors,
    nameValidation,
    submitAddRemark,
    isSaveButtonDisabled
  } = useBuqRemarkAddForm(loadingModalService);

  return <AdminBuqForm
    title='Create remark'
    submitText='Create'
    values={values}
    setName={setName}
    setErrors={setErrors}
    nameValidation={nameValidation}
    setDescription={setDescription}
    onCancel={() => {
      onCancel();
      setInitialValues();
    }}
    isSaveButtonDisabled={isSaveButtonDisabled}
    onSubmit={onSubmit}
    onSubmitHandler={submitAddRemark}
  />
}

export default AdminBuqRemarksAddForm;
