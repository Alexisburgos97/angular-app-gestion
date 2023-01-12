import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsuarioService} from "../../../services/usuario.service";
import {Usuario} from "../../../models/usuario.model";
import {BusquedasService} from "../../../services/busquedas.service";

import Swal from "sweetalert2";
import {ModalImagenService} from "../../../services/modal-imagen.service";
import {delay, Subscription} from "rxjs";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy{

  public totalUsuarios: number = 0;
  public usuarios : Usuario[] = [];
  public usuariosTemp : Usuario[] = [];

  public imgSubs !: Subscription;
  public desde: number = 0;
  public cargando: boolean = false;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor( private usuarioService: UsuarioService,
                private busquedaService: BusquedasService,
                private modalImagenService: ModalImagenService ) {
  }

  ngOnDestroy(): void{
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe( img => {
        this.cargarUsuarios();
      });

  }

  cargarUsuarios(){
    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe( ({total, usuarios}) => {

        this.totalUsuarios = total;

        if( usuarios.length !== 0 ){
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
        }

        this.cargando = false;

      }, error => {
        console.log(error)
      });
  }

  cambiarPagina( valor: number ){
    this.desde += valor;

    if( this.desde < 0 ){
      this.desde = 0;
    }else if( this.desde > this.totalUsuarios ){
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ){

    if ( termino.length === 0 ){
      this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar( 'usuarios', termino)
      .subscribe( (resp: any) => {
        this.usuarios = resp;
      })
  }

  eliminarUsuario( usuario: Usuario ): any{

    if( usuario.uid === this.usuarioService.uid ){
      return Swal.fire('Error', `No puede borrarse a si mismo`, 'error' );
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `¿Está seguro de borrar a ${usuario.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe( resp => {

            Swal.fire(
              'Usuario eliminado',
              `El usuario ${usuario.nombre} fue eliminado correctamente`,
              'success'
            )

            this.cargarUsuarios();

          })

      }
    })

  }

  cambiarRole(usuario: Usuario){

    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {

        if( resp ){
          this.Toast.fire({
            icon: 'success',
            title: 'Role actualizado'
          });
        }else{
          this.Toast.fire({
            icon: 'error',
            title: 'Error al actualizar el role'
          });
        }

      }, error => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error, intente más tarde'
        });
      });

  }

  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios', <string>usuario.uid, usuario.img);
  }


}
