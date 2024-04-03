/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

import React from 'react';
import Breadcrumbs from '../react-components/Breadcrumbs';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import PrepareBuq from './components/prepareBuq/PrepareBuq';
import CreateAuthorizeForecasting from './components/createAuthorizeForecasting/CreateAuthorizeForecasting';
import FacilityDemandingForecasting from './components/facilityDemandingForecasting/FacilityDemandingForecasting';
import ApproveBuq from './components/approveBuq/ApproveBuq';
import ApproveFacilityDemandingForecasting from './components/approveBuq/ApproveFacilityDemandingForecasting';
import MohApproveFacilityDemandingForecasting from './components/MOHApproval/MohApproveFacilityDemandingForecasting';
import MOHApprovalDistrictBuq from './components/MOHApproval/MOHApprovalDistrictBuq';
import MOHApproveRegionBuq from './components/MOHApproval/MOHApproveRegionBuq';
import MOHApprovalFacilityBuq from './components/MOHApproval/MOHApprovalFacilityBuq';
import MohForFinalApproval from './components/MOHApproval/MohForFinalApproval';
import useLocalStorage from "../react-hooks/useLocalStorage";


const Routing = ({
    loadingModalService,
    facilityService,
    periodService,
    orderableService
}) => {

    const { storedItems: { mohApprovalParams } } = useLocalStorage();

    const breadcrumbsRoutes = [{
        path: '/buq',
        breadcrumb: 'BUQ'
    },
    {
        path: '/buq/prepare',
        breadcrumb: 'Prepare BUQ'
    },
    {
        path: '/buq/create',
        breadcrumb: 'Create / Authorize Forecasting'
    },
    {
        path: '/buq/create/:id',
        breadcrumb: 'Facility Demanding Forecasting Form'
    },
    {
        path: '/buq/national-approve',
        breadcrumb: 'Pending Approvals'
    },
    {
        path: '/buq/national-approval',
        breadcrumb: 'Pending Approvals'
    },
    {
        path: '/buq/national-approval/:id',
        breadcrumb: 'Facility Demanding Forecasting Form'
    },
    {
        path: '/buq/national-approve/:districtId',
        breadcrumb: 'District Summary'
    },
    {
        path: '/buq/national-approve/:districtId/:facilityId',
        breadcrumb: `Facilities Consolidated Summary for ${mohApprovalParams?.region} region`
    },
    {
        path: '/buq/national-approve/:districtId/:facilityId/:id',
        breadcrumb:  'Facility Demanding Forecasting Form'
    },
    {
        path: '/buq/approve',
        breadcrumb: 'Approve BUQ'
    },
    {
        path: '/buq/approve/:id',
        breadcrumb: 'Facility Demanding Forecasting Form'
    }
    ];

    return (
        <div className='buq-page-responsive'>
            <Router basename='/' hashType='hashbang'>
                <Breadcrumbs routes={breadcrumbsRoutes} />
                <Switch>
                    <Route exact path='/buq/prepare'>
                        <PrepareBuq loadingModalService={loadingModalService} />
                    </Route>
                    <Route exact path='/buq/create/:id'>
                        <FacilityDemandingForecasting
                            loadingModalService={loadingModalService}
                            facilityService={facilityService}
                            orderableService={orderableService}
                            isInApproval={false}
                            isInFinalApproval={false}
                        />
                    </Route>
                    <Route exact path='/buq/create'>
                        <CreateAuthorizeForecasting loadingModalService={loadingModalService} />
                    </Route>
                    <Route exact path='/buq/approve/:id'>
                        <ApproveFacilityDemandingForecasting
                            loadingModalService={loadingModalService}
                            facilityService={facilityService}
                            periodService={periodService}
                            orderableService={orderableService}
                            isInApproval={true}
                            isInFinalApproval={false}
                        />
                    </Route>
                    <Route exact path='/buq/approve'>
                        <ApproveBuq
                            loadingModalService={loadingModalService}
                            periodService={periodService}
                            orderableService={orderableService}
                            facilityService={facilityService}
                        />
                    </Route>
                    <Route exact path='/buq/national-approve/:districtId/:facilityId'>
                        <MOHApprovalFacilityBuq
                            loadingModalService={loadingModalService}
                            periodService={periodService}
                            orderableService={orderableService}
                            facilityService={facilityService}
                        />
                    </Route>
                    <Route exact path='/buq/national-approve/:districtId'>
                        <MOHApprovalDistrictBuq
                            loadingModalService={loadingModalService}
                            periodService={periodService}
                            orderableService={orderableService}
                            facilityService={facilityService}
                        />
                    </Route>
                    <Route exact path='/buq/national-approve'>
                        <MOHApproveRegionBuq
                            loadingModalService={loadingModalService}
                            periodService={periodService}
                            orderableService={orderableService}
                            facilityService={facilityService}
                        />
                    </Route>
                    <Route exact path='/buq/national-approve/:districtId/:facilityId/:id'>
                        <MohApproveFacilityDemandingForecasting
                            loadingModalService={loadingModalService}
                            facilityService={facilityService}
                            orderableService={orderableService}
                            />
                    </Route>
                    <Route exact path='/buq/national-approval'>
                        <MohForFinalApproval
                            loadingModalService={loadingModalService}
                            periodService={periodService}
                            orderableService={orderableService}
                            facilityService={facilityService}
                            />
                    </Route>
                    <Route exact path='/buq/national-approval/:id'>
                        <MohApproveFacilityDemandingForecasting
                            loadingModalService={loadingModalService}
                            facilityService={facilityService}
                            orderableService={orderableService}
                        />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default Routing;
