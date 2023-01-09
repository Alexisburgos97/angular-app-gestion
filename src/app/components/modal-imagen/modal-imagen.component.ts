import { Component } from '@angular/core';
import {ModalImagenService} from "../../services/modal-imagen.service";
import Swal from "sweetalert2";
import {FileUploadService} from "../../services/file-upload.service";

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent {

  // public ocultarModal: boolean = false;
  public imagenSubir !: File;
  public imgTemp: any = null;

  constructor( public modalImagenService: ModalImagenService, public fileUploadService: FileUploadService ) {
  }

  cerrarModal(){
    // this.ocultarModal = true;
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id)
      .then( img => {
        Swal.fire('Guardado', 'Imagen de usuario actualizado' ,'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      }, error => {
        Swal.fire('Error', 'No se pudo subir la imagen' ,'error');
      });
  }

}
