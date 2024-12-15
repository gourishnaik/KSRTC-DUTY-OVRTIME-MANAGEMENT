import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from '../api-calls.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
constructor(private api:ApiCallsService, private snackBar: MatSnackBar){

}
  ngOnInit(): void {}



  convertToUppercase() {
    this.EmployeeId = this.EmployeeId.toUpperCase();
  }


  DeleteAll(){
    this.api.deleteEverything().subscribe((res=>{
      this.snackBar.open(`${res.message}`, 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar']  
      });

    }))
  }

  save() {
    console.warn(this.EmployeeId);
    this.isLoading = true;
  
    // Check if EmployeeId is empty
    if (!this.EmployeeId) {
      alert("Enter employee id");
      this.isLoading = false;
      return;
    }
  
    const payload = {
      id: this.EmployeeId
    };
  
    // Call the API to create the employee
    this.api.createEmployee(payload).subscribe(
      (res) => {
        console.log(payload);
        this.successtxt = true;
        this.saving = true;
        this.isLoading = false; // End loading state
        this.snackBar.open(`${res.message}`, 'Close', {
          duration: 3000,
          panelClass: ['custom-snackbar']  // Custom class for top snackbar
        });
  
        setTimeout(() => {
          this.successtxt = false;
          this.saving = false;
          this.isLoading = false;
        }, 2000);
  
        // Reset form fields
        this.filteredDuties = [];
        this.EmployeeId = '';
      },
      (err) => {
        alert(err.error.message)
        // Handle error
        this.isLoading = false;
        this.snackBar.open(`${err.error.message}`, 'Close', {
          duration: 3000,
          panelClass: ['custom-snackbar']  // Custom class for top snackbar
        });
      }
    );
  }
  



}
