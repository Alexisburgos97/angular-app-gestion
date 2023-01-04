import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

import {RegisterForm} from "../interfaces/register-form.interface";
import {LoginForm} from "../interfaces/login-form.interface";
import {AbstractControl, ValidationErrors, ɵElement, ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";
import {catchError, map, Observable, of, tap} from "rxjs";
import {Router} from "@angular/router";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient, private router: Router ) {}

  crearUsuario( formData: RegisterForm ){
    console.log("creando usuario");
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );
  }

  login(formData: ɵTypedOrUntyped<{ [K in keyof { remember: boolean[]; password: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[]; email: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[] }]: ɵElement<{ remember: boolean[]; password: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[]; email: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[] }[K], null> }, ɵFormGroupValue<{ [K in keyof { remember: boolean[]; password: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[]; email: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[] }]: ɵElement<{ remember: boolean[]; password: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[]; email: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[] }[K], null> }>, any>){

    console.log("login usuario");

    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );

  }

  loginGoogle( token: string ){
    return this.http.post(`${base_url}/login/google`, { token } )
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );
  }

  validarToken(): Observable<boolean>{

    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      }),
      map( resp => true),
      catchError( error => of(false) )
    );

  }

  logout(){

    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

  }

}
