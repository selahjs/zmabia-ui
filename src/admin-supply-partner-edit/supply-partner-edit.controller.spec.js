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

describe('SupplyPartnerEditController', function() {

    beforeEach(function() {
        module('admin-supply-partner-edit');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.$q = $injector.get('$q');
            this.ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
            this.SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');
            this.SupplyPartnerAssociationDataBuilder = $injector.get('SupplyPartnerAssociationDataBuilder');
            this.viewItemsModalService = $injector.get('viewItemsModalService');
        });

        this.facility = new this.ObjectReferenceDataBuilder()
            .withResource('facility')
            .build();
        this.orderable = new this.ObjectReferenceDataBuilder()
            .withResource('orderable')
            .build();
        this.association = new this.SupplyPartnerAssociationDataBuilder()
            .addFacility(this.facility)
            .addOrderable(this.orderable)
            .build();
        this.associations = [this.association];
        this.supplyPartner = new this.SupplyPartnerDataBuilder()
            .addAssociation(this.association)
            .build();

        this.vm = this.$controller('SupplyPartnerEditController', {
            supplyPartner: this.supplyPartner,
            associations: this.associations
        });
        this.vm.$onInit();

        spyOn(this.viewItemsModalService, 'show');
    });

    describe('onInit', function() {

        it('should expose goToSupplyPartnerList method', function() {
            expect(angular.isFunction(this.vm.goToSupplyPartnerList)).toBe(true);
        });

        it('should expose supplyPartner', function() {
            expect(this.vm.supplyPartner).toEqual(this.supplyPartner);
        });

        it('should expose associations', function() {
            expect(this.vm.associations).toEqual(this.associations);
        });
    });

    describe('goToSupplyPartnerList', function() {

        beforeEach(function() {
            spyOn(this.$state, 'go').andReturn();
            this.vm.goToSupplyPartnerList();
        });

        it('should call state go with correct params', function() {
            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });
    });

    describe('viewFacilities', function() {

        beforeEach(function() {
            this.viewItemsModalService.show.andReturn(this.$q.resolve([]));
        });

        it('should open modal', function() {
            this.vm.viewFacilities(0);

            expect(this.viewItemsModalService.show).toHaveBeenCalledWith({
                titleLabel: 'adminSupplyPartnerEdit.associatedFacilities',
                items: [this.facility]
            });
        });
    });

    describe('viewOrderables', function() {

        beforeEach(function() {
            this.viewItemsModalService.show.andReturn(this.$q.resolve([]));
        });

        it('should open modal', function() {
            this.vm.viewOrderables(0);

            expect(this.viewItemsModalService.show).toHaveBeenCalledWith({
                titleLabel: 'adminSupplyPartnerEdit.associatedProducts',
                items: [this.orderable]
            });
        });
    });
});
