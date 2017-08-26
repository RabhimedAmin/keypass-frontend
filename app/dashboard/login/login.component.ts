import { Component } from '@angular/core';
import { HomeService } from '../../providers/home.service';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';

declare var $: any

@Component({
    selector: 'login-cmp',
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent {
    email: string
    password: string

    constructor(private service: HomeService, private router: Router) { }

    login() {
        this.service.authentificate(this.email, this.password)
                    .subscribe(res => {
                        if(res.status == 200) {
                            this.service.getData('/members/byemail?email=' + this.email)
                                        .subscribe(user => {
                                            if(user.id) {
                                                console.log(user);
                                                localStorage.setItem('userId', user.id)
                                                this.router.navigate(['/dashboard/'])
                                            }
                                        })
                        }
                },
                error => {
                        this.showNotification(
                            'Invalid Email or Password',
                            'error',
                            'top',
                            'center',
                            'danger'
                        )
                })
    }

    
	showNotification(message: string, icon: string, from: string, align: string, color: string) {
    	$.notify({
        	icon: icon,
        	message: message

        },{
            type: color,
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
	}
 }