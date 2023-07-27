import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { TaskResponse } from '../task-response'
import { StorageService } from '../storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public form;
  private url: string;
  public undoneTasks: Array<any>;
  public token: string;
  
  constructor(private http: HttpClient, private formbuilder: FormBuilder, private storage: StorageService, private router: Router) {
    this.token = "";
    this.url = "";
    this.undoneTasks = [];
    this.form = this.formbuilder.group({
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      startDate: ['', Validators.compose([Validators.required])],
      endDate: ['', Validators.compose([Validators.required])]
    });
  }

  async ionViewDidEnter() {
    this.url = await this.storage.get("baseURL") + "/q/tasks";
    this.token = await this.storage.get('token');
    if (this.token == undefined || this.token == null || this.token == "") {
      this.router.navigate(['/tabs/tab4']);
      console.log('you are not logged in'); // TODO: Toast
  }
    this.updateTasks();
  }

  updateTasks() {
    this.undoneTasks = [];
    this.getUndoneTasks();
  }

  editTask(taskId: number) {
    console.log('editTask ' + taskId); // TODO: Write this
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

  onSubmit() {
    const formdata = new FormData();
    formdata.append('task_title', <string>this.form.value.title);
    formdata.append('task_desc', <string>this.form.value.description);
    formdata.append('task_start_date', (<string>this.form.value.startDate).split('T')[0] + ' ' + (<string>this.form.value.startDate).split('T')[1]);
    formdata.append('task_end_date', (<string>this.form.value.endDate).split('T')[0] + ' ' + (<string>this.form.value.endDate).split('T')[1]);
    formdata.append('task_status', 'UNDONE');
    formdata.append('token', this.token);

    this.http.post(this.url, formdata, {})
      .subscribe(response => {
          console.log('Success: ' + response); // TODO: toast
      }, error => {
          console.log("Error: " + error.message); // TODO: toast
      });
  }

  getUndoneTasks() {
    const formdata = new FormData();
    formdata.append('token', this.token);
    
    this.http.post<TaskResponse>(this.url, formdata, {})
        .subscribe(response => {
            response.tasks.forEach((task) => {
              if (task.task_status === "UNDONE") {
                this.undoneTasks.push(task);
              }
            });
        }, error => {
            console.log("Error: " + error.message); // TODO: toast
        });
  }

}
