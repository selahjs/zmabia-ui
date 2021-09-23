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

describe('OrderableAddEditFtapsController', function() {

    beforeEach(function() {
        module('admin-orderable-edit', function($provide) {
            $provide.service('notificationService', function() {
                return jasmine.createSpyObj('notificationService', ['success', 'error']);
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.confirmService = $injector.get('confirmService');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.FacilityTypeApprovedProductDataBuilder = $injector.get('FacilityTypeApprovedProductDataBuilder');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.FacilityTypeApprovedProductResource = $injector.get('FacilityTypeApprovedProductResource');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.facilityType = new this.FacilityTypeDataBuilder().build();
        this.orderable = new this.OrderableDataBuilder().build();

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.ftap = new this.FacilityTypeApprovedProductDataBuilder()
            .withOrderable(this.orderable)
            .withFacilityType(this.facilityType)
            .withProgram(this.programs[0])
            .buildJson();

        this.ftapsPage = new this.PageDataBuilder()
            .withContent([this.ftap])
            .build();

        this.successNotificationKey = 'successMessage.key';
        this.errorNotificationKey = 'errorMessage.key';

        spyOn(this.$state, 'go').andReturn(true);
        spyOn(this.FacilityTypeApprovedProductResource.prototype, 'query').andReturn(this.$q.resolve(this.ftapsPage));
        spyOn(this.FacilityTypeApprovedProductResource.prototype, 'update').andReturn(this.$q.resolve(this.ftap));
        spyOn(this.FacilityTypeApprovedProductResource.prototype, 'create').andReturn(this.$q.resolve(this.ftap));

        this.vm = this.$controller('OrderableAddEditFtapsController', {
            facilityTypeApprovedProduct: this.ftap,
            programOrderables: this.programs,
            facilityTypes: this.facilityTypes,
            canEdit: true,
            successNotificationKey: this.successNotificationKey,
            errorNotificationKey: this.errorNotificationKey
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose ftap', function() {
            expect(this.vm.facilityTypeApprovedProduct).toEqual(this.ftap);
        });

        it('should expose programs', function() {
            expect(this.vm.programs).toEqual(this.programs);
        });

        it('should expose facility types', function() {
            expect(this.vm.facilityTypes).toEqual(this.facilityTypes);
        });

        it('should expose canEdit', function() {
            expect(this.vm.canEdit).toBeTruthy();
        });

    });

    describe('goToFtapsList', function() {

        it('should call state go', function() {
            this.vm.goToFtapsList();

            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });
    });

    describe('saveFacilityTypeApprovedProduct', function() {

        it('should update existing active ftap', function() {
            this.vm.saveFacilityTypeApprovedProduct();
            this.$rootScope.$apply();

            expect(this.FacilityTypeApprovedProductResource.prototype.update)
                .toHaveBeenCalledWith(this.ftap);
        });

        it('should update existing inactive ftap', function() {
            this.vm.facilityTypeApprovedProduct.id = undefined;
            this.vm.facilityTypeApprovedProduct.emergencyOrderPoint = undefined;
            this.vm.facilityTypeApprovedProduct.minPeriodsOfStock = undefined;
            this.vm.facilityTypeApprovedProduct.maxPeriodsOfStock = 10;

            this.vm.saveFacilityTypeApprovedProduct();
            this.$rootScope.$apply();

            expect(this.FacilityTypeApprovedProductResource.prototype.query).toHaveBeenCalledWith({
                program: this.vm.facilityTypeApprovedProduct.program.code,
                facilityType: this.vm.facilityTypeApprovedProduct.facilityType.code,
                orderableId: this.vm.facilityTypeApprovedProduct.orderable.id,
                active: false
            });

            var expectedFtap = this.ftap;
            expectedFtap.emergencyOrderPoint = undefined;
            expectedFtap.minPeriodsOfStock = undefined;
            expectedFtap.maxPeriodsOfStock = 10;

            expect(this.FacilityTypeApprovedProductResource.prototype.update)
                .toHaveBeenCalledWith(expectedFtap);
        });

        it('should create new ftap if it never existed', function() {
            this.FacilityTypeApprovedProductResource.prototype.query.andReturn(this.$q.resolve(
                new this.PageDataBuilder()
                    .withContent([])
            ));
            this.vm.facilityTypeApprovedProduct.id = undefined;

            this.vm.saveFacilityTypeApprovedProduct();
            this.$rootScope.$apply();

            expect(this.FacilityTypeApprovedProductResource.prototype.query).toHaveBeenCalledWith({
                program: this.vm.facilityTypeApprovedProduct.program.code,
                facilityType: this.vm.facilityTypeApprovedProduct.facilityType.code,
                orderableId: this.vm.facilityTypeApprovedProduct.orderable.id,
                active: false
            });

            expect(this.FacilityTypeApprovedProductResource.prototype.create)
                .toHaveBeenCalledWith(this.ftap);
        });

        it('should redirect to the list view on success', function() {
            this.vm.saveFacilityTypeApprovedProduct();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should not redirect to the list view on failure', function() {
            this.vm.facilityTypeApprovedProduct.id = undefined;
            this.FacilityTypeApprovedProductResource.prototype.query.andReturn(this.$q.reject());

            this.vm.saveFacilityTypeApprovedProduct();
            this.$rootScope.$apply();

            expect(this.$state.go).not.toHaveBeenCalled();
        });

    });
});