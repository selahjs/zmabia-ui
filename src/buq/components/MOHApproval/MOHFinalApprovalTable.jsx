import React, { useMemo, useState } from "react";
import Table from "../../../react-components/table/table";
import WebTooltip from "../../../react-components/modals/web-tooltip";
import { Link } from "react-router-dom";
import ResponsiveButton from "../../../react-components/buttons/responsive-button";
import Checkbox from '../../../react-components/inputs/checkbox';

const MOHApprovalTable = ({ data, redirectUrl, handleSetData }) => {
    const [selectedCheckbox, setSelectedCheckbox] = useState(false);

    const checkAllCheckboxes = (checkData) => {
        if (checkData.length) {
            const allCheckboxesAreSelected = checkData.every(
                (item) => item.checkbox === true
            );
            setSelectedCheckbox(allCheckboxesAreSelected);
        } else {
            setSelectedCheckbox(false);
        }
    }

    const toggleAllCheckboxes = (value) => {
        setSelectedCheckbox(value);
        const updatedData = data.map((obj) => ({...obj, checkbox: value}));

        handleSetData(updatedData);
        checkAllCheckboxes(updatedData);
    };

    const toggleRowCheckbox = (value, row) => {
        const updatedData = data.map((obj) => {
            if (obj.idCheckbox === row.idCheckbox) {
                return { ...obj, checkbox: value };
            }
            return { ...obj };
        });

        handleSetData(updatedData);
        checkAllCheckboxes(updatedData);
    };

    const columns = useMemo(
        () => [
            {
                Header: () => (
                    <div className="prepare-buq-table-actions">
                        <Checkbox
                            checked={selectedCheckbox}
                            name="toggleAllCheckboxes"
                            onClick={(value) => toggleAllCheckboxes(value)}
                        />
                    </div>
                ),
                accessor: 'checkbox',
                Cell: ({ row }) => (
                    <div className="prepare-buq-table-actions">
                        <Checkbox
                            checked={row.original.checkbox}
                            name={row.original.id}
                            onClick={(value) => toggleRowCheckbox(value, row.original)}
                        />
                    </div>
                ),
            },
            {
                Header: () => (
                    <div className="header-moh-approve-status-icon">
                        <div>Status</div>
                        <WebTooltip
                            tooltipContent={"All facilities have reported in this period"}
                            shouldDisplayTooltip={true}
                        >
                            <i className="fa fa-info-circle"></i>
                        </WebTooltip>
                    </div>
                ),
                accessor: "status",
                Cell: () => (
                    <div className="fa-check-container">
                        <i className="fa fa-check"></i>
                    </div>
                ),
            },
            {
                Header: "Facility Name",
                accessor: "facilityName",
            },
            {
                Header: "Facility Type",
                accessor: "facilityType",
            },
            {
                Header: "Pharmaceuticals",
                accessor: "calculatedGroupsCosts.pharmaceuticals",
            },
            {
                Header: "Medical supplies & Equipment",
                accessor: "calculatedGroupsCosts.medicalSupplies",
            },
            {
                Header: "Radiology (x-rays consumables)",
                accessor: "calculatedGroupsCosts.radiology",
            },
            {
                Header: "Diagnostics supplies & Equipment",
                accessor: "calculatedGroupsCosts.diagnosticsSupplies",
            },
            {
                Header: "Dental supplies & Equipment",
                accessor: "calculatedGroupsCosts.dentalSupplies",
            },
            {
                Header: "Actions",
                accessor: "buq.id",
                Cell: ({ row: { values } }) => {
                    return (
                        <Link to={`${redirectUrl}/${values["buq.id"]}`}>
                            <ResponsiveButton className="proceed">
                                <span>View</span>
                            </ResponsiveButton>
                        </Link>
                    )
                },
            },
        ],
        [data]
    );

    return (
        <Table
            columns={columns}
            data={data ?? []}
            noItemsMessage="No reports available"
            customReactTableStyle="moh-approve-buq"
            customReactTableContentStyle='moh-approve-buq-content'
        />
    );
};

export default MOHApprovalTable;
