import React, { useState } from 'react';
import useServerService from './useServerService';
import { BUQ_STATUS } from '../buq/utils/constants';

const useFacilityDemandForecasting = (loadingModalService, facilityService, orderableService) => {
  const [buq, setBuq] = useState({});
  const [lineItems, setLineItems] = useState([])
  const [remarksParams, setRemarksParams] = useState([]);
  const [fundingDetails, setFundingDetails] = useState({ sourcesOfFunds: [] });

  const [buqs, setBuqs] = useState([]);
  const [authorizedBuqs, setAuthorizedBuqs] = useState([]);

  const buqService = useServerService('buqService');
  const buqAdminService = useServerService('adminBuq');
  const periodService = useServerService('periodService');

  const fetchFacility = (id) => {
    return facilityService.get(id);
  }

  const fetchProcessingPeriod = (id) => {
    return periodService.get(id);
  }

  const fetchOrderables = () => {
    return orderableService.search();
  }

  const fetchBuq = (buqId) => {
    return buqService.getBuq(buqId);
  }
  const fetchBuqs = () => {
    return buqService.getBuqs();
  }

  const fetchRemarks = () => {
    return buqAdminService.getRemarks();
  }

  const getCategory = (orderable) => {
    const orderableProgram = orderable.programs[0];
    return orderableProgram.orderableCategoryDisplayName;
  };

  const getField = (orderable, fieldName) => {
    const orderableProgram = orderable.programs[0];
    return orderableProgram[fieldName];
};

  const extendLineItems = (fetchedBuqLineItems, orderables, buqProgramId) => {
    return fetchedBuqLineItems.map((fetchedBuqLineItem) => {
      const orderable = orderables.find((orderable) => orderable.id === fetchedBuqLineItem.orderableId);
      const annualAdjustedConsumption = fetchedBuqLineItem.annualAdjustedConsumption ?? 0;
      const verifiedAnnualAdjustedConsumption =
          fetchedBuqLineItem.verifiedAnnualAdjustedConsumption !== annualAdjustedConsumption
          ? fetchedBuqLineItem.verifiedAnnualAdjustedConsumption ?? annualAdjustedConsumption :
          annualAdjustedConsumption
      const forecastedDemand =
          fetchedBuqLineItem.forecastedDemand !== verifiedAnnualAdjustedConsumption
              ? fetchedBuqLineItem.forecastedDemand ?? verifiedAnnualAdjustedConsumption :
              verifiedAnnualAdjustedConsumption
      return {
        ...fetchedBuqLineItem,
        category: getCategory(orderable, buqProgramId),
        orderable: orderable,
        annualAdjustedConsumption: annualAdjustedConsumption,
        verifiedAnnualAdjustedConsumption: verifiedAnnualAdjustedConsumption,
        forecastedDemand: forecastedDemand,
        errors: []
      }
    });
  }

  const verifyTotalCost = (lineItems) => {
    return lineItems.map((lineItem) => {
      const price = getField(lineItem.orderable, 'pricePerPack') ?? 0;
      const expectedTotalCost = lineItem.forecastedDemand * price;
  
      if (Number(lineItem.totalCost).toFixed(2) !== expectedTotalCost.toFixed(2)) {
        return {
          ...lineItem,
          totalCost: parseFloat(expectedTotalCost.toFixed(2)),
        };
      }
  
      if (!lineItem.totalCost) {
        return {
          ...lineItem,
          totalCost: 0,
        };
      }
  
      return lineItem;
    });
  };

  const fetchDetailedBuq = (buqId) => {
    loadingModalService.open();
    return fetchBuq(buqId).then((fetchedBuq) => {
      const facilityId = fetchedBuq.facilityId;
      const processingPeriodId = fetchedBuq.processingPeriodId;
      const fetchedBuqLineItems = fetchedBuq.bottomUpQuantificationLineItems;
      const fundingDetails = fetchedBuq.fundingDetails;

      return Promise.all([
        fetchFacility(facilityId),
        fetchProcessingPeriod(processingPeriodId),
        fetchRemarks(),
        fetchOrderables()
      ]).then((fetchedData) => {
        const [facility, processingPeriod, remarks, orderables] = fetchedData;

        setBuq({
          ...fetchedBuq,
          facility: facility,
          processingPeriod: processingPeriod
        });

        const extendedLineItems = extendLineItems(fetchedBuqLineItems, orderables.content, fetchedBuq.programId);

        const verifyTotalCostInLineItems = verifyTotalCost(extendedLineItems);

        setLineItems(verifyTotalCostInLineItems);

        setRemarksParams(remarks.map((remark) => ({
          name: remark.name,
          value: remark.id
        })));

        setFundingDetails(fundingDetails)
      });
    });
  }

  const fetchApprovedBuqs = () => {
    loadingModalService.open();
    return fetchBuqs().then(async (fetchedBuqs) => {
          const { content } = fetchedBuqs;
          setBuqs(content);
          const buqAuthorizedList = [];

          await Promise.all(
            content.map((buq) =>
                  periodService.get(buq.processingPeriodId).then((processingPeriod) => {
                    if (buq.status === BUQ_STATUS.AUTHORIZED) {
                      buqAuthorizedList.push({
                        id: buq.id,
                        period: processingPeriod.name,
                        status: buq.status,
                        submittedDate: occurredDate
                      });
                  }
                })
                )
          ).then(() => {
            setAuthorizedBuqs(buqAuthorizedList);
          })
        })
  };

  return {
    buq,
    lineItems,
    setLineItems,
    remarksParams,
    fundingDetails,
    buqs,
    authorizedBuqs,
    fetchApprovedBuqs,
    fetchDetailedBuq
  };
};

export default useFacilityDemandForecasting;
