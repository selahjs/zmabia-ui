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

describe('UserService', function() {

    beforeEach(function() {
        module('admin-user-form');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.User = $injector.get('User');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.UserService = $injector.get('UserService');
            this.UserRepository = $injector.get('UserRepository');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.notificationService = $injector.get('notificationService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.userPasswordModalFactory = $injector.get('userPasswordModalFactory');
        });

        this.userService = new this.UserService();
        this.user = new this.UserDataBuilder().build();

        spyOn(this.UserRepository.prototype, 'get').andReturn(this.$q.resolve(this.user));

        spyOn(this.user, 'save');
        spyOn(this.$state, 'go');
        spyOn(this.loadingModalService, 'open');
        spyOn(this.loadingModalService, 'close');
        spyOn(this.notificationService, 'error');
        spyOn(this.notificationService, 'success');
        spyOn(this.userPasswordModalFactory, 'createPassword');
    });

    describe('get', function() {

        it('should return new user if ID is not given', function() {
            var result;
            this.userService.get()
                .then(function(user) {
                    result = user;
                });
            this.$rootScope.$apply();

            expect(result instanceof this.User).toBe(true);
            expect(this.UserRepository.prototype.get).not.toHaveBeenCalled();
        });

        it('should fetch user', function() {
            this.userService.get(this.user.id);
            this.$rootScope.$apply();

            expect(this.UserRepository.prototype.get).toHaveBeenCalledWith(this.user.id);
        });

        it('should decorate save', function() {
            var originalSave = this.user.save;

            var result;
            this.userService.get()
                .then(function(user) {
                    result = user;
                });
            this.$rootScope.$apply();

            expect(result.save).not.toEqual(originalSave);
        });

    });

    describe('decorated save', function() {

        var originalSave, decoratedUser;

        beforeEach(function() {
            originalSave = this.user.save;

            originalSave.andReturn(this.$q.resolve(this.user));

            this.userService.get(this.user.id)
                .then(function(response) {
                    decoratedUser = response;
                });
            this.$rootScope.$apply();
        });

        it('should open loading modal', function() {
            decoratedUser.save();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should show notification after updating user', function() {
            decoratedUser.save();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith('adminUserForm.userUpdatedSuccessfully');
        });

        it('should show notification after creating user', function() {
            decoratedUser.isNewUser = true;

            decoratedUser.save();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith('adminUserForm.userCreatedSuccessfully');
        });

        it('should open password modal after creating new user', function() {
            decoratedUser.isNewUser = true;

            decoratedUser.save();
            this.$rootScope.$apply();

            expect(this.userPasswordModalFactory.createPassword).toHaveBeenCalledWith(decoratedUser);
        });

        it('should resolve if user dismisses password creation', function() {
            this.userPasswordModalFactory.createPassword.andReturn(this.$q.reject());

            var result;
            decoratedUser.save()
                .then(function(user) {
                    result = user;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.user);
            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should resolve if user creates password', function() {
            this.userPasswordModalFactory.createPassword.andReturn(this.$q.resolve());

            var result;
            decoratedUser.save()
                .then(function(user) {
                    result = user;
                });
            this.$rootScope.$apply();

            expect(result).toEqual(this.user);
            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should show notification if update fails', function() {
            originalSave.andReturn(this.$q.reject());

            decoratedUser.save();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('adminUserForm.failedToUpdateUser');
        });

        it('should show notification if creation fails', function() {
            decoratedUser.isNewUser = true;
            originalSave.andReturn(this.$q.reject());

            decoratedUser.save();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('adminUserForm.failedToCreateUser');
        });

        it('should reject if original save rejects', function() {
            originalSave.andReturn(this.$q.reject());

            var rejected;
            decoratedUser.save()
                .catch(function() {
                    rejected = true;
                });
            this.$rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should close loading modal if save fails', function() {
            originalSave.andReturn(this.$q.reject());

            decoratedUser.save();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

    });

});