import { Component } from '@angular/core';
import {SidebarService} from "../../services/sidebar.service";
import {UsuarioService} from "../../services/usuario.service";
import {Usuario} from "../../models/usuario.model";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  public usuario !: Usuario;
  // public menuItems !: any[];

  constructor( public sidebarService: SidebarService, private usuarioService: UsuarioService ) {
    this.usuario = usuarioService.usuario;
    // this.menuItems = sidebarService.menu;
  }

}
