import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import * as moment from 'moment';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.page.html',
  styleUrls: ['./take-photo.page.scss'],
})
export class TakePhotoPage implements OnInit, AfterViewInit {
  public user: User = new User('', '', '');
  private facingMode: string = 'user';
  
  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('brunogram.user'));
  }

  ngAfterViewInit(){
    this.loadCamera();
  }

  loadCamera() {
    let video = <any>document.getElementById('video');
    if(navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { 
          aspectRatio: 1,
          facingMode: { exact: this.facingMode }
        },
        //audio: {}
      }) 
      .then(function (stream){
        video.srcObject = stream;
      })
      .catch(function (err){
        console.log('Erro ao gravar.');
      });
    }
  }

  takePicture() {
    var video = <any>document.getElementById('video');
    var canvas = <any>document.getElementById('canvas');
    var context = canvas.getContext('2d');
   
    context.drawImage(video, 0, 0, 300, 300);
    let post = JSON.stringify(new Post(
      this.user.name, 
      moment().format('DD/MM/YYYY HH:mm'), 
      canvas.toDataURL(), 
      '',
      '', 
      ''));
    localStorage.setItem('brunogram.post', post);

    video.classList.add('animated');
    video.classList.add('flash');

    setTimeout(() => {
      this.navCtrl.navigateForward('/post');
    }, 1000);
  }

  toggleCarema() {
    if(this.facingMode == 'user')
      this.facingMode = 'environment';
    else
      this.facingMode = 'user';

    this.loadCamera();
  }

}
