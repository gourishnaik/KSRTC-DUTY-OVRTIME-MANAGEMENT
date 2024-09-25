import { Component, OnInit } from '@angular/core';
import { ApiCallsService } from '../api-calls.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
interface Duty {
  dutyId: string;
  startTime: string;
  endTime: string;
  dutyHours: string;
  OThours: string;
  NightHalt: string;
  kms: string;
  date: string;
  [key: string]: any; 
}



@Component({
  selector: 'app-view-ot',
  templateUrl: './view-ot.component.html',
  styleUrls: ['./view-ot.component.css']
})
export class ViewOtComponent implements OnInit {
  employeeIdSearch: any = '';
  dutyIdSearch: string = '';
  isLoading: boolean = false;
  successtxt: boolean = false;
  totalValues: any = null;
  filteredDuties: Duty[] = []; 
  AllDuty=false;
  Eid:any;
  newDuty: Duty = {
    dutyId: '',
    startTime: '',
    endTime: '',
    dutyHours: '',
    OThours: '',
    NightHalt: '',
    date: '',
    kms: '',
  };
  // Sample duty data
  dutyListData = [
    {
      dutyId: '1',
      startTime: '18:30',
      endTime: '',
      dutyHours: '',
      OThours: '',
      NightHalt: '',
      kms: ''
    },
    {
      dutyId: 'NS/1',
      startTime: '18:30',
      endTime: '07:45',
      dutyHours: '06:15',
      OThours: '',
      NightHalt: '125',
      kms: '538'
    },
    {
      dutyId: '2',
      startTime: '',
      endTime: '07:45',
      dutyHours: '06:15',
      OThours: '',
      NightHalt: '125',
      kms: '538'
    },
  ];

  constructor(private api: ApiCallsService,private route:Router) {}

  ngOnInit(): void {
    // Optional: Initial setup or data fetch can be done here
    console.log(this.filteredDuties)

  }


  sendFirstFilteredDuty(): void {
    if (this.filteredDuties.length > 0 && Object.keys(this.filteredDuties[0]).length > 0) {
      const firstDuty = this.filteredDuties[0];
      console.log("Sending first duty:", firstDuty);
      
      // Uncomment and implement your sending logic
      // this.api.sendDuty(firstDuty).subscribe(response => {
      //   console.log("Duty sent successfully", response);
      // });
    } else {
      alert('No duties available to send.');
    }
  }
  
  searchDutyById(): void {
    if (this.dutyIdSearch.trim()) {
      const duty = this.dutyListData.find(d => d.dutyId === this.dutyIdSearch);
      
      // Reset input after search
      this.dutyIdSearch = '';
  
      if (duty) {
        const existingDutyIndex = Object.keys(this.filteredDuties[0]).findIndex(key => {
          const existingDuty = this.filteredDuties[0][key];
          return existingDuty.dutyId === duty.dutyId;
        });
  
        if (existingDutyIndex !== -1) {
   
          console.log("Duty already exists:", this.filteredDuties[0][existingDutyIndex]);

        }
  
        const newIndex = Object.keys(this.filteredDuties[0]).length; 
        this.filteredDuties[0][newIndex] = duty; 
        console.log("Duty added:", duty);
  
        this.sendFirstFilteredDuty();
        this.updateEmployeeData();
        // this.searchEmployeeById();
 
        this.totalValues = false;
        
      } else {
        alert('Duty ID not found in the list.');
      }
    } else {
      alert('Please enter a Duty ID to search.');
    }
  
    console.log("Filtered duties:", this.filteredDuties);
  }
  
  
  


  
  
 
  searchEmployeeById(): void {
    this.isLoading = true;
    if (this.employeeIdSearch) {
      this.api.getTaskById(this.employeeIdSearch).subscribe(
        (tasks) => {
          if (tasks) {
            this.AllDuty = true;
            this.isLoading = false;
            this.Eid =this.employeeIdSearch
         
            if (Array.isArray(tasks)) {
              this.filteredDuties = tasks;
             
              this.totalValues = false;
            
            } else {
              this.filteredDuties = [tasks]; 
              this.calculateTotal()
              this.totalValues = false;
              this.isLoading = false;
              // this.Eid ='';
            }
            console.log(this.filteredDuties[0]);
          } else {
            alert('No tasks found for the given Employee ID.');
            this.employeeIdSearch ='';
            this.filteredDuties = [];
            this.isLoading = false;
            this.Eid ='';
          }
        },
        (error) => {
          alert(`No employee present with this employee ID: ${this.employeeIdSearch}`);
          console.error('Error fetching tasks:', error);
          this.filteredDuties = [];
          this.employeeIdSearch ='';
          this.isLoading = false;
          this.Eid ='';
        }
      );
    } else {
      alert('Please enter an Employee ID to search.');
      // this.filteredDuties = [];
      this.isLoading = false;
    }
  }
  

