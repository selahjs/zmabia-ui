import React, { useEffect, useState } from 'react';
import MOHApprovalTable from './MOHApprovalTable';
import WebFilter from '../../../react-components/modals/web-filter';
import { useParams } from 'react-router-dom';
import useLocalStorage from '../../../react-hooks/useLocalStorage';
import useServerService from '../../../react-hooks/useServerService';
import useCostCalculationDistrictOrFacility from '../../../react-hooks/useCostCalculationDistrictOrFacility';

const MOHApprovalFacilityBuq = ({ facilityService, loadingModalService }) => {
  const [data, setData] = useState([]);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const { districtId, facilityId } = useParams();
  const {
    storedItems: { mohApprovalParams },
  } = useLocalStorage();

  const { fetchedData } = useCostCalculationDistrictOrFacility(
    undefined,
    facilityId,
    loadingModalService,
    facilityService
  );

  useEffect(() => setData(fetchedData), [fetchedData]);

  const handleFilter = (value) => {
    setFilterValue(value.facilityName);
    setDataToDisplay(
      data.filter(({ facilityName }) =>
        facilityName.toLowerCase().contains(value.facilityName?.toLowerCase())
      )
    );
  };

  return (
    <>
      <h2 className="bottom-line">{`District Summary - ${mohApprovalParams.district} district`}</h2>
      <WebFilter
        filters={[
          { type: 'text', displayText: 'Facility Name', name: 'facilityName' },
        ]}
        onSubmit={(value) => handleFilter(value)}
      />
      <div className="approve-buq-page-container">
        <MOHApprovalTable
          data={filterValue?.length ? dataToDisplay : data}
          redirectUrl={`/buq/national-approve/${districtId}/${facilityId}`}
        />
      </div>
    </>
  );
};

export default MOHApprovalFacilityBuq;
