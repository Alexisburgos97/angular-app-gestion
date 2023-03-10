import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsuarioService} from "../../services/usuario.service";
import {FileUploadService} from "../../services/file-upload.service";

import {Usuario} from "../../models/usuario.model";

import Swal from "sweetalert2";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit{

  public perfilForm !: FormGroup;
  public usuario : Usuario;
  public imagenSubir !: File;
  public imgTemp: any = null;

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private fileUploadService: FileUploadService ) {

    this.usuario = usuarioService.usuario;

  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil(){
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe( (resp: any) => {
        const {nombre, email} = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Actualizado', resp.msg ,'success');
      }, error => {
        Swal.fire('Error', error.error.msg ,'error');
      });
  }

  cambiarImagen(file: any): any{
    this.imagenSubir = file.target.files[0];

    if( !file ){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    // const url64 = reader.readAsDataURL(file);

    reader.onloadend = () =>{
      this.imgTemp = reader.result;
    }

  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then( img => {
        console.log(img)
        this.usuario.img = img;

        Swal.fire('Guardado', 'Imagen de usuario actualizado' ,'success');
      }, error => {
        Swal.fire('Error', 'No se pudo subir la imagen' ,'error');
      });
  }

}
