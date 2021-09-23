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

describe('RequisitionGroupListController', function() {

    beforeEach(function() {
        module('admin-requisition-group-list');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.ObjectMapper = $injector.get('ObjectMapper');
            this.RequisitionGroupDataBuilder = $injector.get('RequisitionGroupDataBuilder');
            this.GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');

        });

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];
        this.geographicZones = [
            new this.GeographicZoneDataBuilder().build(),
            new this.GeographicZoneDataBuilder().build()
        ];
        this.requisitionGroups = [
            new this.RequisitionGroupDataBuilder().buildJson(),
            new this.RequisitionGroupDataBuilder().buildJson()
        ];
        this.facilitiesMap = new this.ObjectMapper().map(this.requisitionGroups.map(function(group) {
            return group.supervisoryNode.facility;
        }));
        this.stateParams = {
            page: 0,
            size: 10,
            zone: this.geographicZones[0].code,
            name: 'requisition-group',
            program: this.programs[0].code
        };

        this.vm = this.$controller('RequisitionGroupListController', {
            requisitionGroups: this.requisitionGroups,
            programs: this.programs,
            geographicZones: this.geographicZones,
            $stateParams: this.stateParams,
            facilitiesMap: this.facilitiesMap
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose search method', function() {
            expect(angular.isFunction(this.vm.search)).toBe(true);
        });

        it('should expose requisition groups array', function() {
            expect(this.vm.requisitionGroups).toEqual(this.requisitionGroups);
        });

        it('should expose programs array', function() {
            expect(this.vm.programs).toEqual(this.programs);
        });

        it('should expose name', function() {
            expect(this.vm.name).toEqual(this.stateParams.name);
        });

        it('should expose program', function() {
            expect(this.vm.program).toEqual(this.stateParams.program);
        });

        it('should expose geographic zone', function() {
            expect(this.vm.geographicZone).toEqual(this.stateParams.zone);
        });

        it('should expose facilities map', function() {
            expect(this.vm.facilitiesMap).toEqual(this.facilitiesMap);
        });
    });

    describe('search', function() {

        it('should set all params', function() {
            this.vm.geographicZone = 'some-zone';
            this.vm.program = 'some-program';
            this.vm.name = 'some-name';

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.requisitionGroupList', {
                page: this.stateParams.page,
                size: this.stateParams.size,
                zone: 'some-zone',
                name: 'some-name',
                program: 'some-program'
            }, {
                reload: true
            });
        });

        it('should call state go method', function() {
            this.vm.search();

            expect(this.$state.go).toHaveBeenCalled();
        });
    });
});
