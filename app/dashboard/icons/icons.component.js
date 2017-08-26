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
var IconsComponent = (function () {
    function IconsComponent(service, router) {
        this.service = service;
        this.router = router;
        this.request = {};
    }
    IconsComponent.prototype.ngOnInit = function () {
        if (localStorage.getItem('userId') == null || localStorage.getItem('userId') == undefined) {
            this.router.navigate(['/login']);
        }
        $.getScript('../../../assets/js/sidebar-moving-tab.js');
        this.menuItems = sidebar_routes_config_1.ROUTES.filter(function (menuItem) { return menuItem; });
        this.userId = localStorage.getItem('userId');
        this.user$ = this.service.getData('members/' + this.userId);
        this.recievedRequests$ = this.service.getData('Requests/manager/' + this.userId + '/requests');
        this.allRequests$ = this.service.getData('Requests');
        this.resources$ = this.service.getData('resources');
        this.managedResources$ = this.service.getData('members/' + this.userId + '/resources');
        this.allRequests$.subscribe(function (res) { return console.log('ALL REQUESTS: ', res); });
        this.recievedRequests$.subscribe(function (res) { return console.log('RECEIVED REQUESTS: ', res); });
    };
    IconsComponent.prototype.sendRequest = function () {
        var _this = this;
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        this.request.expiryDate = new Date(year + 1, month, day).toISOString();
        this.request.idRequester = localStorage.getItem('userId');
        this.request.statu = 'onHold';
        this.service.sendRequest(this.request)
            .subscribe(function (res) {
            _this.showNotification('.', 'check', 'top', 'center', 'success');
            _this.recievedRequests$ = _this.service.getData('Requests/manager/' + _this.userId + '/requests');
        });
    };
    IconsComponent.prototype.handleRequest = function (req, accepted) {
        var _this = this;
        if (accepted) {
            this.service.acceptRequest(req.requester.team.id, req.resource.accountsRessource[0].id)
                .subscribe(function (res) {
                if (res.status === 200) {
                    _this.showNotification("Request " + (accepted ? 'confirmed.' : 'canceled.'), 'check', 'top', 'center', 'success');
                    _this.recievedRequests$ = _this.service.getData('Requests/manager/' + _this.userId + '/requests');
                    _this.allRequests$ = _this.service.getData('Requests');
                }
                else if (res.status >= 400 && res.status < 500) {
                    _this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 'danger');
                }
                else if (res.status >= 500) {
                    _this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 'danger');
                }
            });
            this.service.updateRequest(req.id, { statu: 'approved' })
                .subscribe(function (res) {
                _this.recievedRequests$ = _this.service.getData('Requests/manager/' + _this.userId + '/requests');
            });
        }
        else {
            this.service.updateRequest(req.id, { statu: 'cancelled' })
                .subscribe(function (res) {
                _this.recievedRequests$ = _this.service.getData('Requests/manager/' + _this.userId + '/requests');
                _this.showNotification("Request " + (accepted ? 'confirmed.' : 'canceled.'), 'check', 'top', 'center', 'success');
            });
        }
    };
    IconsComponent.prototype.showNotification = function (message, icon, from, align, color) {
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
    IconsComponent = __decorate([
        core_1.Component({
            selector: 'icons-cmp',
            moduleId: module.id,
            templateUrl: 'icons.component.html'
        }), 
        __metadata('design:paramtypes', [home_service_1.HomeService, router_1.Router])
    ], IconsComponent);
    return IconsComponent;
}());
exports.IconsComponent = IconsComponent;
//# sourceMappingURL=icons.component.js.map