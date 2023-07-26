import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaskResponse } from '../task-response';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private url: string;
  public doneTasks: Array<any>;
  public token: string; //TODO: Token System 

  constructor(private http: HttpClient) {
    this.token = "LYdEGncuJzDXcwHQvEQpLlXU6XIoaTshVUhbprmI7IWv6lvd";
    this.url = "http://127.0.0.1:5000" + "/q/tasks" //TODO: Get Base URL from Parent
    this.doneTasks = [];
  }

  ionViewDidEnter() {
    this.get_done_tasks()
  }

  get_done_tasks() {
    const formdata = new FormData();
    formdata.append('token', this.token);
    
    this.http.post<TaskResponse>(this.url, formdata, {})
        .subscribe(response => {
            response.tasks.forEach((task) => {
              if (task.task_status === "DONE") {
                this.doneTasks.push(task);
              }
            });
        }, error => {
            console.log("Error: " + error.message); // TODO: toast
        });
  }

}
