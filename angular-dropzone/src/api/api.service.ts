import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, map } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) {}

  /**
   *  Sends a direct GET request to the backend without using API URL
   */
  public fetch(route:string, body:any = {}) {
    return this.http.get<any>(environment.backend_url + route, {params: body}).toPromise();
  }

  // #memo - remember following methods use lazy observables (HTTP request are only send if an observer has subscribed to it)

  public create(entity:string, fields:any = {}) {
    return this.http.put<any>(environment.backend_url + '/?do=model_create', {
      entity: entity,
      fields: JSON.stringify(fields),
      lang: environment.lang
    }).toPromise();
  }


  public read(entity:string, ids:any[], fields:any[]) {
    return this.http.get<any>(environment.backend_url+'/?get=model_read', {params: {
        entity: entity,
        ids: JSON.stringify(ids),
        fields: JSON.stringify(fields),
        lang: environment.lang
      }
    })
    .toPromise();
  }

  public update(entity:string, ids:number[], values:{}, force: boolean=false) {
    return this.http.patch<any>(environment.backend_url+'/?do=model_update', {
        entity: entity,
        ids: ids,
        fields: values,
        lang: environment.lang,
        force: force
    })
    .toPromise();
  }

  public remove(entity:string, ids:number[], permanent:boolean=false) {
    return this.http.delete<any>(environment.backend_url+'/?do=model_delete', {body: {
        entity: entity,
        ids: ids,
        permanent: permanent
      }
    }).toPromise();
  }


  public async collect(entity:string, domain:any[], fields:any[], order:string='id', sort:string='asc', start:number=0, limit:number=5) {
    return this.http.get<any>(environment.backend_url+'/?get=model_collect', {params: {
        entity: entity,
        domain: JSON.stringify(domain),
        fields: JSON.stringify(fields),
        order: order,
        sort: sort,
        start: start,
        limit: limit,
        lang: environment.lang
      }
    })
    .toPromise();
  }

  public readDocument(entity:string, ids:any[], fields: {}) {
    return this.http.get<any>(environment.backend_url+'/?get=documents_document', {params: {
        entity: entity,
        ids: JSON.stringify(ids),
        fields: JSON.stringify(fields),
        lang: environment.lang
      }
    })
    .toPromise();
  }

  /*
    All methods using API return a Promise object.
    They can ben invoked either by chaing .then() and .catch() methods, or with await prefix (assuming parent function is declared as async).
  */

  /**
   * Send a GET request to the API.
   *
   * @param route
   * @param body
   * @returns
   */
  public get(route:string, body:any = {}) {
    return this.http.get<any>(environment.rest_api_url+route, {params: body}).toPromise();
  }

  public post(route:string, body:any = {}) {
    return this.http.post<any>(environment.rest_api_url+route, body).toPromise();
  }

  public patch(route:string, body:any = {}) {
    return this.http.patch<any>(environment.rest_api_url+route, body).toPromise();
  }

  public put(route:string, body:any = {}) {
    return this.http.put<any>(environment.rest_api_url+route, body).toPromise();
  }

  public delete(route:string) {
    return this.http.delete<any>(environment.rest_api_url+route).toPromise();
  }

  public async profileUpdate(user_id: string, firstname: string, lastname: string, language: string, avatar: string) {
    let params:any = {
      id: user_id,
      firstname: firstname,
      lastname: lastname,
      language: language
    };

    if(avatar && avatar.length) {
      params['avatar'] = avatar;
    }

    const data = await this.put('/user/'+user_id, params);

    return data;
  }

  public async passwordUpdate(user_id: string, password: string, confirm: string) {
    const data = await this.http.get<any>(environment.backend_url+'/?do=user_pass-update', {
        params: {
          id: user_id,
          password: password,
          confirmation: confirm
        }
    });

    return data;
  }


}