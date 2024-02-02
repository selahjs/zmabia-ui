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
import AdminBuqRemarks from '../AdminBuqRemarks/AdminBuqRemarks';
import AdminBuqSourcesOfFunds from '../AdminBuqSourcesOfFunds/AdminBuqSourcesOfFunds';

const AdminBuqPage = ({ remarks, sourcesOfFunds, loadingModalService }) => {
    const [currentTab, setCurrentTab] = useState(lastViewedTab || 'remarks');
    const lastViewedTab = localStorage.getItem('lastViewedTab');

    const handleDisplayTab = (name) => {
        setCurrentTab(name);
        localStorage.setItem('lastViewedTab', name)
    };

    return (
        <>
            <h2 className='admin-buq-page-title'>
                Manage BUQ
            </h2>
            <nav>
                <ul className='admin-buq-navigation'>
                    <li
                        className={`admin-buq-link ${currentTab === 'remarks' ? 'active' : null}`}
                        onClick={() => handleDisplayTab('remarks')}
                    >
                        Remarks
                    </li>
                    <li
                        className={`admin-buq-link ${currentTab === 'sourceOfFunds' ? 'active' : null}`}
                        onClick={() => handleDisplayTab('sourceOfFunds')}
                    >
                        Sources of Funds
                    </li>
                </ul>
            </nav>
            {currentTab === 'remarks' && !!remarks.length &&
                <AdminBuqRemarks
                    loadingModalService={loadingModalService}
                    remarks={remarks}
                />
            }
            {currentTab === 'sourceOfFunds' && !!sourcesOfFunds.length &&
                <AdminBuqSourcesOfFunds 
                    loadingModalService={loadingModalService}
                    sourcesOfFunds={sourcesOfFunds}
                />
            }
        </>
    );
}

export default AdminBuqPage;
