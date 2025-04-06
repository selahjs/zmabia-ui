(function() {
    'use strict';
    angular
        .module('custom-stockmanagement')
        .config(routes);
    routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS'];
    function routes($stateProvider, STOCKMANAGEMENT_RIGHTS) {
        // For debugging - log available rights
        console.log('Available STOCKMANAGEMENT_RIGHTS:', STOCKMANAGEMENT_RIGHTS);
        $stateProvider.state('openlmis.stockmanagement.vaccineArrival', {
            url: '/vaccine-arrival',
            label: 'vaccineArrival.title',
            priority: 10,
            showInNavigation: true,
            // accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_INVENTORIES_EDIT],
            views: {
                '@openlmis': {
                    controller: 'VaccineArrivalController',
                    templateUrl: 'custom-stockmanagement/vaccine-arrival/vaccine-arrival.html',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                facility: function(facilityFactory) {
                    return facilityFactory.getUserHomeFacility();
                },
                programs: function(facility, programService) {
                    return programService.getUserPrograms(facility.id);
                }
            }
        });
        
        // Add the creation state
        $stateProvider.state('openlmis.stockmanagement.vaccineArrival.creation', {
            url: '/creation/:programId',
            views: {
                '@openlmis': {
                    // Replace with your actual creation controller and template
                    controller: 'VaccineArrivalCreationController',
                    templateUrl: 'custom-stockmanagement/vaccine-arrival-creation/vaccine-arrival-creation.html',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // Add resolvers for the creation state
            }
        });
    }
})();