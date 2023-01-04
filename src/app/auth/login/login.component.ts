import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {UsuarioService} from "../../services/usuario.service";
import swal from "sweetalert2";

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('googleBtn') googleBtn !: ElementRef;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: [ '', [Validators.required] ],
    remember: [false]
  });

  constructor( private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService ) {
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  login(){

    // console.log(this.loginForm.value);

    this.usuarioService.login(this.loginForm.value)
      .subscribe( resp => {
        // console.log(resp);

        if( this.loginForm.get('remember')?.value ){
          localStorage.setItem('email', <string>this.loginForm.get('email')?.value);
        }else{
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/dashboard');

      }, error => {
        // console.warn(error.error.msg)
        swal.fire('Error', error.error.msg ,'error');
      })

  }

  googleInit(){

    google.accounts.id.initialize({
      client_id: "719157246623-a28ua6oegm8l34ki1k2g0vo7j67894jh.apps.googleusercontent.com",
      callback: (response:any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );

  }

  handleCredentialResponse(response : any){
    // console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp => {
        // console.log({login: resp});
        this.router.navigateByUrl('/dashboard');
      });
  }


}
