import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../@core/services/auth.service';
import { AuthfakeauthenticationService } from '../../@core/services/authfake.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../@core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { IMeData } from 'src/app/@core/interfaces/session.interface';

import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {

  element;
  cookieValue;
  flagvalue;
  countryName;
  valueset;
  session: IMeData = {
    status: false
  };
  access = false;
  sistema = false;
  role: string;
  userName: string;

  constructor(@Inject(DOCUMENT) private document: any,
    private router: Router,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    public languageService: LanguageService,
    public translate: TranslateService,
    public cookiesService: CookieService) {
    this.authService.accessVar$.subscribe((result) => {
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userName = `${this.session.user?.name} ${this.session.user?.lastname}`;
      // Si es usario DARU (administrador o vendedor) para acceso al sistema
      this.sistema = (this.role === 'ADMIN' || 'SELLER') ? true : false;
    });
  }

  listLang = [
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.authService.start();
    if (this.authService.getSession() !== null) {
      if (this.verificarUsuario()) {
        this.userName = 'Usuario';
      }
    }
    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this.cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  verificarUsuario(): boolean {
    // Primero comprobar que existe sesion
    if (this.authService.getSession() !== null) {
      const dataDecode = this.decodeToken();
      return true;
      // // Comprobar que no esta caducado el token
      // if (dataDecode.exp < new Date().getTime() / 1000) {
      //   console.log('Sesion caducada');
      //   this.closeNav();
      //   return this.redirect();
      // }
      // // Dependiendo del rol de usuario, va al checkout o al order
      // if (dataDecode.user.role === 'CLIENT') {
      //   this.router.navigate(['/checkout']);
      //   this.closeNav();
      //   return true;
      // }
      // if (dataDecode.user.role === 'SELLER') {
      //   this.router.navigate(['/order']);
      //   this.closeNav();
      //   return true;
      // }
    } else {
      this.closeNav();
      return this.redirect();
    }
  }

  logout(): void {
    this.authService.resetSession();
    this.router.navigate(['/auth/login']);
  }

  decodeToken() {
    return jwtDecode(this.authService.getSession().token);
  }

  redirect(): boolean {
    this.router.navigate(['/login']);
    return false;
  }

  closeNav(): void {
    // this.cartService.close();
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout1() {
    if (environment.defaultauth === 'firebase') {
      this.authService.logout();
    } else {
      this.authFackservice.logout();
    }
    this.router.navigate(['/auth/login']);
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
