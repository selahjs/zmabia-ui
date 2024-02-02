import React from 'react';
import { toast } from 'react-toastify';
import useServerService from '../../../react-hooks/useServerService';
import AdminBuqDeleteForm from '../AdminBuqForm/AdminBuqDeleteForm';

const AdminBuqSourceOfFundDeleteForm = ({ onSubmit, onCancel, sourceOfFund, loadingModalService }) => {

    const serverService = useServerService('adminBuq');

    const submitDeleteSourcesOfFund = () => {
        loadingModalService.open();
        serverService.removeSourceOfFund(sourceOfFund).then(() => {
            onSubmit();
            toast.success('Source of Fund has been deleted successfully');
          }).finally(() => loadingModalService.close());
    }

    return (
        <AdminBuqDeleteForm
            submitDelete={submitDeleteSourcesOfFund}
            onCancel={onCancel}
            confirmMessage={`Are you sure you want to delete "${sourceOfFund?.name}" Source of Fund?`}/>
    );
}

export default AdminBuqSourceOfFundDeleteForm;
