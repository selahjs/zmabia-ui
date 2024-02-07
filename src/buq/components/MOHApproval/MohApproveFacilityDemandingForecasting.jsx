import React from 'react';
import ApproveFacilityDemandingForecasting from '../approveBuq/ApproveFacilityDemandingForecasting';

const MohApproveFacilityDemandingForecasting = ({
    loadingModalService,
    facilityService,
    orderableService
}) => {
    return (
        <ApproveFacilityDemandingForecasting
            loadingModalService={loadingModalService}
            facilityService={facilityService}
            orderableService={orderableService}
            isInApproval={true}
            isInFinalApproval={true}
        />
    );
}

export default MohApproveFacilityDemandingForecasting;