import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {Medico} from "../models/medico.model";
import {environment} from "../../environments/environment";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( private http: HttpClient ) { }

  cargarMedicos(){

    return this.http.get<Medico[]>(`${base_url}/medicos`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => resp.medicos )
    )

  }

  obtenerMedicoPorId( id: string ){

    return this.http.get(`${base_url}/medicos/${id}`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( ( resp: any ) => resp.medico )
    )

  }

  crearMedico( medico: { nombre: string, hospital: string } ){

    return this.http.post(`${base_url}/medicos`, medico , {
      headers: {
        'x-token': this.token
      }
    });

  }

  actualizarMedico( medico: Medico ){

    return this.http.put(`${base_url}/medicos/${medico._id}`, medico , {
      headers: {
        'x-token': this.token
      }
    });

  }

  borrarMedico(_id: string){

    return this.http.delete(`${base_url}/medicos/${_id}`, {
      headers: {
        'x-token': this.token
      }
    });

  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

}
