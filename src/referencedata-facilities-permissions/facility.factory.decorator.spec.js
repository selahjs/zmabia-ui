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

describe('facilityFactory', function() {

    beforeEach(function() {
        module('referencedata-facilities-permissions');
        module('openlmis-rights');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.permissionService = $injector.get('permissionService');
            this.facilityService = $injector.get('facilityService');
            this.authorizationService = $injector.get('authorizationService');
            this.facilityFactory = $injector.get('facilityFactory');
            this.CCE_RIGHTS = $injector.get('CCE_RIGHTS');
            this.MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            this.PermissionDataBuilder = $injector.get('PermissionDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
        });

        this.minimalFacilities = [
            new this.MinimalFacilityDataBuilder().build(),
            new this.MinimalFacilityDataBuilder().build(),
            new this.MinimalFacilityDataBuilder().build()
        ];

        this.permissions = [
            new this.PermissionDataBuilder().withRight(this.CCE_RIGHTS.CCE_INVENTORY_VIEW)
                .withFacilityId(this.minimalFacilities[0].id)
                .build(),
            new this.PermissionDataBuilder().withRight(this.CCE_RIGHTS.CCE_INVENTORY_VIEW)
                .withFacilityId(this.minimalFacilities[1].id)
                .build(),
            new this.PermissionDataBuilder().withRight(this.CCE_RIGHTS.CCE_INVENTORY_EDIT)
                .withFacilityId(this.minimalFacilities[2].id)
                .build()
        ];

        spyOn(this.authorizationService, 'getUser').andReturn(new this.UserDataBuilder().buildAuthUserJson());
        spyOn(this.permissionService, 'load').andReturn(this.$q.resolve(this.permissions));
        spyOn(this.facilityService, 'getAllMinimal').andReturn(this.$q.resolve(this.minimalFacilities));
    });

    describe('getSupervisedFacilitiesBasedOnRights', function() {

        it('should filter facilities', function() {
            var result;

            this.facilityFactory.getSupervisedFacilitiesBasedOnRights([this.CCE_RIGHTS.CCE_INVENTORY_VIEW])
                .then(function(facilities) {
                    result = facilities;
                });
            this.$rootScope.$apply();

            expect(result.length).toBe(2);
            expect(result.indexOf(this.minimalFacilities[0])).toBeGreaterThan(-1);
            expect(result.indexOf(this.minimalFacilities[1])).toBeGreaterThan(-1);

            this.facilityFactory.getSupervisedFacilitiesBasedOnRights([this.CCE_RIGHTS.CCE_INVENTORY_EDIT])
                .then(function(facilities) {
                    result = facilities;
                });
            this.$rootScope.$apply();

            expect(result.length).toBe(1);
            expect(result.indexOf(this.minimalFacilities[2])).toBeGreaterThan(-1);
        });
    });
});
