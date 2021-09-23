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

describe('openlmis.administration.systemNotifications route', function() {

    beforeEach(function() {
        module('admin-system-notification-list');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.SystemNotificationDataBuilder = $injector.get('SystemNotificationDataBuilder');
            this.SystemNotificationResource = $injector.get('SystemNotificationResource');
            this.ReferenceDataUserResource = $injector.get('ReferenceDataUserResource');
            this.ObjectReferenceDataBuilder = $injector.get('ObjectReferenceDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.users = [
            new this.UserDataBuilder().buildReferenceDataUserJson(),
            new this.UserDataBuilder().buildReferenceDataUserJson()
        ];

        this.systemNotifications = [
            new this.SystemNotificationDataBuilder()
                .withAuthor(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.users[0].id)
                        .build()
                )
                .build(),
            new this.SystemNotificationDataBuilder()
                .withAuthor(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.users[1].id)
                        .build()
                )
                .build(),
            new this.SystemNotificationDataBuilder()
                .withAuthor(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.users[1].id)
                        .build()
                )
                .build(),
            new this.SystemNotificationDataBuilder()
                .withAuthor(
                    new this.ObjectReferenceDataBuilder()
                        .withId(this.users[0].id)
                        .build()
                )
                .build()
        ];

        this.systemNotificationsPage = new this.PageDataBuilder()
            .withContent(this.systemNotifications)
            .build();

        this.usersPage = new this.PageDataBuilder()
            .withContent(this.users)
            .build();

        spyOn(this.ReferenceDataUserResource.prototype, 'query').andReturn(this.$q.resolve(this.usersPage));
        spyOn(this.SystemNotificationResource.prototype, 'query')
            .andReturn(this.$q.resolve(this.systemNotificationsPage));

        this.goToUrl = function(url) {
            this.$location.url(url);
            this.$rootScope.$apply();
        };

        this.getResolvedValue = function(name) {
            return this.$state.$current.locals.globals[name];
        };
    });

    it('should resolve system notifications', function() {
        this.goToUrl('/administration/systemNotifications?page=0&size=10');

        expect(this.getResolvedValue('systemNotifications')).toEqual(this.systemNotifications);
    });

    it('should pass URL params to the system notification fetch call', function() {
        this.goToUrl('/administration/systemNotifications?page=13&size=12');

        expect(this.SystemNotificationResource.prototype.query).toHaveBeenCalledWith({
            page: '13',
            size: '12'
        });
    });

    it('should resolve users map', function() {
        this.goToUrl('/administration/systemNotifications?page=0&size=10');

        var expected = {};
        expected[this.users[0].id] = this.users[0];
        expected[this.users[1].id] = this.users[1];

        expect(this.getResolvedValue('usersMap')).toEqual(expected);
    });

    it('should resolve users list', function() {
        this.goToUrl('/administration/systemNotifications?page=0&size=10');

        expect(this.getResolvedValue('users')).toEqual(this.users);
    });

    it('should resolve all users', function() {
        this.goToUrl('/administration/systemNotifications?page=0&size=10');

        expect(this.ReferenceDataUserResource.prototype.query).toHaveBeenCalled();
    });

    it('should not change state when fetching system notifications fails', function() {
        this.SystemNotificationResource.prototype.query.andReturn(this.$q.reject());

        this.goToUrl('/administration/systemNotifications?page=0&size=10');

        expect(this.$state.current.name).not.toBe('openlmis.administration.systemNotifications');
    });

    it('should not change state when fetching users fails', function() {
        this.ReferenceDataUserResource.prototype.query.andReturn(this.$q.reject());

        this.goToUrl('/administration/systemNotifications?page=0&size=10');

        expect(this.$state.current.name).not.toBe('openlmis.administration.systemNotifications');
    });

    it('should set state params as undefined by default', function() {
        this.goToUrl('/administration/systemNotifications?page=0&size=10');

        expect(this.SystemNotificationResource.prototype.query).toHaveBeenCalledWith({
            isDisplayed: undefined,
            authorId: undefined,
            page: '0',
            size: '10'
        });
    });

});
