import React, { useState, useMemo, useEffect } from 'react';
import useServerService from './useServerService';
import useLocalStorage from './useLocalStorage';
import useGeographicZoneGroup from "./useGeographicZoneGroup";

const useCostCalculationDistrictOrFacility = (
  districtId = undefined,
  facilityId = undefined,
  loadingModalService,
  facilityService
) => {
  const [fetchedData, setFetchedData] = useState([]);

  const {
    storedItems: { mohApprovalParams },
  } = useLocalStorage();

  const buqService = useServerService('buqService');
  const geographicZoneService = useServerService('geographicZoneService');
  const { geographicZoneGroups, isGeographicZoneGroupsFetched } = useGeographicZoneGroup();

  useEffect(() => {
    if (districtId && isGeographicZoneGroupsFetched) {
      fetchDistrictOrFacilityData(districtId);
    }
    if (facilityId && isGeographicZoneGroupsFetched) {
      fetchDistrictOrFacilityData(facilityId);
    }
  }, [isGeographicZoneGroupsFetched]);

  const fetchDistrictOrFacilityData = async (id) => {
    loadingModalService.open();
    const fetchRegion = await buqService.costCalculation(
      mohApprovalParams.programId,
      mohApprovalParams.forecastingPeriodId,
      id,
      geographicZoneGroups
    );
    let items = [];

    for (const item of fetchRegion) {
      const calc = item.calculatedGroupsCosts;

      if (districtId) {
        const districtData = await geographicZoneService.get(item.dataSourceId);
        items.push({
          pharmaceuticals: calc.Pharmaceuticals,
          medicalSupplies: calc['Medical supplies'],
          radiology: calc['Radiology (X-rays consumables)'],
          dentalSupplies: calc['Dental supplies'],
          diagnosticsSupplies: calc['Diagnostics supplies'],
          district: districtData.name,
          id: item.dataSourceId,
          facilityType: item.facilityType,
        });
      }

      if (facilityId) {
        const facilityData = await facilityService.get(item.dataSourceId);

        items.push({
          pharmaceuticals: calc.Pharmaceuticals,
          medicalSupplies: calc['Medical supplies'],
          radiology: calc['Radiology (X-rays consumables)'],
          dentalSupplies: calc['Dental supplies'],
          diagnosticsSupplies: calc['Diagnostics supplies'],
          facilityName: facilityData.name,
          facilityType: facilityData.type.name,
          id: item.bottomUpQuantificationIds[0],
        });
      }
    }

    if (districtId) {
      setFetchedData(
        items.sort((a, b) =>
          a.district > b.district ? 1 : b.district > a.district ? -1 : 0
        )
      );
    }

    if (facilityId) {
      setFetchedData(
        items.sort((a, b) =>
          a.facilityName > b.facilityName
            ? 1
            : b.facilityName > a.facilityName
            ? -1
            : 0
        )
      );
    }

    loadingModalService.close();
  };

  return { fetchedData };
};

export default useCostCalculationDistrictOrFacility;
