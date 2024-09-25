import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTaskComponent } from './pages/view-task/view-task.component';
import { CreateTaskComponent } from './pages/create-task/create-task.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { DutyListComponent } from './pages/duty-list/duty-list.component';
import { ViewOtComponent } from './pages/view-ot/view-ot.component';

const routes: Routes = [
  { path: '', redirectTo: '/duty-list', pathMatch: 'full' },
  // { path: '', redirectTo: '/create-task', pathMatch: 'full' },
  { path: 'duty-list', component: DutyListComponent },
  {path:'view-overtime',component:ViewOtComponent},
  { path: 'create-task', component: CreateTaskComponent },
  { path: 'view-task', component: ViewTaskComponent },
  { path: 'edit-task/:id', component: EditTaskComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
