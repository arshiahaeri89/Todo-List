import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Generalstats } from '../generalstats';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    private url: string;
    public doneTasks: number;
    public undoneTasks: number;
    public token: string; //TODO: Token System
  

    constructor(private http: HttpClient) {
        this.token = "LYdEGncuJzDXcwHQvEQpLlXU6XIoaTshVUhbprmI7IWv6lvd";
        this.url = "http://127.0.0.1:5000" + "/q/stats"; //TODO: Get Base URL from Parent
        this.doneTasks = 0;
        this.undoneTasks = 0;
    }

    ionViewDidEnter() {
        this.get_stats();
    }

    get_stats() {
        const formdata = new FormData();
        formdata.append('token', this.token);
        
        this.http.post<Generalstats>(this.url, formdata, {})
            .subscribe(response => {
                console.log(response);
                
                this.doneTasks = response.done_tasks;
                this.undoneTasks = response.undone_tasks;
            }, error => {
                console.log("Error: " + error.message); // TODO: toast
            });
    }

}
