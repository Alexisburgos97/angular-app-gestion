import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CargarUsuario} from "../interfaces/cargar-usuarios.interface";
import {map} from "rxjs";
import {Usuario} from "../models/usuario.model";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private transformarUsuarios( resultados: any[] ): Usuario[]{

    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );

  }

  buscar( tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string = '' ){

    return this.http.get<any[]>(`${base_url}/todo/coleccion/${tipo}/${termino}`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        // resp.resultados

        switch ( tipo ){
          case 'usuarios':
            return this.transformarUsuarios(resp.resultados);

          default:
            return [];
        }
      })
    );

  }

}
