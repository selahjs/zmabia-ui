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
     * @name buq.buqService
     *
     * @description
     * Communicates with the /api/bottomUpQuantifications endpoint of the OpenLMIS server.
     */
    angular
        .module('buq')
        .service('buqService', service);

    service.$inject = ['$resource', 'openlmisUrlFactory', 'facilityFactory', 'programService'];

    function service($resource, openlmisUrlFactory, facilityFactory, programService) {

        var resource = $resource(openlmisUrlFactory('/api'), {}, {
            getBuqs: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications'),
                method: 'GET',
                params: {
                    facilityId: '@facility'
                }
            },
            getBuq: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/:id')
            },
            getBuqsByStatus: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications'),
                method: 'GET',
                params: {
                    status: '@status'
                }
            },
            getBuqsForApproval: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/forApproval'),
                method: 'GET',
                params: {
                    programId: '@programId'
                }
            },
            getGroup: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/supervisedGeographicZones'),
                method: 'GET',
                params: {
                    programId: '@programId'
                }
            },
            getMostRecentRejection: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/:id/mostRecentRejection'),
                method: 'GET'
            },
            approveFacilityStats: {
                url: openlmisUrlFactory(
                    '/api/bottomUpQuantifications/approveFacilityForecastingStats?programId=:buqProgramId'
                )
            },
            updateBuq: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/:id'),
                method: 'PUT'
            },
            prepareBuqReport: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/prepare?'),
                method: 'POST'
            },
            removeBuqReport: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/:id'),
                method: 'DELETE'
            },
            downloadBuqReport: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/:id/download'),
                method: 'GET'
            },
            submitBuq: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/:id/submit'),
                method: 'POST'
            },
            authorizeBuq: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/:id/authorize'),
                method: 'POST'
            },
            approveBuq: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/:id/approve'),
                method: 'POST'
            },
            rejectBuq: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/:id/reject'),
                method: 'POST'
            },
            finalApproveBuq: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/finalApprove'),
                method: 'POST',
                params: {
                    id: '@id'
                },
                isArray: true
            },
            costCalculation: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/costCalculation' +
                    '?processingPeriodId=:ppId&programId=:pId&geographicZoneId=:gzId'),
                method: 'POST',
                isArray: true
            },
            forFinalApproval: {
                url: openlmisUrlFactory('/api/bottomUpQuantifications/forFinalApproval' +
                    '?processingPeriodId=:ppId&programId=:pId&geographicZoneId=:gzId'),
                method: 'GET'
            }
        });

        this.getBuqs = getBuqs;
        this.getBuq = getBuq;
        this.getBuqsByStatus = getBuqsByStatus;
        this.getBuqsForApproval = getBuqsForApproval;
        this.getGroup = getGroup;
        this.approveFacilityStats = approveFacilityStats;
        this.updateBuq = updateBuq;
        this.prepareBuqReport = prepareBuqReport;
        this.removeBuqReport = removeBuqReport;
        this.downloadBuqReport = downloadBuqReport;
        this.urlFactory = urlFactory;
        this.submitBuq = submitBuq;
        this.authorizeBuq = authorizeBuq;
        this.approveBuq = approveBuq;
        this.rejectBuq = rejectBuq;
        this.finalApproveBuq = finalApproveBuq;
        this.costCalculation = costCalculation;
        this.getMostRecentRejection = getMostRecentRejection;
        this.userHasBUQProgram = userHasBUQProgram;
        this.doesSupportBUQProgram = doesSupportBUQProgram;
        this.forFinalApproval = forFinalApproval;

        function getBuqs(facilityId) {
            var queryParams = {};

            if (facilityId) {
                queryParams.facility = facilityId;
            }

            return resource.getBuqs(queryParams).$promise;
        }

        function prepareBuqReport(facilityId, programId, processingPeriodId) {
            return resource.prepareBuqReport({
                facilityId: facilityId,
                programId: programId,
                processingPeriodId: processingPeriodId
            }, facilityId).$promise;
        }

        function getBuq(buqId) {
            return resource.getBuq({
                id: buqId
            }).$promise;
        }

        function getBuqsByStatus(statusArray, facilityId) {
            var queryParams = {};

            if (statusArray) {
                queryParams.status = statusArray;
            }

            if (facilityId) {
                queryParams.facility = facilityId;
            }

            return resource.getBuqsByStatus(queryParams).$promise;
        }

        function getBuqsForApproval(buqProgramId) {
            return resource.getBuqsForApproval({
                programId: buqProgramId
            }).$promise;
        }

        function getGroup(buqProgramId) {
            return resource.getGroup({
                programId: buqProgramId
            }).$promise;
        }

        function approveFacilityStats(buqProgramId) {
            return resource.approveFacilityStats({
                buqProgramId: buqProgramId
            }).$promise;
        }

        function removeBuqReport(buqReportId) {
            return resource.removeBuqReport({
                id: buqReportId
            }).$promise;
        }

        function downloadBuqReport(buqId) {
            return resource.downloadBuqReport({
                id: buqId
            }).$promise;
        }

        function updateBuq(buqId, lineItems) {
            return resource.updateBuq({
                id: buqId
            }, lineItems).$promise;
        }

        function urlFactory(url) {
            return openlmisUrlFactory(url);
        }

        function submitBuq(buqId, payload) {
            return resource.submitBuq({
                id: buqId
            }, payload).$promise;
        }

        function authorizeBuq(buqId, payload) {
            return resource.authorizeBuq({
                id: buqId
            }, payload).$promise;
        }

        function approveBuq(buqId, payload) {
            return resource.approveBuq({
                id: buqId
            }, payload).$promise;
        }

        function rejectBuq(buqId, params) {
            return resource.rejectBuq({
                id: buqId
            }, params).$promise;
        }

        function finalApproveBuq(buqId) {
            return resource.finalApproveBuq({
                id: buqId
            }).$promise;
        }

        function costCalculation(programId, processingPeriodId, geoZoneId, payload) {
            return resource.costCalculation({
                pId: programId,
                ppId: processingPeriodId,
                gzId: geoZoneId
            }, payload).$promise;
        }

        function forFinalApproval(programId, processingPeriodId, geoZoneId) {
            return resource.forFinalApproval({
                pId: programId,
                ppId: processingPeriodId,
                gzId: geoZoneId
            }).$promise;
        }

        function getMostRecentRejection(buqId) {
            return resource.getMostRecentRejection({
                id: buqId
            }).$promise;
        }

        function userHasBUQProgram() {
            var userId = localStorage.getItem('openlmis.USER_ID');

            return programService.getUserPrograms(userId).then(function(programs) {
                if (programs) {
                    for (var i = 0; i < programs.length; i++) {
                        if (programs[i].name === 'BUQ') {
                            return true;
                        }
                    }
                }
                return false;
            });
        }

        function doesSupportBUQProgram() {
            var userId = localStorage.getItem('openlmis.USER_ID');

            return facilityFactory.getUserHomeFacility(userId).then(function(homeFacility) {
                if (homeFacility.supportedPrograms) {
                    for (var i = 0; i < homeFacility.supportedPrograms.length; i++) {
                        if (homeFacility.supportedPrograms[i].name === 'BUQ') {
                            return true;
                        }
                    }
                }
                return false;
            });
        }
    }
})();
