import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as SignalR from '@aspnet/signalr';
import { SignalRConnection } from '../model/signal-r-connection.model';
import { AppConfig } from '../../app.config';

@Injectable()

export class SignalRService {
  mxChipData: Subject<string> = new Subject();
  private hubConnection: SignalR.HubConnection;

  constructor(private http: HttpClient) { }

  private getSignalRConnection(id: any): Observable<SignalRConnection> {
    //return this.http.get<SignalRConnection>(`${environment.signalR}SignalRConnection`);
    return this.http.get<SignalRConnection>(`${AppConfig.signalRUrl}/api/SignalR${id ? '/' + id : ''}`);
  }

  init(id = null) {
    this.getSignalRConnection(id).subscribe(con => {
      const options = {
        accessTokenFactory: () => con.accessToken
      };

      this.hubConnection = new SignalR.HubConnectionBuilder()
        .withUrl(con.url, options)
        .configureLogging(SignalR.LogLevel.Information)
        .build();

      this.hubConnection.on('notify', (data: any) => {
        this.mxChipData.next(data);
      });

      this.hubConnection.start()
        .catch((error: any) => console.error(error));

      this.hubConnection.serverTimeoutInMilliseconds = 300000;
      this.hubConnection.keepAliveIntervalInMilliseconds = 300000;

      this.hubConnection.onclose((error: any) => {
        console.error(`Something went wrong: ${error}`);
      });
    });
  }
  close() {
    // this.hubConnection.stop();
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
