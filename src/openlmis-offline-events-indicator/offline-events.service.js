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
     * @name openlmis-offline-events-indicator.offlineEventsService
     *
     * @description
     * Responsible for retrieving offline events.
     */
    angular
        .module('openlmis-offline-events-indicator')
        .factory('offlineEventsService', service);

    service.$inject = ['$q'];

    function service($q) {

        return {
            getCountOfPendingOfflineEvents: getCountOfPendingOfflineEvents,
            getCountOfSyncErrorEvents: getCountOfSyncErrorEvents
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-offline-events-indicator.offlineEventsService
         * @name getCountOfPendingOfflineEvents
         *
         * @description
         * Returns count of offline events
         *
         */
        function getCountOfPendingOfflineEvents() {
            return $q.resolve(0);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-offline-events-indicator.offlineEventsService
         * @name getCountOfSyncErrorEvents
         *
         * @description
         * Returns count of synchronization error events from cache
         *
         */
        function getCountOfSyncErrorEvents() {
            return $q.resolve(0);
        }

    }
})();
