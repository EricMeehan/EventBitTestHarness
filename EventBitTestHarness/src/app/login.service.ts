import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Headers, RequestOptions } from '@angular/http';

import { MessageService, MessageStatus } from './message.service';

@Injectable()
export class LoginService {
    
    userName: string;
    private claim : Claim;
    environment:string;

    constructor(private http: Http, private messageService:MessageService) {
    }

    private getUrl() : string {
        return 'https://' + this.environment + '.experienteventbit.com/webapi/API/AuthUser';
    }

    public logout() {
        this.claim = null;
        location.reload();
    }

    public login(userName:string, password:string, environment:string) : boolean {

        this.environment = environment;

        //let headers = new Headers();
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});

        this.http.post(this.getUrl(), {
                'Username': userName,
                'Password': password
            }, options)
            .toPromise()
            //.then(this.extractData);
            .then(response => this.extractData(response, userName))
            .catch(response => 
            this.messageService.messages.push({
                message: response.json()[0].Text,
                messageStatus: MessageStatus.Error
            }));

        return true;
    }

    private extractData(response, userName) {
        this.claim = new Claim(response.headers.get("x-auth-claims"));
        this.userName = userName;
    }

    public IsLoggedIn() : boolean {
        return !!this.claim;
    }

    public getToken() : string {
        if(!this.claim)
            return null;
        else
            return this.claim.Token;
    }

    public getClaim() : Claim {
        return this.claim;
    }

    public setClaim(claim:string) {
        this.claim = new Claim(claim);
    }
}

export class Claim {
    ogString:string;
    EntityId:number;
    EntityType:number;
    Expires:number;
    Issued:number;
    Token:string;

    constructor(data:string) {
        this.ogString = data;
        
        let jsonData = JSON.parse(data);  
        
        this.EntityId = jsonData.EntityId;
        this.EntityType = jsonData.EntityType;
        this.Expires = jsonData.Expires;
        this.Issued = jsonData.Issued;
        this.Token = jsonData.Token;
    }
}