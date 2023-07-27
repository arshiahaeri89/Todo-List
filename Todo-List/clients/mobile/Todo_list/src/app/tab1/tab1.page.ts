import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Generalstats } from '../generalstats';
import { StorageService } from '../storage-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    private url: string;
    public doneTasks: number;
    public undoneTasks: number;
    public token: string;
  

    constructor(private http: HttpClient, private storage: StorageService) {
        this.token = "";
        this.url = "";
        this.doneTasks = 0;
        this.undoneTasks = 0;
    }

    async ionViewDidEnter() {
        this.url = await this.storage.get("baseURL") + "/q/stats";
        this.token = await this.storage.get("token");
        this.get_stats();
    }

    get_stats() {
        const formdata = new FormData();
        formdata.append('token', this.token);
        
        this.http.post<Generalstats>(this.url, formdata, {})
            .subscribe(response => {
                this.doneTasks = response.done_tasks;
                this.undoneTasks = response.undone_tasks;
            }, error => {
                console.log("Error: " + error.message); // TODO: toast
            });
    }

}
