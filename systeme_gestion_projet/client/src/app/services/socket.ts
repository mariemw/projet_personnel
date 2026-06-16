import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environments';
import { T } from '@angular/cdk/keycodes';
import { Message } from '../message.interface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket:Socket;
  constructor(){
    this.socket=io(environment.wsUrl);
    this.socket.on('connect', () => {
    });

    this.socket.on('disconnect', () => {
    });

    this.socket.on('connect_error', () => {
    });
  }

  joinProject(projectId:string){
    this.socket.emit('joinProject',projectId);
  }

  sendMessage(data:{messageSent:string,projectId:string,userId:string,userName:string}){
    this.socket.emit('sendMessage',data);
  }
  
  onMessage(callback: (data: any) => void) {
    this.socket.off('receivedMessage');
    this.socket.on('receivedMessage', callback);
  }

  getMessages(projectId: string) {
    this.socket.emit('getMessages', projectId);
  }

  onMessagesHistory(callback: (messages: any[]) => void) {
    this.socket.on('messagesHistory', callback);
  }

  onUpdateProject(callback: (messages: any[]) => void){
    this.socket.on('projectUpdated',callback)
  }

  onUpdateTask(callback: (messages: any[]) => void){
    this.socket.on('taskUpdated',callback)
  }
}
