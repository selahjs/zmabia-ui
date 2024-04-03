import React, { useState } from 'react';
import useServerService from './useServerService';
import useGeographicZoneGroup from "./useGeographicZoneGroup";

const useCostCalculationsForFourLevels = (
    programId = undefined,
    forecastingPeriodId = undefined,
    geoZone,
    facilityService,
    loadingModalService
) => {
    const [fetchedData, setFetchedData] = useState([]);

    const buqService = useServerService('buqService');
    const { geographicZoneGroups } = useGeographicZoneGroup();

    const fetchDataByRegion = () => {
        loadingModalService.open();

        if (geoZone.level === 1) {
            return fetchCountryLevel();
        }
        if (geoZone.level === 2) {
            return fetchRegionLevel();
        }
        if (geoZone.level === 3) {
            return fetchDistrictLevel();
        }
        if (geoZone.level === 4) {
            return fetchCityLevel();
        }
    };

    const fetchCountryLevel = async () => {
        const fetchCountry = await buqService.costCalculation(
            programId,
            forecastingPeriodId,
            geoZone.value,
            geographicZoneGroups
        );

        await fetchRegionLevel(fetchCountry);
    }

    const fetchRegionLevel = async (fetchCountry) => {
        if (fetchCountry) {
            for (const item of fetchCountry) {
                const fetchRegion = await buqService.costCalculation(
                    programId,
                    forecastingPeriodId,
                    item.dataSourceId,
                    geographicZoneGroups
                );

                await fetchDistrictLevel(fetchRegion);
            }
        } else {
            const fetchRegion = await buqService.costCalculation(
                programId,
                forecastingPeriodId,
                geoZone.value,
                geographicZoneGroups
            );

            await fetchDistrictLevel(fetchRegion);
        }
    }

    const fetchDistrictLevel = async (fetchRegion) => {
        if (fetchRegion) {
            for (const item of fetchRegion) {
                const fetchDistrict = await buqService.costCalculation(
                    programId,
                    forecastingPeriodId,
                    item.dataSourceId,
                    geographicZoneGroups
                );

                await fetchCityLevel(fetchDistrict);
            }
        } else {
            const fetchDistrict = await buqService.costCalculation(
                programId,
                forecastingPeriodId,
                geoZone.value,
                geographicZoneGroups
            );

            await fetchCityLevel(fetchDistrict);
        }
    }

    const fetchCityLevel = async (fetchDistrict) => {
        if (fetchDistrict) {
            for (const item of fetchDistrict) {
                const fetchCity = await buqService.costCalculation(
                    programId,
                    forecastingPeriodId,
                    item.dataSourceId,
                    geographicZoneGroups
                );

                await fetchFacilityLevel(fetchCity);
            }
        } else {
            const fetchCity = await buqService.costCalculation(
                programId,
                forecastingPeriodId,
                geoZone.value,
                geographicZoneGroups
            );

            await fetchFacilityLevel(fetchCity);
        }
    }

    const fetchFacilityLevel = async (fetchCity) => {
        for (const item of fetchCity) {
            const calc = item.calculatedGroupsCosts;

            const facilityData = await facilityService.get(item.dataSourceId);

            const itemData = {
                pharmaceuticals: calc.Pharmaceuticals,
                medicalSupplies: calc['Medical supplies'],
                radiology: calc['Radiology (X-rays consumables)'],
                dentalSupplies: calc['Dental supplies'],
                diagnosticsSupplies: calc['Diagnostics supplies'],
                others: calc.Others,
                facilityName: facilityData.name,
                facilityType: facilityData.type.name,
                buqIdsToBeApproved: item.bottomUpQuantificationIds
            };

            uploadAndSortData(itemData);
        }
    }

    const uploadAndSortData = (item) => {
        setFetchedData(fetchedData => [...fetchedData, item]);
    }

    return { fetchedData, setFetchedData, fetchDataByRegion };
};

export default useCostCalculationsForFourLevels;
