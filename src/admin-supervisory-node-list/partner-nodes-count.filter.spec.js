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

describe('partnerNodesCount', function() {

    beforeEach(function() {
        module('admin-supervisory-node-list');

        inject(function($injector) {
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            this.messageService = $injector.get('messageService');
            this.$filter = $injector.get('$filter');
        });

        this.partnerNodes = [
            new this.SupervisoryNodeDataBuilder().build(),
            new this.SupervisoryNodeDataBuilder().build()
        ];

        spyOn(this.messageService, 'get');
    });

    it('should return message for empty partner node list', function() {
        var message = 'No partner nodes';
        this.messageService.get.andReturn(message);

        var result = this.$filter('partnerNodesCount')([]);

        expect(result).toEqual(message);
        expect(this.messageService.get).toHaveBeenCalledWith('adminSupervisoryNodeList.noPartnerNodes');
    });

    it('should return message for single partner node', function() {
        var message = '1 Partner Node';
        this.messageService.get.andReturn(message);

        var result = this.$filter('partnerNodesCount')([
            this.partnerNodes[0]
        ]);

        expect(result).toEqual(message);
        expect(this.messageService.get).toHaveBeenCalledWith('adminSupervisoryNodeList.singlePartnerNode');
    });

    it('should return message for multiple partner nodes', function() {
        var message = '2 Partner Nodes';
        this.messageService.get.andReturn(message);

        var result = this.$filter('partnerNodesCount')(this.partnerNodes);

        expect(result).toEqual(message);
        expect(this.messageService.get).toHaveBeenCalledWith('adminSupervisoryNodeList.partnerNodesCount', {
            count: 2
        });
    });

    it('should return message for null partner nodes list', function() {
        var message = 'No partner nodes';
        this.messageService.get.andReturn(message);

        var result = this.$filter('partnerNodesCount')(null);

        expect(result).toEqual(message);
        expect(this.messageService.get).toHaveBeenCalledWith('adminSupervisoryNodeList.noPartnerNodes');
    });

    it('should return message for undefined partner nodes list', function() {
        var message = 'No partner nodes';
        this.messageService.get.andReturn(message);

        var result = this.$filter('partnerNodesCount')(undefined);

        expect(result).toEqual(message);
        expect(this.messageService.get).toHaveBeenCalledWith('adminSupervisoryNodeList.noPartnerNodes');
    });

});
