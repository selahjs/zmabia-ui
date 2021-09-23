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

describe('SupervisoryNodeEditController', function() {

    beforeEach(function() {
        module('admin-supervisory-node-edit');

        inject(function($injector) {
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            this.FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            this.$controller = $injector.get('$controller');
            this.$state = $injector.get('$state');
        });

        this.supervisoryNodes = [
            new this.SupervisoryNodeDataBuilder().build(),
            new this.SupervisoryNodeDataBuilder().build(),
            new this.SupervisoryNodeDataBuilder().build(),
            new this.SupervisoryNodeDataBuilder().build(),
            new this.SupervisoryNodeDataBuilder().build()
        ];

        this.supervisoryNodesMap = {};
        this.supervisoryNodesMap[this.supervisoryNodes[0].id] = this.supervisoryNodes[0];
        this.supervisoryNodesMap[this.supervisoryNodes[1].id] = this.supervisoryNodes[1];
        this.supervisoryNodesMap[this.supervisoryNodes[2].id] = this.supervisoryNodes[2];
        this.supervisoryNodesMap[this.supervisoryNodes[3].id] = this.supervisoryNodes[3];
        this.supervisoryNodesMap[this.supervisoryNodes[4].id] = this.supervisoryNodes[4];

        this.supervisoryNode = new this.SupervisoryNodeDataBuilder().build();

        this.facilitiesMap = {
            'facility-id-one': new this.FacilityDataBuilder()
                .withId('facility-id-one')
                .build(),
            'facility-id-two': new this.FacilityDataBuilder()
                .withId('facility-id-two')
                .build()
        };

        this.vm = this.$controller('SupervisoryNodeEditController', {
            supervisoryNode: this.supervisoryNode,
            childNodes: this.supervisoryNode.childNodes,
            facilitiesMap: this.facilitiesMap,
            supervisoryNodes: this.supervisoryNodes,
            supervisoryNodesMap: this.supervisoryNodesMap
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose supervisoryNode', function() {
            expect(this.vm.supervisoryNode).toEqual(this.supervisoryNode);
        });

        it('should expose childNodes', function() {
            expect(this.vm.childNodes).toEqual(this.supervisoryNode.childNodes);
        });

        it('should expose facilitiesMap', function() {
            expect(this.vm.facilitiesMap).toEqual(this.facilitiesMap);
        });

        it('should expose supervisoryNodesMap', function() {
            expect(this.vm.supervisoryNodesMap).toEqual(this.supervisoryNodesMap);
        });

    });

    describe('goToSupervisoryNodeList', function() {

        beforeEach(function() {
            spyOn(this.$state, 'go').andReturn();
            this.vm.goToSupervisoryNodeList();
        });

        it('should call state go with correct params', function() {
            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });
    });

    describe('getAvailableParentNodes', function() {

        it('should not return added child nodes', function() {
            this.vm.supervisoryNode.childNodes = [
                this.supervisoryNodes[1],
                this.supervisoryNodes[3]
            ];

            var result = this.vm.getAvailableParentNodes();

            expect(result).toEqual([
                this.supervisoryNodes[0],
                this.supervisoryNodes[2],
                this.supervisoryNodes[4]
            ]);
        });

        it('should return selected parent node', function() {
            this.vm.supervisoryNode.parentNode = this.supervisoryNodes[4];

            var result = this.vm.getAvailableParentNodes();

            expect(result).toEqual(this.supervisoryNodes);
        });

        it('should not return supervisory node being edited', function() {
            this.vm.supervisoryNodesMap[this.vm.supervisoryNode.id] = this.vm.supervisoryNode;

            var result = this.vm.getAvailableParentNodes();

            expect(result).toEqual(this.supervisoryNodes);
        });

        it('should not return supervisory node selected to add as child node', function() {
            this.vm.selectedChildNode = this.supervisoryNodes[2];

            var result = this.vm.getAvailableParentNodes();

            expect(result).toEqual([
                this.supervisoryNodes[0],
                this.supervisoryNodes[1],
                this.supervisoryNodes[3],
                this.supervisoryNodes[4]
            ]);
        });

    });

    describe('getAvailableChildNodes', function() {

        it('should not return added child nodes', function() {
            this.vm.supervisoryNode.childNodes = [
                this.supervisoryNodes[1],
                this.supervisoryNodes[3]
            ];

            var result = this.vm.getAvailableChildNodes();

            expect(result).toEqual([
                this.supervisoryNodes[0],
                this.supervisoryNodes[2],
                this.supervisoryNodes[4]
            ]);
        });

        it('should not return selected parent node', function() {
            this.vm.supervisoryNode.parentNode = this.supervisoryNodes[4];

            var result = this.vm.getAvailableChildNodes();

            expect(result).toEqual([
                this.supervisoryNodes[0],
                this.supervisoryNodes[1],
                this.supervisoryNodes[2],
                this.supervisoryNodes[3]
            ]);
        });

        it('should not return supervisory node being edited', function() {
            this.vm.supervisoryNodesMap[this.vm.supervisoryNode.id] = this.vm.supervisoryNode;

            var result = this.vm.getAvailableChildNodes();

            expect(result).toEqual(this.supervisoryNodes);
        });

        it('should return supervisory node selected to add as child node', function() {
            this.vm.selectedChildNode = this.supervisoryNodes[2];

            var result = this.vm.getAvailableChildNodes();

            expect(result).toEqual([
                this.supervisoryNodes[0],
                this.supervisoryNodes[1],
                this.supervisoryNodes[2],
                this.supervisoryNodes[3],
                this.supervisoryNodes[4]
            ]);
        });

    });

    describe('getAvailablePartnerNodes', function() {

        it('should not return added partner nodes', function() {
            this.vm.supervisoryNode.partnerNodes = [
                this.supervisoryNodes[1],
                this.supervisoryNodes[3]
            ];

            var result = this.vm.getAvailablePartnerNodes();

            expect(result).toEqual([
                this.supervisoryNodes[0],
                this.supervisoryNodes[2],
                this.supervisoryNodes[4]
            ]);
        });

        it('should not return supervisory node being edited', function() {
            this.vm.supervisoryNodesMap[this.vm.supervisoryNode.id] = this.vm.supervisoryNode;

            var result = this.vm.getAvailablePartnerNodes();

            expect(result).toEqual(this.supervisoryNodes);
        });

        it('should return supervisory node selected to add as partner node', function() {
            this.vm.selectedPartnerNode = this.supervisoryNodes[2];

            var result = this.vm.getAvailablePartnerNodes();

            expect(result).toEqual([
                this.supervisoryNodes[0],
                this.supervisoryNodes[1],
                this.supervisoryNodes[2],
                this.supervisoryNodes[3],
                this.supervisoryNodes[4]
            ]);
        });

    });

});
