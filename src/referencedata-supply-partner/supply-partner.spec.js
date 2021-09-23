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

describe('SupplyPartner', function() {

    beforeEach(function() {
        module('referencedata-supply-partner');

        var SupplyPartner;

        inject(function($injector) {
            SupplyPartner = $injector.get('SupplyPartner');

            this.SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
            this.SupplyPartnerRepository = $injector.get('SupplyPartnerRepository');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.SupplyPartnerAssociationDataBuilder = $injector.get('SupplyPartnerAssociationDataBuilder');
        });

        this.json = new this.SupplyPartnerDataBuilder()
            .withAssociations()
            .buildJson();
        this.repository = new this.SupplyPartnerRepository();
        this.supplyPartner = new SupplyPartner(this.json, this.repository);

        spyOn(this.repository, 'create');
        spyOn(this.repository, 'update');
    });

    describe('constructor', function() {

        it('should set all properties', function() {
            expect(this.supplyPartner.id).toEqual(this.json.id);
            expect(this.supplyPartner.name).toEqual(this.json.name);
            expect(this.supplyPartner.code).toEqual(this.json.code);
            expect(this.supplyPartner.repository).toEqual(this.repository);
        });

    });

    describe('create', function() {

        it('should reject if create fails', function() {
            this.repository.create.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartner.create().catch(function() {
                rejected = true;
            });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should resolve when create is successful', function() {
            this.repository.create.andReturn(this.$q.resolve(this.supplyPartner));

            var result;
            this.supplyPartner.create().then(function(response) {
                result = response;
            });
            this.$rootScope.$apply();

            expect(result).toEqual(this.supplyPartner);
        });

    });

    describe('getAssociationByProgramAndSupervisoryNode', function() {

        beforeEach(function() {
            this.programId = 'program-id';
            this.supervisoryNodeId = 'supervisory-node-id';
        });

        it('should return undefined if no association matches the given parameters', function() {
            var result = this.supplyPartner.getAssociationByProgramAndSupervisoryNode(
                this.programId, this.supervisoryNodeId
            );

            expect(result).toBeUndefined();
        });

        it('should throw an exception if program id is not given', function() {
            var supplyPartner = this.supplyPartner,
                supervisoryNodeId = this.supervisoryNodeId;

            expect(function() {
                supplyPartner.getAssociationByProgramAndSupervisoryNode(undefined, supervisoryNodeId);
            }).toThrow('Program ID must be defined');

            expect(function() {
                supplyPartner.getAssociationByProgramAndSupervisoryNode(null, supervisoryNodeId);
            }).toThrow('Program ID must be defined');
        });

        it('should throw an exception if supervisory node is not given', function() {
            var supplyPartner = this.supplyPartner,
                programId = this.programId;

            expect(function() {
                supplyPartner.getAssociationByProgramAndSupervisoryNode(programId, undefined);
            }).toThrow('Supervisory node ID must be defined');

            expect(function() {
                supplyPartner.getAssociationByProgramAndSupervisoryNode(programId, null);
            }).toThrow('Supervisory node ID must be defined');
        });

        it('should return matching association', function() {
            var expectedAssociation = this.supplyPartner.associations[0];

            var result = this.supplyPartner.getAssociationByProgramAndSupervisoryNode(
                expectedAssociation.program.id,
                expectedAssociation.supervisoryNode.id
            );

            expect(result).toEqual(expectedAssociation);
        });

        it('should return undefined if program does not match', function() {
            var result = this.supplyPartner.getAssociationByProgramAndSupervisoryNode(
                'definitely-not-matching-id',
                this.supplyPartner.associations[0].supervisoryNode.id
            );

            expect(result).toBeUndefined();
        });

        it('should return undefined if supervisory node does not match', function() {
            var result = this.supplyPartner.getAssociationByProgramAndSupervisoryNode(
                this.supplyPartner.associations[0].program.id,
                'definitely-not-matching-id'
            );

            expect(result).toBeUndefined();
        });

        it('should return undefined if both program and supervisory node do not match', function() {
            var result = this.supplyPartner.getAssociationByProgramAndSupervisoryNode(
                'definitely-not-matching-id',
                'definitely-not-matching-id'
            );

            expect(result).toBeUndefined();
        });

    });

    describe('addAssociation', function() {

        it('should override the existing association if ID matches', function() {
            var associationCopy = angular.copy(this.supplyPartner.associations[1]),
                association = this.supplyPartner.associations[1];

            associationCopy.facilities = [associationCopy.facilities[0]];

            this.supplyPartner.addAssociation(associationCopy);

            expect(this.supplyPartner.associations[1]).toBe(associationCopy);
            expect(this.supplyPartner.associations[1]).not.toBe(association);
        });

        it('should add new association if association has no id', function() {
            var newAssociation = new this.SupplyPartnerAssociationDataBuilder().buildAsNew();

            this.supplyPartner.addAssociation(newAssociation);

            expect(this.supplyPartner.associations.pop()).toEqual(newAssociation);
        });

        it('should not create a new association when updating a new one', function() {
            var newAssociation = new this.SupplyPartnerAssociationDataBuilder().buildAsNew();

            this.supplyPartner.addAssociation(angular.copy(newAssociation));

            newAssociation.facilities = [newAssociation.facilities[0]];

            this.supplyPartner.addAssociation(angular.copy(newAssociation));

            expect(this.supplyPartner.associations.length).toBe(3);
            expect(this.supplyPartner.associations[2]).toEqual(newAssociation);
        });

    });

    describe('removeAssociation', function() {

        it('should remove the association if it is a part of the supply partner', function() {
            this.supplyPartner.removeAssociation(this.supplyPartner.associations[1]);

            expect(this.supplyPartner.associations.length).toBe(1);
        });

        it('should do nothing if the association is not a part of the supply partner', function() {
            this.supplyPartner.removeAssociation(new this.SupplyPartnerAssociationDataBuilder().build());

            expect(this.supplyPartner.associations.length).toBe(2);
        });

        it('should do nothing if association is not given', function() {
            this.supplyPartner.removeAssociation(undefined);

            expect(this.supplyPartner.associations.length).toBe(2);

            this.supplyPartner.removeAssociation(null);

            expect(this.supplyPartner.associations.length).toBe(2);
        });

    });

    describe('save', function() {

        it('should create new supply partner when supply partner has no ID', function() {
            this.supplyPartner.id = undefined;

            this.supplyPartner.save();

            expect(this.repository.create).toHaveBeenCalledWith(this.supplyPartner);
        });

        it('should update supply partner if it has ID', function() {
            this.supplyPartner.save();

            expect(this.repository.update).toHaveBeenCalledWith(this.supplyPartner);
        });

        it('should reject if creation fails', function() {
            this.repository.create.andReturn(this.$q.reject());
            this.supplyPartner.id = undefined;

            var rejected;
            this.supplyPartner.save()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if update fails', function() {
            this.repository.update.andReturn(this.$q.reject());

            var rejected;
            this.supplyPartner.save()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

    });

});
