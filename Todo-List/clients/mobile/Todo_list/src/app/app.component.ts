import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storage: Storage) {}
  
  async ngOnInit() {
    await this.storage.create();
    await this.storage.set("baseURL", "http://192.168.1.105:5000");
  }
  
}
