import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from '../api-calls.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit{
  taskData: any;
  editForm!: FormGroup;
  selectedTaskId: number | null = null;
  constructor(private api:ApiCallsService,private router: Router){}
  ngOnInit(): void {
   this.getAlltasks();
   
  }

  getAlltasks(){
    this.api.getTasks().subscribe((res=>{
      this.taskData = res;
    }))
  }
  deleteTask(taskId: number){
 
  }

  Edit(taskId: any): void {
    this.router.navigate(['/edit-task', taskId]);
  }

  toggleCompletion(taskId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(input)
    const checkbox = input.checked;
    localStorage.setItem(`task-${taskId}`, JSON.stringify(checkbox));
  }

  isChecked(taskId: string): boolean {
    const cachedStatus = localStorage.getItem(`task-${taskId}`);
    return cachedStatus ? JSON.parse(cachedStatus) : false;
  }

  
}
