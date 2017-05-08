import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { LoginService } from './login.service';

//import {Observable} from 'rxjs/Observable'; 
import {Observable} from 'rxjs/Rx';

import{MessageService, MessageStatus} from './message.service';

declare var JXG: any;

@Injectable()
export class SnapShotService {
    
    trackedData: {[showCode:string] : TrackedData} = {};

    constructor(private jsonp: Jsonp, private http:Http, private loginService:LoginService, private messageService:MessageService){
        
    }

    private getUrlBase() : string {
        return 'https://' + this.loginService.environment + '.experienteventbit.com/webapi/API/Event';
    }

    public getLocalTrackedData(showCode:string) : TrackedData {
        return this.trackedData[showCode];
    }

    public getServerTrackedData(showCode:string) : Promise<TrackedData> {

        let headers = new Headers();
        headers.append("X-AUTH-CLAIMS", this.loginService.getClaim().ogString)

        var url = [];
        url.push(this.getUrlBase());
        url.push(showCode);
        url.push('TrackingData');
        //url.push('TrackedDump');

        return this.http.get(url.join('/'), {headers : headers})
//            .map(response => response.json() as TrackedData);
            .toPromise()
            .then(response => this.extractTrackedData(response, showCode))
            .catch(response => this.handlePullError(response, showCode));
    }

    private extractTrackedData(response, showCode:string) {

        this.loginService.setClaim(response.headers.get("x-auth-claims"));

        let trackedData = new TrackedData(response.json());

        trackedData.url = response.url;

        if(!this.trackedData[showCode]) {
            this.trackedData[showCode] = trackedData;
        } else if (this.trackedData[showCode].UniqueIdentifier != trackedData.UniqueIdentifier) {
            this.trackedData[showCode] = trackedData;
            this.messageService.messages.push({message: 'New snapshot loaded', messageStatus:MessageStatus.OK});
        }
          else if (this.trackedData[showCode].UniqueIdentifier == trackedData.UniqueIdentifier) {
            this.messageService.messages.push({message: 'No new snapshot', messageStatus:MessageStatus.OK});
            return this.trackedData[showCode];
        }            

        return trackedData;
    }

    private handlePullError(response, showCode:string) {
        this.loginService.setClaim(response.headers.get("x-auth-claims"));

        this.messageService.messages.push({
            message: response.json()[0].Text,
            messageStatus: MessageStatus.Error
        });

        return this.trackedData[showCode];
    }    

    public getTableData(showCode:string, tableName:string){

        let table =  this.trackedData[showCode].tablesMap[tableName];
        
        //No 'Access-Control-Allow-Origin' header is present on the requested resource
        let chunks = new Array<Promise<string>>();        

        table.ChunkURIs.forEach((value, index, array) => {
            //let chunk = this.http.get("abc.html", {})
            let chunk = this.http.get("app/SampleData/Sample.txt")
            //let chunk = this.http.get("app/SampleData/20170506171702_5d19c070-2fe7-49ab-94e6-4aed507366d3_trackedactivity_0000_part_00.gz")
                //.map(response => 
                //response.text()
                //);
            
            //let chunk = this.http.get(value + '?callback=JSONP_CALLBACK')
            // .map(response => 
            //        alert(response)
            //    ).subscribe(response =>
            //        alert(response)
            //    );
            //let chunk = this.jsonp.get(value + '?callback=test')
                .toPromise()
                .then(response => 
                    response.text()
                );
            
            chunks.push(chunk);
        });

        return Promise.all(chunks).then(response => {

                table.Data = [];

                response.join().split('\n').forEach((value, index, array) => {
                    table.Data.push(value.split('|'));
                });
            }
             //alert(response.join());
        )

    }


    public getShows() : Show[] {
        return [
            { name : 'IFT999', showCode: 'IFT999'},
            { name : 'INF999', showCode: 'INF999'},
            //{ name : 'BCN999', showCode: 'BCN999'}
        ];
    }

}


export class Show {
    name:string;
    showCode:string;
}

export class Table {
    TableName:string;
    OrderedColumnSchema:string[];
    ChunkURIs:string[];
    Data:string[][];
    FilteredData:string[][];
    Filter:any={};
}

export class TrackedData
{
    url:string;
    UniqueIdentifier:string;
    Tables:Table[];

    tablesMap: {[tableName: string] : Table}

    TimeStamp: Date;

    constructor(json:any){
        this.tablesMap = {};

        this.UniqueIdentifier = json.UniqueIdentifier;
        this.Tables = json.Tables;

        this.Tables.forEach((value, index, array) => {
            this.tablesMap[value.TableName] = value;
            this.tablesMap[value.TableName].Filter = {};
        });

        this.TimeStamp = new Date();
    }
}