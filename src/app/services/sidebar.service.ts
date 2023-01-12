import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any= [
    // {
    //   titulo: 'Dashboard',
    //   icono: 'mdi mdi-gauge',
    //   submenu: [
    //     { titulo: 'Dashboard', url: '/' },
    //     { titulo: 'ProgressBar', url: '/dashboard/progress' },
    //     { titulo: 'Promesas', url: '/dashboard/promesas' },
    //     { titulo: 'Gráfica', url: '/dashboard/grafica1' },
    //     { titulo: 'Rxjs', url: '/dashboard/rxjs' },
    //   ]
    // },
    // {
    //   titulo: 'Mantenimientos',
    //   icono: 'mdi mdi-folder-lock-open',
    //   submenu: [
    //     { titulo: 'Usuarios', url: '/dashboard/usuarios' },
    //     { titulo: 'Hospitales', url: '/dashboard/hospitales' },
    //     { titulo: 'Médicos', url: '/dashboard/medicos' },
    //   ]
    // }
  ]

  constructor() { }

  cargarMenu(){
    this.menu = JSON.parse( localStorage.getItem('menu')! ) || [] ;
  }


}
