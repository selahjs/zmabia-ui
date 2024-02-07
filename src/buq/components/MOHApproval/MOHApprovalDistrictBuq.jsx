import React from 'react';
import { useParams } from 'react-router-dom';
import MOHApprovalTable from './MOHApprovalTable';
import useLocalStorage from '../../../react-hooks/useLocalStorage';
import useCostCalculationDistrictOrFacility from '../../../react-hooks/useCostCalculationDistrictOrFacility';

const MOHApprovalDistrictBuq = ({ loadingModalService }) => {
  const { districtId } = useParams();
  const {
    storedItems: { mohApprovalParams },
  } = useLocalStorage();

  const { fetchedData } = useCostCalculationDistrictOrFacility(
    districtId,
    undefined,
    loadingModalService
  );

  return (
    <>
      <h2 className="bottom-line">{`District Summary - ${mohApprovalParams.region} region`}</h2>
      <div className="approve-buq-page-container">
        <MOHApprovalTable
          data={fetchedData}
          redirectUrl={`/buq/national-approve/${districtId}`}
          districtLvl={true}
        />
      </div>
    </>
  );
};

export default MOHApprovalDistrictBuq;
