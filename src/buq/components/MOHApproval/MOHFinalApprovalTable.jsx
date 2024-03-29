import React, { useMemo } from "react";
import Table from "../../../react-components/table/table";
import WebTooltip from "../../../react-components/modals/web-tooltip";
import { Link } from "react-router-dom";
import ResponsiveButton from "../../../react-components/buttons/responsive-button";
import useLocalStorage from "../../../react-hooks/useLocalStorage";
import {STORAGE_MOH_APPROVAL_PARAMS} from "../../utils/constants";
import { addThousandsSeparatorsForStrings } from '../../utils/helpers';

const MOHApprovalTable = ({ data, redirectUrl, districtLvl = false }) => {
    const { storedItems: { mohApprovalParams }, handleSaveInLocalStorage } = useLocalStorage();

    const columns = useMemo(
        () => [
            {
                Header: () => (
                    <div className="header-moh-approve-status-icon">
                        <div>Status</div>
                        <WebTooltip
                            shouldDisplayTooltip={true}
                            tooltipContent={"All facilities have reported in this period"}
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
                Header: `${districtLvl ? "District" : "Facility Name"}`,
                accessor: `${districtLvl ? "district" : "facilityName"}`,
            },
            {
                Header: "Facility Type",
                accessor: "facilityType",
            },
            {
                Header: "Pharmaceuticals",
                accessor: "pharmaceuticals",
                Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
            },
            {
                Header: "Medical supplies & Equipment",
                accessor: "medicalSupplies",
                Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
            },
            {
                Header: "Radiology (x-rays consumables)",
                accessor: "radiology",
                Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
            },
            {
                Header: "Diagnostics supplies & Equipment",
                accessor: "diagnosticsSupplies",
                Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
            },
            {
                Header: "Dental supplies & Equipment",
                accessor: "dentalSupplies",
                Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ row: { values } }) => {
                    if (districtLvl) {
                        handleSaveInLocalStorage(STORAGE_MOH_APPROVAL_PARAMS, {
                            forecastingPeriodId: mohApprovalParams?.forecastingPeriodId,
                            programId: mohApprovalParams?.programId,
                            region: mohApprovalParams?.region,
                            district: values.district
                        })
                    }
                    return (
                        <Link to={`${redirectUrl}/${data.facilityId}/${values.id}`}>
                            <ResponsiveButton className="proceed">
                                <span>View</span>
                            </ResponsiveButton>
                        </Link>
                    )
                },
            },
        ],
        []
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
