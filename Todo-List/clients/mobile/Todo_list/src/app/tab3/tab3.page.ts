import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaskResponse } from '../task-response';
import { StorageService } from '../storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private url: string;
  public doneTasks: Array<any>;
  public token: string;

  constructor(private http: HttpClient, private storage: StorageService, private router: Router) {
    this.token = "";
    this.url = "";
    this.doneTasks = [];
  }

  async ionViewDidEnter() {
    this.url = await this.storage.get("baseURL") + "/q/tasks";
    this.token = await this.storage.get('token');
    if (this.token == undefined || this.token == null || this.token == "") {
      this.router.navigate(['/tabs/tab4']);
      console.log('you are not logged in'); // TODO: Toast
  }
    this.updateTasks()
  }

  updateTasks() {
    this.doneTasks = []
    this.getDoneTasks()
  }

  async setTaskStatus(taskId: number) {
    let url = await this.storage.get('baseURL') + '/tasks/status'
    
    const formdata = new FormData();
    formdata.append('task_id', taskId.toString())
    formdata.append('task_status', 'UNDONE')
    formdata.append('token', this.token)

    this.http.post<object>(url, formdata, {})
        .subscribe(response => {
          console.log("Status edited Successfully."); // TODO: toast
          this.updateTasks()
        }, error => {
           console.log("Error: " + error.message); // TODO: toast
        });
  }

  async removeTask(taskId: number) {
    let url = await this.storage.get('baseURL') + '/tasks/remove'
    
    const formdata = new FormData();
    formdata.append('task_id', taskId.toString())
    formdata.append('token', this.token)

    this.http.post<object>(url, formdata, {})
        .subscribe(response => {
          console.log("Task removed Successfully."); // TODO: toast
          this.updateTasks()
        }, error => {
           console.log("Error: " + error.message); // TODO: toast
        });
  }

  getDoneTasks() {
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
