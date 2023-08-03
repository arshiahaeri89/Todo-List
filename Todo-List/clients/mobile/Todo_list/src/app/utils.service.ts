import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private toastCtrl: ToastController) { }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
    });

    await toast.present();
  }

  isValidDates(startDate: string, endDate: string) {
    let start = new Date(startDate);
    let end = new Date(endDate);

    return start <= end;
  }

  isEmpty(value: undefined | null | string) {
    return value == undefined || value == null || value == ""
  }

}
