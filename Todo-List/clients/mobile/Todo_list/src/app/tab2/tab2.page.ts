import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { TaskResponse } from '../task-response'
import { StorageService } from '../storage-service.service';
import { Router } from '@angular/router';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public form;
  private url: string;
  public undoneTasks: any[];
  public token: string;
  public openModals: number[];
  
  constructor(
      private http: HttpClient, 
      private formbuilder: FormBuilder, 
      private storage: StorageService, 
      private router: Router,
      private utils: UtilsService
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
    this.openModals = [];
  }

  async ionViewDidEnter() {
    this.url = await this.storage.get("baseURL") + "/q/tasks";
    this.token = await this.storage.get('token');
    if (this.token == undefined || this.token == null || this.token == "") {
      this.router.navigate(['/tabs/tab4']);
      this.utils.toast('برای دسترسی به اپلیکیشن باید لاگین کنید');
    } else {
      this.updateTasks();
    }
  }

  updateTasks() {
    this.undoneTasks = [];
    this.getUndoneTasks();
  }

  setOpen(task_id: number, isOpen: boolean) {
    if(isOpen) {
      this.openModals.push(task_id);
    } else {      
      delete this.openModals[this.openModals.indexOf(task_id)];
    }
  }

  format_task_show(task: any) {
    let startDate = task.task_start_date.split(' ');
    startDate = startDate[0] + ' ' + startDate[1] + ' ' + startDate[2] + ' ' + startDate[3];
    
    let endDate = task.task_end_date.split(' ');
    endDate = endDate[0] + ' ' + endDate[1] + ' ' + endDate[2] + ' ' + endDate[3]

    return task.task_title + ' ' + startDate + ' - ' + endDate
  }

  async setTaskStatus(taskId: number) {
    let url = await this.storage.get('baseURL') + '/tasks/status'
    
    const formdata = new FormData();
    formdata.append('task_id', taskId.toString())
    formdata.append('task_status', 'DONE')
    formdata.append('token', this.token)

    this.http.post<object>(url, formdata, {})
        .subscribe(response => {
          this.utils.toast("وضعیت به انجام شده تغییر کرد");
          this.updateTasks()
        }, error => {
           this.utils.toast("Error: " + error.message);
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
          this.utils.toast("کار با موفقیت حذف شد");
          this.updateTasks()
        }, error => {
           this.utils.toast("Error: " + error.message);
        });
  }

  async onSubmit() {
    let url = await this.storage.get('baseURL') + '/tasks/add';

    let title = (<string>this.form.value.title).trim();
    let desc = (<string>this.form.value.description).trim();
    let startDate = ((<string>this.form.value.startDate).split('T')[0] + ' ' + (<string>this.form.value.startDate).split('T')[1]).trim()
    let endDate = ((<string>this.form.value.endDate).split('T')[0] + ' ' + (<string>this.form.value.endDate).split('T')[1]).trim()
    let status = 'UNDONE'

    if (!(this.utils.isEmpty(title) || this.utils.isEmpty(desc) || this.utils.isEmpty(startDate) || this.utils.isEmpty(endDate))) {
      if (this.utils.isValidDates(startDate, endDate)) {
        const formdata = new FormData();
        formdata.append('task_title', title);
        formdata.append('task_desc', desc);
        formdata.append('task_start_date', startDate);
        formdata.append('task_end_date', endDate);
        formdata.append('task_status', status);
        formdata.append('token', this.token);
  
        this.http.post(url, formdata, {})
          .subscribe(response => {
              this.utils.toast('کار با موفقیت اضافه شد');
              this.updateTasks();
          }, error => {
              this.utils.toast("Error: " + error.message);
          });
      } else {
        this.utils.toast('تاریخ شروع نباید از تاریخ پایان جلوتر باشد');
      }
    } else {
      this.utils.toast('وارد کردن همه مقادیر الزامی است')
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
            this.utils.toast("Error: " + error.message);
        });
  }

}
