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

describe('OpenlmisPrinter', function() {

    beforeEach(function() {
        module('openlmis-printer');

        inject(function($injector) {
            this.OpenlmisPrinter = $injector.get('OpenlmisPrinter');
            this.accessTokenFactory = $injector.get('accessTokenFactory');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.messageService = $injector.get('messageService');
            this.$window = $injector.get('$window');
        });

        this.loadingMessage = 'Loading message...';
        this.loadingMessageKey = 'loading.message.key';
        this.tabSpy = jasmine.createSpyObj('tab', ['close']);
        this.accessTokenSuffix = '&access_token="some-access-token';
        this.tabSpy.location = {};
        this.documentSpy = jasmine.createSpyObj('document', ['write']);
        this.tabSpy.document = this.documentSpy;

        spyOn(this.accessTokenFactory, 'addAccessToken');
        spyOn(this.messageService, 'get').andReturn(this.loadingMessage);
        spyOn(this.$window, 'open').andReturn(this.tabSpy);
    });

    describe('constructor', function() {

        beforeEach(function() {
            this.printer = new this.OpenlmisPrinter({
                loadingMessage: this.loadingMessageKey,
                resourceUri: '/api/resource',
                id: '1'
            });
        });

        it('should set loadingMessage', function() {
            expect(this.printer.loadingMessage).toEqual(this.loadingMessageKey);
        });

        it('should set resource uri', function() {
            expect(this.printer.resourceUri).toEqual('/api/resource');
        });

        it('should set id', function() {
            expect(this.printer.id).toEqual('1');
        });

        it('should remove trailing slash from resource uri', function() {
            this.printer = new this.OpenlmisPrinter({
                resourceUri: '/api/resource/'
            });

            expect(this.printer.resourceUri).toEqual('/api/resource');
        });

        it('should default loading message to \'Loading...\'', function() {
            this.printer = new this.OpenlmisPrinter({});

            expect(this.printer.loadingMessage).toEqual('openlmisPrinter.loading');
        });

        it('should accept undefined', function() {
            this.printer = new this.OpenlmisPrinter();

            expect(this.printer.loadingMessage).toEqual('openlmisPrinter.loading');
            expect(this.printer.resourceUri).toBeUndefined();
            expect(this.printer.id).toBeUndefined();
        });
    });

    describe('openTab', function() {

        beforeEach(function() {
            this.printer = new this.OpenlmisPrinter({
                loadingMessage: this.loadingMessageKey
            });

            this.printer.openTab();
        });

        it('should open tab', function() {
            expect(this.$window.open).toHaveBeenCalledWith('', '_blank');
        });

        it('should set a loading message', function() {
            expect(this.documentSpy.write).toHaveBeenCalledWith(this.loadingMessage);
            expect(this.messageService.get).toHaveBeenCalledWith(this.loadingMessageKey);
        });

    });

    describe('print', function() {

        beforeEach(function() {
            this.printer = new this.OpenlmisPrinter({
                resourceUri: '/api/resource',
                id: '2'
            });
            this.printer.openTab();

            var accessTokenSuffix = this.accessTokenSuffix;
            this.accessTokenFactory.addAccessToken.andCallFake(function(url) {
                return url + accessTokenSuffix;
            });
        });

        it('should update tab url', function() {
            this.printer.print();

            expect(this.tabSpy.location.href).
                toEqual(this.openlmisUrlFactory('/api/resource/2/print?format=pdf') + this.accessTokenSuffix);
        });

    });

    describe('closeTab', function() {

        beforeEach(function() {
            this.printer = new this.OpenlmisPrinter();
            this.printer.openTab();
        });

        it('it should close tab', function() {
            this.printer.closeTab();

            expect(this.tabSpy.close).toHaveBeenCalled();
        });

    });

    describe('setId', function() {

        beforeEach(function() {
            this.printer = new this.OpenlmisPrinter();
        });

        it('should set id', function() {
            expect(this.printer.id).toBeUndefined();

            this.printer.setId('1');

            expect(this.printer.id).toEqual('1');
        });

    });

});