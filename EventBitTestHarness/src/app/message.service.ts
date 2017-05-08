import { Injectable } from '@angular/core';
import { Http, Jsonp } from '@angular/http';

@Injectable()
export class MessageService {
    public messages:Message[] = [];

    
}

export class Message {
    public messageStatus:MessageStatus = MessageStatus.Error;
    public message:string;
}

export enum MessageStatus {
    OK = 1,
    Warning = 2,
    Error = 3
}