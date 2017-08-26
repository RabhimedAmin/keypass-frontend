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
var sidebar_routes_config_1 = require('../../sidebar/sidebar-routes.config');
var home_service_1 = require('../../providers/home.service');
var router_1 = require("@angular/router");
var TableComponent = (function () {
    function TableComponent(service, router) {
        var _this = this;
        this.service = service;
        this.router = router;
        this.accountToAdd = {};
        this.userResources$ = [];
        this.profilesToEdit = [];
        this.profileToPut = {};
        if (localStorage.getItem('userId') == null || localStorage.getItem('userId') == undefined) {
            this.router.navigate(['/login']);
        }
        this.user$ = this.service.getData('members/' + localStorage.getItem('userId'));
        this.resources$ = this.service.getData('resources');
        this.userResources$ = this.service.getData('members/' + localStorage.getItem('userId') + '/resources');
        this.userAccounts$ = this.service.getData('members/' + localStorage.getItem('userId') + '/resources/accounts');
        this.userResources$.subscribe(function (res) {
            for (var _i = 0, _a = res.accountsRessource; _i < _a.length; _i++) {
                var profile = _a[_i];
                _this.profilesToEdit[profile.id] = false;
            }
        });
    }
    TableComponent.prototype.ngOnInit = function () {
        $.getScript('../../../assets/js/sidebar-moving-tab.js');
        this.menuItems = sidebar_routes_config_1.ROUTES.filter(function (menuItem) { return menuItem; });
    };
    TableComponent.prototype.editProfile = function (id, index, index2) {
        var _this = this;
        if (!this.profilesToEdit.includes(true) || this.profilesToEdit[id]) {
            this.profilesToEdit[id] = !this.profilesToEdit[id];
            if (index != null) {
                this.userResources$.subscribe(function (res) {
                    _this.profileToPut = res[index].accountsRessource[index2];
                });
            }
        }
    };
    TableComponent.prototype.updateProfile = function (index) {
        var _this = this;
        console.warn(this.profileToPut);
        this.service.editProfile(this.profileToPut.id, this.profileToPut)
            .subscribe(function (res) {
            if (res.status === 200) {
                _this.showNotification('The profile of id "' + _this.profileToPut.id + '" is modified with success.', 'check', 'top', 'center', 'success');
                _this.userResources$ = _this.service.getData('members/' + localStorage.getItem('userId') + '/resources');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 'danger');
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 'danger');
            }
        });
    };
    TableComponent.prototype.addAccount = function () {
        this.service.newAccessAccount(this.resourceId, this.accountToAdd)
            .subscribe();
    };
    TableComponent.prototype.deleteProfile = function (profile) {
        var _this = this;
        this.service.deleteProfile(profile.id).subscribe(function (res) {
            if (res.status === 200) {
                _this.showNotification('The profile with login "' + profile.login + '" is deleted with success.', 'delete', 'top', 'center', 'warning');
                _this.userResources$ = _this.service.getData('members/' + localStorage.getItem('userId') + '/resources');
            }
            else if (res.status >= 400 && res.status < 500) {
                _this.showNotification('This operation cannot be proceeded', 'delete', 'top', 'center', 'danger');
            }
            else if (res.status >= 500) {
                _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete', 'top', 'center', 'danger');
            }
        });
    };
    TableComponent.prototype.showNotification = function (message, icon, from, align, color) {
        $.notify({
            icon: icon,
            message: message
        }, {
            type: color,
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    };
    TableComponent = __decorate([
        core_1.Component({
            selector: 'table-cmp',
            moduleId: module.id,
            templateUrl: 'table.component.html'
        }), 
        __metadata('design:paramtypes', [home_service_1.HomeService, router_1.Router])
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
//# sourceMappingURL=table.component.js.map