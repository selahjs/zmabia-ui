import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import InputWithSuggestionsAndValidation from '../../../react-components/inputs/input-with-suggestions-and-validation';
import useBuqCommonFuncs from '../../../react-hooks/useBuqCommonFunctions';
import Table from '../../../react-components/table/table';
import ResponsiveButton from '../../../react-components/buttons/responsive-button';
import Checkbox from '../../../react-components/inputs/checkbox';
import ActionBar from '../../../react-components/ActionBar';
import Modal from '../../../admin-buq/components/Modal/Modal';
import ConfirmModalBody from '../../../react-components/ConfirmModalBody';
import { Link } from 'react-router-dom';
import { STORAGE_MOH_APPROVAL_PARAMS } from '../../utils/constants';
import WebTooltip from '../../../react-components/modals/web-tooltip';
import useGeographicZoneGroup from '../../../react-hooks/useGeographicZoneGroup';
import useServerService from '../../../react-hooks/useServerService';
import useLocalStorage from '../../../react-hooks/useLocalStorage';
import useCostCalculationRegion from '../../../react-hooks/useCostCalculationRegion';
import ModalErrorMessage from '../../../react-components/ModalErrorMessage';
import { addThousandsSeparatorsForStrings } from '../../utils/helpers';
import MOHApprovalTable from "./MOHApprovalTable";
import useCostCalculationDistrictOrFacility from "../../../react-hooks/useCostCalculationDistrictOrFacility";
import MOHFinalApprovalTable from "./MOHFinalApprovalTable";

const MohForFinalApproval = ({ loadingModalService, facilityService }) => {
    const { forecastingPeriodsParams } = useBuqCommonFuncs();
    const { geographicZoneParams } = useGeographicZoneGroup();

    const [noneSelectedGroup, setNoneSelectedGroup] = useState(false);
    const [noneSelectedForecastingPeriod, setNoneSelectedForecastingPeriod] =
        useState(false);
    const [group, setGroup] = useState();
    const [forecastingPeriodId, setForecastingPeriodId] = useState();
    const [data, setData] = useState([]);

    const buqService = useServerService('buqService');

    const { regionData, programId, fetchRegionData } = useCostCalculationRegion(
        group,
        forecastingPeriodId,
        loadingModalService
    );

    useEffect(() => {
        const groupValues = geographicZoneParams[0];
        if (group === undefined) {
            setGroup(groupValues)
        }
    }, [geographicZoneParams])

    const fetchBuqForFinalApproval = () => {
        console.log(programId, forecastingPeriodId, group);

        const elo = buqService.forFinalApproval(programId, forecastingPeriodId, group.value).then(function(response) {
                console.log(response);

                setData(response.content);
            });
    };

    const handleSearchButton = () => {
        if (!group) {
            setNoneSelectedGroup(true);
        }
        if (!forecastingPeriodId) {
            setNoneSelectedForecastingPeriod(true);
        }
        if (group && forecastingPeriodId) {
            fetchBuqForFinalApproval();
            // fetchRegionData();
        }
    };

    return (
        <>
            <h2 className="bottom-line">Consolidated Summary</h2>
            <div className="approve-buq-page-container">
                <div className="approve-buq-page-left">
                    <div className="approve-buq-select-section">
                        <div className="approve-buq-select">
                            <p className="is-required">Group</p>
                            <InputWithSuggestionsAndValidation
                                data={geographicZoneParams}
                                defaultValue={geographicZoneParams[0]}
                                displayValue="name"
                                placeholder="Select group"
                                onClick={(value) => {
                                    setGroup(value);
                                    setNoneSelectedGroup(false);
                                }}
                                isInvalid={noneSelectedGroup}
                                displayInformation={true}
                            />
                        </div>
                        <div className="approve-buq-select">
                            <p className="is-required">Forecasting period</p>
                            <InputWithSuggestionsAndValidation
                                data={forecastingPeriodsParams}
                                defaultValue={forecastingPeriodsParams.at(-1)}
                                displayValue="name"
                                placeholder="Select period"
                                onClick={(value) => {
                                    setForecastingPeriodId(value);
                                    setNoneSelectedForecastingPeriod(false);
                                }}
                                isInvalid={noneSelectedForecastingPeriod}
                                displayInformation={true}
                            />
                        </div>
                    </div>
                    <div className="approve-buq-button">
                        <button
                            className="primary"
                            type="button"
                            onClick={() => handleSearchButton()}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="approve-buq-page-container">
                    <MOHFinalApprovalTable
                        data={data}
                        redirectUrl={`/buq/national-approve/${group?.value}`}
                    />
                </div>
            </div>
            {/*<Modal*/}
            {/*    // isOpen={displayFinalApproveModal}*/}
            {/*    children={[*/}
            {/*        <ConfirmModalBody*/}
            {/*            // onConfirm={handleFinalApproveAction}*/}
            {/*            confirmMessage={*/}
            {/*                'Are you sure you want to approve this forecasting?'*/}
            {/*            }*/}
            {/*            // onCancel={() => setDisplayFinalApproveModal(false)}*/}
            {/*            confirmButtonText={'Approve'}*/}
            {/*        />,*/}
            {/*    ]}*/}
            {/*    sourceOfFundStyle={true}*/}
            {/*/>*/}
            {/*<ModalErrorMessage*/}
            {/*    isOpen={displayFinalApproveErrorModal}*/}
            {/*    customMessage="At least one pending approval needs to be selected"*/}
            {/*    onClose={() => setDisplayFinalApproveErrorModal(false)}*/}
            {/*/>*/}
            {/*<ActionBar*/}
            {/*    onFinalApproveAction={() => setDisplayFinalApproveModal(true)}*/}
            {/*    finalApproveButton={true}*/}
            {/*    cancelButton={false}*/}
            {/*    totalCostInformation={false}*/}
            {/*    sourceOfFundButton={false}*/}
            {/*/>*/}
        </>
    );
};

export default MohForFinalApproval;
