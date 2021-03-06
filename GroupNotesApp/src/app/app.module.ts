import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FileStorageService } from './_services/file-storage.service';
import { AuthProvider } from './_services/auth.service';
import { GroupsService } from './_services/groups.service'
import { config } from './app.firebaseconfig';
import { ImagePopoverComponent } from './_components/image-popover/image-popover.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@NgModule({
  declarations: [AppComponent, ImagePopoverComponent],
  entryComponents: [AppComponent, ImagePopoverComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    FormsModule,                          
    ReactiveFormsModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // Imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // Imports firebase/auth, only needed for auth features
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileStorageService,
    QuillModule,
    FileTransfer,
    FileTransferObject,
    GroupsService,
    AuthProvider,
    AngularFireDatabase
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  
}
