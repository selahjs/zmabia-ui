/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Fundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

import React, { useMemo, useState } from 'react';
import Table from '../../../react-components/table/table';
import Modal from '../Modal/Modal';
import ResponsiveButton from '../../../react-components/buttons/responsive-button';
import AdminBuqSourceOfFundEditForm from './AdminBuqSourcesOfFundEditForm';
import AdminBuqSourceOfFundAddForm from './AdminBuqSourceOfFundAddForm';
import AdminBuqSourceOfFundDeleteForm from './AdminBuqSourceOfFundDeleteForm';
import BreakableCell from '../../../react-components/BreakableCell';

const AdminBuqSourcesOfFunds = ({ sourcesOfFunds, loadingModalService }) => {
    const [sourceOfFundParams, setSourceOfFundParams] = useState(sourcesOfFunds);
    const [displayAddModal, setDisplayAddModal] = useState(false);
    const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
    const [sourceOfFundToDelete, setSourceOfFundToDelete] = useState({});
    const [displayEditModal, setDisplayEditModal] = useState(false);
    const [sourceOfFundToEdit, setSourceOfFundToEdit] = useState({});

    const addNewSoF = (sourceOfFund) => {
        setSourceOfFundParams([ ...sourceOfFundParams, sourceOfFund]);
    };

    const deleteSourceOfFund = () => {
        setSourceOfFundParams(sourceOfFundParams.filter((sourceOfFund) => sourceOfFund.id !== sourceOfFundToDelete.id));
    };

    const toggleAddModal = () => {
        setDisplayAddModal(!displayAddModal);
    };

    const toggleDeleteModal = (sourceOfFund) => {
        setDisplayDeleteModal(!displayDeleteModal);
        setSourceOfFundToDelete(sourceOfFund);
    };

    const onSubmitAdd = (newSourceOfFund) => {
        addNewSoF(newSourceOfFund);
        toggleAddModal();
    };

    const onSubmitDelete = () => {
        toggleDeleteModal({});
        deleteSourceOfFund();
    };

    const updateSourceOfFund = (updatedSourceOfFund) => {
        const sourcesOfFunds = sourceOfFundParams.map((sourceOfFund) => {
            if (sourceOfFund.id === updatedSourceOfFund.id) {
                return updatedSourceOfFund;
            }
            return sourceOfFund;
        });

        setSourceOfFundParams(sourcesOfFunds);
    };

    const toggleEditModal = (sourceOfFund) => {
        setDisplayEditModal(!displayEditModal);
        setSourceOfFundToEdit(sourceOfFund);
    };

    const onSubmitEdit = (updatedSourceOfFund) => {
        toggleEditModal();
        updateSourceOfFund(updatedSourceOfFund);
    };

    const columns = useMemo(
        () => [
            {
                Header: 'Source Of Fund',
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
        [sourceOfFundParams]
    );

    return (
        <div className='admin-buq-row'>
            <div className='admin-buq-main'>
                <div className='admin-buq-table-header'>
                    <button
                        className='add admin-buq-table-add-button'
                        onClick={toggleAddModal}
                    >
                        Add Source of Fund
                    </button>
                </div>
                <Table
                    columns={columns}
                    data={sourceOfFundParams}
                />
            </div>
            <Modal
                isOpen={displayAddModal}
                children={[
                    <AdminBuqSourceOfFundAddForm
                        onSubmit={onSubmitAdd}
                        onCancel={toggleAddModal}
                        loadingModalService={loadingModalService}
                    />
                ]}
            />
            <Modal
                isOpen={displayDeleteModal}
                children={[
                    <AdminBuqSourceOfFundDeleteForm
                        onSubmit={onSubmitDelete}
                        onCancel={() => toggleDeleteModal({})}
                        sourceOfFund={sourceOfFundToDelete}
                        loadingModalService={loadingModalService}
                    />
                ]}
            />
            <Modal
                isOpen={displayEditModal}
                children={[
                    <AdminBuqSourceOfFundEditForm
                        onSubmit={onSubmitEdit}
                        onCancel={() => toggleEditModal({})}
                        sourceOfFund={sourceOfFundToEdit}
                        loadingModalService={loadingModalService}
                    />
                ]}
            />
        </div>
    );
}

export default AdminBuqSourcesOfFunds;
