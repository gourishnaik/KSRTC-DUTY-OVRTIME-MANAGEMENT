import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCallsService } from '../api-calls.service';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  editForm: FormGroup;
  taskId!: string; 
minDate: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiCallsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['low', Validators.required],
      dueDate: ['', Validators.required]
    });
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = params['id']; 
      console.log('Task ID:', this.taskId); 
    
      this.loadTask();
    });
  }

  loadTask(): void {
    this.api.getTaskById(this.taskId).subscribe(task => {
      this.editForm.patchValue(task);
      console.log("task data is",task)
    },);
  }

  update(){
    // if (this.editForm.valid) {
    //   this.api.updateTask(this.taskId, this.editForm.value).subscribe(() => {
    //     this.router.navigate(['/view-task']);
    //   });
    // }else{
    //   this.editForm.markAllAsTouched();
    // }
  
  }
}
