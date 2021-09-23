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

describe('ServiceAccountListController', function() {

    beforeEach(function() {
        module('admin-service-account-list');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.confirmService = $injector.get('confirmService');
            this.notificationService = $injector.get('notificationService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.messageService = $injector.get('messageService');
            this.serviceAccountFactory = $injector.get('serviceAccountFactory');
            this.ServiceAccountBuilder = $injector.get('ServiceAccountBuilder');
        });

        this.serviceAccounts = [
            new this.ServiceAccountBuilder().build(),
            new this.ServiceAccountBuilder().build()
        ];

        this.vm = this.$controller('ServiceAccountListController', {
            serviceAccounts: this.serviceAccounts
        });
        this.vm.$onInit();

        spyOn(this.$state, 'reload').andReturn();
        spyOn(this.confirmService, 'confirm').andReturn(this.$q.resolve());
        spyOn(this.loadingModalService, 'open').andReturn(this.$q.resolve());
        spyOn(this.loadingModalService, 'close').andReturn(this.$q.resolve());
        spyOn(this.serviceAccountFactory, 'create').andReturn(this.$q.resolve(this.serviceAccounts[0]));
        spyOn(this.serviceAccountFactory, 'remove').andReturn(this.$q.resolve());
        spyOn(this.notificationService, 'success').andReturn(this.$q.resolve());
        spyOn(this.notificationService, 'error').andReturn(this.$q.resolve());
        spyOn(this.messageService, 'get').andCallFake(function(key) {
            return key;
        });
    });

    describe('onInit', function() {

        it('should expose serviceAccounts', function() {
            expect(this.vm.serviceAccounts).toEqual(this.serviceAccounts);
        });
    });

    describe('add', function() {

        it('should create a service account and display success notification', function() {
            this.vm.add();
            this.$rootScope.$apply();

            expect(this.confirmService.confirm)
                .toHaveBeenCalledWith('adminServiceAccount.add.question', 'adminServiceAccount.add');

            expect(this.loadingModalService.open).toHaveBeenCalled();
            expect(this.serviceAccountFactory.create).toHaveBeenCalled();
            expect(this.notificationService.success).toHaveBeenCalledWith('adminServiceAccount.add.success');
            expect(this.$state.reload).toHaveBeenCalled();
        });

        it('should not call any service when confirmation fails', function() {
            this.confirmService.confirm.andReturn(this.$q.reject());

            this.vm.add();
            this.$rootScope.$apply();

            expect(this.confirmService.confirm)
                .toHaveBeenCalledWith('adminServiceAccount.add.question', 'adminServiceAccount.add');

            expect(this.loadingModalService.open).not.toHaveBeenCalled();
            expect(this.serviceAccountFactory.create).not.toHaveBeenCalled();
            expect(this.notificationService.success).not.toHaveBeenCalled();
            expect(this.notificationService.error).not.toHaveBeenCalledWith();
            expect(this.$state.reload).not.toHaveBeenCalled();
        });

        it('should display error notification when service account creation fails', function() {
            this.serviceAccountFactory.create.andReturn(this.$q.reject());

            this.vm.add();
            this.$rootScope.$apply();

            expect(this.confirmService.confirm)
                .toHaveBeenCalledWith('adminServiceAccount.add.question', 'adminServiceAccount.add');

            expect(this.loadingModalService.open).toHaveBeenCalled();
            expect(this.serviceAccountFactory.create).toHaveBeenCalled();
            expect(this.notificationService.success).not.toHaveBeenCalled();
            expect(this.notificationService.error).toHaveBeenCalledWith('adminServiceAccount.add.failure');
            expect(this.loadingModalService.close).toHaveBeenCalled();
            expect(this.$state.reload).not.toHaveBeenCalled();
        });
    });

    describe('remove', function() {

        it('should remove service account and display success notification', function() {
            this.vm.remove('token');
            this.$rootScope.$apply();

            expect(this.confirmService.confirm)
                .toHaveBeenCalledWith('adminServiceAccount.delete.question', 'adminServiceAccount.delete');

            expect(this.loadingModalService.open).toHaveBeenCalled();
            expect(this.serviceAccountFactory.remove).toHaveBeenCalledWith('token');
            expect(this.notificationService.success).toHaveBeenCalledWith('adminServiceAccount.delete.success');
            expect(this.$state.reload).toHaveBeenCalled();
        });

        it('should not call any service when confirmation fails', function() {
            this.confirmService.confirm.andReturn(this.$q.reject());

            this.vm.remove('token');
            this.$rootScope.$apply();

            expect(this.confirmService.confirm)
                .toHaveBeenCalledWith('adminServiceAccount.delete.question', 'adminServiceAccount.delete');

            expect(this.loadingModalService.open).not.toHaveBeenCalled();
            expect(this.serviceAccountFactory.remove).not.toHaveBeenCalled();
            expect(this.notificationService.success).not.toHaveBeenCalled();
            expect(this.notificationService.error).not.toHaveBeenCalledWith();
            expect(this.$state.reload).not.toHaveBeenCalled();
        });

        it('should display error notification when service account delete fails', function() {
            this.serviceAccountFactory.remove.andReturn(this.$q.reject());

            this.vm.remove('token');
            this.$rootScope.$apply();

            expect(this.confirmService.confirm)
                .toHaveBeenCalledWith('adminServiceAccount.delete.question', 'adminServiceAccount.delete');

            expect(this.loadingModalService.open).toHaveBeenCalled();
            expect(this.serviceAccountFactory.remove).toHaveBeenCalledWith('token');
            expect(this.notificationService.success).not.toHaveBeenCalled();
            expect(this.notificationService.error).toHaveBeenCalledWith('adminServiceAccount.delete.failure');
            expect(this.loadingModalService.close).toHaveBeenCalled();
            expect(this.$state.reload).not.toHaveBeenCalled();
        });
    });
});
