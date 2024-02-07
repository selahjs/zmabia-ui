import React from 'react';
import useBuqSourceOfFundEditForm from '../../hooks/adminBuq/useBuqSourceOfFundEditForm';
import AdminBuqForm from '../AdminBuqForm/AdminBuqForm';

const AdminBuqSourceOfFundEditForm = ({ sourceOfFund, onSubmit, onCancel, loadingModalService }) => {
    const {
        values,
        setName,
        setDescription,
        setErrors,
        nameValidation,
        submitEditSourceOfFund,
        isSaveButtonDisabled
    } = useBuqSourceOfFundEditForm(sourceOfFund, loadingModalService);

    return <AdminBuqForm
        title='Edit Source of Fund'
        submitText='Save'
        values={values}
        setName={setName}
        setErrors={setErrors}
        nameValidation={nameValidation}
        setDescription={setDescription}
        onCancel={onCancel}
        isSaveButtonDisabled={isSaveButtonDisabled}
        onSubmit={onSubmit}
        onSubmitHandler={submitEditSourceOfFund}
    />
}

export default AdminBuqSourceOfFundEditForm;
