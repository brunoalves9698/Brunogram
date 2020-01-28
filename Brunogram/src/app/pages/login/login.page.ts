import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/models/user.model';
import { auth } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public form: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private fbAuth: AngularFireAuth
  ) { 
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async submit() {
    const loading = await this.loadingCtrl.create({ message: 'Autenticando...' });
    loading.present();

    this.fbAuth
      .auth
      .signInWithEmailAndPassword(this.form.controls.email.value, this.form.controls.password.value)
      .then((data) => {
        loading.dismiss();
        localStorage.setItem('brunogram.user', JSON.stringify(new User(data.user.email, data.user.email, 'https://placehold.it/80')));
        this.navCtrl.navigateRoot('/home');
      })
      .catch((err) => {
        loading.dismiss();
        this.showMessage('Usuário ou senha inválido.');
      });
  }

  goToSignup() {
    this.navCtrl.navigateForward('/signup');
  }

  signInWithGoogle() {
    this.fbAuth
      .auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then((data) => {
        localStorage.setItem('brunogram.user', JSON.stringify(new User(data.user.displayName, data.user.email, data.user.photoURL)));
        this.navCtrl.navigateRoot('home');
      })
      .catch((err) => {
        this.showMessage('Usuário ou senha inválido.');
      })
  }

  async showMessage(message: string){
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'OK'
    });
    toast.present();
  }

}
