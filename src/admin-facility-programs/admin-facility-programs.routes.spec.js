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

describe('openlmis.administration.facilities.facility.programs state', function() {

    beforeEach(function() {
        module('openlmis-modal-state', function($provide) {
            $provide.provider('modalState', function($stateProvider) {
                return $stateProvider;
            });
        });
        module('admin-facility-programs');
        module('admin-facility-view');

        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.openlmisModalService = $injector.get('openlmisModalService');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.programService = $injector.get('programService');
            this.facilityOperatorService = $injector.get('facilityOperatorService');
            this.geographicZoneService = $injector.get('geographicZoneService');
            this.facilityTypeService = $injector.get('facilityTypeService');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.FacilityOperatorDataBuilder = $injector.get('FacilityOperatorDataBuilder');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            this.GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.facilityTypes = [
            new this.FacilityTypeDataBuilder().build(),
            new this.FacilityTypeDataBuilder().build(),
            new this.FacilityTypeDataBuilder().build()
        ];

        this.facilityOperators = [
            new this.FacilityOperatorDataBuilder().build(),
            new this.FacilityOperatorDataBuilder().build(),
            new this.FacilityOperatorDataBuilder().build()
        ];

        this.geographicZones = [
            new this.GeographicZoneDataBuilder().build(),
            new this.GeographicZoneDataBuilder().build(),
            new this.GeographicZoneDataBuilder().build()
        ];

        this.dialogSpy = jasmine.createSpyObj('dialog', ['hide']);

        this.state = this.$state.get('openlmis.administration.facilities.facility.programs');

        spyOn(this.openlmisModalService, 'createDialog').andReturn(this.dialogSpy);
        spyOn(this.programService, 'getAll').andReturn(this.$q.when(this.programs));
        spyOn(this.facilityOperatorService, 'getAll').andReturn(this.$q.when(this.facilityOperators));

        spyOn(this.facilityTypeService, 'query').andReturn(this.$q.when(
            new this.PageDataBuilder()
                .withContent(this.facilityTypes)
                .build()
        ));

        spyOn(this.geographicZoneService, 'getAll').andReturn(this.$q.when(
            new this.PageDataBuilder()
                .withContent(this.geographicZones)
                .build()
        ));
    });

    it('should expect facility from parent state', function() {
        expect(this.state.parentResolves.indexOf('facility')).toBeGreaterThan(-1);
    });

    it('should resolve programs', function() {
        var result;

        this.state.resolve.programs(this.programService).then(function(programs) {
            result = programs;
        });
        this.$rootScope.$apply();

        expect(result).toEqual(this.programs);
    });

    it('should resolve facilityOperators', function() {
        var result;

        this.state.resolve.facilityOperators(this.facilityOperatorService).then(function(facilityOperators) {
            result = facilityOperators;
        });
        this.$rootScope.$apply();

        expect(result).toEqual(this.facilityOperators);
    });

    it('should resolve geographicZones', function() {
        var result;

        this.state.resolve.geographicZones(this.$q, this.geographicZoneService).then(function(geographicZones) {
            result = geographicZones;
        });
        this.$rootScope.$apply();

        expect(result).toEqual(this.geographicZones);
    });

    it('should resolve facilityTypes', function() {
        var result;

        this.state.resolve.facilityTypes(this.facilityTypeService).then(function(facilityTypes) {
            result = facilityTypes;
        });
        this.$rootScope.$apply();

        expect(result).toEqual(this.facilityTypes);
    });

    it('should use facility-programs.html template', function() {
        expect(this.state.templateUrl).toEqual('admin-facility-programs/facility-programs.html');
    });

    it('should expose controller as vm', function() {
        expect(this.state.controllerAs).toEqual('vm');
    });

    it('should expose FacilityViewController', function() {
        expect(this.state.controller).toEqual('FacilityViewController');
    });

});
