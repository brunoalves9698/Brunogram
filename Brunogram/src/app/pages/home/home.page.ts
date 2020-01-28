import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public user: User = new User('', '', 'https://placehold.it/80');
  public posts: Observable<Post[]>;

  constructor(
    private db: AngularFirestore,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.init();
  }

  async init() {
    const loading = await this.loadingCtrl.create({ message: 'Carregando...' });
    loading.present();
    this.posts = this.db.collection<Post>('posts', ref => ref
      .orderBy('date', 'desc'))
      .valueChanges();
    loading.dismiss();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('brunogram.user'));

    const post = localStorage.getItem('brunogram.post');
    if (post) this.showMessage('Você tem um publicação não salva.');
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      buttons: [
        {
          icon: 'send',
          handler: () => {
            this.navCtrl.navigateForward('/post');
          }
        }
      ]
    });
    toast.present();
  }

  async showOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opções',
      cssClass: 'primary',
      buttons: [{
        text: 'Sair',
        role: 'destructive',
        icon: 'power',
        handler: () => {
          localStorage.removeItem('brunogram.user');
          localStorage.removeItem('brunogram.post');
          this.navCtrl.navigateRoot('login');
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        icon: 'close'
      }]
    });
    actionSheet.present();
  }
}
