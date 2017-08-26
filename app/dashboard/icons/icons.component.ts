import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar-routes.config';
import { HomeService } from '../../providers/home.service';
import { Response } from '@angular/http';
import { Router } from "@angular/router";

declare var $: any;

@Component({
    selector: 'icons-cmp',
    moduleId: module.id,
    templateUrl: 'icons.component.html'
})

export class IconsComponent implements OnInit {
    public menuItems: any[]

    userId: any

    user$: any
    allRequests$: any
    recievedRequests$: any
    resources$: any
    userResources$: any
    managedResources$: any

    request: any = {}

    constructor(private service: HomeService, private router: Router) {

    }
    ngOnInit() {
       if(localStorage.getItem('userId') == null || localStorage.getItem('userId') == undefined) {
            this.router.navigate(['/login'])
        }

        $.getScript('../../../assets/js/sidebar-moving-tab.js');
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.userId = localStorage.getItem('userId')
        this.user$ = this.service.getData('members/' + this.userId)
        this.recievedRequests$ = this.service.getData('Requests/manager/' + this.userId + '/requests')
        this.allRequests$ = this.service.getData('Requests')
        this.resources$ = this.service.getData('resources')
        this.managedResources$ = this.service.getData('members/' + this.userId + '/resources')

        this.allRequests$.subscribe(res => console.log('ALL REQUESTS: ', res))
        this.recievedRequests$.subscribe(res => console.log('RECEIVED REQUESTS: ',res))
    }

    sendRequest() {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        this.request.expiryDate = new Date(year + 1, month, day).toISOString()
        this.request.idRequester = localStorage.getItem('userId')
        this.request.statu = 'onHold'

        this.service.sendRequest(this.request)
            .subscribe((res: Response) => {
                this.showNotification('.', 'check', 'top', 'center', 'success')
                this.recievedRequests$ = this.service.getData('Requests/manager/' + this.userId + '/requests')
            })
    }

    handleRequest(req: any, accepted: boolean) {
        if (accepted) {
            this.service.acceptRequest(req.requester.team.id, req.resource.accountsRessource[0].id)
                .subscribe((res: Response) => {
                    if (res.status === 200) {
                        this.showNotification(`Request ${accepted ? 'confirmed.' : 'canceled.'}`, 'check', 'top', 'center', 'success')
                        this.recievedRequests$ = this.service.getData('Requests/manager/' + this.userId + '/requests')
                        this.allRequests$ = this.service.getData('Requests')                   
                    } else if (res.status >= 400 && res.status < 500) {
                        this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 'danger')
                    } else if (res.status >= 500) {
                        this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 'danger')
                    }
                })
            this.service.updateRequest(req.id, { statu: 'approved' })
                .subscribe(res => {
                    this.recievedRequests$ = this.service.getData('Requests/manager/' + this.userId + '/requests')
                });
        } else {
            this.service.updateRequest(req.id, { statu: 'cancelled' })
                .subscribe(res => {
                    this.recievedRequests$ = this.service.getData('Requests/manager/' + this.userId + '/requests')
                    this.showNotification(`Request ${accepted ? 'confirmed.' : 'canceled.'}`, 'check', 'top', 'center', 'success')                    
                });
        }
    }

    showNotification(message: string, icon: string, from: string, align: string, color: string) {
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
    }

}