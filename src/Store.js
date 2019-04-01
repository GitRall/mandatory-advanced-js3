import { BehaviorSubject } from 'rxjs';
//
export const token$ = new BehaviorSubject(window.localStorage.getItem('token'));

export function updateToken(newToken){
  token$.next(newToken);
}
