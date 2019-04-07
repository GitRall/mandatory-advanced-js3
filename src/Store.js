import { BehaviorSubject } from 'rxjs';
//
export const token$ = new BehaviorSubject(window.localStorage.getItem('token'));

export function updateToken(newToken){
  newToken ? window.localStorage.setItem('token', newToken) : window.localStorage.removeItem('token')
  token$.next(newToken);
}
