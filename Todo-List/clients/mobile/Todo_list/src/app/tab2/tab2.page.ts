import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { TaskResponse } from '../task-response'
import { StorageService } from '../storage-service.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
  
  constructor(
      private http: HttpClient, 
      private formbuilder: FormBuilder, 
      private storage: StorageService, 
      private router: Router,
      private toastCtrl: ToastController
    ) {
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
    this.undoneTasks = [];
    this.getUndoneTasks();
  }

  isValidDates(startDate: string, endDate: string) {
    let start = new Date(startDate);
    let end = new Date(endDate);

    return start <= end;
  }

  isEmpty(value: undefined | null | string) {
    console.log(value+' '+value == undefined || value == null || value == "");
    return value == undefined || value == null || value == ""
  }

  async setTaskStatus(taskId: number) {
    let url = await this.storage.get('baseURL') + '/tasks/status'
    
    const formdata = new FormData();
    formdata.append('task_id', taskId.toString())
    formdata.append('task_status', 'DONE')
    formdata.append('token', this.token)

    this.http.post<object>(url, formdata, {})
        .subscribe(response => {
          this.toast("وضعیت به انجام شده تغییر کرد");
          this.updateTasks()
        }, error => {
           this.toast("Error: " + error.message);
        });
  }

  editTask(taskId: number) {
    console.log('editTask ' + taskId);
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

  async onSubmit() {
    let url = await this.storage.get('baseURL') + '/tasks/add';

    let title = (<string>this.form.value.title).trim();
    let desc = (<string>this.form.value.description).trim();
    let startDate = ((<string>this.form.value.startDate).split('T')[0] + ' ' + (<string>this.form.value.startDate).split('T')[1]).trim()
    let endDate = ((<string>this.form.value.endDate).split('T')[0] + ' ' + (<string>this.form.value.endDate).split('T')[1]).trim()
    let status = 'UNDONE'

    if (!(this.isEmpty(title) || this.isEmpty(desc) || this.isEmpty(startDate) || this.isEmpty(endDate))) {
      if (this.isValidDates(startDate, endDate)) {
        const formdata = new FormData();
        formdata.append('task_title', title);
        formdata.append('task_desc', desc);
        formdata.append('task_start_date', startDate);
        formdata.append('task_end_date', endDate);
        formdata.append('task_status', status);
        formdata.append('token', this.token);
  
        this.http.post(url, formdata, {})
          .subscribe(response => {
              this.toast('کار با موفقیت اضافه شد');
              this.updateTasks();
          }, error => {
              this.toast("Error: " + error.message);
          });
      } else {
        this.toast('تاریخ شروع نباید از تاریخ پایان جلوتر باشد');
      }
    } else {
      this.toast('وارد کردن همه مقادیر الزامی است')
    }
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
            this.toast("Error: " + error.message);
        });
  }

}
