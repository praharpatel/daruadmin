import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { IMeData, ISession } from 'src/app/@core/interfaces/session.interface';
import { LOGIN_QUERY, ME_DATA_QUERY } from 'src/app/@graphql/operations/query/users';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { getFirebaseBackend } from '../../authUtils';

import { User } from '../models/auth.models';

@Injectable({ providedIn: 'root' })

export class AuthenticationService extends ApiService {

  user: User;

  accessVar = new Subject<IMeData>();
  accessVar$ = this.accessVar.asObservable();

  constructor(apollo: Apollo, private router: Router) {
    super(apollo);
  }

  start(): void {
    if (this.getSession() !== null) {
      this.getMe().subscribe((result: IMeData) => {
        if (!result.status) {
          this.resetSession();
          return;
        }
        console.log('start/result: ', result);
        this.updateSession(result);
      });
      this.updateSession({
        status: false
      });
      console.log('Sesión iniciada');
      this.router.navigate(['/']);
      return;
    }
    console.log('Sesión no iniciada');
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string) {
    return this.get(LOGIN_QUERY, { email, password, include: false }).pipe(
      map((result: any) => {
        return result.login;
      })
    );
  }

  getMe() {
    return this.get(ME_DATA_QUERY, { include: false },
      {
        headers: new HttpHeaders({
          Authorization: (this.getSession() as ISession).token
        })
      }
    ).pipe(
      map((result: any) => {
        return result.me;
      })
    );
  }

  setSession(token: string, expiresTimeInHours = 1): void {
    const date = new Date();
    date.setHours(date.getHours() + expiresTimeInHours);

    const session: ISession = {
      expiresIn: new Date(date).toISOString(),
      token
    };
    localStorage.setItem('session', JSON.stringify(session));
  }

  getSession(): ISession {
    return JSON.parse(localStorage.getItem('session'));
  }

  updateSession(newValue: IMeData): void {
    this.accessVar.next(newValue);
  }

  resetSession(): void {
    localStorage.removeItem('session');
    this.updateSession({ status: false });
  }


  // Authorizaciones firebase.
  /**
   * Returns the current user
   */
  public currentUser(): User {
    return getFirebaseBackend().getAuthenticatedUser();
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login1(email: string, password: string) {
    return getFirebaseBackend().loginUser(email, password).then((response: any) => {
      const user = response;
      return user;
    });
  }

  /**
   * Performs the register
   * @param email email
   * @param password password
   */
  register(email: string, password: string) {
    return getFirebaseBackend().registerUser(email, password).then((response: any) => {
      const user = response;
      return user;
    });
  }

  /**
   * Reset password
   * @param email email
   */
  resetPassword(email: string) {
    return getFirebaseBackend().forgetPassword(email).then((response: any) => {
      const message = response.data;
      return message;
    });
  }

  /**
   * Logout the user
   */
  logout() {
    // logout the user
    getFirebaseBackend().logout();
  }
}

