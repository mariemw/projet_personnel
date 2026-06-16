import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket';
import { FormsModule } from '@angular/forms';
import { Message } from '../../message.interface';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat  implements OnInit{
  constructor(private socket:SocketService){}
  typing:string='';
  messages:Message[]=[];
  myMessage:string=''; 
  otherMessage:string='';
  @Input() projectId:string='';
  @Input() userId:string='';
  @Input() userName:string='';

  ngOnInit(): void {
    this.socket.getMessages(this.projectId);
    this.socket.onMessagesHistory((messages) => {
      this.messages = messages;
    });
    this.socket.onMessage((data) => {
      this.otherMessage=data.messageSent;
      this.messages.push({text: data.messageSent,
      userId: data.userId,
      userName: data.userName,
      projectId: data.projectId});
    });
    
  }

  sendMessage(){
    this.myMessage=this.typing;
    this.socket.sendMessage({messageSent:this.myMessage,userId:this.userId,projectId:this.projectId,userName:this.userName});
    this.messages.push({text:this.myMessage,userId:this.userId,projectId:this.projectId,userName:this.userName})
    this.typing='';
  }

}
