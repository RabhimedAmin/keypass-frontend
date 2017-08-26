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
var home_service_1 = require('../../providers/home.service');
var router_1 = require('@angular/router');
var LoginComponent = (function () {
    function LoginComponent(service, router) {
        this.service = service;
        this.router = router;
    }
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.service.authentificate(this.email, this.password)
            .subscribe(function (res) {
            if (res.status == 200) {
                _this.service.getData('/members/byemail?email=' + _this.email)
                    .subscribe(function (user) {
                    if (user.id) {
                        console.log(user);
                        localStorage.setItem('userId', user.id);
                        _this.router.navigate(['/dashboard/']);
                    }
                });
            }
        }, function (error) {
            _this.showNotification('Invalid Email or Password', 'error', 'top', 'center', 'danger');
        });
    };
    LoginComponent.prototype.showNotification = function (message, icon, from, align, color) {
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
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login-cmp',
            moduleId: module.id,
            templateUrl: 'login.component.html'
        }), 
        __metadata('design:paramtypes', [home_service_1.HomeService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map