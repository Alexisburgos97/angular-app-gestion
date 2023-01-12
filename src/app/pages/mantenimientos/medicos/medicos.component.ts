import {Component, OnInit} from '@angular/core';
import {MedicoService} from "../../../services/medico.service";
import {Medico} from "../../../models/medico.model";
import {ModalImagenService} from "../../../services/modal-imagen.service";
import {BusquedasService} from "../../../services/busquedas.service";
import {delay, Subscription} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit{

  public cargando: boolean = true;
  public imgSubs !: Subscription;
  public medicos: Medico[] = [];

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService ) {
  }

  ngOnDestroy(): void{
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe( img => {
        this.cargarMedicos();
      });
  }

  cargarMedicos(){
    this.cargando = true;

    this.medicoService.cargarMedicos()
      .subscribe( resp => {
        this.cargando = false;
        this.medicos = resp;
      })
  }

  abrirModal( medico: Medico ){
    this.modalImagenService.abrirModal('medicos', <string>medico._id, medico.img);
  }

  buscar( termino: string ){

    if ( termino.length === 0 ){
      return this.cargarMedicos();
    }

    this.busquedaService.buscar( 'medicos', termino)
      .subscribe( resp => {
        this.medicos = resp;
      })
  }

  borrarMedico(medico: Medico){

    Swal.fire({
      title: '¿Borrar médico?',
      text: `¿Está seguro de borrar a ${medico.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.medicoService.borrarMedico(<string>medico._id)
          .subscribe( resp => {

            Swal.fire(
              'Médico eliminado',
              `El Médico ${medico.nombre} fue eliminado correctamente`,
              'success'
            )

            this.cargarMedicos();
          })

      }
    });

  }



}
