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
var UserComponent = (function () {
    function UserComponent(service, router) {
        this.service = service;
        this.router = router;
        this.editUser = false;
        this.userChanges = {};
        this.type = ['', 'info', 'success', 'warning', 'danger'];
    }
    UserComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (localStorage.getItem('userId') == null || localStorage.getItem('userId') == undefined) {
            this.router.navigate(['/login']);
        }
        // $.getScript('../../../assets/js/material-dashboard.js');
        $.getScript('../../../assets/js/sidebar-moving-tab.js');
        this.menuItems = sidebar_routes_config_1.ROUTES.filter(function (menuItem) { return menuItem; });
        this.userID = localStorage.getItem('userId');
        this.user$ = this.service.getData('members/' + this.userID);
        this.user$.subscribe(function (user) {
            _this.userChanges.name = user.name;
            _this.userChanges.email = user.email;
            _this.userChanges.password = user.password;
            _this.userChanges.function = user.function;
        });
    };
    UserComponent.prototype.showNotification = function (message, icon, from, align, color) {
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
    // 
    UserComponent.prototype.saveChanges = function () {
        var _this = this;
        if (this.editUser) {
            this.user$.subscribe(function (user) {
                _this.service.editMember(user.id, user.profile.id, user.team.id, _this.userChanges)
                    .subscribe(function (res) {
                    if (res.status === 200) {
                        _this.showNotification('Your profile has been updated sucessfully.', 'check', 'top', 'center', 2);
                        _this.user$ = _this.service.getData('members/' + _this.userID);
                        _this.toggleEdit;
                    }
                    else if (res.status >= 400 && res.status < 500) {
                        _this.showNotification('This operation cannot be proceeded', 'delete', 'top', 'center', 4);
                    }
                    else if (res.status >= 500) {
                        _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete', 'top', 'center', 4);
                    }
                });
            });
        }
        else {
            this.editUser = !this.editUser;
        }
    };
    UserComponent.prototype.toggleEdit = function () {
        var _this = this;
        this.user$.subscribe(function (user) {
            _this.userChanges.name = user.name;
            _this.userChanges.email = user.email;
            _this.userChanges.password = user.password;
            _this.userChanges.function = user.function;
            _this.editUser = !_this.editUser;
        });
    };
    UserComponent = __decorate([
        core_1.Component({
            selector: 'user-cmp',
            moduleId: module.id,
            templateUrl: 'user.component.html'
        }), 
        __metadata('design:paramtypes', [home_service_1.HomeService, router_1.Router])
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map