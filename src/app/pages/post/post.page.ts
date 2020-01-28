import { Post } from './../../models/post.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, NavController, AlertController, IonSlides } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  @ViewChild(IonSlides, null) slides: IonSlides;
  
  public post: Post = new Post('', '', '', '', '', null);
  public filters: string[] = [];

  public task: AngularFireUploadTask;
  public progress: any;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    const data = localStorage.getItem('brunogram.post');
    if (data) this.post = JSON.parse(data);

    this.filters.push('filter-normal');
    this.filters.push('filter-juno');
    this.filters.push('filter-kelvin');
    this.filters.push('filter-willow');
    this.filters.push('filter-gingham');
    this.filters.push('filter-zinga');
    this.filters.push('filter-moon');
    this.filters.push('filter-1977');
    this.filters.push('filter-aden');
    this.filters.push('filter-brannan');
    this.filters.push('filter-brooklyn');
    this.filters.push('filter-charmes');
    this.filters.push('filter-inkwell');
  }

  getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.post.location = `${position.coords.latitude},${position.coords.longitude}`;
        localStorage.setItem('brunogram.post', JSON.stringify(this.post));
      });
    } else {
      this.showMessage('Seu dispositivo não tem suporte para localização.');
    }
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'OK'
    });
    toast.present();
  }

  async showCloseOptions() {
    const alert = await this.alertCtrl.create({
      header: 'Descartar Postagem?',
      message: 'Deseja descartar esta <strong>postagem</strong>?',
      buttons: [
        {
          text: 'Descartar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            localStorage.removeItem('brunogram.post');
            this.close();
          }
        },
        {
          text: 'Manter',
          handler: () => {
            this.close();
          }
        }
      ]
    });
    await alert.present();
  }

  close() {
    this.navCtrl.navigateBack('/home');
  }

  public saveLocal() {
    localStorage.setItem('brunogram.post', JSON.stringify(this.post));
  }

  submit() {
    const filePaht = `post_${new Date().getTime()}.jpg`;
    this.task = this.storage.ref(filePaht).putString(this.post.image, 'data_url');
    this.progress = this.task.percentageChanges();

    this.task.then((data) => {
      const ref = this.storage.ref(data.metadata.fullPath);
      ref.getDownloadURL().subscribe((imgUrl) => {
        this.post.image = imgUrl;
        this.db.collection('posts').add(this.post);
        localStorage.removeItem('brunogram.post');
        this.navCtrl.navigateBack('/home');
      });
    });
  }

  showMap() {
    this.navCtrl.navigateForward('/map');
  }

  changeFilter() {
    this.slides.getActiveIndex().then((index) => {
      this.post.filter = this.filters[index];
    });
  }

}
