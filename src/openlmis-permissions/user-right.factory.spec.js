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

describe('userRightsFactory', function() {

    beforeEach(function() {
        module('openlmis-permissions');

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.permissionService = $injector.get('permissionService');
            this.userRightsFactory = $injector.get('userRightsFactory');
            this.PermissionDataBuilder = $injector.get('PermissionDataBuilder');
        });

        this.programIds = [
            'program-1',
            'program-2'
        ];

        this.facilityIds = [
            'facility-1',
            'facility-2',
            'facility-3'
        ];

        this.exampleRightName = 'example';
        this.otherExampleRightName = 'otherExample';
        this.directRightName = 'directRight';

        var permissions = [
            new this.PermissionDataBuilder()
                .withRight(this.exampleRightName)
                .withFacilityId(this.facilityIds[0])
                .withProgramId(this.programIds[0])
                .build(),
            new this.PermissionDataBuilder()
                .withRight(this.exampleRightName)
                .withFacilityId(this.facilityIds[1])
                .withProgramId(this.programIds[0])
                .build(),
            new this.PermissionDataBuilder()
                .withRight(this.exampleRightName)
                .withFacilityId(this.facilityIds[2])
                .withProgramId(this.programIds[1])
                .build(),

            new this.PermissionDataBuilder()
                .withRight(this.otherExampleRightName)
                .withFacilityId(this.facilityIds[0])
                .build(),
            new this.PermissionDataBuilder()
                .withRight(this.otherExampleRightName)
                .withFacilityId(this.facilityIds[1])
                .build(),
            new this.PermissionDataBuilder()
                .withRight(this.directRightName)
                .build()
        ];

        spyOn(this.permissionService, 'load').andReturn(this.$q.resolve(permissions));

        var context = this;
        this.userRightsFactory.buildRights('userId')
            .then(function(rights) {
                context.rights = rights;
            });
        this.$rootScope.$apply();
    });

    it('should get permissions for userId', function() {
        expect(this.permissionService.load).toHaveBeenCalledWith('userId');
    });

    it('should not duplicate rights', function() {
        expect(this.rights.length).toBe(3);
    });

    it('should group programs', function() {
        expect(this.rights[0].programIds.length).toBe(2);
        expect(this.rights[0].programIds[0]).toBe(this.programIds[0]);
        expect(this.rights[0].programIds[1]).toBe(this.programIds[1]);
    });

    it('should group facilities', function() {
        expect(this.rights[1].facilityIds.length).toBe(2);
        expect(this.rights[1].facilityIds[0]).toBe(this.facilityIds[0]);
        expect(this.rights[1].facilityIds[1]).toBe(this.facilityIds[1]);
    });

    it('should mark right as direct if no program or facility id is associated with permission', function() {
        expect(this.rights[2].isDirect).toBe(true);
        expect(this.rights[1].isDirect).toBe(false);
    });
});
