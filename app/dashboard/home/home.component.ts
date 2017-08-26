import { Component, OnInit, trigger, state, style, transition, animate, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs'
import { Response } from '@angular/http'
import initDemo = require('../../../assets/js/charts.js');
import { HomeService } from '../../providers/home.service';


import { ROUTES } from '../../sidebar/sidebar-routes.config';
import { Router } from "@angular/router";


declare var $:any;
declare var swal:any;

@Component({
    selector: 'home-cmp',
    styleUrls: ['./home.component.css'],
    moduleId: module.id,
    templateUrl: 'home.component.html'
})



export class HomeComponent implements OnInit{

user$: any
userResources$: any

members$ : any
resources$ : any
teams$ : any
accessAccounts$ : any = []
date1 = null;
resourcesToEdit : Array<boolean> = []
teamsToEdit : Array<boolean> = []
membersToEdit : Array<boolean> = []

membersResToEdit : Array<boolean> = []

memberResourcesUnused$ : any = []

resourceToAdd: any = {  }
resourceAccountToAdd: any = {  }
minExipirationDate : string = new Date(Date.now()).toISOString()
teamToAdd: any = {  }

memberToAdd: any = { profileAutoritiesId: '2', admin: false }

lastResourceAddedID : string | boolean = false

resourceToPut : any = { }
teamToPut : any = { }

memberToPut : any = { }
/* --------RADIO---------- */
profileToPut : any

show: boolean = false

showResourceForm : boolean = false
showTeamForm : boolean = false
showMemberForm : boolean = false

memberResources$: any = []

newGrantedResource: any = []

type = ['','info','success','warning','danger']

public menuItems: any[]

    constructor(private service: HomeService, private router: Router) {
        // this.service.deleteMember(5)
    }

    ngOnInit(){

        if(localStorage.getItem('userId') == null || localStorage.getItem('userId') == undefined) {
            this.router.navigate(['/login'])
        }

        // $('[data-toggle="checkbox"]').each(function () {
        //     if($(this).data('toggle') == 'switch') return;
        //
        //     var $checkbox = $(this);
        //     $checkbox.checkbox();
        // });

     $.getScript('../../../assets/js/sidebar-moving-tab.js');
        this.menuItems = ROUTES.filter(menuItem => menuItem);

// @NOTE Crypté login password base64

                this.user$ = this.service.getData('members/' + localStorage.getItem('userId'))
                this.userResources$ = this.service.getData('members/' + localStorage.getItem('userId') + '/resources')
                
                this.resources$ = this.service.getData('resources')
                this.teams$ = this.service.getData('teams')
                this.members$ = this.service.getData('members')
                
                this.teams$.subscribe(res => {
                    for (let team of res) {
                        this.teamsToEdit[team.id]
                    }
                })
                this.resources$.subscribe((res: any) => {                    
                    for (let resource of res) {
                        this.resourcesToEdit[resource.id]
                        // accessAccounts[resourceID]
                        this.accessAccounts$[resource.id] = this.service.getData('resources/' + resource.id + '/accounts') 
                     }
                    }
                )
                this.members$.subscribe((res: any) => {
                    for (let member of res) {
                        this.membersToEdit[member.id]
                            if(member.profile.grantedAuthority === 'MANAGER') {
                                this.membersResToEdit[member.id]                     
                            }
                        this.memberResources$[member.id] = this.service.getData('members/'+ member.id +'/resources')
                    //     this.service.getData('resources')
                    //                     .subscribe(resources => {
                    //                                             this.memberResources$[member.id]
                    //                                                 .subscribe(used => {
                    //                                                     for(let x of resources) {
                    //                                                         if(!used.includes(x)) {
                    //                                                             this.memberResourcesUnused$.push(x)
                    //                                                         }
                    //                                                     }
                    //                                                     console.log(this.memberResourcesUnused$, 'TARGET');
                    //                                                     console.log('########');
                    //                                                     console.log(resources);
                    //                                                     console.log('******');
                    //                                                     console.log(used);
                    //                                                     console.log('###########');
                    //                                                     })
                    //                             })
                     }
                })
                initDemo();
    }

    userManagesRes(resourceId: string | number) : any {
        console.log('***************')
        console.log(resourceId)
        console.log('*********************')
       return this.service.getData('members/' + localStorage.getItem('userId') + '/resources')
            .map(res =>  {
                if(res.find(res => res.id == resourceId)) {
                    return { 'manages' : true }
                }
                return { 'manages' : false }
            })
    }

    unusedResource(memberID: number, used: any) {
        return this.resources$
                    .filter(all => !all.includes(used))
    }

    grantAccess(member: any) {
        this.service.grantAccess('resources/' + this.newGrantedResource[member.id] + '/manager/' + member.id)
            .subscribe(res => {
                        if(res.status === 200) {
                             this.memberResources$[member.id] = this.service.getData('members/'+ member.id +'/resources')
                             this.showNotification('Resource granted successfully to ' + member.name + '.', 'check', 'top', 'center', 2)
                        } else if (res.status >= 400 && res.status < 500) {
                                    this.showNotification('This operation cannot be proceeded', 'error','top', 'center', 4)
                        } else if (res.status >= 500) {
                                    this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error','top', 'center', 4)                
                        }
            })
    }

    toggleForm(type: string) {
        switch (type) {
            case 'resource': {
                this.showResourceForm = !this.showResourceForm
                this.showTeamForm = false
                this.showMemberForm = false
                break
            }
            case 'team': {
                this.showResourceForm = false
                this.showTeamForm = !this.showTeamForm
                this.showMemberForm = false
                break
            }
            case 'member': {
                this.showResourceForm = false
                this.showTeamForm = false
                this.showMemberForm = !this.showMemberForm
                break
            }
            default: {
                console.error('FALSE FORM TOGGLE PARAM')
            }
        }
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

    addResource() {
        this.resourceToAdd.expirationDate = this.resourceToAdd.expirationDate.toString().replace(' ', 'T') + ':00'
        this.resourceToAdd.lastModificationDate = new Date(Date.now()).toISOString()
        this.resourceToAdd.creationDate = new Date(Date.now()).toISOString()

        this.service.newResource(this.resourceToAdd).subscribe(res => {
                                if(res.status === 200) {
                                    this.lastResourceAddedID = res._body.slice(res._body.lastIndexOf('/') + 1)
                                    this.showNotification('Resource added successfully with ID ' + this.lastResourceAddedID + ', please add it\'s access account information.', 'check', 'top', 'center', 2)
                                    this.resources$ = this.service.getData('resources')
                                } else if (res.status >= 400 && res.status < 500) {
                                    this.showNotification('This operation cannot be proceeded', 'error','top', 'center', 4)
                                } else if (res.status >= 500) {
                                    this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error','top', 'center', 4)                
                                }
                            })

    }

    addResourceAccount() {
        this.service.newResourceAccount(this.resourceAccountToAdd, this.lastResourceAddedID).subscribe(res => {                                
                                if(res.status === 200) {
                                    this.showResourceForm = !this.showResourceForm
                                    this.lastResourceAddedID = false
                                    this.resourceAccountToAdd = { }
                                    this.resourceToAdd = { }
                                    this.showNotification('Resource Account added successfully', 'check', 'top', 'center', 2)
                                } else if (res.status >= 400 && res.status < 500) {
                                    this.showNotification('This operation cannot be proceeded', 'error','top', 'center', 4)
                                } else if (res.status >= 500) {
                                    this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error','top', 'center', 4)                
                                }
                            })

    }


    addTeam() {
        this.service.newTeam(this.teamToAdd).subscribe(res => {
                                if(res.status === 200) {
                                    this.toggleForm('team')
                                    this.teamToAdd = { }
                                    this.showNotification('Team added successfully.', 'check', 'top', 'center', 2)
                                    this.teams$ = this.service.getData('teams')
                                } else if (res.status >= 400 && res.status < 500) {
                                    this.showNotification('This operation cannot be proceeded', 'error','top', 'center', 4)
                                } else if (res.status >= 500) {
                                    this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error','top', 'center', 4)                
                                }
                            })
    }

    addMember() {
        this.service.newMember(this.memberToAdd).subscribe(res => {
                                if(res.status === 200) {
                                    this.toggleForm('member')
                                    this.memberToAdd = { profileAutoritiesId: '2', admin: false }
                                    this.showNotification('Member added successfully.', 'check', 'top', 'center', 2)
                                    this.members$ = this.service.getData('members')
                                } else if (res.status >= 400 && res.status < 500) {
                                    this.showNotification('This operation cannot be proceeded', 'error','top', 'center', 4)
                                } else if (res.status >= 500) {
                                    this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error','top', 'center', 4)                
                                }
                            })
    }


    deleteResource(resource: any) {      
        this.service.deleteResource(resource.id).subscribe((res: Response) => {
            if(res.status === 200) {
                this.showNotification('The resource "' + resource.name + '" is deleted with success.', 'delete','top', 'center', 3)
                this.resources$ = this.service.getData('resources')
            } else if (res.status >= 400 && res.status < 500) {
                this.showNotification('This operation cannot be proceeded', 'delete','top', 'center', 4)
            } else if (res.status >= 500) {
                this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete','top', 'center', 4)                
            }
        })
    }

    deleteTeam(team: any) {
        this.service.deleteTeam(team.id).subscribe((res: Response) => {
            if(res.status === 200) {
                this.showNotification('The team "' + team.libelle + '" is deleted with success.', 'delete','top', 'center', 3)
                this.teams$ = this.service.getData('teams')
            } else if (res.status >= 400 && res.status < 500) {
                this.showNotification('This operation cannot be proceeded', 'delete','top', 'center', 4)
            } else if (res.status >= 500) {
                this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete','top', 'center', 4)                
            }
        })
    }

    deleteMember(member: any) {
        this.service.deleteMember(member.id).subscribe((res: Response) => {
            if(res.status === 200) {
                this.showNotification('The member "' + member.name + '" is deleted with success.', 'delete','top', 'center', 3)
                this.members$ = this.service.getData('members')
            } else if (res.status >= 400 && res.status < 500) {
                this.showNotification('This operation cannot be proceeded', 'delete','top', 'center', 4)
            } else if (res.status >= 500) {
                this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'delete','top', 'center', 4)                
            }
        })
    }


    editResource(id: number, index?: number) {
        if(!this.resourcesToEdit.includes(true) || this.resourcesToEdit[id]) {
            this.resourcesToEdit[id] = !this.resourcesToEdit[id]

           if(index != null) {
                this.resources$.subscribe(res => {
                this.resourceToPut = res[index]
            })
           }
        }
    }


    editTeam(id: number, index?: number) {
        if(!this.teamsToEdit.includes(true) || this.teamsToEdit[id]) {
            this.teamsToEdit[id] = !this.teamsToEdit[id]

           if(index != null) {
                this.teams$.subscribe(res => {
                this.teamToPut = res[index]
            })
           }
        }
    }


    editMember(id: number, index?: number) {
        if(!this.membersToEdit.includes(true) || this.membersToEdit[id]) {
            this.membersToEdit[id] = !this.membersToEdit[id]

           if(index != null) {
                this.members$.subscribe(res => {
                this.memberToPut = res[index]
            })
           }
        }
    }

    editMemberRes(id: number, index?: number) {
        this.newGrantedResource = []
        if(!this.membersResToEdit.includes(true) || this.membersResToEdit[id]) {
            //Toggle (only one)
            this.membersResToEdit[id] = !this.membersResToEdit[id]

            //Get member after update
           if(index != null) {
                this.members$.subscribe(res => {
                this.memberToPut = res[index]
            })
           }
        }
    }

    updateResource(index: number) {
        this.service.editResource(this.resourceToPut.id , this.resourceToPut)
            .subscribe((res: Response) => {
            if(res.status === 200) {
                this.showNotification('The resource of id "' + this.resourceToPut.id + '" is modified with success.', 'check','top', 'center', 2)
                this.resources$ = this.service.getData('resources')
            } else if (res.status >= 400 && res.status < 500) {
                this.showNotification('This operation cannot be proceeded', 'error','top', 'center', 4)
            } else if (res.status >= 500) {
                this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error','top', 'center', 4)                
            }
        })
    }

    updateTeam(index: number) {
        this.service.editTeam(this.teamToPut.id , this.teamToPut)
            .subscribe((res: Response) => {
            if(res.status === 200) {
                this.showNotification('The team of id "' + this.teamToPut.id + '" is modified with success.', 'check','top', 'center', 2)
                this.teams$ = this.service.getData('teams')
            } else if (res.status >= 400 && res.status < 500) {
                this.showNotification('This operation cannot be proceeded', 'error','top', 'center', 4)
            } else if (res.status >= 500) {
                this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error','top', 'center', 4)                
            }
        })      
    }

    updateMember(index: number, profileID: number) {
        this.service.editMember(this.memberToPut.id, profileID, this.memberToPut.teamId, this.memberToPut)
            .subscribe((res: Response) => {
            if(res.status === 200) {
                this.showNotification('The member of id "' + this.memberToPut.id + '" is modified with success.', 'check','top', 'center', 2)
                this.members$ = this.service.getData('members')
            } else if (res.status >= 400 && res.status < 500) {
                this.showNotification('This operation cannot be proceeded', 'error','top', 'center', 4)
            } else if (res.status >= 500) {
                this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error','top', 'center', 4)                
            }
        })      
    }

    revokeAccess(memberID: number, resourceID: number) {
        this.service.revokeManagerAccess(memberID, resourceID)
                    .subscribe((res: Response) => {
                        if(res.status === 200) {
                            this.showNotification('Access Revoked From Manager Successfully', 'check','top', 'center', 3)
                            this.members$.subscribe((res: any) => {
                                for (let member of res) {                                    
                                    this.memberResources$[member.id] = this.service.getData('members/'+ member.id +'/resources')
                                }
                            })
                        } else if (res.status >= 400 && res.status < 500) {
                            this.showNotification('This operation cannot be proceeded', 'error','top', 'center', 4)
                        } else if (res.status >= 500) {
                            this.showNotification('This operation cannot be proceeded because of internal SERVER error', 'error','top', 'center', 4)                
                        }
              })
    }

}