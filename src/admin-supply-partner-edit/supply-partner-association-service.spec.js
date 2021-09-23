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

describe('SupplyPartnerAssociationService', function() {

    beforeEach(function() {
        module('admin-supply-partner-edit');

        inject(function($injector) {
            this.SupplyPartnerAssociationService = $injector.get('SupplyPartnerAssociationService');
            this.SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
            this.SupplyPartnerAssociationDataBuilder = $injector.get('SupplyPartnerAssociationDataBuilder');
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.FacilityTypeApprovedProductDataBuilder = $injector.get('FacilityTypeApprovedProductDataBuilder');
            this.FacilityTypeApprovedProductResource = $injector.get('FacilityTypeApprovedProductResource');
            this.SupervisoryNodeFacilityResource = $injector.get('SupervisoryNodeFacilityResource');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.supervisoryNodes = [
            new this.SupervisoryNodeDataBuilder().build(),
            new this.SupervisoryNodeDataBuilder().buildPartnerNode()
        ];

        this.association = new this.SupplyPartnerAssociationDataBuilder()
            .withSupervisoryNode(this.supervisoryNodes[1])
            .buildWithFacilitiesAndOrderables();

        this.supplyPartner = new this.SupplyPartnerDataBuilder()
            .withAssociations([
                this.association,
                new this.SupplyPartnerAssociationDataBuilder().build()
            ])
            .build();

        this.newAssociation = {
            facilities: [],
            orderables: []
        };

        this.stateParams = {
            programId: this.supplyPartner.associations[1].program.id,
            supervisoryNodeId: this.supplyPartner.associations[1].supervisoryNode.id
        };

        this.facilityTypes = [
            new this.FacilityTypeDataBuilder()
                .withCode('custom-code-one')
                .build(),
            new this.FacilityTypeDataBuilder()
                .withCode('custom-code-two')
                .build()
        ];

        this.facilities = [
            new this.FacilityDataBuilder()
                .withId(this.supplyPartner.associations[0].facilities[0].id)
                .withFacilityType(this.facilityTypes[0])
                .build(),
            new this.FacilityDataBuilder()
                .withId(this.supplyPartner.associations[0].facilities[1].id)
                .withFacilityType(this.facilityTypes[1])
                .build()
        ];

        this.programs = [
            new this.ProgramDataBuilder()
                .withId(this.supplyPartner.associations[0].program.id)
                .build(),
            new this.ProgramDataBuilder().build()
        ];

        this.orderables = [
            new this.OrderableDataBuilder().build(),
            new this.OrderableDataBuilder().build()
        ];

        this.facilityTypeApprovedProducts = [
            new this.FacilityTypeApprovedProductDataBuilder()
                .withOrderable(this.orderables[0])
                .build(),
            new this.FacilityTypeApprovedProductDataBuilder()
                .withOrderable(this.orderables[1])
                .build(),
            new this.FacilityTypeApprovedProductDataBuilder()
                .withOrderable(this.orderables[0])
                .build(),
            new this.FacilityTypeApprovedProductDataBuilder()
                .withOrderable(this.orderables[1])
                .build(),
            new this.FacilityTypeApprovedProductDataBuilder()
                .withOrderable(angular.copy(this.orderables[1]))
                .build()
        ];

        this.facilitiesPage = new this.PageDataBuilder()
            .withContent(this.facilities)
            .build();

        this.supplyPartnerAssociationService = new this.SupplyPartnerAssociationService();

        spyOn(this.SupervisoryNodeFacilityResource.prototype, 'query');
        spyOn(this.FacilityTypeApprovedProductResource.prototype, 'getAll');
    });

    describe('getAssociation', function() {

        it('should return matching association', function() {
            var result = this.supplyPartnerAssociationService.getAssociation(this.supplyPartner, this.stateParams);

            expect(result).toEqual(this.supplyPartner.associations[1]);
        });

        it('should return new association when program is not passed', function() {
            this.stateParams.programId = undefined;

            var result = this.supplyPartnerAssociationService.getAssociation(this.supplyPartner, this.stateParams);

            expect(result).toEqual(this.newAssociation);
        });

        it('should return new association when supervisory node is not passed', function() {
            this.stateParams.supervisoryNodeId = undefined;

            var result = this.supplyPartnerAssociationService.getAssociation(this.supplyPartner, this.stateParams);

            expect(result).toEqual(this.newAssociation);
        });

        it('should throw exception if supply partner is not given', function() {
            var supplyPartnerAssociationService = this.supplyPartnerAssociationService,
                stateParams = this.stateParams;

            expect(function() {
                supplyPartnerAssociationService.getAssociation(undefined, stateParams);
            }).toThrow();

            expect(function() {
                supplyPartnerAssociationService.getAssociation(null, stateParams);
            }).toThrow();
        });

        it('should throw exception if state parameters are not given', function() {
            var supplyPartnerAssociationService = this.supplyPartnerAssociationService,
                supplyPartner = this.supplyPartner;

            expect(function() {
                supplyPartnerAssociationService.getAssociation(supplyPartner, undefined);
            }).toThrow();

            expect(function() {
                supplyPartnerAssociationService.getAssociation(supplyPartner, null);
            }).toThrow();
        });

    });

    describe('getFacilities', function() {

        beforeEach(function() {
            this.SupervisoryNodeFacilityResource.prototype.query.andReturn(this.$q.resolve(this.facilitiesPage));
        });

        it('should reject if failure', function() {
            this.SupervisoryNodeFacilityResource.prototype.query.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartnerAssociationService.getFacilities(this.association, this.supervisoryNodes)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should return empty list if association has no supervisory node', function() {
            this.association.supervisoryNode = undefined;

            var result;
            this.supplyPartnerAssociationService.getFacilities(this.association, this.supervisoryNodes)
                .then(function(facilities) {
                    result = facilities;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([]);
        });

        it('should return empty list if association has no program', function() {
            this.association.program = undefined;

            var result;
            this.supplyPartnerAssociationService.getFacilities(this.association, this.supervisoryNodes)
                .then(function(facilities) {
                    result = facilities;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([]);
        });

        it('should return a list of matching facilities', function() {
            var result;
            this.supplyPartnerAssociationService.getFacilities(this.association, this.supervisoryNodes)
                .then(function(facilities) {
                    result = facilities;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.facilitiesPage.content);
        });

        it('should fetch facilities for correct program and supervisory node', function() {
            this.supplyPartnerAssociationService.getFacilities(this.association, this.supervisoryNodes);

            expect(this.SupervisoryNodeFacilityResource.prototype.query).toHaveBeenCalledWith({
                supervisoryNodeId: this.supervisoryNodes[1].partnerNodeOf.id,
                programId: this.association.program.id
            });
        });

    });

    describe('getOrderables', function() {

        beforeEach(function() {
            this.FacilityTypeApprovedProductResource.prototype.getAll
                .andReturn(this.$q.resolve(this.facilityTypeApprovedProducts));
        });

        it('should return empty list when association has no facilities', function() {
            this.association.facilities = [];

            var result;
            this.supplyPartnerAssociationService.getOrderables(this.association, this.facilities, this.programs)
                .then(function(orderables) {
                    result = orderables;
                });
            this.$rootScope.$apply();

            expect(result).toEqual([]);
        });

        it('should return a list of orderables', function() {
            var result;
            this.supplyPartnerAssociationService.getOrderables(this.association, this.facilities, this.programs)
                .then(function(orderables) {
                    result = orderables;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.orderables);
        });

        it('should fetch orderables for matching program and facility types', function() {
            this.supplyPartnerAssociationService.getOrderables(this.association, this.facilities, this.programs);

            expect(this.FacilityTypeApprovedProductResource.prototype.getAll)
                .toHaveBeenCalledWith({
                    program: this.programs[0].code,
                    facilityType: [
                        this.facilityTypes[0].code,
                        this.facilityTypes[1].code
                    ]
                });
        });

        it('should throw exception when association is not defined', function() {
            var supplyPartnerAssociationService = this.supplyPartnerAssociationService,
                facilities = this.facilities,
                programs = this.programs;

            expect(function() {
                supplyPartnerAssociationService.getOrderables(undefined, facilities, programs);
            }).toThrow();

            expect(function() {
                supplyPartnerAssociationService.getOrderables(null, facilities, programs);
            }).toThrow();
        });

        it('should throw exception when the list of facilities is not defined', function() {
            var supplyPartnerAssociationService = this.supplyPartnerAssociationService,
                association = this.association,
                programs = this.programs;

            expect(function() {
                supplyPartnerAssociationService.getOrderables(association, undefined, programs);
            }).toThrow();

            expect(function() {
                supplyPartnerAssociationService.getOrderables(association, null, programs);
            }).toThrow();
        });

        it('should throw exception when the list of programs is not defined', function() {
            var supplyPartnerAssociationService = this.supplyPartnerAssociationService,
                association = this.association,
                facilities = this.facilities;

            expect(function() {
                supplyPartnerAssociationService.getOrderables(association, facilities, undefined);
            }).toThrow();

            expect(function() {
                supplyPartnerAssociationService.getOrderables(association, facilities, null);
            }).toThrow();
        });

        it('should reject when fetch fails', function() {
            this.FacilityTypeApprovedProductResource.prototype.getAll.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartnerAssociationService.getOrderables(this.association, this.facilities, this.programs)
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

    });

});
