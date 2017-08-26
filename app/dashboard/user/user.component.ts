import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar-routes.config';
import { HomeService } from '../../providers/home.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from "@angular/router";
declare var $: any;

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit{
    public menuItems: any[]

    userID: string
    user$: any
    editUser: boolean = false
    userChanges: any = { }
    type = ['','info','success','warning','danger']

    constructor(private service: HomeService, private router: Router) { }

    ngOnInit(){
       if(localStorage.getItem('userId') == null || localStorage.getItem('userId') == undefined) {
            this.router.navigate(['/login'])
        }

        // $.getScript('../../../assets/js/material-dashboard.js');
     $.getScript('../../../assets/js/sidebar-moving-tab.js');
     this.menuItems = ROUTES.filter(menuItem => menuItem);

     this.userID = localStorage.getItem('userId')
        
     this.user$ = this.service.getData('members/' + this.userID)

        this.user$.subscribe(user => {
            this.userChanges.name = user.name
            this.userChanges.email = user.email
            this.userChanges.password = user.password
            this.userChanges.function = user.function
        })
    }

	showNotification(message: string, icon: string, from: string, align: string, color: number) {
    	$.notify({
        	icon: icon,
        	message: message

        },{
            type: this.type[color],
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });

	}
// 
    saveChanges() {
        if(this.editUser) {
        this.user$.subscribe(user => {
            this.service.editMember(user.id, user.profile.id, user.team.id, this.userChanges)
                        .subscribe(res => {
                            if(res.status === 200) {
                                this.showNotification('Your profile has been updated sucessfully.', 'check','top', 'center', 2)
                                this.user$ = this.service.getData('members/' + this.userID)
                                this.toggleEdit
                            } else if (res.status >= 400 && res.status < 500) {
                                this.showNotification('This operation cannot be proceeded', 'delete','top', 'center', 4)
                            } else if (res.status >= 500) {
                                this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete','top', 'center', 4)                
                            }
                        })
        })
    } else {
        this.editUser = !this.editUser
    }    
}

toggleEdit() {
            this.user$.subscribe(user => {
            this.userChanges.name = user.name
            this.userChanges.email = user.email
            this.userChanges.password = user.password
            this.userChanges.function = user.function
            this.editUser = !this.editUser
        })
}
}