  updateEmployeeData(): void {
    this.isLoading = true;
    if (this.filteredDuties.length > 0 && this.employeeIdSearch) {
      
      const payload = {
        ...this.filteredDuties[0],
        id: this.employeeIdSearch,
        
      };
     
      this.api.updateTask(payload).subscribe(
        (res) => {
          this.successtxt = true;
          this.calculateTotal();
          this.isLoading = false;
          this.searchEmployeeById();
          setTimeout(() => {
            this.successtxt = false;
            // this.route.navigateByUrl('/')
          }, 3000);
          console.log('Employee data updated successfully', res);
        },
        (error) => {
          alert('Error updating employee data. Please try again or plz enter proper Employee Id.');
          console.error('Error updating data:', error);

          this.isLoading = false;
        }
      );
    } else {
      alert('No data to update or Employee ID is missing.');
      this.isLoading = false;
    }
  }

  loadDuties(): void {
    const updatedDuties: Duty[] = [];
  
    Object.keys(this.filteredDuties[0]).forEach(key => {
      const duty = this.filteredDuties[0][key];
      
      // Check if duty is valid and has all necessary properties
      if (duty && typeof duty === 'object' && 'dutyId' in duty) {
        updatedDuties.push({
          dutyId: duty.dutyId,
          startTime: duty.startTime || '', // Ensure all properties are defined
          endTime: duty.endTime || '',
          dutyHours: duty.dutyHours || '',
          OThours: duty.OThours || '',
          NightHalt: duty.NightHalt || '',
          kms: duty.kms || '',
          date:duty.date || '',

        });
      }
    });
  
    // Update the state to reflect the array format
    this.filteredDuties = [ ...updatedDuties ]; // Ensure it's an array
    console.log("Duties loaded:", this.filteredDuties);
  }
  

  deleteDutyie(index: number): void {
    console.log('Attempting to delete duty at index:', index);

    // Access the filteredDuties object
    const dutiesObject = this.filteredDuties[0]; // Assuming you're using the first object
    const dutiesKeys = Object.keys(dutiesObject); // Get the keys
  
    // Log the keys and their count
    console.log('Filtered duties keys:', dutiesKeys);
    console.log('Filtered duties object length:', dutiesKeys.length);
  
    if (index >= 0 && index < dutiesKeys.length) {
      const dutyKey = dutiesKeys[index]; // Get the actual key
      delete dutiesObject[dutyKey]; // Delete the duty using the key
  
      // Clean up the object to remove undefined properties
      this.filteredDuties[0] = { ...dutiesObject }; // Update the filteredDuties object
      console.log('Duty deleted successfully', this.filteredDuties);
      this.calculateTotal(); // Update totals after deletion
    } else {
      console.error('Invalid index for deletion:', index);
      alert('Invalid index for deletion.');
    }
  }
  
 
  deleteDuty(dutyId: string): void {

    const dutiesArray = Object.values(this.filteredDuties[0]);
  
    const filteredArray = dutiesArray.filter(duty => duty.dutyId !== dutyId);
  
   
    const updatedDuties: { [key: string]: Duty } = {};
  
    filteredArray.forEach((duty, index) => {
      updatedDuties[index] = duty;
    });

    this.filteredDuties[0] = {
      ...updatedDuties,
      ['id']: this.filteredDuties[0]['id'] 
    } as any; 
  
    console.log('Duty deleted successfully', this.filteredDuties);
    this.calculateTotal();
    this.totalValues = false;
  }
  

