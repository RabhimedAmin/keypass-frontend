import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Member } from '../interfaces/member'


@Injectable()
export class HomeService {
  private SERVER_URL = 'http://localhost'

  constructor(private http: Http) { }


  authentificate(username: string, password: string): any {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.post(this.SERVER_URL + ':8080/login?username=' + username + '&password=' + password, {}, options)
  }


  getData(type: string): Observable<any> {
    return this.http.get(this.SERVER_URL + ':8080/' + type)
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }



  newResource(resource: any): any {
    return this.http.post(this.SERVER_URL + ':8080/resources', resource)
    // ...using post request
  }

  newResourceAccount(resource: any, resourceID: any): any {
    return this.http.post(this.SERVER_URL + ':8080/resources/' + resourceID + '/accounts', resource)
    // ...using post request
  }

  newTeam(team: any): Observable<any> {
    return this.http.post(this.SERVER_URL + ':8080/teams', team) // ...using post request
  }

  newMember(member: any) {
    return this.http.post(this.SERVER_URL + ':8080/members', member) // ...using post request
  }


  newAccessAccount(resourceId: any, account: any) {
    return this.http.post(this.SERVER_URL + ':8080/resources/'+ resourceId +'/accounts', account) // ...using post request
  }

  editResource(id: number, resource: any): any {
    return this.http.put(this.SERVER_URL + ':8080/resources/' + id, resource)
  }

  editTeam(id: number, team: any): any {
    return this.http.put(this.SERVER_URL + ':8080/teams/' + id, team)
  }

  editMember(id: number, profileID: number, teamId: number, member: any): any {
    return this.http.put(this.SERVER_URL + ':8080/members/member/' + id + '/profile/' + profileID + '/team/' + teamId, member)
  }

  editProfile(resourceID: number, profile: any): any {
    return this.http.put(this.SERVER_URL + ':8080/resources/account/' + resourceID, profile)
  }

  updateRequest(requestId: any, statu: any): any {
    return this.http.put(this.SERVER_URL + ':8080/Requests/demande/' + requestId, statu)
  }

  deleteResource(id: number): any {
    return this.http.delete(this.SERVER_URL + ':8080/resources/' + id)
  }


  deleteTeam(id: number): any {
    return this.http.delete(this.SERVER_URL + ':8080/teams/' + id)
  }

  deleteMember(id: number): any {
    return this.http.delete(this.SERVER_URL + ':8080/members/agent/' + id)
  }

  deleteProfile(id: number): any {
    return this.http.delete(this.SERVER_URL + ':8080/resources/account/{id}?id=' + id)
  }

  grantAccess(route: string) {
    return this.http.post(this.SERVER_URL + ':8080/' + route, {})
  }

  revokeManagerAccess(memberID: number, resourceID: number): any {
    return this.http.delete(this.SERVER_URL + ':8080/resources/manager/' + memberID + '/resource/' + resourceID)
  }

  sendRequest(request: Object): any {
    return this.http.post(this.SERVER_URL + ':8080/Requests', request)
  }

  acceptRequest(teamId: any, accountId: any): any {
    return this.http.post(this.SERVER_URL + ':8080/resources/team/' + teamId + '/account/' + accountId, {})
  }

  logout() {
    localStorage.removeItem('userId')
    location.reload()
  }



  private extractData(res: any) {
    return JSON.parse(res._body);
  }
  handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}