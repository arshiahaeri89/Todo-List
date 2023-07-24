import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
        this.token = "LYdEGncuJzDXcwHQvEQpLlXU6XIoaTshVUhbprmI7IWv6lvd"
        this.url = "http://127.0.0.1:5000" + "/q/stats" //TODO: Get Base URL from Parent
        this.doneTasks = 0
        this.undoneTasks = 0
    }

    ionViewDidEnter() {
        this.get_stats();
    }

    get_stats() {
        this.http.post(this.url,
            JSON.stringify({
                token: this.token
            }), {headers : new HttpHeaders({ 'Content-Type': 'application/json' })})
            .subscribe(response => {
                // this.doneTasks = response.data.done_tasks
                // this.undoneTasks = response.data.undone_tasks
                console.log(response)
            }, error => {
                console.log("Error: " + error.message);
            });
    }

}
