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
describe('RoleFormController', function() {

    beforeEach(function() {
        module('admin-role-form');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.confirmService = $injector.get('confirmService');
            this.referencedataRoleService = $injector.get('referencedataRoleService');
            this.$controller = $injector.get('$controller');
        });

        this.deferred = this.$q.defer();
        this.confirmDeferred = this.$q.defer();

        spyOn(this.referencedataRoleService, 'update').andReturn(this.deferred.promise);
        spyOn(this.referencedataRoleService, 'create').andReturn(this.deferred.promise);
        spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);
        spyOn(this.loadingModalService, 'open').andReturn(this.$q.when());
        spyOn(this.notificationService, 'success');
        spyOn(this.loadingModalService, 'close');
        spyOn(this.$state, 'go');

        this.role = {
            name: 'Some role'
        };

        this.type = 'SOME_ROLE_TYPE';

        this.rights = [{
            name: 'Some right one',
            checked: false
        }, {
            name: 'Some right two',
            checked: false
        }];

        this.vm = this.$controller('RoleFormController', {
            role: this.role,
            type: this.type,
            rights: this.rights
        });
        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose role', function() {
            expect(this.vm.role).toBe(this.role);
        });

        it('should expose type', function() {
            expect(this.vm.type).toBe(this.type);
        });

        it('should expose rights', function() {
            expect(this.vm.rights).toBe(this.rights);
        });

    });

    describe('saveRole', function() {

        it('should update the role if it has id', function() {
            this.role.id = 'some-id';

            this.vm.saveRole();
            this.confirmDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.referencedataRoleService.update).toHaveBeenCalledWith(this.role);
            expect(this.referencedataRoleService.create).not.toHaveBeenCalled();
        });

        it('should create the role if it does not have an id', function() {
            this.vm.saveRole();

            expect(this.referencedataRoleService.create).toHaveBeenCalledWith(this.role);
            expect(this.referencedataRoleService.update).not.toHaveBeenCalled();
        });

        it('should open loading modal', function() {
            this.vm.saveRole();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should show a notification if creation was successful', function() {
            this.vm.saveRole();
            this.deferred.resolve();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith('adminRoleForm.roleCreatedSuccessfully');
        });

        it('should close loading modal if creation was unsuccessful', function() {
            this.vm.saveRole();
            this.deferred.reject();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal if update was unsuccessful', function() {
            this.role.id = 'some-id';

            this.vm.saveRole();
            this.confirmDeferred.resolve();
            this.deferred.reject();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should show a notification if update was successful', function() {
            this.role.id = 'some-id';

            this.vm.saveRole();
            this.confirmDeferred.resolve();
            this.deferred.resolve();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith('adminRoleForm.roleUpdatedSuccessfully');
        });

        it('should redirect to role list after success', function() {
            this.vm.saveRole();
            this.confirmDeferred.resolve();
            this.deferred.resolve();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should prompt for confirmation if updating', function() {
            this.role.id = 'some-id';

            this.vm.saveRole();

            expect(this.confirmService.confirm).toHaveBeenCalledWith('adminRoleForm.confirm');
        });

        it('should not update if confirmation was not successful', function() {
            this.role.id = 'some-id';

            this.vm.saveRole();

            this.confirmDeferred.reject();
            this.$rootScope.$apply();

            expect(this.referencedataRoleService.create).not.toHaveBeenCalled();
            expect(this.referencedataRoleService.update).not.toHaveBeenCalled();
        });

    });

    describe('isNoneSelected', function() {

        it('should return true if no right is selected', function() {
            var result = this.vm.isNoneSelected();

            expect(result).toBe(true);
        });

        it('should return false if at least one right is selected', function() {
            this.vm.rights[1].checked = true;

            var result = this.vm.isNoneSelected();

            expect(result).toBe(false);
        });

    });

});
