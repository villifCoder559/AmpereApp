import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  constructor(private http:HttpClient) {
    this.loadToken();
   }

  loadToken(){
    const token = window.localStorage.getItem('TOKEN_KEY');    
    console.log('Token_get')
    if (token != null) {
      console.log('set token: ', token);
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: {email, password}): Observable<any> {
    console.log('1')
    return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
      map((data: any) => {
        this.token=data.token;
        window.localStorage.setItem('TOKEN_KEY',this.token);;
        this.isAuthenticated.next(true);})
    )
  }

  logout(){
    this.isAuthenticated.next(false);
    window.localStorage.removeItem('TOKEN_KEY'); 
  }
}
