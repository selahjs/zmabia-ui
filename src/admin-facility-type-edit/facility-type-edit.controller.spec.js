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

describe('FacilityTypeEditController', function() {

    beforeEach(function() {
        module('admin-facility-type-edit');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.confirmService = $injector.get('confirmService');
            this.$q = $injector.get('$q');
            this.facilityTypeService = $injector.get('facilityTypeService');
            this.stateTrackerService = $injector.get('stateTrackerService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
        });

        this.facilityType = new this.FacilityTypeDataBuilder().build();

        this.confirmDeferred = this.$q.defer();
        this.saveDeferred = this.$q.defer();

        spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);
        spyOn(this.stateTrackerService, 'goToPreviousState').andReturn(true);
        spyOn(this.facilityTypeService, 'update').andReturn(this.saveDeferred.promise);
        spyOn(this.facilityTypeService, 'create').andReturn(this.saveDeferred.promise);
        spyOn(this.loadingModalService, 'open').andReturn(true);
        spyOn(this.loadingModalService, 'close').andReturn(true);
        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');

        this.vm = this.$controller('FacilityTypeEditController', {
            facilityType: this.facilityType
        });
        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose facilityType', function() {
            expect(this.vm.facilityType).toEqual(this.facilityType);
        });

        it('should expose resolved fields', function() {
            expect(this.vm.editMode).toEqual(true);
        });

        it('should expose default field values', function() {
            this.vm = this.$controller('FacilityTypeEditController', {
                facilityType: undefined
            });
            this.vm.$onInit();

            expect(this.vm.editMode).toEqual(false);
            expect(this.vm.facilityType).toEqual({
                displayOrder: 1,
                active: true
            });
        });
    });

    describe('save', function() {

        it('should reload state after successful save', function() {
            this.vm.save();

            this.confirmDeferred.resolve();
            this.saveDeferred.resolve(this.facilityType);
            this.$rootScope.$apply();

            expect(this.stateTrackerService.goToPreviousState).toHaveBeenCalled();
        });

        describe('while editing', function() {

            beforeEach(function() {
                this.vm.editMode = true;
            });

            it('should prompt user to save period', function() {
                this.vm.save();

                expect(this.confirmService.confirm).toHaveBeenCalledWith(
                    'adminFacilityTypeEdit.save.question',
                    'adminFacilityTypeEdit.save'
                );
            });

            it('should not save facility type if user does not confirm it', function() {
                this.vm.save();

                this.confirmDeferred.reject();
                this.$rootScope.$apply();

                expect(this.facilityTypeService.update).not.toHaveBeenCalled();
                expect(this.facilityTypeService.create).not.toHaveBeenCalled();
            });

            it('should save facility type and open loading modal after confirm', function() {
                this.vm.save();

                this.confirmDeferred.resolve();
                this.$rootScope.$apply();

                expect(this.facilityTypeService.update).toHaveBeenCalledWith(this.vm.facilityType);
                expect(this.facilityTypeService.create).not.toHaveBeenCalled();
                expect(this.loadingModalService.open).toHaveBeenCalled();
            });

            it('should show notification if facility type was saveed successfully', function() {
                this.vm.save();

                this.confirmDeferred.resolve();
                this.saveDeferred.resolve(this.facilityType);
                this.$rootScope.$apply();

                expect(this.notificationService.success).toHaveBeenCalledWith('adminFacilityTypeEdit.save.success');
            });

            it('should show notification if period save has failed', function() {
                this.vm.save();

                this.confirmDeferred.resolve();
                this.saveDeferred.reject();
                this.$rootScope.$apply();

                expect(this.notificationService.error).toHaveBeenCalledWith('adminFacilityTypeEdit.save.failure');
                expect(this.loadingModalService.close).toHaveBeenCalled();
            });
        });

        describe('while creating', function() {

            beforeEach(function() {
                this.vm.editMode = false;
            });

            it('should prompt user to save period', function() {
                this.vm.save();

                expect(this.confirmService.confirm).toHaveBeenCalledWith(
                    'adminFacilityTypeEdit.create.question',
                    'adminFacilityTypeEdit.create'
                );
            });

            it('should not save facility type if user does not confirm it', function() {
                this.vm.save();

                this.confirmDeferred.reject();
                this.$rootScope.$apply();

                expect(this.facilityTypeService.create).not.toHaveBeenCalled();
                expect(this.facilityTypeService.update).not.toHaveBeenCalled();
            });

            it('should save facility type and open loading modal after confirm', function() {
                this.vm.save();

                this.confirmDeferred.resolve();
                this.$rootScope.$apply();

                expect(this.facilityTypeService.create).toHaveBeenCalledWith(this.vm.facilityType);
                expect(this.facilityTypeService.update).not.toHaveBeenCalled();
                expect(this.loadingModalService.open).toHaveBeenCalled();
            });

            it('should show notification if facility type was saveed successfully', function() {
                this.vm.save();

                this.confirmDeferred.resolve();
                this.saveDeferred.resolve(this.facilityType);
                this.$rootScope.$apply();

                expect(this.notificationService.success).toHaveBeenCalledWith('adminFacilityTypeEdit.create.success');
            });

            it('should show notification if period save has failed', function() {
                this.vm.save();

                this.confirmDeferred.resolve();
                this.saveDeferred.reject();
                this.$rootScope.$apply();

                expect(this.notificationService.error).toHaveBeenCalledWith('adminFacilityTypeEdit.create.failure');
                expect(this.loadingModalService.close).toHaveBeenCalled();
            });
        });
    });

    describe('goToPreviousState', function() {

        it('should redirect to Facility Type List screen', function() {
            this.vm.goToPreviousState();

            expect(this.stateTrackerService.goToPreviousState).toHaveBeenCalled();
        });
    });
});
