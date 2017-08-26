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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
var HomeService = (function () {
    function HomeService(http) {
        this.http = http;
        this.SERVER_URL = 'http://localhost';
    }
    HomeService.prototype.authentificate = function (username, password) {
        var options = new http_1.RequestOptions({ withCredentials: true });
        return this.http.post(this.SERVER_URL + ':8080/login?username=' + username + '&password=' + password, {}, options);
    };
    HomeService.prototype.getData = function (type) {
        var _this = this;
        return this.http.get(this.SERVER_URL + ':8080/' + type)
            .map(function (res) { return _this.extractData(res); })
            .catch(this.handleError);
    };
    HomeService.prototype.newResource = function (resource) {
        return this.http.post(this.SERVER_URL + ':8080/resources', resource);
        // ...using post request
    };
    HomeService.prototype.newResourceAccount = function (resource, resourceID) {
        return this.http.post(this.SERVER_URL + ':8080/resources/' + resourceID + '/accounts', resource);
        // ...using post request
    };
    HomeService.prototype.newTeam = function (team) {
        return this.http.post(this.SERVER_URL + ':8080/teams', team); // ...using post request
    };
    HomeService.prototype.newMember = function (member) {
        return this.http.post(this.SERVER_URL + ':8080/members', member); // ...using post request
    };
    HomeService.prototype.newAccessAccount = function (resourceId, account) {
        return this.http.post(this.SERVER_URL + ':8080/resources/' + resourceId + '/accounts', account); // ...using post request
    };
    HomeService.prototype.editResource = function (id, resource) {
        return this.http.put(this.SERVER_URL + ':8080/resources/' + id, resource);
    };
    HomeService.prototype.editTeam = function (id, team) {
        return this.http.put(this.SERVER_URL + ':8080/teams/' + id, team);
    };
    HomeService.prototype.editMember = function (id, profileID, teamId, member) {
        return this.http.put(this.SERVER_URL + ':8080/members/member/' + id + '/profile/' + profileID + '/team/' + teamId, member);
    };
    HomeService.prototype.editProfile = function (resourceID, profile) {
        return this.http.put(this.SERVER_URL + ':8080/resources/account/' + resourceID, profile);
    };
    HomeService.prototype.updateRequest = function (requestId, statu) {
        return this.http.put(this.SERVER_URL + ':8080/Requests/demande/' + requestId, statu);
    };
    HomeService.prototype.deleteResource = function (id) {
        return this.http.delete(this.SERVER_URL + ':8080/resources/' + id);
    };
    HomeService.prototype.deleteTeam = function (id) {
        return this.http.delete(this.SERVER_URL + ':8080/teams/' + id);
    };
    HomeService.prototype.deleteMember = function (id) {
        return this.http.delete(this.SERVER_URL + ':8080/members/agent/' + id);
    };
    HomeService.prototype.deleteProfile = function (id) {
        return this.http.delete(this.SERVER_URL + ':8080/resources/account/{id}?id=' + id);
    };
    HomeService.prototype.grantAccess = function (route) {
        return this.http.post(this.SERVER_URL + ':8080/' + route, {});
    };
    HomeService.prototype.revokeManagerAccess = function (memberID, resourceID) {
        return this.http.delete(this.SERVER_URL + ':8080/resources/manager/' + memberID + '/resource/' + resourceID);
    };
    HomeService.prototype.sendRequest = function (request) {
        return this.http.post(this.SERVER_URL + ':8080/Requests', request);
    };
    HomeService.prototype.acceptRequest = function (teamId, accountId) {
        return this.http.post(this.SERVER_URL + ':8080/resources/team/' + teamId + '/account/' + accountId, {});
    };
    HomeService.prototype.logout = function () {
        localStorage.removeItem('userId');
        location.reload();
    };
    HomeService.prototype.extractData = function (res) {
        return JSON.parse(res._body);
    };
    HomeService.prototype.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    HomeService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], HomeService);
    return HomeService;
}());
exports.HomeService = HomeService;
//# sourceMappingURL=home.service.js.map