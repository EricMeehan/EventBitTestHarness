import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { LoginService } from './login.service';

//import {Observable} from 'rxjs/Observable'; 
import {Observable} from 'rxjs/Rx';

import {MessageService, MessageStatus} from './message.service';

@Injectable()
export class EntityService {
    

    entityData: {[showCode:string]: ShowEntities} = {};

    constructor(private http:Http, private loginService:LoginService, private messageService:MessageService){

    }

    private getUrlBase() : string {
        return 'https://' + this.loginService.environment + '.experienteventbit.com/webapi/API/Event';
    }

    public getServerEntityData(showCode:string, entityName:string, entityPullSize:Number, forceHighestSysRowStampNum:Number) : Promise<ShowEntities> {

        if(!this.entityData[showCode])
            this.entityData[showCode] = new ShowEntities(showCode);

        let headers = new Headers();
        headers.append("X-AUTH-CLAIMS", this.loginService.getClaim().ogString)

        var url = [];

        url.push(this.getUrlBase());
        url.push(showCode);
        url.push(entityName);

        let qs = '?include=-&max=' + entityPullSize + '&since=';

        if(forceHighestSysRowStampNum != -1)
            qs += forceHighestSysRowStampNum;
        else if(this.entityData[showCode].Entities[entityName])
            qs += this.entityData[showCode].Entities[entityName].getHighestSysRowStampNum();
        else
            qs += 0;

        url.push(qs);

        return this.http.get(url.join('/'), {headers : headers})
            .toPromise()
            .then(response => this.extractEntityData(response, showCode, entityName))
            .catch(response => this.handlePullError(response, showCode));
    }

    private extractEntityData(response, showCode:string, entityName:string){

        this.loginService.setClaim(response.headers.get("x-auth-claims"));

        if(!this.entityData[showCode].Entities[entityName])
            this.entityData[showCode].Entities[entityName] = new Entity(entityName);

        let entity = this.entityData[showCode].Entities[entityName];

        let data = response.json();

        data.forEach((value, index, array) => {
            value.pullNumber = entity.pullLog.length + 1;
            entity.data.push(value);
        });

        
        entity.pullLog.push({
            timeStamp: new Date(),
            rows: data,
            url: response.url
        });

        return this.entityData[showCode];
    }

    private handlePullError(response, showCode:string) {
        this.loginService.setClaim(response.headers.get("x-auth-claims"));

        this.messageService.messages.push({
            message: response.json()[0].Text,
            messageStatus: MessageStatus.Error
        });

        return this.entityData[showCode];
    }

    public getLocalEntityData(showCode:string) : ShowEntities {
        return this.entityData[showCode];
    }

    public getEntities() : string[] {
        return [ 
            'Booth',
            'Category',
            'Company',
            'CompanyAltName',
            'CompanyBooth',
            'CompanyCategory',
            'Facility',
            'FieldDetail',
            'FieldDetailPick',
            'Location',
            'LocationProduct',
            'LocationSchedule',
            'Map',
            'MapBooth',
            'Person',
            'PersonCategory',
            'PersonCompany',
            'PersonFieldDetailPick',
            'PersonPurchase',
            'PersonRegistration',
            'PersonReservation',
            'Product',
            'ProductCategory'
            ];
    }

    public getShows() : Promise<Show[]> {

    let headers = new Headers();
        headers.append("X-AUTH-CLAIMS", this.loginService.getClaim().ogString)

        return this.http.get(this.getUrlBase(), {headers: headers})
            .toPromise()
            .then(response => {
                this.loginService.setClaim(response.headers.get("x-auth-claims"));

                return response.json()
            })
            .catch(response => {
                this.loginService.setClaim(response.headers.get("x-auth-claims"));
                
                this.messageService.messages.push({
                            message: response.json()[0].Text,
                            messageStatus: MessageStatus.Error
                        });

                return [];
            });
    }
}

export class Show {
    name:string;
    showCode:string;
}

export class ShowEntities {
    showCode:string;
    Entities:any;

    constructor(showCode:string){
        this.showCode = showCode;
        this.Entities = {};
    }
}

export class Entity {
    entityName:string;
    data:any[] = [];
    filteredData:any[];
    pullLog:EntityPullData[] = [];
    cols:string[] = null;
    filter:any={};
    

    constructor(entityName:string){
        this.entityName = entityName;
        this.filter = {};
    }

    public getHighestSysRowStampNum() : number {
        
        let max = -1;
        
        if(!this.data)
            return max;
        
        this.data.forEach((value, index, arrayelement) => {
            if(value.sysRowStampNum > max)
                max = value.sysRowStampNum;
        });

        return max;
    }
    public getColumns() : string[] {
        if(this.data.length == 0)
            return [];

        if(this.cols == null)
            return this.cols = Object.keys(this.data[0]);
        else
            return this.cols;
    }
}

export class EntityPullData {
    timeStamp:Date = new Date();
    rows:any[];
    url:string;
}

