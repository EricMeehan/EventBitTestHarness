import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class LoginService {
    
    userName: string;
    url: string;
    claim : Claim;

    constructor(private http: Http) {
        //this.url = 'https://dev.experienteventbit.com/webapi/API/AuthUser';
        this.url = 'https://qa.experienteventbit.com/webapi/api/authuser';

        console.log('creating login service');
    }

    public login(userName:string, password:string) : boolean {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});

        this.http.post(this.url, {
            'Username': userName,
            'Password': password
        }, options)
        .toPromise()
        //.then(this.extractData);
        .then(response => this.extractData(response, userName));

        return true;
    }

    private extractData(response, userName) {
        this.claim = new Claim(response.headers.get("x-auth-claims"));
        this.userName = userName;
    }

    public IsLoggedIn() : boolean {
        if(!this.claim)
            return false;
        else
            return true;
    }

    public getToken() : string {
        if(!this.claim)
            return null;
        else
            return this.claim.Token;
    }
}

export class Claim {
    EntityId:number;
    EntityType:number;
    Expires:number;
    Issued:number;
    Token:string;

    constructor(data:string) {
        let jsonData = JSON.parse(data);  

        this.EntityId = jsonData.EntityId;
        this.EntityType = jsonData.EntityType;
        this.Expires = jsonData.Expires;
        this.Issued = jsonData.Issued;
        this.Token = jsonData.Token;
    }
}