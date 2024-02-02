import React from 'react';
import FacilityDemandingForecasting from '../facilityDemandingForecasting/FacilityDemandingForecasting';

const ApproveFacilityDemandingForecasting = ({
    loadingModalService,
    facilityService,
    orderableService,
    isInApproval,
    isInFinalApproval
}) => {
    return (
        <FacilityDemandingForecasting
            loadingModalService={loadingModalService}
            facilityService={facilityService}
            orderableService={orderableService}
            isInApproval={isInApproval}
            isInFinalApproval={isInFinalApproval}
        />
    );
}

export default ApproveFacilityDemandingForecasting