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

describe('openlmis.profile', function() {

    beforeEach(function() {
        module('openlmis-user');

        inject(function($injector) {
            this.RoleDataBuilder = $injector.get('RoleDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
            this.MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            this.UserDataBuilder = $injector.get('UserDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.DigestConfigurationDataBuilder = $injector.get('DigestConfigurationDataBuilder');
            this.UserSubscriptionDataBuilder = $injector.get('UserSubscriptionDataBuilder');
            this.$q = $injector.get('$q');
            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataRoleFactory = $injector.get('referencedataRoleFactory');
            this.AdminUserRolesSupervisoryNodeResource = $injector.get('AdminUserRolesSupervisoryNodeResource');
            this.programService = $injector.get('programService');
            this.facilityService = $injector.get('facilityService');
            this.currentUserService = $injector.get('currentUserService');
            this.UserRepository = $injector.get('UserRepository');
            this.$state = $injector.get('$state');
            this.userRoleAssignmentFactory = $injector.get('userRoleAssignmentFactory');
            this.$templateCache = $injector.get('$templateCache');
            this.ROLE_TYPES = $injector.get('ROLE_TYPES');
            this.authUserService = $injector.get('authUserService');
            this.DigestConfigurationResource = $injector.get('DigestConfigurationResource');
            this.UserSubscriptionResource = $injector.get('UserSubscriptionResource');
            this.ObjectMapper = $injector.get('ObjectMapper');
        });

        this.roles = [
            new this.RoleDataBuilder().build(),
            new this.RoleDataBuilder().build(),
            new this.RoleDataBuilder().build(),
            new this.RoleDataBuilder().build(),
            new this.RoleDataBuilder().build(),
            new this.RoleDataBuilder().build()
        ];

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.supervisoryNodes = [
            new this.SupervisoryNodeDataBuilder().build(),
            new this.SupervisoryNodeDataBuilder().build()
        ];

        this.warehouses = [
            new this.MinimalFacilityDataBuilder().build(),
            new this.MinimalFacilityDataBuilder().build()
        ];

        this.digestConfigurations = [
            new this.DigestConfigurationDataBuilder().buildJson(),
            new this.DigestConfigurationDataBuilder().buildJson()
        ];

        this.userSubscriptions = [
            new this.UserSubscriptionDataBuilder().buildJson(),
            new this.UserSubscriptionDataBuilder().buildJson()
        ];

        this.digestConfigurationsPage = new this.PageDataBuilder()
            .withContent(this.digestConfigurations)
            .build();

        this.homeFacility = new this.MinimalFacilityDataBuilder().build();

        this.user = new this.UserDataBuilder()
            .withHomeFacilityId(this.homeFacility.id)
            .withSupervisionRoleAssignment(this.roles[0].id, this.supervisoryNodes[0].id, this.programs[0].id)
            .withSupervisionRoleAssignment(this.roles[1].id, this.supervisoryNodes[1].id, this.programs[1].id)
            .withOrderFulfillmentRoleAssignment(this.roles[2].id, this.warehouses[0].id)
            .withOrderFulfillmentRoleAssignment(this.roles[3].id, this.warehouses[1].id)
            .withGeneralAdminRoleAssignment(this.roles[4].id)
            .withGeneralAdminRoleAssignment(this.roles[5].id)
            .build();

        this.pendingVerificationEmail = {
            email: 'example@test.org'
        };

        this.objectMapper = new this.ObjectMapper();

        spyOn(this.AdminUserRolesSupervisoryNodeResource.prototype, 'query')
            .andReturn(this.$q.resolve(new this.PageDataBuilder()
                .withContent(this.supervisoryNodes)
                .build()));
        spyOn(this.referencedataRoleFactory, 'getAllWithType').andReturn(this.$q.resolve(this.roles));
        spyOn(this.facilityService, 'getAllMinimal').andReturn(this.$q.resolve(this.warehouses));
        spyOn(this.facilityService, 'getMinimal').andReturn(this.$q.resolve(this.homeFacility));
        spyOn(this.currentUserService, 'getUserInfo').andReturn(this.$q.resolve(this.user));
        spyOn(this.UserRepository.prototype, 'get').andReturn(this.$q.resolve(this.user));
        spyOn(this.programService, 'getAll').andReturn(this.$q.resolve(this.programs));
        spyOn(this.userRoleAssignmentFactory, 'getUser').andReturn(this.$q.resolve(this.user));
        spyOn(this.$templateCache, 'get').andCallThrough();
        spyOn(this.authUserService, 'getVerificationEmail').andReturn(this.$q.resolve(this.pendingVerificationEmail));
        spyOn(this.UserSubscriptionResource.prototype, 'query').andReturn(this.$q.resolve(this.userSubscriptions));
        spyOn(this.DigestConfigurationResource.prototype, 'query')
            .andReturn(this.$q.resolve(this.digestConfigurationsPage));

        this.goToUrl = function(url) {
            this.$location.url(url);
            this.$rootScope.$apply();
        };

        this.getResolvedValue = function(name) {
            return this.$state.$current.locals.globals[name];
        };
    });

    describe('state', function() {

        it('should be available under "/profile" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile');

            this.goToUrl('/profile');

            expect(this.$state.current.name).toEqual('openlmis.profile');
        });

        it('should use template', function() {
            this.goToUrl('/profile');

            expect(this.$templateCache.get).toHaveBeenCalledWith('openlmis-user/user-profile.html');
        });

        it('should resolve user', function() {
            this.goToUrl('/profile');

            expect(this.getResolvedValue('user')).toEqual(this.user);
            expect(this.UserRepository.prototype.get).toHaveBeenCalled();
        });

    });

    describe('.basicInformation state', function() {

        it('should be available under "/profile/basicInformation" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.basicInformation');

            this.goToUrl('/profile/basicInformation');

            expect(this.$state.current.name).toEqual('openlmis.profile.basicInformation');
        });

        it('should use template', function() {
            this.goToUrl('/profile/basicInformation');

            expect(this.$templateCache.get).toHaveBeenCalledWith('openlmis-user/user-profile-basic-information.html');
        });

        it('should resolve home facility', function() {
            this.goToUrl('/profile/basicInformation');

            expect(this.getResolvedValue('homeFacility')).toEqual(this.homeFacility);
            expect(this.facilityService.getMinimal).toHaveBeenCalledWith(this.user.homeFacilityId);
        });

        it('should resolve home facility to undefined if user has no home facility', function() {
            this.user.homeFacilityId = undefined;

            this.goToUrl('/profile/basicInformation');

            expect(this.getResolvedValue('homeFacility')).toBeUndefined();
        });

        it('should resolve pending verification email', function() {
            this.goToUrl('/profile/basicInformation');

            expect(this.getResolvedValue('pendingVerificationEmail')).toEqual(this.pendingVerificationEmail);
        });

        it('should resolve a copy of the original user', function() {
            this.goToUrl('/profile/basicInformation');

            expect(this.getResolvedValue('user')).not.toBe(this.user);
            expect(this.getResolvedValue('user')).toEqual(this.user);
        });

    });

    describe('.roleAssignments state', function() {

        it('should be available under "/profile/roleAssignments" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.roleAssignments');

            this.goToUrl('/profile/roleAssignments');

            expect(this.$state.current.name).toEqual('openlmis.profile.roleAssignments');
        });

        it('should use template', function() {
            this.goToUrl('/profile/roleAssignments');

            expect(this.$templateCache.get).toHaveBeenCalledWith('openlmis-user/user-profile-role-assignments.html');
        });

        it('should resolve roles', function() {
            this.goToUrl('/profile/roleAssignments');

            expect(this.getResolvedValue('roles')).toEqual(this.roles);
            expect(this.referencedataRoleFactory.getAllWithType).toHaveBeenCalled();
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile/roleAssignments');

            expect(this.getResolvedValue('programs')).toEqual(this.programs);
            expect(this.programService.getAll).toHaveBeenCalled();
        });

        it('should resolve facilitiesMap', function() {
            var facilitiesMap = this.objectMapper.map(this.warehouses);

            this.goToUrl('/profile/roleAssignments');

            expect(this.getResolvedValue('facilitiesMap')).toEqual(facilitiesMap);
            expect(this.facilityService.getAllMinimal).toHaveBeenCalled();
        });

        it('should resolve supervisoryNodes', function() {
            this.goToUrl('/profile/roleAssignments');

            expect(this.getResolvedValue('supervisoryNodes')).toEqual(this.supervisoryNodes);
            expect(this.AdminUserRolesSupervisoryNodeResource.prototype.query).toHaveBeenCalled();
        });

        it('should resolve warehouses', function() {
            this.goToUrl('/profile/roleAssignments');

            expect(this.getResolvedValue('warehouses')).toEqual(this.warehouses);
            expect(this.facilityService.getAllMinimal).toHaveBeenCalled();
        });

        it('should resolve user', function() {
            this.goToUrl('/profile/roleAssignments');

            expect(this.getResolvedValue('user')).toEqual(this.user);
            expect(this.userRoleAssignmentFactory.getUser).toHaveBeenCalledWith(
                this.user.id,
                this.roles,
                this.programs,
                this.supervisoryNodes,
                this.warehouses
            );
        });

        it('should resolve home roleRightsMap', function() {
            this.goToUrl('/profile/roleAssignments');

            var roleRightsMap = this.getResolvedValue('roleRightsMap');

            expect(roleRightsMap[this.roles[0].id]).toEqual(this.roles[0].rights);
            expect(roleRightsMap[this.roles[1].id]).toEqual(this.roles[1].rights);
            expect(roleRightsMap[this.roles[2].id]).toEqual(this.roles[2].rights);
            expect(roleRightsMap[this.roles[3].id]).toEqual(this.roles[3].rights);
            expect(roleRightsMap[this.roles[4].id]).toEqual(this.roles[4].rights);
            expect(roleRightsMap[this.roles[5].id]).toEqual(this.roles[5].rights);
        });

    });

    describe('.notificationSettings', function() {

        it('should resolve digest configurations', function() {
            this.goToUrl('/profile/notificationSettings');

            expect(this.getResolvedValue('digestConfigurations')).toEqual(this.digestConfigurations);
        });

        it('should resolve user subscriptions', function() {
            this.goToUrl('/profile/notificationSettings');

            expect(this.getResolvedValue('userSubscriptions')).toEqual(this.userSubscriptions);
            expect(this.UserSubscriptionResource.prototype.query).toHaveBeenCalledWith({
                userId: this.user.id
            });
        });

    });

    describe('.supervision state', function() {

        it('should be available under "/profile/roleAssignments/supervision" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.roleAssignments.SUPERVISION');

            this.goToUrl('/profile/roleAssignments/supervision');

            expect(this.$state.current.name).toEqual('openlmis.profile.roleAssignments.SUPERVISION');
        });

        it('should use template', function() {
            this.goToUrl('/profile/roleAssignments/supervision');

            expect(this.$templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-supervision.html');
        });

        it('should resolve tab', function() {
            this.goToUrl('/profile/roleAssignments/supervision');

            expect(this.getResolvedValue('tab')).toEqual(this.ROLE_TYPES.SUPERVISION);
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile/roleAssignments/supervision');

            expect(this.getResolvedValue('roleAssignments')).toEqual([
                this.user.roleAssignments[0],
                this.user.roleAssignments[1]
            ]);
        });

    });

    describe('.fulfillment state', function() {

        it('should be available under "/profile/roleAssignments/fulfillment" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.roleAssignments.ORDER_FULFILLMENT');

            this.goToUrl('/profile/roleAssignments/fulfillment');

            expect(this.$state.current.name).toEqual('openlmis.profile.roleAssignments.ORDER_FULFILLMENT');
        });

        it('should use template', function() {
            this.goToUrl('/profile/roleAssignments/fulfillment');

            expect(this.$templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-fulfillment.html');
        });

        it('should resolve tab', function() {
            this.goToUrl('/profile/roleAssignments/fulfillment');

            expect(this.getResolvedValue('tab')).toEqual(this.ROLE_TYPES.ORDER_FULFILLMENT);
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile/roleAssignments/fulfillment');

            expect(this.getResolvedValue('roleAssignments')).toEqual([
                this.user.roleAssignments[2],
                this.user.roleAssignments[3]
            ]);
        });

    });

    describe('.report state', function() {

        it('should be available under "/profile/roleAssignments/reports" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.roleAssignments.REPORTS');

            this.goToUrl('/profile/roleAssignments/reports');

            expect(this.$state.current.name).toEqual('openlmis.profile.roleAssignments.REPORTS');
        });

        it('should use template', function() {
            this.goToUrl('/profile/roleAssignments/reports');

            expect(this.$templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-tab.html');
        });

        it('should resolve tab', function() {
            this.goToUrl('/profile/roleAssignments/reports');

            expect(this.getResolvedValue('tab')).toEqual(this.ROLE_TYPES.REPORTS);
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile/roleAssignments/reports');

            expect(this.getResolvedValue('roleAssignments')).toEqual([]);
        });

    });

    describe('.admin state', function() {

        it('should be available under "/profile/roleAssignments/admin" URI', function() {
            expect(this.$state.current.name).not.toEqual('openlmis.profile.roleAssignments.GENERAL_ADMIN');

            this.goToUrl('/profile/roleAssignments/admin');

            expect(this.$state.current.name).toEqual('openlmis.profile.roleAssignments.GENERAL_ADMIN');
        });

        it('should use template', function() {
            this.goToUrl('/profile/roleAssignments/admin');

            expect(this.$templateCache.get).toHaveBeenCalledWith('admin-user-roles/user-roles-tab.html');
        });

        it('should resolve tab', function() {
            this.goToUrl('/profile/roleAssignments/admin');

            expect(this.getResolvedValue('tab')).toEqual(this.ROLE_TYPES.GENERAL_ADMIN);
        });

        it('should resolve programs', function() {
            this.goToUrl('/profile/roleAssignments/admin');

            expect(this.getResolvedValue('roleAssignments')).toEqual([
                this.user.roleAssignments[4],
                this.user.roleAssignments[5]
            ]);
        });

    });

});
