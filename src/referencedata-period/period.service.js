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
     * @name referencedata-period.periodService
     *
     * @description
     * Responsible for retrieving all processing period information from the server.
     */
    angular
        .module('referencedata-period')
        .service('periodService', service);

    service.$inject = ['$q', '$resource', 'referencedataUrlFactory', 'dateUtils', 'localStorageService',
        'localStorageFactory', 'ProcessingPeriodResource', 'openlmisDateFilter'];

    function service($q, $resource, referencedataUrlFactory, dateUtils, localStorageService,
                     localStorageFactory, ProcessingPeriodResource, openlmisDateFilter) {

        var periodsOffline = localStorageFactory('processingPeriods'),
            periodsPromise,
            resource = $resource(referencedataUrlFactory('/api/processingPeriods/:id'), {}, {
                query: {
                    method: 'GET',
                    isArray: false
                }
            });

        this.get = get;
        this.query = query;
        this.create = create;
        this.clearProcessingPeriodsCache = clearProcessingPeriodsCache;

        /**
         * @ngdoc method
         * @name get
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Retrieves processing period from the server by id.
         *
         * @param  {String}  periodId Period UUID
         * @return {Promise}          Period
         */
        function get(periodId) {
            var cachedPeriod = periodsOffline.getBy('id', periodId);

            if (cachedPeriod) {
                periodsPromise = $q.resolve(angular.fromJson(cachedPeriod));
            } else {
                periodsPromise = new ProcessingPeriodResource().get(periodId)
                    .then(function(period) {
                        periodsOffline.put(period);
                        return $q.resolve(period);
                    });
            }

            return periodsPromise;
        }

        /**
         * @ngdoc method
         * @name query
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Retrieves page of Processing Periods that are matching given parameters.
         *
         * @param  {Object}  params search. pagination and sort parameters
         * @return {Promise}        page of Processing Periods
         */
        function query(params) {
            return resource.query(params).$promise;
        }

        /**
         * @ngdoc method
         * @name create
         * @methodOf referencedata-period.periodService
         *
         * @description
         * Creates processing periods.
         *
         * @param  {Object}  period new Period
         * @return {Promise}        created Period
         */
        function create(period) {
            period.startDate = toBackendFormat(period.startDate);
            period.endDate = toBackendFormat(period.endDate);
            return resource.save(period).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-period.periodService
         * @name clearProcessingPeriodsCache
         *
         * @description
         * Deletes processing periods stored in the browser cache.
         */
        function clearProcessingPeriodsCache() {
            periodsPromise = undefined;
            localStorageService.remove('processingPeriods');
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-period.periodService
         * @name toStringDateUTC
         *
         * @description
         * Transforms dates from Date to string at UTC 00:00.
         *
         * @param {Date} date date to be parsed
         * @return {String} parsed date string in format yyyy-MM-dd.
         */
        function toStringDateUTC(date) {
            return openlmisDateFilter(date, 'yyyy-MM-dd');
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-period.periodService
         * @name toBackendFormat
         *
         * @description
         * Transforms dates from Date, String or Array of numbers
         * to string at UTC 00:00.
         *
         * @param {Date | String | Array} date to be parsed
         * @return {String} parsed date string in format yyyy-MM-dd.
         */
        function toBackendFormat(date) {
            var parsed;
            if (date instanceof Date) {
                parsed = date;
            } else {
                parsed = dateUtils.toDate(date);
            }
            return (parsed) ? toStringDateUTC(parsed) : undefined;
        }
    }
})();
