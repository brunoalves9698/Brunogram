import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

import { PostPage } from './post.page';

const routes: Routes = [
  {
    path: '',
    component: PostPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AngularFireModule.initializeApp(environment.firebase, 'brunogram')
  ],
  exports: [RouterModule],
})
export class PostPageRoutingModule {}
