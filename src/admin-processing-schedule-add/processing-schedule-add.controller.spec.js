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

describe('ProcessingScheduleAddController', function() {

    beforeEach(function() {
        module('admin-processing-schedule-add');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.confirmService = $injector.get('confirmService');
            this.$q = $injector.get('$q');
            this.processingScheduleService = $injector.get('processingScheduleService');
            this.stateTrackerService = $injector.get('stateTrackerService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.messageService = $injector.get('messageService');
            this.ProcessingScheduleDataBuilder = $injector.get('ProcessingScheduleDataBuilder');
        });

        this.processingSchedule = new this.ProcessingScheduleDataBuilder().build();

        this.confirmDeferred = this.$q.defer();
        this.saveDeferred = this.$q.defer();
        this.loadingDeferred = this.$q.defer();

        spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);
        spyOn(this.stateTrackerService, 'goToPreviousState').andCallFake(this.loadingDeferred.resolve);
        spyOn(this.processingScheduleService, 'create').andReturn(this.saveDeferred.promise);
        spyOn(this.loadingModalService, 'open').andReturn(this.loadingDeferred.promise);
        spyOn(this.loadingModalService, 'close').andCallFake(this.loadingDeferred.resolve);
        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');
        spyOn(this.messageService, 'get').andCallFake(function(key, param) {
            if (key === 'adminProcessingScheduleAdd.save.question') {
                return 'Do you want to save Processing Schedule ' + param.processingSchedule + '?';
            }
        });

        this.vm = this.$controller('ProcessingScheduleAddController');
    });

    describe('$onInit', function() {

        it('should expose resolved fields', function() {
            expect(this.vm.processingSchedule).toEqual({});
        });
    });

    describe('save', function() {

        beforeEach(function() {
            this.vm.processingSchedule = this.processingSchedule;
        });

        it('should prompt user to save schedule', function() {
            this.vm.save();

            expect(this.confirmService.confirm).toHaveBeenCalledWith(
                'Do you want to save Processing Schedule ' + this.processingSchedule.name + '?',
                'adminProcessingScheduleAdd.save'
            );
        });

        it('should not save period if user does not confirm it', function() {
            this.vm.save();

            this.confirmDeferred.reject();
            this.$rootScope.$apply();

            expect(this.processingScheduleService.create).not.toHaveBeenCalled();
        });

        it('should save schedule and open loading modal after confirm', function() {
            this.vm.save();

            this.confirmDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.processingScheduleService.create).toHaveBeenCalledWith(this.processingSchedule);
            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should show notification if schedule was saved successfully', function() {
            this.vm.save();

            this.confirmDeferred.resolve();
            this.saveDeferred.resolve(this.processingSchedule);
            this.loadingDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith('adminProcessingScheduleAdd.save.success');
        });

        it('should show notification if schedule save has failed', function() {
            this.vm.save();

            this.confirmDeferred.resolve();
            this.saveDeferred.reject();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('adminProcessingScheduleAdd.save.fail');
            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should take the user to processing schedule list page after successful save', function() {
            this.vm.save();

            this.confirmDeferred.resolve();
            this.saveDeferred.resolve(this.processingSchedule);
            this.$rootScope.$apply();

            expect(this.stateTrackerService.goToPreviousState)
                .toHaveBeenCalledWith('openlmis.administration.processingSchedules');
        });
    });

    describe('goToPreviousState', function() {

        it('should redirect to Processing Period screen', function() {
            this.vm.goToPreviousState();

            expect(this.stateTrackerService.goToPreviousState).toHaveBeenCalled();
        });
    });
});
