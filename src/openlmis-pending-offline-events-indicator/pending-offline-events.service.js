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
     * @name openlmis-pending-offline-events-indicator.pendingOfflineEventsService
     *
     * @description
     * Responsible for retrieving pending offline events from the local storage.
     */
    angular
        .module('openlmis-pending-offline-events-indicator')
        .factory('pendingOfflineEventsService', service);

    service.$inject = ['$q'];

    function service($q) {

        return {
            getCountOfOfflineEvents: getCountOfOfflineEvents
        };

        /**
         * @ngdoc method
         * @methodOf openlmis-pending-offline-events-indicator.pendingOfflineEventsService
         * @name getCountOfOfflineEvents
         *
         * @description
         * Returned count of offline events
         *
         */
        function getCountOfOfflineEvents() {
            return $q.resolve(0);
        }

    }
})();
