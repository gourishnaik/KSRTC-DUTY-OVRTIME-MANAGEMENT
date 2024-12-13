import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from '../api-calls.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit{
  taskForm!: FormGroup;
  successtext:boolean = false;
  minDate: string;
  constructor(private api:ApiCallsService,private fb: FormBuilder){
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['low', Validators.required], 
      dueDate: ['', Validators.required]
    });
  }



  save(): void {

  }


}
