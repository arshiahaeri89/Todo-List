import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../storage-service.service';
import { LoginResponse } from '../login-response';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page  {

  public form;
  private url: string;
  public loggedIn: boolean;
  public token: string;

  constructor(
      private http: HttpClient, 
      private formbuilder: FormBuilder, 
      private storage: StorageService,
      private toastCtrl: ToastController
    ) {
    this.token = "";
    this.url = "";
    this.loggedIn = false
    this.form = this.formbuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  async ionViewDidEnter() {
    this.url = await this.storage.get("baseURL") + "/account/login";
    this.token = await this.storage.get('token');
    this.loggedIn = !(this.token == undefined || this.token == null || this.token == "");
  }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
    });

    await toast.present();
  }

  login() {
    const formdata = new FormData();
    formdata.append('username', <string>this.form.value.username);
    formdata.append('password', <string>this.form.value.password);

    this.http.post<LoginResponse>(this.url, formdata, {})
        .subscribe(async response => {
            console.log(response);
            this.token = response.token;
            await this.storage.set('token', this.token);
            this.loggedIn = true;
            this.toast('با موفقیت لاگین شدید')
        }, error => {
            this.toast("Error: " + error.message);
        });
  }

  async logout() {
    this.token = ""
    await this.storage.set('token', this.token);
    this.loggedIn = false
    this.toast('با موفقیت خارج شدید')
  }

}
