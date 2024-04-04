import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import useBuqCommonFuncs from '../../../react-hooks/useBuqCommonFunctions';
import Table from '../../../react-components/table/table';
import ResponsiveButton from '../../../react-components/buttons/responsive-button';
import Checkbox from '../../../react-components/inputs/checkbox';
import { Link } from 'react-router-dom';
import { STORAGE_MOH_APPROVAL_PARAMS } from '../../utils/constants';
import WebTooltip from '../../../react-components/modals/web-tooltip';
import useGeographicZoneGroup from '../../../react-hooks/useGeographicZoneGroup';
import useServerService from '../../../react-hooks/useServerService';
import useLocalStorage from '../../../react-hooks/useLocalStorage';
import useCostCalculationRegion from '../../../react-hooks/useCostCalculationRegion';
import { addThousandsSeparatorsForStrings } from '../../utils/helpers';
import MOHSearchBuq from "./MOHSearchBuq";
import MOHActionBarFinalApprove from "./MOHActionBarFinalApprove";

const MOHApproveRegionBuq = ({ loadingModalService }) => {
  const { forecastingPeriodsParams } = useBuqCommonFuncs();
  const { geographicZoneParams } = useGeographicZoneGroup();

  const [group, setGroup] = useState();
  const [forecastingPeriodId, setForecastingPeriodId] = useState();
  const [data, setData] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState(false);
  const [displayFinalApproveModal, setDisplayFinalApproveModal] = useState(false);
  const [displayFinalApproveErrorModal, setDisplayFinalApproveErrorModal] = useState(false);

  const buqService = useServerService('buqService');

  useEffect(() => {
    const groupValues = geographicZoneParams[0];
    if (group === undefined) {
      setGroup(groupValues)
    }
  }, [geographicZoneParams])

  const { regionData, programId, fetchRegionData } = useCostCalculationRegion(
    group,
    forecastingPeriodId,
    loadingModalService
  );

    const { handleSaveInLocalStorage } = useLocalStorage();

    useEffect(() => {
        if (regionData) {
            setData(regionData);
        }
    }, [regionData]);

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
    const updatedData = data.map((obj) => ({ ...obj, checkbox: value }));
    setData(updatedData);
    checkAllCheckboxes(updatedData);
  };

  const toggleRowCheckbox = (value, row) => {
    const updatedData = data.map((obj) => {
      if (obj.idCheckbox === row.idCheckbox) {
        return { ...obj, checkbox: value };
      }
      return { ...obj };
    });

    setData(updatedData);
    checkAllCheckboxes(updatedData);
  };

  const handleFinalApproveAction = () => {
    const buqToBeFinalApproved = data
      .filter((buq) => buq.checkbox === true)
      .flatMap((buq) => buq.buqIdsToBeApproved);

    if (buqToBeFinalApproved.length) {
      loadingModalService.open();
      buqService
        .finalApproveBuq(buqToBeFinalApproved)
        .then(() => {
          toast.success('Forecast has been approved successfully');
          setDisplayFinalApproveModal(false);
          setData(data.filter(
            (item) => !buqToBeFinalApproved.includes(item.buqIdsToBeApproved[0])
          ))
        })
        .finally(() => loadingModalService.close());
    } else {
      setDisplayFinalApproveModal(false);
      setDisplayFinalApproveErrorModal(true);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: () => (
          <div className="prepare-buq-table-actions">
            <Checkbox
              name="toggleAllCheckboxes"
              checked={selectedCheckbox}
              onClick={(value) => toggleAllCheckboxes(value)}
            />
          </div>
        ),
        accessor: 'checkbox',
        Cell: ({ row }) => (
          <div className="prepare-buq-table-actions">
            <Checkbox
              name={row.original.id}
              checked={row.original.checkbox}
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
              shouldDisplayTooltip={true}
              tooltipContent={'All facilities have reported in this period'}
            >
              <i className="fa fa-info-circle"></i>
            </WebTooltip>
          </div>
        ),
        accessor: 'status',
        Cell: () => (
          <div className="fa-check-container">
            <i className="fa fa-check"></i>
          </div>
        ),
      },
      {
        Header: 'Region',
        accessor: 'region',
      },
      {
        Header: 'Facility Type',
        accessor: 'facilityType',
      },
      {
        Header: 'Pharmaceuticals',
        accessor: 'pharmaceuticals',
        Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
      },
      {
        Header: 'Medical supplies & Equipment',
        accessor: 'medicalSupplies',
        Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
      },
      {
        Header: 'Radiology (x-rays consumables)',
        accessor: 'radiology',
        Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
      },
      {
        Header: 'Diagnostics supplies & Equipment',
        accessor: 'diagnosticsSupplies',
        Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
      },
      {
        Header: 'Dental supplies & Equipment',
        accessor: 'dentalSupplies',
        Cell: ({ value }) => addThousandsSeparatorsForStrings(value),
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: ({ row }) => {
          const { values } = row;
          handleSaveInLocalStorage(STORAGE_MOH_APPROVAL_PARAMS, {
            forecastingPeriodId,
            programId,
            region: values.region,
          });

          return (
            <Link to={`/buq/national-approve/${values.id}`}>
              <ResponsiveButton className="proceed">
                <span>View</span>
              </ResponsiveButton>
            </Link>
          );
        },
      },
    ],
    [data, selectedCheckbox]
  );
    const handleSetGroup = (payload) => setGroup(payload);
    const handleSetForecastingPeriodId = (payload) => setForecastingPeriodId(payload);
    const handleSetDisplayFinalApproveErrorModal = (payload) => setDisplayFinalApproveErrorModal(payload);
    const handleSetDisplayFinalApproveModal = (payload) => setDisplayFinalApproveModal(payload);

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
          fetchBuqs={fetchRegionData}
        />
        <Table
          columns={columns}
          data={data[0]?.buqIdsToBeApproved !== undefined ? data : []}
          noItemsMessage="No pending consolidated summary"
          customReactTableStyle="moh-approve-buq-region"
        />
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

export default MOHApproveRegionBuq;
