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

const MOHApproveRegionBuq = ({ loadingModalService }) => {
  const { forecastingPeriodsParams } = useBuqCommonFuncs();
  const { geographicZoneParams } = useGeographicZoneGroup();

  const [group, setGroup] = useState();
  const [noneSelectedGroup, setNoneSelectedGroup] = useState(false);
  const [forecastingPeriodId, setForecastingPeriodId] = useState();
  const [noneSelectedForecastingPeriod, setNoneSelectedForecastingPeriod] =
    useState(false);
  const [displayFinalApproveModal, setDisplayFinalApproveModal] =
    useState(false);
  const [data, setData] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState(false);
  const [displayFinalApproveErrorModal, setDisplayFinalApproveErrorModal] =
    useState(false);

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

  useEffect(() => {
    if (data.length) {
      const allCheckboxesAreSelected = data.every(
        (item) => item.checkbox === true
      );      
      setSelectedCheckbox(allCheckboxesAreSelected);
    } else {
      setSelectedCheckbox(false);
    }
  }, [data]);

  const handleSearchButton = () => {
    if (!group) {
      setNoneSelectedGroup(true);
    }
    if (!forecastingPeriodId) {
      setNoneSelectedForecastingPeriod(true);
    }
    if (group && forecastingPeriodId) {
      fetchRegionData();
    }
  };

  const toggleAllCheckboxes = (value) => {
    setSelectedCheckbox(value);
    const updatedData = data.map((obj) => ({ ...obj, checkbox: value }));
    setData(updatedData);
  };

  const toggleRowCheckbox = (value, row) => {
    const updatedData = data.map((obj) => {
      if (obj.idCheckbox === row.idCheckbox) {
        return { ...obj, checkbox: value };
      }
      return { ...obj };
    });

    setData(updatedData);
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
          console.log(values);
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
        <Table
          columns={columns}
          data={data}
          noItemsMessage="No pending consolidated summary"
          customReactTableStyle="moh-approve-buq-region"
        />
      </div>
      <Modal
        isOpen={displayFinalApproveModal}
        children={[
          <ConfirmModalBody
            onConfirm={handleFinalApproveAction}
            confirmMessage={
              'Are you sure you want to approve this forecasting?'
            }
            onCancel={() => setDisplayFinalApproveModal(false)}
            confirmButtonText={'Approve'}
          />,
        ]}
        sourceOfFundStyle={true}
      />
      <ModalErrorMessage
        isOpen={displayFinalApproveErrorModal}
        customMessage="At least one pending approval needs to be selected"
        onClose={() => setDisplayFinalApproveErrorModal(false)}
      />
      <ActionBar
        onFinalApproveAction={() => setDisplayFinalApproveModal(true)}
        finalApproveButton={true}
        cancelButton={false}
        totalCostInformation={false}
        sourceOfFundButton={false}
      />
    </>
  );
};

export default MOHApproveRegionBuq;
