import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Primero comprobar que existe sesion
    if (this.authService.getSession() !== null) {
      const dataDecode = this.decodeToken();
      // Comprobar que no esta caducado el token
      if (dataDecode.exp < new Date().getTime() / 1000) {
        console.log('Sesion caducada');
        return this.redirect(state);
      }
      // El role del usuario es ADMIN
      if (dataDecode.user.role === 'ADMIN' || dataDecode.user.role === 'SELLER') {
        return true;
      }
      return this.redirect(state);
    }
    console.log('Sesion no iniciada');
    return this.redirect(state);
  }

  redirect(state: RouterStateSnapshot): boolean {
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  decodeToken(): any {
    return jwtDecode(this.authService.getSession().token);
  }
}
