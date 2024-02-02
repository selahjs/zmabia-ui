import React from 'react';
import { toast } from 'react-toastify';
import useServerService from '../../../react-hooks/useServerService';
import AdminBuqDeleteForm from '../AdminBuqForm/AdminBuqDeleteForm';

const AdminBuqRemarksDeleteForm = ({ onSubmit, onCancel, remark, loadingModalService }) => {

    const serverService = useServerService('adminBuq');

    const submitDeleteRemark = () => {
        loadingModalService.open();
        serverService.removeRemark(remark).then(() => {
            onSubmit();
            toast.success('Remark has been deleted successfully');
          }).finally(() => loadingModalService.close());
    }

    return (
        <AdminBuqDeleteForm
            submitDelete={submitDeleteRemark}
            onCancel={onCancel}
            confirmMessage={`Are you sure you want to delete "${remark?.name}" Remark?`}/>
    );
}

export default AdminBuqRemarksDeleteForm;
