import {Component, OnDestroy, OnInit} from '@angular/core';
import {HospitalService} from "../../../services/hospital.service";
import {Hospital} from "../../../models/hospital.model";
import Swal from "sweetalert2";
import {ModalImagenService} from "../../../services/modal-imagen.service";
import {delay, Subscription} from "rxjs";
import {BusquedasService} from "../../../services/busquedas.service";

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy{

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;

  public imgSubs !: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService ) {
  }

  ngOnDestroy(): void{
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospital();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe( img => {
        this.cargarHospital();
      });
  }

  cargarHospital(){

    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
        console.log(hospitales)
        this.cargando = false;
        this.hospitales = hospitales;
      });

  }

  guardarCambios(hospital: Hospital){

    this.hospitalService.actualizarHospital(<string>hospital._id, hospital.nombre)
      .subscribe( resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      })

  }

  eliminarHospital(hospital: Hospital){

    this.hospitalService.borrarHospital(<string>hospital._id)
      .subscribe( resp => {
        this.cargarHospital();
        Swal.fire('Borrado', hospital.nombre, 'success');
      })

  }

  async abrirSweetAlert(){

    const {value = ''} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    })

    if( value!.trim().length > 0 ){

      this.hospitalService.crearHospital( value! )
        .subscribe( resp => {
          this.cargarHospital();
        });

    }
  }

  abrirModal( hospital: Hospital ){
    this.modalImagenService.abrirModal('hospitales', <string>hospital._id, hospital.img);
  }

  buscar( termino: string ){

    if ( termino.length === 0 ){
      return this.cargarHospital();
    }

    this.busquedaService.buscar( 'hospitales', termino)
      .subscribe( resp => {
        this.hospitales = resp;
      })
  }

}
