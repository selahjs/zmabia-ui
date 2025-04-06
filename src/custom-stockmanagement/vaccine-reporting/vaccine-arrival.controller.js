(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name custom-stockmanagement.controller:VaccineArrivalController
     *
     * @description
     * Controller for vaccine arrival feature.
     */
    angular
        .module('custom-stockmanagement')
        .controller('VaccineArrivalController', controller);

    controller.$inject = ['facility', 'programs', '$state', 'offlineService', 'localStorageService'];

    function controller(facility, programs, $state, offlineService, localStorageService) {
        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf custom-stockmanagement.controller:VaccineArrivalController
         * @name facility
         * @type {Object}
         *
         * @description
         * Holds user's home facility.
         */
        vm.facility = facility;

        /**
         * @ngdoc property
         * @propertyOf custom-stockmanagement.controller:VaccineArrivalController
         * @name programs
         * @type {Array}
         *
         * @description
         * Holds available programs for home facility.
         */
        vm.programs = programs;

        /**
         * @ngdoc property
         * @propertyOf custom-stockmanagement.controller:VaccineArrivalController
         * @name offline
         * @type {boolean}
         *
         * @description
         * Holds information about internet connection
         */
        vm.offline = offlineService.isOffline;

        // This is the key function used in the template
        vm.key = function(secondaryKey) {
            return 'vaccineArrival.' + secondaryKey;
        };

        // This function navigates to the creation state
        vm.proceed = function(program) {
            $state.go('openlmis.stockmanagement.vaccineArrival.creation', {
                programId: program.id,
                program: program,
                facility: facility
            });
        };

        vm.goToPendingOfflineEventsPage = function() {
            $state.go('openlmis.pendingOfflineEvents');
        };
    }
})();