import { Component, OnInit } from '@angular/core';
import * as Ably from 'ably';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ably-angular';
  data = '';

  ably = new Ably.Realtime('<insert API Key>');
  channel = this.ably.channels.get('blobtastic');


  ngOnInit() {
    this.ably.connection.once('connected').then(() => {
      console.log('Connected to Ably!');
      this.channel.subscribe('greeting', (message) => {
        console.log(message.clientId);
        this.data = String(message.data);
        console.log(message.data);
      })
    });
  }

  publishMessage() {
    const date = new Date();
    const minute = 'minute is ' + date.getMinutes.toString();

    this.channel.publish('greeting', minute);
  }

}
