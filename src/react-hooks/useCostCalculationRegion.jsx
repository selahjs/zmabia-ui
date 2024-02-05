import React, { useState, useEffect } from 'react';
import useServerService from './useServerService';
import useLocalStorage from './useLocalStorage';
import useGeographicZoneGroup from "./useGeographicZoneGroup";

const useCostCalculationRegion = (
  group,
  forecastingPeriodId,
  loadingModalService
) => {
  const [regionData, setRegionData] = useState([]);
  const [programId, setProgramId] = useState('');

  const buqService = useServerService('buqService');
  const programService = useServerService('programService');
  const geographicZoneService = useServerService('geographicZoneService');
  const { geographicZoneGroups } = useGeographicZoneGroup()

  const {
    storedItems: { userId },
  } = useLocalStorage();

  useEffect(() => {
    programBuqId();
  }, []);

  const programBuqId = () => {
    programService.getUserPrograms(userId).then(function (programs) {
      if (programs) {
        const program = programs.find((program) => program.name === 'BUQ');
        setProgramId(program.id);
      }
      return false;
    });
  };

  const fetchRegionData = async () => {
    loadingModalService.open();
    if (group.level === 1) {
      const fetchCountry = await buqService.costCalculation(
        programId,
        forecastingPeriodId,
        group.value,
        geographicZoneGroups
      );

      const regionItems = [];

      for (const country of fetchCountry) {
        const fetchZone = await buqService.costCalculation(
          programId,
          forecastingPeriodId,
          country.dataSourceId,
          geographicZoneGroups
        );

        for (const region of fetchZone) {
          const calc = region.calculatedGroupsCosts;

          const regionData = await geographicZoneService.get(
            region.dataSourceId
          );

          regionItems.push({
            id: region.dataSourceId,
            idCheckbox: `${region.dataSourceId}${region.facilityType}`,
            pharmaceuticals: calc.Pharmaceuticals,
            medicalSupplies: calc['Medical supplies'],
            radiology: calc['Radiology (X-rays consumables)'],
            dentalSupplies: calc['Dental supplies'],
            diagnosticsSupplies: calc['Diagnostics supplies'],
            region: regionData.name,
            facilityType: region.facilityType,
            buqIdsToBeApproved: region.bottomUpQuantificationIds
          });
        }
      }
      setRegionData(
        regionItems.length ?
          regionItems.sort((a, b) =>
            a.region > b.region ? 1 : b.region > a.region ? -1 : 0
          ) : regionItems
      );
      loadingModalService.close();
    } else {
      const fetchZone = await buqService.costCalculation(
        programId,
        forecastingPeriodId,
        group.value,
        geographicZoneGroups
      );

      const regionItems = [];

      for (const region of fetchZone) {
        const calc = region.calculatedGroupsCosts;

        const regionData = await geographicZoneService.get(region.dataSourceId);

        regionItems.push({
          pharmaceuticals: calc.Pharmaceuticals,
          medicalSupplies: calc['Medical supplies'],
          radiology: calc['Radiology (X-rays consumables)'],
          dentalSupplies: calc['Dental supplies'],
          diagnosticsSupplies: calc['Diagnostics supplies'],
          region: regionData.name,
          id: region.dataSourceId,
          idCheckbox: `${region.dataSourceId}${region.facilityType}`,
          facilityType: region.facilityType,
          buqIdsToBeApproved: region.bottomUpQuantificationIds
        });
      }
      setRegionData(
        regionItems.length ?
          regionItems.sort((a, b) =>
            a.region > b.region ? 1 : b.region > a.region ? -1 : 0
          ) : regionItems
      );
      loadingModalService.close();
    }
  };

  return { regionData, programId, fetchRegionData };
};

export default useCostCalculationRegion;
