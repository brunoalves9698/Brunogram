import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private navCtrl: NavController) { }

    canActivate() {
        const user = localStorage.getItem('brunogram.user');
        if (!user) {
            this.navCtrl.navigateRoot('login');
            return false;
        }

        return true;
    }
}
