import React from 'react';
import useBuqRemarkEditForm from '../../hooks/adminBuq/useBuqRemarkEditForm';
import AdminBuqForm from '../AdminBuqForm/AdminBuqForm';

const AdminBuqRemarksEditForm = ({ remark, onSubmit, onCancel, loadingModalService }) => {
  const {
    values,
    setName,
    setDescription,
    setErrors,
    nameValidation,
    submitEditRemark,
    isSaveButtonDisabled
  } = useBuqRemarkEditForm(remark, loadingModalService);

  return <AdminBuqForm
    title='Edit remark'
    submitText='Save'
    values={values}
    setName={setName}
    setErrors={setErrors}
    nameValidation={nameValidation}
    setDescription={setDescription}
    onCancel={onCancel}
    isSaveButtonDisabled={isSaveButtonDisabled}
    onSubmit={onSubmit}
    onSubmitHandler={submitEditRemark}
  />
}

export default AdminBuqRemarksEditForm;
