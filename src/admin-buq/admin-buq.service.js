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

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name admin-buq.adminBuq
     *
     * @description
     * Communicates with the /api/serverConfiguration endpoint of the OpenLMIS server.
     */
    angular
        .module('admin-buq')
        .service('adminBuq', service);

    service.$inject = ['$resource', 'openlmisUrlFactory'];

    function service($resource, openlmisUrlFactory) {

        var resource = $resource(openlmisUrlFactory('/api'), {}, {
            getRemarks: {
                url: openlmisUrlFactory('/api/remark'),
                method: 'GET',
                isArray: true
            },
            addRemark: {
                url: openlmisUrlFactory('/api/remark'),
                method: 'Post'
            },
            updateRemark: {
                url: openlmisUrlFactory('/api/remark/:id'),
                method: 'PUT'
            },
            removeRemark: {
                url: openlmisUrlFactory('/api/remark/:id'),
                method: 'DELETE'
            },
            getSourcesOfFunds: {
                url: openlmisUrlFactory('/api/sourcesOfFunds'),
                method: 'GET'
            },
            addSourcesOfFunds: {
                url: openlmisUrlFactory('/api/sourcesOfFunds'),
                method: 'POST'
            },
            removeSourceOfFund: {
                url: openlmisUrlFactory('/api/sourcesOfFunds/:id'),
                method: 'DELETE'
            },
            updateSourceOfFund: {
                url: openlmisUrlFactory('/api/sourcesOfFunds/:id'),
                method: 'PUT'
            }
        });

        this.getRemarks = getRemarks;
        this.addRemark = addRemark;
        this.updateRemark = updateRemark;
        this.removeRemark = removeRemark;

        this.getSourcesOfFunds = getSourcesOfFunds;
        this.addSourcesOfFunds = addSourcesOfFunds;
        this.removeSourceOfFund = removeSourceOfFund;
        this.updateSourceOfFund = updateSourceOfFund;

        function getRemarks() {
            return resource.getRemarks().$promise;
        }
        function addRemark(remark) {
            return resource.addRemark(remark).$promise;
        }

        function updateRemark(remark) {
            return resource.updateRemark({
                id: remark.id
            }, remark).$promise;
        }

        function removeRemark(remark) {
            return resource.removeRemark({
                id: remark.id
            }).$promise;
        }

        function getSourcesOfFunds() {
            return resource.getSourcesOfFunds().$promise;
        }

        function addSourcesOfFunds(sourcesOfFunds) {
            return resource.addSourcesOfFunds(sourcesOfFunds).$promise;
        }

        function removeSourceOfFund(sourceOfFund) {
            return resource.removeSourceOfFund({
                id: sourceOfFund.id
            }).$promise;
        }

        function updateSourceOfFund(sourceOfFund) {
            return resource.updateSourceOfFund({
                id: sourceOfFund.id
            }, sourceOfFund).$promise;
        }
    }
})();
