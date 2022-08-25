import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageHandlerService {

  constructor(
  ) { }

  async setLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  async getLocalStorage(key): Promise<any> {
    const localStorage = await JSON.parse(window.localStorage.getItem(key));
    return localStorage;
  }

  removeLocalStorage(key) {
    window.localStorage.removeItem(key);
  }
}
