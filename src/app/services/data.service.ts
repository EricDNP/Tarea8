import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, from, of } from 'rxjs';
import { Secret } from '../models/secret.model';

const SecretStorage = "SecretStorage";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private storageReady = new BehaviorSubject(false);

  constructor(private storage: Storage) {
    this.init();
  }

  init() {
    this.storage.defineDriver(cordovaSQLiteDriver);
    this.storage.create();
    this.storageReady.next(true);
  }

  getAllSecrets() {
    return this.storageReady.pipe(
      (ready => ready),
      (_ => {
        return from(this.storage.get(SecretStorage)) || of([]);
      })
    )
  }

  async getSecret(id: number) {
    const storedData: Secret[] = await this.storage.get(SecretStorage) || [];
    return storedData.find(s => s.Id === id) || null;
  }

  async addSecret(secret: Secret) {
    const storedData: Secret[] = await this.storage.get(SecretStorage) || [];
    storedData.push(secret);
    return this.storage.set(SecretStorage, storedData);
  }

  async updateSecret(secret: Secret) {
    const storedData: Secret[] = await this.storage.get(SecretStorage) || [];
    storedData.forEach(s => {
      if (s.Id == secret.Id){
        s = secret;
        return true;
      }
    });
    this.storage.set(SecretStorage, storedData);
    return false;
  }

  async deleteSecret(id: number) {
    let storedData: Secret[] = await this.storage.get(SecretStorage) || [];
    storedData = storedData.filter(s => s.Id !== id);
    return this.storage.set(SecretStorage, storedData);
  }
}
