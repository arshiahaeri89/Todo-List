import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TaskResponse } from '../task-response';
import { StorageService } from '../storage-service.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private url: string;
  public doneTasks: Array<any>;
  public token: string;

  constructor(
      private http: HttpClient, 
      private storage: StorageService, 
      private router: Router,
      private toastCtrl: ToastController
    ) {
    this.token = "";
    this.url = "";
    this.doneTasks = [];
  }

  async ionViewDidEnter() {
    this.url = await this.storage.get("baseURL") + "/q/tasks";
    this.token = await this.storage.get('token');
    if (this.token == undefined || this.token == null || this.token == "") {
      this.router.navigate(['/tabs/tab4']);
      this.toast('برای دسترسی به اپلیکیشن باید لاگین کنید');
    } else {
      this.updateTasks();
    }
  }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
    });

    await toast.present();
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
          this.toast("وضعیت به انجام نشده تغییر کرد");
          this.updateTasks()
        }, error => {
           this.toast("Error: " + error.message);
        });
  }

  async removeTask(taskId: number) {
    let url = await this.storage.get('baseURL') + '/tasks/remove'
    
    const formdata = new FormData();
    formdata.append('task_id', taskId.toString())
    formdata.append('token', this.token)

    this.http.post<object>(url, formdata, {})
        .subscribe(response => {
          this.toast("کار با موفقیت حذف شد");
          this.updateTasks()
        }, error => {
           this.toast("Error: " + error.message);
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
            this.toast("Error: " + error.message);
        });
  }

}
