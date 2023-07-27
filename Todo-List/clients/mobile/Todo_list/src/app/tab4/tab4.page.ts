import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../storage-service.service';
import { LoginResponse } from '../login-response';

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

  constructor(private http: HttpClient, private formbuilder: FormBuilder, private storage: StorageService) {
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
    const formdata = new FormData();
    formdata.append('username', <string>this.form.value.username);
    formdata.append('password', <string>this.form.value.password);

    this.http.post<LoginResponse>(this.url, formdata, {})
        .subscribe(async response => {
            console.log(response);
            this.token = response.token;
            await this.storage.set('token', this.token);
            this.loggedIn = true;
            console.log('successful login, token=' + this.token);
        }, error => {
            console.log("Error: " + error.message); // TODO: toast
        });
  }

  async logout() {
    this.token = ""
    await this.storage.set('token', this.token);
    this.loggedIn = false
    console.log('logged out'); // TODO: toast
  }

}
