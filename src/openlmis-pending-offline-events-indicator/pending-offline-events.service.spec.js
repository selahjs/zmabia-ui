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

describe('PendingOfflineEventsService', function() {

    beforeEach(function() {
        module('openlmis-pending-offline-events-indicator');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.pendingOfflineEventsService = $injector.get('pendingOfflineEventsService');
            this.localStorageService = $injector.get('localStorageService');
            this.currentUserService = $injector.get('currentUserService');
        });

        this.localStorageEvents = {};
        this.localStorageEvents['user_1'] = [
            {
                facilityId: 'facility_1',
                programId: 'program_1',
                lineItems: [{
                    orderableId: 'orderable_1'
                }]
            },
            {
                facilityId: 'facility_1',
                programId: 'program_2',
                lineItems: [{
                    orderableId: 'orderable_3'
                }]
            }
        ];
        this.localStorageEvents['user_2'] = [
            {
                facilityId: 'facility_1',
                programId: 'program_3',
                lineItems: [{
                    orderableId: 'orderable_5'
                }]
            }
        ];

        this.user1 = {
            id: 'user_1'
        };

        this.user3 = {
            id: 'user_3'
        };

        spyOn(this.localStorageService, 'get');
        spyOn(this.currentUserService, 'getUserInfo');
    });

    describe('getCountOfOfflineEvents', function() {

        it('should get a count of offline events', function() {
            this.localStorageService.get.andReturn(this.localStorageEvents);
            this.currentUserService.getUserInfo.andReturn(this.$q.resolve(this.user1));

            var eventsCount;
            this.pendingOfflineEventsService.getCountOfOfflineEvents().then(function(result) {
                eventsCount = result;
            });
            this.$rootScope.$apply();

            expect(this.currentUserService.getUserInfo).toHaveBeenCalled();
            expect(this.localStorageService.get).toHaveBeenCalled();
            expect(eventsCount).toEqual(this.localStorageEvents.user_1.length);
        });

        it('should get 0 if stock events in local storage are empty', function() {
            this.localStorageService.get.andReturn(null);
            this.currentUserService.getUserInfo.andReturn(this.$q.resolve(this.user1));

            var eventsCount;
            this.pendingOfflineEventsService.getCountOfOfflineEvents().then(function(result) {
                eventsCount = result;
            });
            this.$rootScope.$apply();

            expect(this.currentUserService.getUserInfo).toHaveBeenCalled();
            expect(this.localStorageService.get).toHaveBeenCalled();
            expect(eventsCount).toEqual(0);
        });

        it('should get 0 if stock events in local storage are empty for specific user', function() {
            this.localStorageService.get.andReturn(this.localStorageEvents);
            this.currentUserService.getUserInfo.andReturn(this.$q.resolve(this.user3));

            var eventsCount;
            this.pendingOfflineEventsService.getCountOfOfflineEvents().then(function(result) {
                eventsCount = result;
            });
            this.$rootScope.$apply();

            expect(this.currentUserService.getUserInfo).toHaveBeenCalled();
            expect(this.localStorageService.get).toHaveBeenCalled();
            expect(eventsCount).toEqual(0);
        });
    });
});