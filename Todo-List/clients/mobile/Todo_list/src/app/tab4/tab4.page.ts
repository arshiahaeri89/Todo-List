import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../storage-service.service';
import { LoginResponse } from '../login-response';
import { UtilsService } from '../utils.service';

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
      private utils: UtilsService
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

  login() {
    let username = <string>this.form.value.username;
    let password = <string>this.form.value.password;
    
    if (!(this.utils.isEmpty(username) || this.utils.isEmpty(password))) {
      const formdata = new FormData();
      formdata.append('username', username);
      formdata.append('password', password);

      this.http.post<LoginResponse>(this.url, formdata, {})
          .subscribe(async response => {
              this.token = response.token;
              await this.storage.set('token', this.token);
              this.loggedIn = true;
              this.utils.toast('با موفقیت لاگین شدید')
          }, error => {
              this.utils.toast("Error: " + error.message);
          });
    } else {
      this.utils.toast('وارد کردن همه مقادیر الزامی است');
    }
  }

  async logout() {
    this.token = ""
    await this.storage.set('token', this.token);
    this.loggedIn = false
    this.utils.toast('با موفقیت خارج شدید')
  }

}
