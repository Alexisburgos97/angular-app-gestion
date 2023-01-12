import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HospitalService} from "../../../services/hospital.service";
import {Hospital} from "../../../models/hospital.model";
import {MedicoService} from "../../../services/medico.service";
import {Medico} from "../../../models/medico.model";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {delay} from "rxjs";

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit{

  public medicoForm !: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado !: Medico;
  public hospitalSeleccionado !: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(){

    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarMedico(id);
    });

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe( hospitalId =>{
        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId )!;
      });
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      })
  }

  cargarMedico(id: string){

    if( id === 'nuevo' ){
      return;
    }

    this.medicoService.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe( (medico): any => {

        if( !medico ){
          return this.router.navigateByUrl(`/medicos`);
        }

        const { nombre, hospital: { _id } } = medico;

        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({nombre, hospital: _id});

      });
  }

  guardarMedico(){

    const {nombre} = this.medicoForm.value;

    //Actualizamos
    if( this.medicoSeleccionado ){

      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };

      console.log(data);

      this.medicoService.actualizarMedico( data )
        .subscribe( resp => {

          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');

        });

    }
    //Creamos
    else{

      this.medicoService.crearMedico( this.medicoForm.value )
        .subscribe( (resp: any) => {

          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');

          this.router.navigateByUrl(`/medico/${resp.medico._id}`);

        })

    }

  }

}
