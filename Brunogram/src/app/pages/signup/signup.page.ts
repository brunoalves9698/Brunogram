import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  public form: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private fbAuth: AngularFireAuth
  ) { 
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async submit() {
    const loading = await this.loadingCtrl.create({ message: 'Cadastrando...' });
    loading.present();

    this.fbAuth
      .auth
      .createUserWithEmailAndPassword(this.form.controls.email.value, this.form.controls.password.value)
      .then((data) => {
        loading.dismiss();
        localStorage.setItem('brunogram.user', JSON.stringify(new User(data.user.email, data.user.email, 'https://placehold.it/80')));
        this.showMessage('Bem vindo!');
        this.navCtrl.navigateRoot('/home');
      })
      .catch((err) => {
        loading.dismiss();
        this.showMessage('Não foi possível realizar seu cadastro.');
      });
  }

  cancel() {
    this.navCtrl.navigateBack('/login');
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
