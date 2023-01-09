import {Injectable, NgZone} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

import {RegisterForm} from "../interfaces/register-form.interface";
import {LoginForm} from "../interfaces/login-form.interface";
import {AbstractControl, ValidationErrors, ɵElement, ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";
import {catchError, map, Observable, of, tap} from "rxjs";
import {Router} from "@angular/router";
import {Usuario} from "../models/usuario.model";
import {CargarUsuario} from "../interfaces/cargar-usuarios.interface";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario !: Usuario;

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

  actualizarPerfil( data: {email: string, nombre: string, role: string} ) {

    data = {
      ...data,
      role : this.usuario.role!
    };

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });

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

    // const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {

        const {email, google, nombre, role, img = '', uid} = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

        localStorage.setItem('token', resp.token);

        return true;
      }),
      catchError( error => of(false) )
    );

  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  cargarUsuarios(desde: number = 0){

    return this.http.get<CargarUsuario>(`${base_url}/usuarios?desde=${desde}`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( resp => {

        const usuarios = resp.usuarios.map(
          user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
        );

        return {
          total: resp.total,
          usuarios
        };
      })
    );

  }

  eliminarUsuario( usuario: Usuario ){

    return this.http.delete(`${base_url}/usuarios/${usuario.uid}`, {
      headers: {
        'x-token': this.token
      }
    });

  }

  guardarUsuario( usuario: Usuario ) {

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, {
      headers: {
        'x-token': this.token
      }
    });

  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

}