  calculateTotal() {
    let totalOThours = 0;
    let totalNightHalt = 0;
    let totalKms = 0;
    let totalHours = 0;
    let totalMinutes = 0;
  
    // Iterate through the filtered duties and sum the values
    for (const dutyKey of Object.keys(this.filteredDuties[0])) {
      const duty = this.filteredDuties[0][dutyKey];
  
      // Handle duty hours (convert HH:mm format to minutes and sum)
      if (duty.dutyHours) {
        const [hours, minutes] = duty.dutyHours.split(':').map(Number); // Split the duty hours into hours and minutes
        totalHours += hours;
        totalMinutes += minutes;
      }
  
      // Sum OT hours (ensure it is treated as a number)
      totalOThours += Number(duty.OThours) || 0;
  
      // Sum night halt
      totalNightHalt += Number(duty.NightHalt) || 0;
  
      // Sum KMS (convert to number)
      totalKms += Number(duty.kms) || 0;
    }
  
    // Convert totalMinutes to hours if it exceeds 60
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60; // remaining minutes after converting to hours
  
    // Format total duty hours in HH:mm
    const formattedDutyHours = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}`;
  
    // Store the totals
    // this.totalValues = {
    //   totalDutyHours: formattedDutyHours,
    //   totalOThours,
    //   totalNightHalt, 
    //   totalKms,
    // };
  }
  exportToExcel() {
    if (!this.filteredDuties || this.filteredDuties.length === 0 || !this.filteredDuties[0]) {
      alert("No duties available to export.");
      return;
    }
  
    const dutiesArray = Object.values(this.filteredDuties[0]);

    // Helper function to format date to dd/mm/yyyy
    const formatDate = (dateString:any) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    // Prepare the table data without headings
    const tableData = dutiesArray.map((duty: Duty, index) => [
      index + 1,                 // SL No
      formatDate(duty.date),      // Date formatted as dd/mm/yyyy
      duty.dutyId,               // Schedule No
      duty.startTime,            // Start Time
      duty.endTime,              // End Time
      duty.dutyHours,            // Duty Hours
      duty.OThours,              // OT Hours
      duty.NightHalt,            // Night Allowance
      duty.kms                   // KMS
    ]);

    // Remove the last entry from the tableData array
    tableData.pop();
  
    // If tableData is empty after removing the last entry, return early
    if (tableData.length === 0) {
      alert("No duties found for exporting.");
      return;
    }
  
    // Create the worksheet from the array of arrays without headers
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
  
    const workbook = {
      Sheets: {
        'Duty Data': worksheet
      },
      SheetNames: ['Duty Data']
    };
  
    // Export file using employeeIdSearch for file name
    XLSX.writeFile(workbook, `${this.Eid}.xlsx`);
    this.updateEmployeeData();
 
}


TotalAmtOfEmployee() {
  let totalOThours = 0;
  let totalNightHalt = 0;
  let totalKms = 0;
  let totalHours = 0;
  let totalMinutes = 0;

  // Iterate through the filtered duties and sum the values
  for (const dutyKey of Object.keys(this.filteredDuties[0])) {
    const duty = this.filteredDuties[0][dutyKey];

    // Handle duty hours (convert HH:mm format to minutes and sum)
    if (duty.dutyHours) {
      const [hours, minutes] = duty.dutyHours.split(':').map(Number); // Split the duty hours into hours and minutes
      totalHours += hours;
      totalMinutes += minutes;
    }

    // Sum OT hours (ensure it is treated as a number)
    totalOThours += Number(duty.OThours) || 0;

    // Sum night halt
    totalNightHalt += Number(duty.NightHalt) || 0;

    // Sum KMS (convert to number)
    totalKms += Number(duty.kms) || 0;
  }

  // Convert totalMinutes to hours if it exceeds 60
  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60; // remaining minutes after converting to hours

  // Format total duty hours in HH:mm
  const formattedDutyHours = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}`;


  this.totalValues = {
    totalDutyHours: formattedDutyHours,
    totalOThours,
    totalNightHalt, 
    totalKms,
  };
}

  
  
}
