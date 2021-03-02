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

describe('PendingOfflineEventsIndicatorController', function() {

    beforeEach(function() {
        module('openlmis-pending-offline-events-indicator');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.$controller = $injector.get('$controller');
            this.pendingOfflineEventsService = $injector.get('pendingOfflineEventsService');
            this.offlineService = $injector.get('offlineService');
        });

        this.eventsCount = 2;

        spyOn(this.pendingOfflineEventsService, 'getCountOfOfflineEvents')
            .andReturn(this.$q.resolve(this.eventsCount));

        spyOn(this.offlineService, 'isOffline');
        spyOn(this.$state, 'go').andReturn();

        this.vm = this.$controller('PendingOfflineEventsIndicatorController');
        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose pending offline events', function() {
            this.offlineService.isOffline.andReturn(true);
            this.vm.$onInit();
            this.$rootScope.$apply();

            expect(this.pendingOfflineEventsService.getCountOfOfflineEvents).toHaveBeenCalled();
            expect(this.vm.eventsCount).toEqual(this.eventsCount);
        });

        it('should not get pending offline events while online', function() {
            this.offlineService.isOffline.andReturn(false);
            this.vm.$onInit();
            this.$rootScope.$apply();

            expect(this.pendingOfflineEventsService.getCountOfOfflineEvents).not.toHaveBeenCalled();
            expect(this.vm.eventsCount).toEqual(0);
        });

        it('should reload state when emit new pending offline events', function() {
            spyOn(this.$state, 'reload').andReturn(true);

            this.offlineService.isOffline.andReturn(true);
            this.$rootScope.$emit('openlmis-referencedata.pending-offline-events-indicator');
            this.$rootScope.$apply();

            expect(this.$state.reload).toHaveBeenCalled();
        });

    });

    describe('goToPendingOfflineEventsPage', function() {

        it('should call state go method', function() {
            this.vm.goToPendingOfflineEventsPage();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.pendingOfflineEvents');
        });
    });

});