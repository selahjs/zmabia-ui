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

describe('openlmis.orders.view state', function() {

    var $q, $state, $rootScope, requestingFacilityFactory, state, minimalFacilities, FULFILLMENT_RIGHTS,
        permissionService, authorizationService, $stateParams;

    beforeEach(function() {
        loadModules();
        injectServices();
        prepareTestData();
        prepareSpies();
    });

    it('should fetch a list of requesting facilities', function() {
        $stateParams.supplyingFacilityId = 'supplying-facility';

        var result;

        state.resolve.requestingFacilities(requestingFacilityFactory, $stateParams).then(function(facilities) {
            result = facilities;
        });
        $rootScope.$apply();

        expect(result).toEqual(minimalFacilities);
        expect(requestingFacilityFactory.loadRequestingFacilities).toHaveBeenCalledWith('supplying-facility');
    });

    it('should require FULFILLMENT_RIGHTS right to enter', function() {
        expect(state.accessRights).toEqual([FULFILLMENT_RIGHTS.PODS_MANAGE, FULFILLMENT_RIGHTS.ORDERS_VIEW]);
    });

    it('should not try to check permission if supplyingFacilityId is undefined', function() {
        spyOn(permissionService, 'hasPermissionWithAnyProgram').andReturn();

        $stateParams.supplyingFacilityId = undefined;

        state.resolve.canRetryTransfer(authorizationService,
            permissionService, $stateParams);
        $rootScope.$apply();

        expect(permissionService.hasPermissionWithAnyProgram).not.toHaveBeenCalled();

    });

    it('should return false if supplying facility is not selected', function() {
        $stateParams.supplyingFacilityId = undefined;

        var result = state.resolve.canRetryTransfer(authorizationService,
            permissionService, $stateParams);
        $rootScope.$apply();

        expect(result).toEqual(false);
    });

    it('should return false if user cannot retry to transfer order', function() {

        $stateParams.supplyingFacilityId = undefined;
        spyOn(authorizationService, 'getUser').andReturn({
            //eslint-disable-next-line camelcase
            user_id: '123'
        });
        spyOn(permissionService, 'hasPermissionWithAnyProgram').andReturn($q.when(false));

        var result = state.resolve.canRetryTransfer(authorizationService, permissionService, $stateParams);

        expect(result).toEqual(false);
    });

    it('should return true if user can retry transfer order', function() {

        $stateParams.supplyingFacilityId = undefined;
        spyOn(authorizationService, 'getUser').andReturn({
            //eslint-disable-next-line camelcase
            user_id: '123'
        });
        spyOn(permissionService, 'hasPermissionWithAnyProgram').andReturn($q.when(true));

        var result = state.resolve.canRetryTransfer(authorizationService, permissionService, $stateParams);

        expect(result).toEqual(false);
    });

    function loadModules() {
        module('openlmis-main-state');
        module('order');
        module('order-view');
    }

    function injectServices() {
        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            requestingFacilityFactory = $injector.get('requestingFacilityFactory');
            permissionService = $injector.get('permissionService');
            authorizationService = $injector.get('authorizationService');
            FULFILLMENT_RIGHTS = $injector.get('FULFILLMENT_RIGHTS');
        });
    }

    function prepareTestData() {
        state = $state.get('openlmis.orders.view');
        $stateParams = {};
        minimalFacilities = [
            {
                id: 'facility-1',
                name: 'Facility One'
            },
            {
                id: 'facility-2',
                name: 'Facility Two'
            },
            {
                id: 'facility-3',
                name: 'Facility Three'
            }
        ];
    }

    function prepareSpies() {
        spyOn(requestingFacilityFactory, 'loadRequestingFacilities').andReturn($q.when(minimalFacilities));
    }
});
