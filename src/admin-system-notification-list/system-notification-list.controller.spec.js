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

describe('SystemNotificationListController', function() {

    beforeEach(function() {
        module('admin-system-notification-list');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.$stateParams = $injector.get('$stateParams');
            this.$state = $injector.get('$state');
        });

        var currentDay = new Date().getDate();
        this.farPastDate = new Date(new Date().setDate(currentDay - 3)).toISOString();
        this.pastDate = new Date(new Date().setDate(currentDay - 2)).toISOString();
        this.futureDate = new Date(new Date().setDate(currentDay + 2)).toISOString();
        this.farFutureDate = new Date(new Date().setDate(currentDay + 3)).toISOString();

        this.ongoingSystemNotification = new this.SystemNotificationDataBuilder()
            .withStartDate(this.pastDate)
            .withExpiryDate(this.futureDate)
            .build();

        this.systemNotificationWithoutExpiryDate = new this.SystemNotificationDataBuilder()
            .withStartDate(this.pastDate)
            .withoutExpiryDate()
            .build();

        this.pastSystemNotification = new this.SystemNotificationDataBuilder()
            .withStartDate(this.farPastDate)
            .withExpiryDate(this.pastDate)
            .build();

        this.futureSystemNotification = new this.SystemNotificationDataBuilder()
            .withStartDate(this.farPastDate)
            .withExpiryDate(this.futureDate)
            .build();

        this.inactiveSystemNotification = new this.SystemNotificationDataBuilder()
            .withStartDate(this.pastDate)
            .withExpiryDate(this.futureDate)
            .inactive()
            .build();

        this.systemNotifications = [
            this.ongoingSystemNotification,
            this.systemNotificationWithoutExpiryDate,
            this.pastSystemNotification,
            this.futureSystemNotification,
            this.inactiveSystemNotification
        ];

        this.users = [
            new this.UserDataBuilder().buildReferenceDataUserJson(),
            new this.UserDataBuilder().buildReferenceDataUserJson()
        ];

        this.usersMap = {};
        this.usersMap[this.users[0].id] = this.users[0];
        this.usersMap[this.users[1].id] = this.users[1];

        this.vm = this.$controller('SystemNotificationListController', {
            systemNotifications: this.systemNotifications,
            usersMap: this.usersMap,
            users: this.users
        });
        this.vm.$onInit();

        spyOn(this.$state, 'go').andReturn();
    });

    describe('$onInit', function() {

        it('should expose system notification', function() {
            expect(this.vm.systemNotifications).toEqual(this.systemNotifications);
        });

        it('should expose users map', function() {
            expect(this.vm.usersMap).toEqual(this.usersMap);
        });

        it('should set isDisplayed if flag was passed through the URL', function() {
            this.$stateParams.isDisplayed = true;

            this.vm.$onInit();

            expect(this.vm.isDisplayed).toBeTruthy();
        });

        it('should not set isDisplayed if flag was not passed through the URL', function() {
            this.$stateParams.isDisplayed = undefined;

            this.vm.$onInit();

            expect(this.vm.isDisplayed).toBeUndefined();
        });

        it('should not set authorId if it was not passed through the URL', function() {
            this.$stateParams.authorId = undefined;

            this.vm.$onInit();

            expect(this.vm.authorId).toBeUndefined();
        });

        it('should set authorId if it was not passed through the URL', function() {
            this.$stateParams.authorId = this.users[0].id;

            this.vm.$onInit();

            expect(this.vm.authorId).toEqual(this.users[0].id);
        });

    });

    describe('loadSystemNotifications', function() {

        it('should set all params', function() {
            this.vm.authorId = 'some-author';
            this.vm.isDisplayed = true;

            this.vm.loadSystemNotifications();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.administration.systemNotifications', {
                page: this.$stateParams.page,
                size: this.$stateParams.size,
                authorId: 'some-author',
                isDisplayed: true
            }, {
                reload: true
            });
        });

        it('should call state go method', function() {
            this.vm.loadSystemNotifications();

            expect(this.$state.go).toHaveBeenCalled();
        });

    });

});