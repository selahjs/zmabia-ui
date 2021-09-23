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

describe('SupervisoryNode', function() {

    beforeEach(function() {
        module('referencedata-supervisory-node');

        var SupervisoryNodeDataBuilder, SupervisoryNodeRepository, SupervisoryNode;
        inject(function($injector) {
            SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            SupervisoryNodeRepository = $injector.get('SupervisoryNodeRepository');
            SupervisoryNode = $injector.get('SupervisoryNode');

            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.OpenlmisArrayDecorator = $injector.get('OpenlmisArrayDecorator');
        });

        this.json = new SupervisoryNodeDataBuilder()
            .withParentNode()
            .withChildNodes()
            .withPartnerNodes()
            .buildJson();
        this.repository = new SupervisoryNodeRepository();
        this.supervisoryNode = new SupervisoryNode(this.json, this.repository);
        this.newChildNode = new SupervisoryNodeDataBuilder().buildJson();
        this.newPartnerNode = new SupervisoryNodeDataBuilder().buildJson();
        this.duplicatedChildNode = new SupervisoryNodeDataBuilder()
            .withId(this.newChildNode.id)
            .buildJson();
        this.duplicatedPartnerNode = new SupervisoryNodeDataBuilder()
            .withId(this.newPartnerNode.id)
            .buildJson();

        spyOn(this.repository, 'update');
    });

    describe('constructor', function() {

        it('should set all properties', function() {
            expect(this.supervisoryNode.id).toEqual(this.json.id);
            expect(this.supervisoryNode.name).toEqual(this.json.name);
            expect(this.supervisoryNode.code).toEqual(this.json.code);
            expect(this.supervisoryNode.facility).toEqual(this.json.facility);
            expect(this.supervisoryNode.childNodes).toEqual(this.json.childNodes);
            expect(this.supervisoryNode.description).toEqual(this.json.description);
            expect(this.supervisoryNode.repository).toEqual(this.repository);
            expect(this.supervisoryNode.parentNode).toEqual(this.json.parentNode);
            expect(this.supervisoryNode.requisitionGroup).toEqual(this.json.requisitionGroup);
        });

    });

    describe('addChildNode', function() {

        it('should throw exception when trying to add the same object twice', function() {
            this.supervisoryNode.childNodes = new this.OpenlmisArrayDecorator([
                this.newChildNode
            ]);

            var supervisoryNode = this.supervisoryNode,
                newChildNode = this.newChildNode;

            expect(function() {
                supervisoryNode.addChildNode(newChildNode);
            }).toThrow('Given supervisory node is already a child node');
        });

        it('should throw exception when trying to add null child node', function() {
            var supervisoryNode = this.supervisoryNode;

            expect(function() {
                supervisoryNode.addChildNode(null);
            }).toThrow('Supervisory node must be defined');
        });

        it('should throw exception when trying to add undefined child node', function() {
            var supervisoryNode = this.supervisoryNode;

            expect(function() {
                supervisoryNode.addChildNode(undefined);
            }).toThrow('Supervisory node must be defined');
        });

        it('should throw exception when trying to add object with duplicated id', function() {
            this.supervisoryNode.childNodes = new this.OpenlmisArrayDecorator([
                this.newChildNode
            ]);

            var supervisoryNode = this.supervisoryNode,
                duplicatedChildNode = this.duplicatedChildNode;

            expect(function() {
                supervisoryNode.addChildNode(duplicatedChildNode);
            }).toThrow('Given supervisory node is already a child node');
        });

        it('should throw exception when trying to add parent node as child node', function() {
            var supervisoryNode = this.supervisoryNode;

            expect(function() {
                supervisoryNode.addChildNode(supervisoryNode.parentNode);
            }).toThrow('Given supervisory node is parent node');
        });

        it('should not throw exception when trying to add child node when the parent node is not defined', function() {
            this.supervisoryNode.parentNode = undefined;

            var supervisoryNode = this.supervisoryNode,
                newChildNode = this.newChildNode;

            expect(function() {
                supervisoryNode.addChildNode(newChildNode);
            }).not.toThrow();
        });

        it('should add child node', function() {
            this.supervisoryNode.addChildNode(this.newChildNode);

            expect(this.supervisoryNode.childNodes.pop()).toEqual(this.newChildNode);
        });

    });

    describe('removeChildNode', function() {

        it('should throw exception when trying to remove null child node', function() {
            var supervisoryNode = this.supervisoryNode;

            expect(function() {
                supervisoryNode.removeChildNode(null);
            }).toThrow('Child node ID must be defined');
        });

        it('should throw exception when trying to remove undefined child node', function() {
            var supervisoryNode = this.supervisoryNode;

            expect(function() {
                supervisoryNode.removeChildNode(undefined);
            }).toThrow('Child node ID must be defined');
        });

        it('should throw exception when trying to remove supervisory node that is not child node', function() {
            var supervisoryNode = this.supervisoryNode,
                newChildNode = this.newChildNode;

            expect(function() {
                supervisoryNode.removeChildNode(newChildNode.id);
            }).toThrow('Child node with the given ID does not exist');
        });

        it('should remove child node with the given ID', function() {
            var childNodeId = this.supervisoryNode.childNodes[0].id;

            this.supervisoryNode.removeChildNode(childNodeId);

            expect(this.supervisoryNode.childNodes.length).toBe(1);
            expect(this.supervisoryNode.childNodes[0].id).not.toEqual(childNodeId);
        });

    });

    describe('save', function() {

        it('should reject if save fails', function() {
            this.repository.update.andReturn(this.$q.reject());

            var rejected;
            this.supervisoryNode.save().catch(function() {
                rejected = true;
            });
            this.$rootScope.$apply();

            expect(rejected).toBe(true);
        });

        it('should resolve when save is successful', function() {
            this.repository.update.andReturn(this.$q.resolve(this.supervisoryNode));

            var result;
            this.supervisoryNode.save().then(function(supervisoryNode) {
                result = supervisoryNode;
            });
            this.$rootScope.$apply();

            expect(result).toEqual(this.supervisoryNode);
        });

    });

    describe('addPartnerNode', function() {

        it('should throw exception when trying to add the same object twice', function() {
            this.supervisoryNode.partnerNodes = new this.OpenlmisArrayDecorator([
                this.newPartnerNode
            ]);

            var supervisoryNode = this.supervisoryNode,
                newPartnerNode = this.newPartnerNode;

            expect(function() {
                supervisoryNode.addPartnerNode(newPartnerNode);
            }).toThrow('Given supervisory node is already a partner node');
        });

        it('should throw exception when trying to add null partner node', function() {
            var supervisoryNode = this.supervisoryNode;

            expect(function() {
                supervisoryNode.addPartnerNode(null);
            }).toThrow('Supervisory node must be defined');
        });

        it('should throw exception when trying to add undefined partner node', function() {
            var supervisoryNode = this.supervisoryNode;

            expect(function() {
                supervisoryNode.addPartnerNode(undefined);
            }).toThrow('Supervisory node must be defined');
        });

        it('should throw exception when trying to add object with duplicated id', function() {
            this.supervisoryNode.partnerNodes = new this.OpenlmisArrayDecorator([
                this.newPartnerNode
            ]);

            var supervisoryNode = this.supervisoryNode,
                duplicatedPartnerNode = this.duplicatedPartnerNode;

            expect(function() {
                supervisoryNode.addPartnerNode(duplicatedPartnerNode);
            }).toThrow('Given supervisory node is already a partner node');
        });

        it('should add partner node', function() {
            this.supervisoryNode.addPartnerNode(this.newPartnerNode);

            expect(this.supervisoryNode.partnerNodes.pop()).toEqual(this.newPartnerNode);
        });

    });

    describe('removePartnerNode', function() {

        it('should throw exception when trying to remove null partner node', function() {
            var supervisoryNode = this.supervisoryNode;

            expect(function() {
                supervisoryNode.removePartnerNode(null);
            }).toThrow('Partner node ID must be defined');
        });

        it('should throw exception when trying to remove undefined partner node', function() {
            var supervisoryNode = this.supervisoryNode;

            expect(function() {
                supervisoryNode.removePartnerNode(undefined);
            }).toThrow('Partner node ID must be defined');
        });

        it('should throw exception when trying to remove supervisory node that is not partner node', function() {
            var supervisoryNode = this.supervisoryNode,
                newPartnerNode = this.newPartnerNode;

            expect(function() {
                supervisoryNode.removePartnerNode(newPartnerNode.id);
            }).toThrow('Partner node with the given ID does not exist');
        });

        it('should remove partner node with the given ID', function() {
            var partnerNodeId = this.supervisoryNode.partnerNodes[0].id;

            this.supervisoryNode.removePartnerNode(partnerNodeId);

            expect(this.supervisoryNode.partnerNodes.length).toBe(1);
            expect(this.supervisoryNode.partnerNodes[0].id).not.toEqual(partnerNodeId);
        });

    });

});