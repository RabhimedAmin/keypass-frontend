"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var initDemo = require('../../../assets/js/charts.js');
var home_service_1 = require('../../providers/home.service');
var sidebar_routes_config_1 = require('../../sidebar/sidebar-routes.config');
var router_1 = require("@angular/router");
var HomeComponent = (function () {
    function HomeComponent(service, router) {
        this.service = service;
        this.router = router;
        this.accessAccounts$ = [];
        this.date1 = null;
        this.resourcesToEdit = [];
        this.teamsToEdit = [];
        this.membersToEdit = [];
        this.membersResToEdit = [];
        this.memberResourcesUnused$ = [];
        this.resourceToAdd = {};
        this.resourceAccountToAdd = {};
        this.minExipirationDate = new Date(Date.now()).toISOString();
        this.teamToAdd = {};
        this.memberToAdd = { profileAutoritiesId: '2', admin: false };
        this.lastResourceAddedID = false;
        this.resourceToPut = {};
        this.teamToPut = {};
        this.memberToPut = {};
        this.show = false;
        this.showResourceForm = false;
        this.showTeamForm = false;
        this.showMemberForm = false;
        this.memberResources$ = [];
        this.newGrantedResource = [];
        this.type = ['', 'info', 'success', 'warning', 'danger'];
        // this.service.deleteMember(5)
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (localStorage.getItem('userId') == null || localStorage.getItem('userId') == undefined) {
            this.router.navigate(['/login']);
        }
        // $('[data-toggle="checkbox"]').each(function () {
        //     if($(this).data('toggle') == 'switch') return;
        //
        //     var $checkbox = $(this);
        //     $checkbox.checkbox();
        // });
        $.getScript('../../../assets/js/sidebar-moving-tab.js');
        this.menuItems = sidebar_routes_config_1.ROUTES.filter(function (menuItem) { return menuItem; });
        // @NOTE Crypté login password base64
        this.user$ = this.service.getData('members/' + localStorage.getItem('userId'));
        this.userResources$ = this.service.getData('members/' + localStorage.getItem('userId') + '/resources');
        this.resources$ = this.service.getData('resources');
        this.teams$ = this.service.getData('teams');
        this.members$ = this.service.getData('members');
        this.teams$.subscribe(function (res) {
            for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                var team = res_1[_i];
                _this.teamsToEdit[team.id];
            }
        });
        this.resources$.subscribe(function (res) {
            for (var _i = 0, res_2 = res; _i < res_2.length; _i++) {
                var resource = res_2[_i];
                _this.resourcesToEdit[resource.id];
                // accessAccounts[resourceID]
                _this.accessAccounts$[resource.id] = _this.service.getData('resources/' + resource.id + '/accounts');
            }
        });
        this.members$.subscribe(function (res) {
            for (var _i = 0, res_3 = res; _i < res_3.length; _i++) {
                var member = res_3[_i];
                _this.membersToEdit[member.id];
                if (member.profile.grantedAuthority === 'MANAGER') {
                    _this.membersResToEdit[member.id];
                }
                _this.memberResources$[member.id] = _this.service.getData('members/' + member.id + '/resources');
            }
        });
        initDemo();
    };
    HomeComponent.prototype.userManagesRes = function (resourceId) {
        console.log('***************');
        console.log(resourceId);
        console.log('*********************');
        return this.service.getData('members/' + localStorage.getItem('userId') + '/resources')
            .map(function (res) {
            if (res.find(function (res) { return res.id == resourceId; })) {
                return { 'manages': true };
            }
            return { 'manages': false };
        });
    };
    HomeComponent.prototype.unusedResource = function (memberID, used) {
        return this.resources$
            .filter(function (all) { return !all.includes(used); });
    };
    HomeComponent.prototype.grantAccess = function (member) {
        var _this = this;
        this.service.grantAccess('resources/' + this.newGrantedResource[member.id] + '/manager/' + member.id)
            .subscribe(function (res) {
            if (res.status === 200) {
                _this.memberResources$[member.id] = _this.service.getData('members/' + member.id + '/resources');
                _this.showNotification('Resource granted successfully to ' + member.name + '.', 'check', 'top', 'center', 2);
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.toggleForm = function (type) {
        switch (type) {
            case 'resource': {
                this.showResourceForm = !this.showResourceForm;
                this.showTeamForm = false;
                this.showMemberForm = false;
                break;
            }
            case 'team': {
                this.showResourceForm = false;
                this.showTeamForm = !this.showTeamForm;
                this.showMemberForm = false;
                break;
            }
            case 'member': {
                this.showResourceForm = false;
                this.showTeamForm = false;
                this.showMemberForm = !this.showMemberForm;
                break;
            }
            default: {
                console.error('FALSE FORM TOGGLE PARAM');
            }
        }
    };
    HomeComponent.prototype.showNotification = function (message, icon, from, align, color) {
        $.notify({
            icon: icon,
            message: message
        }, {
            type: this.type[color],
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    };
    HomeComponent.prototype.addResource = function () {
        var _this = this;
        this.resourceToAdd.expirationDate = this.resourceToAdd.expirationDate.toString().replace(' ', 'T') + ':00';
        this.resourceToAdd.lastModificationDate = new Date(Date.now()).toISOString();
        this.resourceToAdd.creationDate = new Date(Date.now()).toISOString();
        this.service.newResource(this.resourceToAdd).subscribe(function (res) {
            if (res.status === 200) {
                _this.lastResourceAddedID = res._body.slice(res._body.lastIndexOf('/') + 1);
                _this.showNotification('Resource added successfully with ID ' + _this.lastResourceAddedID + ', please add it\'s access account information.', 'check', 'top', 'center', 2);
                _this.resources$ = _this.service.getData('resources');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.addResourceAccount = function () {
        var _this = this;
        this.service.newResourceAccount(this.resourceAccountToAdd, this.lastResourceAddedID).subscribe(function (res) {
            if (res.status === 200) {
                _this.showResourceForm = !_this.showResourceForm;
                _this.lastResourceAddedID = false;
                _this.resourceAccountToAdd = {};
                _this.resourceToAdd = {};
                _this.showNotification('Resource Account added successfully', 'check', 'top', 'center', 2);
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.addTeam = function () {
        var _this = this;
        this.service.newTeam(this.teamToAdd).subscribe(function (res) {
            if (res.status === 200) {
                _this.toggleForm('team');
                _this.teamToAdd = {};
                _this.showNotification('Team added successfully.', 'check', 'top', 'center', 2);
                _this.teams$ = _this.service.getData('teams');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.addMember = function () {
        var _this = this;
        this.service.newMember(this.memberToAdd).subscribe(function (res) {
            if (res.status === 200) {
                _this.toggleForm('member');
                _this.memberToAdd = { profileAutoritiesId: '2', admin: false };
                _this.showNotification('Member added successfully.', 'check', 'top', 'center', 2);
                _this.members$ = _this.service.getData('members');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.deleteResource = function (resource) {
        var _this = this;
        this.service.deleteResource(resource.id).subscribe(function (res) {
            if (res.status === 200) {
                _this.showNotification('The resource "' + resource.name + '" is deleted with success.', 'delete', 'top', 'center', 3);
                _this.resources$ = _this.service.getData('resources');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'delete', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.deleteTeam = function (team) {
        var _this = this;
        this.service.deleteTeam(team.id).subscribe(function (res) {
            if (res.status === 200) {
                _this.showNotification('The team "' + team.libelle + '" is deleted with success.', 'delete', 'top', 'center', 3);
                _this.teams$ = _this.service.getData('teams');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'delete', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.deleteMember = function (member) {
        var _this = this;
        this.service.deleteMember(member.id).subscribe(function (res) {
            if (res.status === 200) {
                _this.showNotification('The member "' + member.name + '" is deleted with success.', 'delete', 'top', 'center', 3);
                _this.members$ = _this.service.getData('members');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'delete', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.editResource = function (id, index) {
        var _this = this;
        if (!this.resourcesToEdit.includes(true) || this.resourcesToEdit[id]) {
            this.resourcesToEdit[id] = !this.resourcesToEdit[id];
            if (index != null) {
                this.resources$.subscribe(function (res) {
                    _this.resourceToPut = res[index];
                });
            }
        }
    };
    HomeComponent.prototype.editTeam = function (id, index) {
        var _this = this;
        if (!this.teamsToEdit.includes(true) || this.teamsToEdit[id]) {
            this.teamsToEdit[id] = !this.teamsToEdit[id];
            if (index != null) {
                this.teams$.subscribe(function (res) {
                    _this.teamToPut = res[index];
                });
            }
        }
    };
    HomeComponent.prototype.editMember = function (id, index) {
        var _this = this;
        if (!this.membersToEdit.includes(true) || this.membersToEdit[id]) {
            this.membersToEdit[id] = !this.membersToEdit[id];
            if (index != null) {
                this.members$.subscribe(function (res) {
                    _this.memberToPut = res[index];
                });
            }
        }
    };
    HomeComponent.prototype.editMemberRes = function (id, index) {
        var _this = this;
        this.newGrantedResource = [];
        if (!this.membersResToEdit.includes(true) || this.membersResToEdit[id]) {
            //Toggle (only one)
            this.membersResToEdit[id] = !this.membersResToEdit[id];
            //Get member after update
            if (index != null) {
                this.members$.subscribe(function (res) {
                    _this.memberToPut = res[index];
                });
            }
        }
    };
    HomeComponent.prototype.updateResource = function (index) {
        var _this = this;
        this.service.editResource(this.resourceToPut.id, this.resourceToPut)
            .subscribe(function (res) {
            if (res.status === 200) {
                _this.showNotification('The resource of id "' + _this.resourceToPut.id + '" is modified with success.', 'check', 'top', 'center', 2);
                _this.resources$ = _this.service.getData('resources');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.updateTeam = function (index) {
        var _this = this;
        this.service.editTeam(this.teamToPut.id, this.teamToPut)
            .subscribe(function (res) {
            if (res.status === 200) {
                _this.showNotification('The team of id "' + _this.teamToPut.id + '" is modified with success.', 'check', 'top', 'center', 2);
                _this.teams$ = _this.service.getData('teams');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.updateMember = function (index, profileID) {
        var _this = this;
        this.service.editMember(this.memberToPut.id, profileID, this.memberToPut.teamId, this.memberToPut)
            .subscribe(function (res) {
            if (res.status === 200) {
                _this.showNotification('The member of id "' + _this.memberToPut.id + '" is modified with success.', 'check', 'top', 'center', 2);
                _this.members$ = _this.service.getData('members');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 4);
            }
        });
    };
    HomeComponent.prototype.revokeAccess = function (memberID, resourceID) {
        var _this = this;
        this.service.revokeManagerAccess(memberID, resourceID)
            .subscribe(function (res) {
            if (res.status === 200) {
                _this.showNotification('Access Revoked From Manager Successfully', 'check', 'top', 'center', 3);
                _this.members$.subscribe(function (res) {
                    for (var _i = 0, res_4 = res; _i < res_4.length; _i++) {
                        var member = res_4[_i];
                        _this.memberResources$[member.id] = _this.service.getData('members/' + member.id + '/resources');
                    }
                });
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 4);
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 4);
            }
        });
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home-cmp',
            styleUrls: ['./home.component.css'],
            moduleId: module.id,
            templateUrl: 'home.component.html'
        }), 
        __metadata('design:paramtypes', [home_service_1.HomeService, router_1.Router])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map