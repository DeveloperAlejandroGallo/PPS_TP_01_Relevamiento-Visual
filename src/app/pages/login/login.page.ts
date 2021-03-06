import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirecloudService } from '../../services/firecloud.service';
import { FireauthService } from '../../services/fireauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit
{
  // Declaraciones
  correo: string;
  clave: string;
  mensaje: string;

  constructor(
    private login: FirecloudService,
    private authServise: FireauthService,
    private router: Router) { }

  ngOnInit() {}

  public register(): void {
    this.createUserFireBase(this.correo, this.clave);
  }

  public validarCorreoClave(): void
  {
    if (this.correoValido(this.correo))
    {
      if (this.clave !== '' && this.clave !== undefined)
      {
        this.authServise.logueoConEmailYClave(this.correo, this.clave).then(resp =>
        {
            this.mensaje = 'Bienvenido';
            this.router.navigate(['/bienvenido']);
        }).catch(error => {
          console.log(error.code);
          switch (error.code)
          {
            case 'auth/invalid-email':
              this.mensaje = 'Correo con formato incorrecto';
              break;
            case 'auth/wrong-password':
              this.mensaje = 'Clave incorrecta';
              break;
              default:
                this.mensaje = error.message;
          }
        });
      }
      else
      {
        this.mensaje = 'Por favor ingrese una clave';
      }
    }
    else
    {
      this.mensaje = 'Por favor ingrese un correo valido';
    }
  }


  private createUserFireBase(email: string, password: string) {

    this.authServise.register(email, password).then(res => {
      console.log(res);

      this.mensaje = 'Registro exitoso.';
      this.router.navigate(['']);

    }).catch(error => {
      console.log(error);
      switch (error.code)
      {
        case 'auth/weak-password':
          this.mensaje = 'La clave debe poseer al menos 6 caracteres';
          break;
        case 'auth/email-already-in-use':
          this.mensaje = 'Correo ya registrado';
          break;
          case 'auth/invalid-email':
            this.mensaje = 'Correo con formato invalido';
            break;
          case 'auth/argument-error':
            this.mensaje = 'Correo con debe ser una cadena v\u00E1lida';
            break;
          default:
            this.mensaje = 'Error en registro';
      }
    });
  }


  correoValido(correo: string)
  {
    let ret = true;
    if (correo !== '' && correo !== undefined)
    {
      if (!correo.includes('@'))
      {
        ret = false;
      }
    }
    else
    {
      ret = false;
    }

    return ret;
  }

  save(event): any
  {
    this.validarCorreoClave();
  }
}
