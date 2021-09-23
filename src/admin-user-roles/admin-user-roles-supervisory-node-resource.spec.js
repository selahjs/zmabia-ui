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

describe('AdminUserRolesSupervisoryNodeResource', function() {

    beforeEach(function() {
        var suite = this;

        module('admin-user-roles', function($provide) {
            suite.OpenlmisResource = jasmine.createSpy('OpenlmisResource');
            suite.query = jasmine.createSpy('query');

            suite.OpenlmisResource.prototype.query = suite.query;

            $provide.factory('OpenlmisResource', function() {
                return suite.OpenlmisResource;
            });
        });

        this.supervisoryNodes = [];

        inject(function($injector) {
            this.AdminUserRolesSupervisoryNodeResource = $injector.get('AdminUserRolesSupervisoryNodeResource');
            this.MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
        });

        var facilityMap = {};
        for (var i = 0; i < 5; i++) {
            var facility = new this.MinimalFacilityDataBuilder().build();
            facilityMap[facility.id] = facility;

            this.supervisoryNodes.push(new this.SupervisoryNodeDataBuilder()
                .withFacility(facility)
                .build());
        }

        this.resource = new this.AdminUserRolesSupervisoryNodeResource(facilityMap);
        this.query.andReturn(this.$q.resolve(new this.PageDataBuilder()
            .withContent(this.supervisoryNodes)
            .build()));
    });

    describe('constructor', function() {

        it('should extend OpenlmisResource', function() {
            expect(this.OpenlmisResource).toHaveBeenCalledWith('/api/supervisoryNodes');
        });

    });

    describe('query', function() {

        it('should match supervisory nodes with facilities', function() {
            var list;

            this.resource.query().then(function(page) {
                list = page.content;
            });

            this.$rootScope.$apply();

            expect(list).toEqual(this.supervisoryNodes);
            expect(this.query).toHaveBeenCalled();
        });

    });
});
