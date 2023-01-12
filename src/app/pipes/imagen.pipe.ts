import { Pipe, PipeTransform } from '@angular/core';
import {environment} from "../../environments/environment";

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, tipo: 'usuarios'|'medicos'|'hospitales' ): string {

    if( img?.includes('https') ){
      return img;
    }

    if( img?.length !== 0 ){
      return `${base_url}/upload/${tipo}/${img}`;
    }

    return `${base_url}/upload/usuarios/no-image`;
  }

}
