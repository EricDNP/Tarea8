import { DataService } from './../services/data.service';
import { Component } from '@angular/core';
import { Secret } from '../models/secret.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  secretsData = [];

  constructor(private dataService: DataService) {
    this.loadSecrets()
  }

  loadSecrets() {
    this.dataService.getAllSecrets().subscribe((res: Secret[]) => {
      this.secretsData = res;
    })
  }

}
