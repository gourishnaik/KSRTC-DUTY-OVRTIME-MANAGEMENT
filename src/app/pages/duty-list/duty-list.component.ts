import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from '../api-calls.service';

@Component({
  selector: 'app-duty-list',
  templateUrl: './duty-list.component.html',
  styleUrls: ['./duty-list.component.css']
})
export class DutyListComponent implements OnInit {
  successtxt=false;
  isLoading: boolean = false;

  EmployeeId:any;
  saving=false
  filteredDuties: any[] = []; 
  searchId: any | null = null; 
constructor(private api:ApiCallsService){

}
  ngOnInit(): void {}






  

  
save() {
  console.warn(this.EmployeeId);
this.isLoading = true;
  if (!this.EmployeeId) {
    alert("Enter employee id");
    this.isLoading =false
    return;
  }

  // if (this.filteredDuties.length === 0) {
  //   alert("Enter duty details");
  //   this.isLoading =false
  //   return;
  // }

  // Check if the EmployeeId already exists
  this.api.checkIfEmployeeIdExists(this.EmployeeId).subscribe(existingTasks => {
    if (existingTasks.length > 0) {
      // EmployeeId already exists
      alert("Employee Record already exist plz Change id and save.");
      this.isLoading =false
    } else {
      // Proceed with creating the task if EmployeeId does not exist
      const payload = {
        // ...this.filteredDuties,
        id: this.EmployeeId
      };
      this.api.createTask(payload).subscribe((res) => {
        this.successtxt = true;
        this.saving = true;
        this.isLoading =true
        setTimeout(() => {
          this.successtxt = false;
          this.saving = false;
          this.isLoading =false;
        }, 2000);

        this.filteredDuties = [];
        this.EmployeeId = '';
      });
    }
  });
}


}
