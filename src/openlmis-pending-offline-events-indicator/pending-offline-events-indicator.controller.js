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
     * @ngdoc controller
     * @name pending-offline-events-indicator.controller:PendingOfflineEventsIndicatorController
     *
     * @description
     * Exposes count of the pending offline events.
     */
    angular
        .module('openlmis-pending-offline-events-indicator')
        .controller('PendingOfflineEventsIndicatorController', controller);

    controller.$inject = ['offlineService', 'pendingOfflineEventsService', '$rootScope', '$state'];

    function controller(offlineService, pendingOfflineEventsService, $rootScope, $state) {

        var vm = this;

        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf pending-offline-events-indicator.controller:PendingOfflineEventsIndicatorController
         * @name eventsCount
         * @type {Number}
         *
         * @description
         * Holds pending offline events count.
         */
        vm.eventsCount = 0;

        function onInit() {
            if (offlineService.isOffline()) {
                return pendingOfflineEventsService.getCountOfOfflineEvents()
                    .then(function(result) {
                        vm.eventsCount = result;
                    });
            }
        }

        $rootScope.$on('openlmis-referencedata.pending-offline-events-indicator', function() {
            $state.reload();
        });
    }

})();