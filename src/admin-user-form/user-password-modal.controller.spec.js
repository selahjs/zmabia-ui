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

describe('UserPasswordModalController', function() {

    beforeEach(function() {
        this.authUserService = jasmine.createSpyObj('authUserService', ['resetPassword', 'sendResetEmail']);

        var authUserService = this.authUserService;
        module('admin-user-form', function($provide) {
            $provide.service('authUserService', function() {
                return authUserService;
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
        });

        spyOn(this.loadingModalService, 'open').andReturn(this.$q.when(true));
        spyOn(this.loadingModalService, 'close').andReturn();
        spyOn(this.notificationService, 'success').andReturn();

        this.user = {
            username: 'random-user',
            newPassword: 'new-password',
            email: 'random-email'
        };
        this.modalDeferred = this.$q.defer();

        this.vm = this.$controller('UserPasswordModalController', {
            user: this.user,
            modalDeferred: this.modalDeferred,
            title: 'adminUserForm.createPassword',
            hideCancel: false
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose updatePassword method', function() {
            expect(angular.isFunction(this.vm.updatePassword)).toBe(true);
        });

        it('should set user', function() {
            expect(this.vm.user).toBe(this.user);
        });

        it('should set title', function() {
            expect(this.vm.title).toBe('adminUserForm.createPassword');
        });

        it('should set hideCancel', function() {
            expect(this.vm.hideCancel).toBe(false);
        });

        it('should set isEmailResetSelected as true if user has email', function() {
            expect(this.vm.isEmailResetSelected).toBe(true);
        });

        it('should set isEmailResetSelected as false if user has no email', function() {
            delete this.user.email;
            this.vm.$onInit();

            expect(this.vm.isEmailResetSelected).toBe(false);
        });

    });

    describe('updatePassword', function() {

        describe('resetPassword', function() {

            beforeEach(function() {
                this.authUserService.resetPassword.andReturn(this.$q.when(true));
                this.vm.isEmailResetSelected = false;
                this.vm.updatePassword();
                this.$rootScope.$apply();
            });

            it('should open loading modal', function() {
                expect(this.loadingModalService.open).toHaveBeenCalled();
            });

            it('should call authUserService', function() {
                expect(this.authUserService.resetPassword)
                    .toHaveBeenCalledWith(this.user.username, this.user.newPassword);
            });

            it('should change email if it is empty string', function() {
                expect(this.notificationService.success).toHaveBeenCalledWith('adminUserForm.passwordSetSuccessfully');
            });

            it('should close loading modal if reset password request fails', function() {
                expect(this.notificationService.success.callCount).toBe(1);

                var deferred = this.$q.defer();

                this.authUserService.resetPassword.andReturn(deferred.promise);
                this.vm.updatePassword();
                deferred.reject();
                this.$rootScope.$apply();

                expect(this.loadingModalService.close).toHaveBeenCalled();
                expect(this.notificationService.success.callCount).toBe(1);
            });

        });

        describe('sendResetEmail', function() {

            beforeEach(function() {
                this.authUserService.sendResetEmail.andReturn(this.$q.when(true));
                this.vm.isEmailResetSelected = true;
                this.vm.updatePassword();
                this.$rootScope.$apply();
            });

            it('should open loading modal', function() {
                expect(this.loadingModalService.open).toHaveBeenCalled();
            });

            it('should call authUserService', function() {
                expect(this.authUserService.sendResetEmail).toHaveBeenCalledWith(this.user.email);
            });

            it('should sent reset email', function() {
                expect(this.notificationService.success)
                    .toHaveBeenCalledWith('adminUserForm.passwordResetSuccessfully');
            });

            it('should close loading modal if sent reset email request fails', function() {
                expect(this.notificationService.success.callCount).toBe(1);

                var deferred = this.$q.defer();

                this.authUserService.sendResetEmail.andReturn(deferred.promise);
                this.vm.updatePassword();
                deferred.reject();
                this.$rootScope.$apply();

                expect(this.loadingModalService.close).toHaveBeenCalled();
                expect(this.notificationService.success.callCount).toBe(1);
            });
        });

    });
});
