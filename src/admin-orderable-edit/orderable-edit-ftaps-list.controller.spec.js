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

describe('OrderableEditFtapsListController', function() {

    beforeEach(function() {
        module('admin-orderable-edit', function($provide) {
            $provide.service('notificationService', function() {
                return jasmine.createSpyObj('notificationService', ['success', 'error']);
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.OrderableResource = $injector.get('OrderableResource');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.FunctionDecorator = $injector.get('FunctionDecorator');
            this.FacilityTypeApprovedProductDataBuilder = $injector.get('FacilityTypeApprovedProductDataBuilder');
            this.FacilityTypeApprovedProductResource = $injector.get('FacilityTypeApprovedProductResource');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.orderable = new this.OrderableDataBuilder().build();
        this.facilityType = new this.FacilityTypeDataBuilder().build();

        this.ftaps = [
            new this.FacilityTypeApprovedProductDataBuilder()
                .withOrderable(this.orderable)
                .build(),
            new this.FacilityTypeApprovedProductDataBuilder()
                .withOrderable(this.orderable)
                .build(),
            new this.FacilityTypeApprovedProductDataBuilder()
                .withOrderable(this.orderable)
                .withFacilityType(this.facilityType)
                .build(),
            new this.FacilityTypeApprovedProductDataBuilder()
                .withOrderable(this.orderable)
                .withFacilityType(this.facilityType)
                .build()
        ];

        this.ftapsPage = new this.PageDataBuilder()
            .withContent(this.ftaps)
            .build();

        this.ftapsMap = {};
        this.ftapsMap[this.ftaps[0].facilityType.id] = [this.ftaps[0]];
        this.ftapsMap[this.ftaps[1].facilityType.id] = [this.ftaps[1]];
        this.ftapsMap[this.ftaps[2].facilityType.id] = [this.ftaps[2], this.ftaps[3]];

        this.facilityTypesMap = {};
        this.facilityTypesMap[this.ftaps[0].facilityType.id] = this.ftaps[0].facilityType.name;
        this.facilityTypesMap[this.ftaps[1].facilityType.id] = this.ftaps[1].facilityType.name;
        this.facilityTypesMap[this.ftaps[2].facilityType.id] = this.ftaps[2].facilityType.name;

        spyOn(this.$state, 'reload');
        spyOn(this.FacilityTypeApprovedProductResource.prototype, 'update').andReturn(this.$q.resolve(this.ftaps[0]));
        spyOn(this.FunctionDecorator.prototype, 'withSuccessNotification').andCallThrough();
        spyOn(this.FunctionDecorator.prototype, 'withErrorNotification').andCallThrough();
        spyOn(this.FunctionDecorator.prototype, 'withConfirm').andCallThrough();

        var context = this;
        spyOn(this.FunctionDecorator.prototype, 'decorateFunction').andCallFake(function(fn) {
            context.fn = fn;
            return this;
        });

        spyOn(this.FunctionDecorator.prototype, 'getDecoratedFunction').andCallFake(function() {
            return context.fn;
        });

        this.vm = this.$controller('OrderableEditFtapsListController', {
            orderable: this.orderable,
            ftaps: this.ftaps,
            ftapsMap: this.ftapsMap,
            facilityTypesMap: this.facilityTypesMap,
            canEdit: this.canEdit
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose orderable', function() {
            expect(this.vm.orderable).toEqual(this.orderable);
        });

        it('should expose facility type approved proructs', function() {
            expect(this.vm.facilityTypeApprovedProducts).toEqual(this.ftaps);
        });

        it('should expose ftapsMap', function() {
            expect(this.vm.ftapsMap).toEqual(this.ftapsMap);
        });

        it('should expose facilityTypesMap', function() {
            expect(this.vm.facilityTypesMap).toEqual(this.facilityTypesMap);
        });

        it('should decorate with correct success message', function() {
            expect(this.FunctionDecorator.prototype.withSuccessNotification)
                .toHaveBeenCalledWith('adminOrderableEdit.ftapHasBeenRemovedSuccessfully');
        });

        it('should decorate with correct error message', function() {
            expect(this.FunctionDecorator.prototype.withErrorNotification)
                .toHaveBeenCalledWith('adminOrderableEdit.failedToRemovedFtap');
        });

        it('should decorate with correct confirm message', function() {
            expect(this.FunctionDecorator.prototype.withConfirm)
                .toHaveBeenCalledWith('adminOrderableEdit.confirmFtapDeactivation');
        });

    });

    describe('deactivateFacilityTypeApproveProduct', function() {

        it('should deactivate ftap', function() {
            this.vm.deactivateFacilityTypeApproveProduct(this.ftaps[0]);
            this.$rootScope.$apply();

            expect(this.FacilityTypeApprovedProductResource.prototype.update).toHaveBeenCalledWith(this.ftaps[0]);
        });

        it('should redirect to the list view on success', function() {
            this.vm.deactivateFacilityTypeApproveProduct(this.ftaps[0]);
            this.$rootScope.$apply();

            expect(this.$state.reload).toHaveBeenCalled();
        });

        it('should not redirect to the list view on failure', function() {
            this.FacilityTypeApprovedProductResource.prototype.update.andReturn(this.$q.reject());

            this.vm.deactivateFacilityTypeApproveProduct(this.ftaps[0]);
            this.$rootScope.$apply();

            expect(this.$state.reload).not.toHaveBeenCalled();
        });

    });
});