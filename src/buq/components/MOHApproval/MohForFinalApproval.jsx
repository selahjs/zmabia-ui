import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useBuqCommonFuncs from '../../../react-hooks/useBuqCommonFunctions';
import useGeographicZoneGroup from '../../../react-hooks/useGeographicZoneGroup';
import useServerService from '../../../react-hooks/useServerService';
import useCostCalculationRegion from '../../../react-hooks/useCostCalculationRegion';
import MOHFinalApprovalTable from "./MOHFinalApprovalTable";
import DetailsBlock from '../../../react-components/DetailsBlock';
import MOHSearchBuq from "./MOHSearchBuq";
import MOHActionBarFinalApprove from "./MOHActionBarFinalApprove";

const MohForFinalApproval = ({ loadingModalService, facilityService }) => {
    const { forecastingPeriodsParams } = useBuqCommonFuncs();
    const { geographicZoneParams } = useGeographicZoneGroup();

    const [group, setGroup] = useState();
    const [forecastingPeriodId, setForecastingPeriodId] = useState();
    const [data, setData] = useState([]);
    const [buqsData, setBuqsData] = useState([]);
    const [displayFinalApproveModal, setDisplayFinalApproveModal] = useState(false);
    const [displayFinalApproveErrorModal, setDisplayFinalApproveErrorModal] = useState(false);

    const buqService = useServerService('buqService');

    const { programId } = useCostCalculationRegion();

    useEffect(() => {
        const groupValues = geographicZoneParams[0];
        if (group === undefined) {
            setGroup(groupValues)
        }
    }, [geographicZoneParams]);

    useEffect(() => {
        if (buqsData.length) {
            combineData();
        }
    }, [buqsData]);

    const fetchBuqForFinalApproval = () => {
        loadingModalService.open();
        setBuqsData([]);
        setData([]);
        buqService.forFinalApproval(programId, forecastingPeriodId, group.value).then(function (response) {
            if (response.content.length) {
                setBuqsData(response.content);
            } else {
                loadingModalService.close();
            }
        })
    };

    const combineData = () => {
        let items = [];
        buqsData.map(async (buq, index) => {
            const facilityData = await facilityService.get(buq.bottomUpQuantification.facilityId);

            const calc = buq.calculatedGroupsCosts;

            const calculatedGroups = {
                pharmaceuticals: calc.Pharmaceuticals,
                medicalSupplies: calc['Medical supplies'],
                radiology: calc['Radiology (X-rays consumables)'],
                dentalSupplies: calc['Dental supplies'],
                diagnosticsSupplies: calc['Diagnostics supplies'],
                others: calc.Others,
            };

            items.push({
                buq,
                calculatedGroupsCosts: calculatedGroups,
                idCheckbox: `${buq.bottomUpQuantification.id}${buq.bottomUpQuantification.facilityId}`,
                facilityName: facilityData.name,
                facilityType: facilityData.type.name,
                key: index + buq.bottomUpQuantification.id,
            })

            setData(items);
            loadingModalService.close();
        })
    };

    const handleFinalApproveAction = () => {
        const buqToBeFinalApproved = data
            .filter((buq) => buq.checkbox === true)
            .flatMap((buq) => buq.buq.id);

        if (buqToBeFinalApproved.length) {
            loadingModalService.open();
            buqService
                .finalApproveBuq(buqToBeFinalApproved)
                .then(() => {
                    toast.success('Forecast has been approved successfully');
                    setDisplayFinalApproveModal(false);
                    setData(data.filter(
                        (item) => !buqToBeFinalApproved.includes(item.buq.id)
                    ))
                })
                .finally(() => loadingModalService.close());
        } else {
            setDisplayFinalApproveModal(false);
            setDisplayFinalApproveErrorModal(true);
        }
    };

    const detailsData = data[0]?.calculatedGroupsCosts !== undefined ? [
        [
            {
                topic: 'Others',
                value: data.length > 1
                    ? data?.reduce((total, buq) => {
                        if (buq.calculatedGroupsCosts !== undefined && total?.calculatedGroupsCosts !== undefined) {
                            return (parseInt(total.calculatedGroupsCosts.others) + parseInt(buq.calculatedGroupsCosts.others)).toFixed(2) + " USD"
                        }
                    })
                    : data[0].calculatedGroupsCosts.others
            },
            {
                topic: 'Pharmaceuticals',
                value: data.length > 1
                    ? data?.reduce((total, buq) => {
                        if (buq.calculatedGroupsCosts !== undefined && total?.calculatedGroupsCosts !== undefined) {
                            return (parseInt(total.calculatedGroupsCosts.pharmaceuticals) + parseInt(buq?.calculatedGroupsCosts?.pharmaceuticals)).toFixed(2) + " USD"
                        }
                    })
                    : data[0].calculatedGroupsCosts.pharmaceuticals
            },
            {
                topic: 'Medical supplies & Equipment',
                value: data.length > 1
                    ? data?.reduce((total, buq) => {
                        if (buq.calculatedGroupsCosts !== undefined && total?.calculatedGroupsCosts !== undefined) {
                            return (parseInt(total.calculatedGroupsCosts.medicalSupplies) + parseInt(buq?.calculatedGroupsCosts?.medicalSupplies)).toFixed(2) + " USD"
                        }
                    })
                    : data[0].calculatedGroupsCosts.medicalSupplies
            }
        ],
        [
            {
                topic: 'Radiology (x-rays consumables)',
                value: data.length > 1
                    ? data?.reduce((total, buq) => {
                        if (buq.calculatedGroupsCosts !== undefined && total?.calculatedGroupsCosts !== undefined) {
                            return (parseInt(total.calculatedGroupsCosts.radiology) + parseInt(buq?.calculatedGroupsCosts?.radiology)).toFixed(2) + " USD"
                        }
                    })
                    : data[0].calculatedGroupsCosts.radiology
            },
            {
                topic: 'Diagnostics supplies & Equipment',
                value: data.length > 1
                    ? data?.reduce((total, buq) => {
                        if (buq.calculatedGroupsCosts !== undefined && total?.calculatedGroupsCosts !== undefined) {
                            return (parseInt(total.calculatedGroupsCosts.diagnosticsSupplies) + parseInt(buq?.calculatedGroupsCosts?.diagnosticsSupplies)).toFixed(2) + " USD"
                        }
                    })
                    : data[0].calculatedGroupsCosts.diagnosticsSupplies
            },
            {
                topic: 'Quantification Period',
                value: data.length > 1
                    ? data?.reduce((total, buq) => {
                        if (buq.calculatedGroupsCosts !== undefined && total?.calculatedGroupsCosts !== undefined) {
                            return (parseInt(total.calculatedGroupsCosts.dentalSupplies) + parseInt(buq.calculatedGroupsCosts?.dentalSupplies)).toFixed(2) + " USD"
                        }
                    })
                    : data[0].calculatedGroupsCosts.dentalSupplies
            }
        ]
    ] : [];

    const handleSetData = (payload) => setData(payload);
    const handleSetGroup = (payload) => setGroup(payload);
    const handleSetForecastingPeriodId = (payload) => setForecastingPeriodId(payload);

    const handleSetDisplayFinalApproveModal = (payload) => setDisplayFinalApproveModal(payload);

    const handleSetDisplayFinalApproveErrorModal = (payload) => setDisplayFinalApproveErrorModal(payload);

    return (
        <>
            <h2 className="bottom-line">Consolidated Summary</h2>
            <div className="approve-buq-page-container">
                <MOHSearchBuq
                    geographicZoneParams={geographicZoneParams}
                    forecastingPeriodsParams={forecastingPeriodsParams}
                    group={group}
                    handleSetGroup={handleSetGroup}
                    forecastingPeriodId={forecastingPeriodId}
                    handleSetForecastingPeriodId={handleSetForecastingPeriodId}
                    fetchBuqs={fetchBuqForFinalApproval}
                />
                <div className="approve-buq-page-right">
                    {data[0]?.calculatedGroupsCosts !== undefined ?
                        <DetailsBlock
                            data={detailsData}
                            className='full-width'
                        />
                        : []
                    }
                    <MOHFinalApprovalTable
                        data={data[0]?.calculatedGroupsCosts !== undefined ? data : []}
                        redirectUrl={`/buq/national-approval`}
                        handleSetData={handleSetData}
                    />
                </div>
            </div>
            <MOHActionBarFinalApprove
                handleFinalApproveAction={handleFinalApproveAction}
                displayFinalApproveModal={displayFinalApproveModal}
                handleSetDisplayFinalApproveModal={handleSetDisplayFinalApproveModal}
                displayFinalApproveErrorModal={displayFinalApproveErrorModal}
                handleSetDisplayFinalApproveErrorModal={handleSetDisplayFinalApproveErrorModal}
            />
        </>
    );
};

export default MohForFinalApproval;
