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

describe('SupplyPartnerRepositoryImpl', function() {

    beforeEach(function() {
        module('referencedata-supply-partner');

        inject(function($injector) {
            this.SupplyPartnerRepositoryImpl = $injector.get('SupplyPartnerRepositoryImpl');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
            this.SupplyPartnerAssociationDataBuilder = $injector.get('SupplyPartnerAssociationDataBuilder');
            this.SupplyPartnerResource = $injector.get('SupplyPartnerResource');
            this.ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.programService = $injector.get('programService');
            this.SupervisoryNodeResource = $injector.get('SupervisoryNodeResource');
            this.FacilityResource = $injector.get('FacilityResource');
            this.OrderableResource = $injector.get('OrderableResource');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.supplyPartnerRepositoryImpl = new this.SupplyPartnerRepositoryImpl();

        this.programId = 'spri-program-id-1';
        this.supervisoryNodeId = 'spri-node-id-1';
        this.facilityId = 'spri-facility-id-1';
        this.orderableId = 'spri-orderable-id-1';

        this.programs = [
            new this.ProgramDataBuilder()
                .withId(this.programId)
                .build(),
            new this.ProgramDataBuilder().build()
        ];
        this.supervisoryNodes = [
            new this.SupervisoryNodeDataBuilder()
                .withId(this.supervisoryNodeId)
                .build(),
            new this.SupervisoryNodeDataBuilder().build()
        ];
        this.facilities = [
            new this.FacilityDataBuilder()
                .withId(this.facilityId)
                .build(),
            new this.FacilityDataBuilder().build()
        ];
        this.orderables = [
            new this.OrderableDataBuilder()
                .withId(this.orderableId)
                .build(),
            new this.OrderableDataBuilder().build()
        ];

        this.supplyPartner = new this.SupplyPartnerDataBuilder()
            .addAssociation(new this.SupplyPartnerAssociationDataBuilder()
                .withProgram(new this.ObjectReferenceDataBuilder()
                    .withId(this.programId)
                    .withResource('program')
                    .build())
                .withSupervisoryNode(new this.ObjectReferenceDataBuilder()
                    .withId(this.supervisoryNodeId)
                    .withResource('supervisoryNode')
                    .build())
                .addFacility(new this.ObjectReferenceDataBuilder()
                    .withId(this.facilityId)
                    .withResource('facility')
                    .build())
                .addOrderable(new this.ObjectReferenceDataBuilder()
                    .withId(this.orderableId)
                    .withResource('orderable')
                    .build())
                .build())
            .build();

        this.supervisoryNodesPage = new this.PageDataBuilder()
            .withContent(this.supervisoryNodes)
            .build();

        this.facilitiesPage = new this.PageDataBuilder()
            .withContent(this.facilities)
            .build();

        this.orderablesPage = new this.PageDataBuilder()
            .withContent(this.orderables)
            .build();

        spyOn(this.SupplyPartnerResource.prototype, 'get').andReturn(this.$q.resolve(this.supplyPartner));
        spyOn(this.SupplyPartnerResource.prototype, 'create').andReturn(this.$q.resolve(this.supplyPartner));
        spyOn(this.SupplyPartnerResource.prototype, 'update').andReturn(this.$q.resolve(this.supplyPartner));
        spyOn(this.SupervisoryNodeResource.prototype, 'query').andReturn(this.$q.resolve(this.supervisoryNodesPage));
        spyOn(this.FacilityResource.prototype, 'query').andReturn(this.$q.resolve(this.facilitiesPage));
        spyOn(this.OrderableResource.prototype, 'query').andReturn(this.$q.resolve(this.orderablesPage));
        spyOn(this.programService, 'getAll').andReturn(this.$q.resolve(this.programs));
    });

    describe('create', function() {

        it('should reject if unsuccessful', function() {
            this.SupplyPartnerResource.prototype.create.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartnerRepositoryImpl.create(this.supplyPartner)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
            expect(this.SupplyPartnerResource.prototype.create).toHaveBeenCalledWith(this.supplyPartner);
        });

        it('should resolve and return object if successful', function() {
            var result;
            this.supplyPartnerRepositoryImpl.create(this.supplyPartner)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.supplyPartner);
            expect(this.SupplyPartnerResource.prototype.create).toHaveBeenCalledWith(this.supplyPartner);
        });

    });

    describe('update', function() {

        it('should reject if unsuccessful', function() {
            this.SupplyPartnerResource.prototype.update.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartnerRepositoryImpl.update(this.supplyPartner)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
            expect(this.SupplyPartnerResource.prototype.update).toHaveBeenCalledWith(this.supplyPartner);
        });

        it('should resolve if successful', function() {
            var result;
            this.supplyPartnerRepositoryImpl.update(this.supplyPartner)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.supplyPartner);
            expect(this.SupplyPartnerResource.prototype.update).toHaveBeenCalledWith(this.supplyPartner);
        });

    });

    describe('get', function() {

        it('should reject if get supply partner unsuccessful', function() {
            this.SupplyPartnerResource.prototype.get.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartnerRepositoryImpl.get(this.supplyPartner.id)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
            expect(this.SupplyPartnerResource.prototype.get).toHaveBeenCalledWith(this.supplyPartner.id);
        });

        it('should resolve and return object with all expanded if all successful', function() {
            var result;
            this.supplyPartnerRepositoryImpl.get(this.supplyPartner.id)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(result.code).toEqual(this.supplyPartner.code);
            expect(result.associations[0].program.code).toEqual(this.programs[0].code);
            expect(result.associations[0].supervisoryNode.code).toEqual(this.supervisoryNodes[0].code);

            expect(this.programService.getAll).toHaveBeenCalled();
            expect(this.SupplyPartnerResource.prototype.get).toHaveBeenCalledWith(this.supplyPartner.id);
            expect(this.SupervisoryNodeResource.prototype.query).toHaveBeenCalledWith({
                id: [this.supervisoryNodeId]
            });

            expect(this.FacilityResource.prototype.query).toHaveBeenCalledWith({
                id: [this.facilityId]
            });

            expect(this.OrderableResource.prototype.query).toHaveBeenCalledWith({
                id: [this.orderableId]
            });
        });

    });

});
