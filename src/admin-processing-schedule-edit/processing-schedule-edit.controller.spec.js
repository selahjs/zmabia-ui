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

describe('ProcessingScheduleEditController', function() {

    beforeEach(function() {
        module('admin-processing-schedule-edit');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.confirmService = $injector.get('confirmService');
            this.$q = $injector.get('$q');
            this.periodService = $injector.get('periodService');
            this.stateTrackerService = $injector.get('stateTrackerService');
            this.$state = $injector.get('$state');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.messageService = $injector.get('messageService');
            this.ProcessingScheduleDataBuilder = $injector.get('ProcessingScheduleDataBuilder');
            this.PeriodDataBuilder = $injector.get('PeriodDataBuilder');
        });

        this.processingSchedule = new this.ProcessingScheduleDataBuilder().build();
        this.processingPeriods = [
            new this.PeriodDataBuilder().build(),
            new this.PeriodDataBuilder().build()
        ];
        this.newStartDate = this.processingPeriods[1].endDate;

        this.confirmDeferred = this.$q.defer();
        this.saveDeferred = this.$q.defer();
        this.loadingDeferred = this.$q.defer();

        spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);
        spyOn(this.stateTrackerService, 'goToPreviousState').andCallFake(this.loadingDeferred.resolve);
        spyOn(this.periodService, 'create').andReturn(this.saveDeferred.promise);
        spyOn(this.$state, 'reload');
        spyOn(this.$state, 'go');
        spyOn(this.loadingModalService, 'open').andReturn(this.loadingDeferred.promise);
        spyOn(this.loadingModalService, 'close').andCallFake(this.loadingDeferred.resolve);
        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');
        spyOn(this.messageService, 'get').andCallFake(function(key, param) {
            if (key === 'adminProcessingScheduleEdit.add.question') {
                return 'Do you want to add Processing Period ' + param.period + '?';
            }
        });

        this.vm = this.$controller('ProcessingScheduleEditController', {
            processingSchedule: this.processingSchedule,
            processingPeriods: this.processingPeriods,
            newStartDate: this.newStartDate
        });
    });

    describe('$onInit', function() {

        it('should expose resolved fields', function() {
            var newStartDate = angular.copy(this.processingPeriods[this.processingPeriods.length - 1].endDate);

            this.vm.$onInit();

            expect(this.vm.processingSchedule).toEqual(this.processingSchedule);
            expect(this.vm.newPeriod).toEqual({
                processingSchedule: this.processingSchedule,
                startDate: newStartDate
            });

            expect(this.vm.processingPeriods).toEqual(this.processingPeriods);
        });
    });

    describe('add', function() {

        beforeEach(function() {
            this.vm.$onInit();
            this.vm.newPeriod = this.processingPeriods[0];
            this.vm.newPeriod.processingSchedule = this.processingSchedule;
        });

        it('should prompt user to add period', function() {
            this.vm.add();

            expect(this.confirmService.confirm).toHaveBeenCalledWith(
                'Do you want to add Processing Period ' + this.processingPeriods[0].name + '?',
                'adminProcessingScheduleEdit.add'
            );
        });

        it('should not add period if user does not confirm it', function() {
            this.vm.add();

            this.confirmDeferred.reject();
            this.$rootScope.$apply();

            expect(this.periodService.create).not.toHaveBeenCalled();
        });

        it('should add period and open loading modal after confirm', function() {
            this.vm.add();

            this.confirmDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.vm.newPeriod.processingSchedule).toEqual(this.processingSchedule);
            expect(this.periodService.create).toHaveBeenCalledWith(this.vm.newPeriod);
            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should show notification if period was added successfully', function() {
            this.vm.add();

            this.confirmDeferred.resolve();
            this.saveDeferred.resolve(this.processingPeriods[0]);
            this.loadingDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith('adminProcessingScheduleEdit.add.success');
        });

        it('should show notification if period save has failed', function() {
            this.vm.add();

            this.confirmDeferred.resolve();
            this.saveDeferred.reject();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('adminProcessingScheduleEdit.add.fail');
            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should reload state after successful add', function() {
            this.vm.add();

            this.confirmDeferred.resolve();
            this.saveDeferred.resolve(this.processingSchedule);
            this.$rootScope.$apply();

            expect(this.$state.reload).toHaveBeenCalled();
        });
    });

    describe('goToPreviousState', function() {

        it('should redirect to Processing Period screen', function() {
            this.vm.goToPreviousState();

            expect(this.stateTrackerService.goToPreviousState).toHaveBeenCalled();
        });
    });
});
