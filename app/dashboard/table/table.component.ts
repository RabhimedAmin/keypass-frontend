import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { ROUTES } from '../../sidebar/sidebar-routes.config';
import { HomeService } from '../../providers/home.service';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

declare var $: any;

@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'table.component.html'
})

export class TableComponent implements OnInit {

    public menuItems: any[]
    user$: any

    accountToAdd: any = {}
    resourceId: any

    userResources$: any = []

    profilesToEdit: Array<boolean> = []

    profileToPut: any = {}

    userAccounts$: any
    resources$: any

    constructor(private service: HomeService, private router: Router) {

        if (localStorage.getItem('userId') == null || localStorage.getItem('userId') == undefined) {
            this.router.navigate(['/login'])
        }

        this.user$ = this.service.getData('members/' + localStorage.getItem('userId'))

        this.resources$ = this.service.getData('resources')

        this.userResources$ = this.service.getData('members/' + localStorage.getItem('userId') + '/resources')

        this.userAccounts$ = this.service.getData('members/' + localStorage.getItem('userId') + '/resources/accounts')

        this.userResources$.subscribe(res => {
            for (let profile of res.accountsRessource) {
                this.profilesToEdit[profile.id] = false
            }
        })
    }


    ngOnInit() {
        $.getScript('../../../assets/js/sidebar-moving-tab.js');
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    editProfile(id: number, index?: number, index2?: number) {
        if (!this.profilesToEdit.includes(true) || this.profilesToEdit[id]) {
            this.profilesToEdit[id] = !this.profilesToEdit[id]

            if (index != null) {
                this.userResources$.subscribe(res => {
                    this.profileToPut = res[index].accountsRessource[index2]
                })
            }
        }
    }

    updateProfile(index: number) {
        console.warn(this.profileToPut)
        this.service.editProfile(this.profileToPut.id, this.profileToPut)
            .subscribe((res: Response) => {
                if (res.status === 200) {
                    this.showNotification('The profile of id "' + this.profileToPut.id + '" is modified with success.', 'check', 'top', 'center', 'success')
                    this.userResources$ = this.service.getData('members/' + localStorage.getItem('userId') + '/resources')
                } else if (res.status >= 400 && res.status < 500) {
                    this.showNotification('This operation cannot be proceeded', 'error', 'top', 'center', 'danger')
                } else if (res.status >= 500) {
                    this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error', 'top', 'center', 'danger')
                }
            })
    }

    addAccount() {
        this.service.newAccessAccount(this.resourceId, this.accountToAdd)
            .subscribe()
    }

    deleteProfile(profile: any) {
        this.service.deleteProfile(profile.id).subscribe((res: Response) => {
            if (res.status === 200) {
                this.showNotification('The profile with login "' + profile.login + '" is deleted with success.', 'delete', 'top', 'center', 'warning')
                this.userResources$ = this.service.getData('members/' + localStorage.getItem('userId') + '/resources')
            } else if (res.status >= 400 && res.status < 500) {
                this.showNotification('This operation cannot be proceeded', 'delete', 'top', 'center', 'danger')
            } else if (res.status >= 500) {
                this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete', 'top', 'center', 'danger')
            }
        })
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