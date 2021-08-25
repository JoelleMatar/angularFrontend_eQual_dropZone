import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatTableModule, _MatTableDataSource } from '@angular/material/table';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from 'src/http.interceptor.service';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/api/api.service';
import { AuthService } from 'src/auth/auth.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxDropzoneModule,
    MatTableModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }, 
    ApiService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
