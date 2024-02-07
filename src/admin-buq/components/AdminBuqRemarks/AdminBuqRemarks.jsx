/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

import React, { useMemo, useState } from 'react';
import Modal from '../Modal/Modal';
import Table from '../../../react-components/table/table';
import ResponsiveButton from '../../../react-components/buttons/responsive-button';
import AdminBuqRemarksAddForm from './AdminBuqRemarksAddForm';
import AdminBuqRemarksDeleteForm from './AdminBuqRemarksDeleteForm';
import AdminBuqRemarksEditForm from './AdminBuqRemarksEditForm';
import BreakableCell from '../../../react-components/BreakableCell';

const AdminBuqRemarks = ({ remarks, loadingModalService }) => {
    const [remarkParams, setRemarkParams] = useState(remarks);
    const [displayAddModal, setDisplayAddModal] = useState(false);
    const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
    const [displayEditModal, setDisplayEditModal] = useState(false);
    const [remarkToEdit, setRemarkToEdit] = useState({});
    const [remarkToDelete, setRemarkToDelete] = useState({});

    const addNewRemark = (remark) => {
        setRemarkParams([...remarkParams, remark]);
    };

    const updateRemark = (updatedRemark) => {
        const updatedRemarks = remarkParams.map((remark) => {
            if (remark.id === updatedRemark.id) {
                return updatedRemark;
            }
            return remark;
        });

        setRemarkParams(updatedRemarks);
    };

    const deleteRemark = () => {
        setRemarkParams(remarkParams.filter((remark) => remark.id !== remarkToDelete.id));
    };

    const toggleAddModal = () => {
        setDisplayAddModal(!displayAddModal);
    };

    const toggleEditModal = (remark) => {
        setDisplayEditModal(!displayEditModal);
        setRemarkToEdit(remark);
    };

    const toggleDeleteModal = (remark) => {
        setDisplayDeleteModal(!displayDeleteModal);
        setRemarkToDelete(remark);
    };

    const onSubmitAdd = (newRemark) => {
        addNewRemark(newRemark);
        toggleAddModal();
    };

    const onSubmitEdit = (updatedRemark) => {
        toggleEditModal({});
        updateRemark(updatedRemark);
    }

    const onSubmitDelete = () => {
        toggleDeleteModal({});
        deleteRemark();
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Remark',
                accessor: 'name',
                Cell: ({ cell }) => <BreakableCell cell={cell} />
            },
            {
                Header: 'Description',
                accessor: 'description',
                Cell: ({ cell }) => <BreakableCell cell={cell} />
            },
            {
                Header: 'Actions',
                accessor: 'id',
                Cell: ({ row }) => (
                    <div className='admin-buq-table-actions'>
                        <ResponsiveButton
                            className={`${!row.original.editable && 'disabled-button'}`}
                            onClick={() => toggleEditModal(row.original)}
                            disabled={!row.original.editable}
                            >
                            Edit
                        </ResponsiveButton>
                        <ResponsiveButton
                            className={`danger ${!row.original.editable && 'disabled-button'}`}
                            onClick={() => toggleDeleteModal(row.original)}
                            disabled={!row.original.editable}
                            >
                            Delete
                        </ResponsiveButton>
                    </div>
                )
            },
        ],
        [remarkParams]
    );

    return (
        <div className='admin-buq-row'>
            <div className='admin-buq-main'>
                <div className='admin-buq-table-header'>
                    <button
                        className='add admin-buq-table-add-button'
                        onClick={toggleAddModal}
                    >
                        Add Remark
                    </button>
                </div>
                <Table
                    columns={columns}
                    data={remarkParams}
                />
            </div>
            <Modal
                isOpen={displayAddModal}
                children={[
                    <AdminBuqRemarksAddForm
                        onSubmit={onSubmitAdd}
                        onCancel={toggleAddModal}
                        loadingModalService={loadingModalService}
                    />
                ]}
            />
            <Modal
                isOpen={displayDeleteModal}
                children={[
                    <AdminBuqRemarksDeleteForm
                        onSubmit={onSubmitDelete}
                        onCancel={() => toggleDeleteModal({})}
                        remark={remarkToDelete}
                        loadingModalService={loadingModalService}
                    />
                ]}
            />
            <Modal
                isOpen={displayEditModal}
                children={[
                    <AdminBuqRemarksEditForm
                        onSubmit={onSubmitEdit}
                        onCancel={() => toggleEditModal({})}
                        remark={remarkToEdit}
                        loadingModalService={loadingModalService}
                    />
                ]}
            />
        </div>
    );
}

export default AdminBuqRemarks;
