import React from 'react';
import useBuqSourceOfFundAddForm from '../../hooks/adminBuq/useBuqSourceOfFundAddForm';
import AdminBuqForm from '../AdminBuqForm/AdminBuqForm';

const AdminBuqSourceOfFundAddForm = ({ onSubmit, onCancel, loadingModalService }) => {
  const {
    values,
    setInitialValues,
    setName,
    setDescription,
    setErrors,
    nameValidation,
    submitAddSourceOfFund,
    isSaveButtonDisabled
  } = useBuqSourceOfFundAddForm(loadingModalService);

  return <AdminBuqForm
    title='Create Source of Fund'
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
    onSubmitHandler={submitAddSourceOfFund}
  />
}

export default AdminBuqSourceOfFundAddForm;