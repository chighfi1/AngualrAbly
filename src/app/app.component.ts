import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Ably from 'ably';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ably-angular';
  data = '';
  ably: Ably.Realtime | undefined;
  channel: Ably.RealtimeChannel | undefined;

  constructor(private http: HttpClient) {
    const tokenResponse = this.http.get<{ token: string; }>(
      'https://localhost:7222/WeatherForecast'
    ).subscribe((tokenResponse) => {
      const token = tokenResponse.token;
      this.ably = new Ably.Realtime({
        authUrl: '/api/ably/authenticate',
        token
      });

      this.channel = this.ably.channels.get('blobtastic');

      this.ably.connection.once('connected').then(() => {
        console.log('Connected to Ably!');
        this.channel!.subscribe('greeting', (message) => {
          console.log(message.clientId);
          this.data = String(message.data);
          console.log(message.data);
        })
      });


    })
  }


  publishMessage() {
    const date = new Date();
    const minute = 'minute is ' + date.getMinutes.toString();

    this.channel!.publish('greeting', minute);
  }

}
