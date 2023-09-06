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
  public formEdit;
  private url: string;
  public undoneTasks: any[];
  public token: string;
  public openModals: number[];
  public openEditModals: number[];
  
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
    this.formEdit = this.formbuilder.group({
      titleEdit: ['', Validators.compose([Validators.required])],
      descriptionEdit: ['', Validators.compose([Validators.required])],
      startDateEdit: ['', Validators.compose([Validators.required])],
      endDateEdit: ['', Validators.compose([Validators.required])]
    });
    this.openModals = [];
    this.openEditModals = [];
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
    this.form.value.title = '';
    this.form.value.description = '';
    this.form.value.startDate = '';
    this.form.value.endDate = '';
    this.undoneTasks = [];
    this.getUndoneTasks();
  }

  setOpen(taskId: number, isOpen: boolean) {
    if(isOpen) {
      this.openModals.push(taskId);
    } else {      
      this.openModals.splice(this.openModals.indexOf(taskId), 1);
    }
  }

  format_date_show(date: any) {
    let date_split = date.split(' ');
    let result = date_split[0] + ' ' + date_split[1] + ' ' + date_split[2] + ' ' + date_split[3];
    return result;
  }

  format_task_show(task: any) {
    let startDate = this.format_date_show(task.task_start_date);
    
    let endDate = this.format_date_show(task.task_end_date);

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

  editTask(task: any, isOpen: boolean) {
    console.log(task);

    if(isOpen) {
      this.formEdit.value.titleEdit = task.task_title;
      this.formEdit.value.descriptionEdit = task.task_desc;
      this.formEdit.value.startDateEdit = (new Date(task.task_start_date)).toISOString().split('T')[0].replace('.000Z', '');
      this.formEdit.value.endDateEdit = (new Date(task.task_end_date)).toISOString().split('T')[0].replace('.000Z', '');

      // this.openEditModals.push(task.task_id);
      this.openEditModals.push(task);
    } else {      
      // this.openEditModals.splice(this.openEditModals.indexOf(task.task_id), 1);
      this.openEditModals.splice(this.openEditModals.indexOf(task), 1);
    }

    console.log(this.openEditModals);
    
  }

  async editTaskSubmit(taskId: number) {
    let url = await this.storage.get('baseURL') + '/tasks/edit';

    let title = (<string>this.formEdit.value.titleEdit).trim();
    let desc = (<string>this.formEdit.value.descriptionEdit).trim();
    let startDate = (((new Date(<string>this.formEdit.value.startDateEdit).toISOString()).split('T')[0] + ' ' + (new Date(<string>this.formEdit.value.startDateEdit).toISOString()).split('T')[1]).trim()).replace('.000Z', '')
    let endDate = (((new Date(<string>this.formEdit.value.endDateEdit).toISOString()).split('T')[0] + ' ' + (new Date(<string>this.formEdit.value.endDateEdit).toISOString()).split('T')[1]).trim()).replace('.000Z', '')
    let status = "UNDONE";

    if (!(this.utils.isEmpty(title) || this.utils.isEmpty(desc) || this.utils.isEmpty(startDate) || this.utils.isEmpty(endDate))) {
      if (this.utils.isValidDates(startDate, endDate)) {
        const formdata = new FormData();
        formdata.append('task_id', taskId.toString())
        formdata.append('task_title', title);
        formdata.append('task_desc', desc);
        formdata.append('task_start_date', startDate);
        formdata.append('task_end_date', endDate);
        formdata.append('task_status',  status);
        formdata.append('token', this.token);
  
        this.http.post(url, formdata, {})
          .subscribe(response => {
              // this.editTask(this.openEditModals[this.openEditModals.indexOf(taskId)], false);
              this.editTask(
                this.undoneTasks.filter((value, index, array) => value.task_id == taskId), false);
              this.updateTasks();
              this.utils.toast('کار با موفقیت ویرایش شد');
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
