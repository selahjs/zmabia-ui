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

import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Breadcrumbs from '../react-components/Breadcrumbs';
import useServerService from '../react-hooks/useServerService';
import AdminBuqPage from './components/AdminBuqPage/AdminBuqPage';

const Routing = ({
    loadingModalService
}) => {
    const [remarks, setRemarks] = useState([]);
    const [sourcesOfFunds, setSourcesOfFunds] = useState([]);
    const serverService = useServerService('adminBuq');

    const fetchRemarks = () => {
        loadingModalService.open();
        serverService.getRemarks()
            .then((fetchedRemarks) => {
                setRemarks(fetchedRemarks);
            }).finally(() => loadingModalService.close());
    };

    const fetchSourcesOfFunds = () => {
        loadingModalService.open();
        serverService.getSourcesOfFunds()
            .then((fetchedSourcesOfFunds) => {
                setSourcesOfFunds(fetchedSourcesOfFunds.content);
            }).finally(() => loadingModalService.close());
    };

    useEffect(() => {
        fetchRemarks()
        fetchSourcesOfFunds();
    }, []);

    return !!remarks.length && !!sourcesOfFunds.length ? (
        <div className='page-responsive'>
            <Router basename='/' hashType='hashbang'>
                <Breadcrumbs routes={[{ path: '/administration/manage-buq', breadcrumb: 'Manage BUQ' }]} />
                <Switch>

                    <Route exact path='/administration/manage-buq'>
                        <AdminBuqPage
                            remarks={remarks}
                            sourcesOfFunds={sourcesOfFunds}
                            loadingModalService={loadingModalService}
                        />
                    </Route>
                </Switch>
            </Router>
        </div>) : null;
};

export default Routing;
