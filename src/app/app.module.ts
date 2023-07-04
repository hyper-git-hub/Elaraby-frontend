import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ConnectionResolver } from './core/route.resolver';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DefaultInterceptor } from './core/interceptors/tokenInsertion.interceptor';






// export function createConfig(): SignalRConfiguration {
//   const c = new SignalRConfiguration();
//   // c.url = 'http://52.166.198.230:8080/signalr'; // IoP old signal'; https://iotsa.staging.signalr.elarabygroup.com:8080/signalr
//   //c.url = 'https://iotsa.staging.signalr.elarabygroup.com:8080/signalr';
//   c.url = 'https://iotsa.signalr.elarabygroup.com:8080/signalr';
//   //https://iotsa.signalr.elarabygroup.com:8080/signalr
//   // 'https://iotsa.dev.signalr.elarabygroup.com:8080/signalr'                  // developmenr signalR url
//   // 'http://iotsa.signalr.elarabygroup.com:8080/signalr';                     // production signalR url
//   // 'http://iotsa.staging.signalr.elarabygroup.com:8080/signalr';             // staging signalR url
//   // 'http://elaraby-broadcast-hn.westeurope.cloudapp.azure.com:8080/signalr'; // IoP new tenant';
//   c.hubName = 'EventHubMessages';
//   c.logging = false;
//   return c;
// }




const interceptors: any = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: DefaultInterceptor,
    multi: true,
  }
];



export const firebaseConfig = {
  apiKey: 'AIzaSyBoK0nPXiHvy9ddCS2jdf-lHHkSp4OdXIw',
  authDomain: '',
  databaseURL: 'https://hypernet-notifications.firebaseio.com/',
  storageBucket: '',
  messagingSenderId: '766877346878',
  projectId: 'hypernet-notifications'
};


@NgModule({
  declarations: [
    AppComponent],
  imports: [
    // SignalRModule.forRoot(createConfig),
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    CoreModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
  ],
  providers: [ interceptors
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
