import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CargarUsuario} from "../interfaces/cargar-usuarios.interface";
import {map} from "rxjs";
import {Usuario} from "../models/usuario.model";
import {environment} from "../../environments/environment";
import {Hospital} from "../models/hospital.model";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http: HttpClient ) { }

  cargarHospitales(){

    return this.http.get<Hospital[]>(`${base_url}/hospitales`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => resp.hospitales )
    )

  }

  crearHospital(nombre: string){

    return this.http.post(`${base_url}/hospitales`, {nombre} , {
      headers: {
        'x-token': this.token
      }
    });

  }

  actualizarHospital(_id: string, nombre: string){

    return this.http.put(`${base_url}/hospitales/${_id}`, {nombre} , {
      headers: {
        'x-token': this.token
      }
    });

  }

  borrarHospital(_id: string){

    return this.http.delete(`${base_url}/hospitales/${_id}`, {
      headers: {
        'x-token': this.token
      }
    });

  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }


}
