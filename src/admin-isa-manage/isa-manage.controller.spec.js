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

describe('IsaManageController', function() {

    beforeEach(function() {
        module('admin-isa-manage');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.isaService = $injector.get('isaService');
            this.notificationService = $injector.get('notificationService');
            this.messageService = $injector.get('messageService');
            this.loadingModalService = $injector.get('loadingModalService');
        });

        this.file = {
            fileName: 'file.csv',
            content: 'file-content'
        };

        this.vm = this.$controller('IsaManageController', {});

        spyOn(this.$state, 'reload').andReturn(true);
        spyOn(this.loadingModalService, 'open').andReturn(this.$q.when());
    });

    describe('init', function() {

        it('should expose getExportUrl method', function() {
            expect(angular.isFunction(this.vm.getExportUrl)).toBe(true);
        });

        it('should expose upload method', function() {
            expect(angular.isFunction(this.vm.upload)).toBe(true);
        });
    });

    describe('getExportUrl', function() {

        it('should call isaService and return download url', function() {
            var downloadUrl = 'some-domain/download';
            spyOn(this.isaService, 'getDownloadUrl').andReturn(downloadUrl);

            var result = this.vm.getExportUrl();

            expect(result).toEqual(downloadUrl);
            expect(this.isaService.getDownloadUrl).toHaveBeenCalled();
        });
    });

    describe('upload', function() {

        beforeEach(function() {
            this.response = {
                amount: 2
            };
            this.deferred = this.$q.defer();

            spyOn(this.isaService, 'upload').andReturn(this.deferred.promise);
            spyOn(this.notificationService, 'success');
            spyOn(this.notificationService, 'error');
        });

        it('should call isaService and show success notification', function() {
            var message = 'message';
            spyOn(this.messageService, 'get').andReturn(message);

            this.vm.file = this.file;
            this.deferred.resolve(this.response);

            this.vm.upload();
            this.$rootScope.$apply();

            expect(this.messageService.get).toHaveBeenCalledWith(
                'adminIsaManage.uploadSuccess', {
                    amount: this.response.amount
                }
            );

            expect(this.isaService.upload).toHaveBeenCalledWith(this.file);
            expect(this.notificationService.success).toHaveBeenCalledWith(message);
            expect(this.$state.reload).toHaveBeenCalled();
        });

        it('should show error notification if upload failed', function() {
            this.vm.file = this.file;
            this.deferred.reject();

            this.vm.upload();
            this.$rootScope.$apply();

            expect(this.isaService.upload).toHaveBeenCalledWith(this.file);
            expect(this.notificationService.error).toHaveBeenCalledWith('adminIsaManage.uploadFailed');
        });

        it('should show error notification if file is not selected', function() {
            this.vm.upload();

            expect(this.notificationService.error).toHaveBeenCalledWith('adminIsaManage.fileIsNotSelected');
            expect(this.isaService.upload).not.toHaveBeenCalled();
        });
    });
});
