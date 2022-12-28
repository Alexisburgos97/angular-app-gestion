import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'ProgressBar', url: '/progress' },
        { titulo: 'Promesas', url: '/promesas' },
        { titulo: 'Gráfica', url: '/grafica1' },
        { titulo: 'Rxjs', url: '/rxjs' },
      ]
    }
  ]

  constructor() { }


}
