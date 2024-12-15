import { Component, OnInit } from "@angular/core";
import { ApiCallsService } from "../api-calls.service";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";
import { MatSnackBar } from '@angular/material/snack-bar';
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
  selector: "app-view-ot",
  templateUrl: "./view-ot.component.html",
  styleUrls: ["./view-ot.component.css"],
})
export class ViewOtComponent implements OnInit {
  employeeIdSearch: any = "";
  dutyIdSearch: string = "";
  isLoading: boolean = false;
  successtxt: boolean = false;
  totalValues: any = null;
  timedropdown = [
    "00:00",
    "00:15",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
  ];
  filteredDuties: Duty[] = [];
  AllDuty = false;
  Eid: any;
  previewMessage: string = ''
  newDuty: Duty = {
    dutyId: "",
    startTime: "",
    endTime: "",
    dutyHours: "",
    OThours: "",
    NightHalt: "",
    date: "",
    kms: "",
  };
 
  dutyListData = [
    { dutyId: "0", startTime: "-", endTime: "-", dutyHours: "", OThours: "", NightHalt: "", kms: "",date:"" },
    { dutyId: "1", startTime: "18:30", endTime: "", dutyHours: "", OThours: "", NightHalt: "", kms: "",date:"" },
    { dutyId: "NS/1", startTime: "18:30", endTime: "07:45", dutyHours: "06:15", OThours: "", NightHalt: "125", kms: "538",date:"" },
    { dutyId: "2", startTime: "", endTime: "07:45", dutyHours: "06:15", OThours: "", NightHalt: "125", kms: "538",date:"" },
    { dutyId: "3", startTime: "08:45", endTime: "20:30", dutyHours: "10:30", OThours: "2:30", NightHalt: "15", kms: "503",date:"" },
    { dutyId: "4", startTime: "06:00", endTime: "18:00", dutyHours: "10:30", OThours: "2:30", NightHalt: "", kms: "503",date:"" },
    { dutyId: "9", startTime: "07:30", endTime: "19:30", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "302" ,date:""},
    { dutyId: "10", startTime: "07:00", endTime: "18:50", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "279",date:"" },
    { dutyId: "11", startTime: "06:15", endTime: "16:45", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "386",date:"" },
    { dutyId: "13", startTime: "15:15", endTime: "", dutyHours: "", OThours: "", NightHalt: "", kms: "" ,date:""},
    { dutyId: "NS/13", startTime: "21:00", endTime: "07:05", dutyHours: "08:00", OThours: "1:35", NightHalt: "90", kms: "718" ,date:""},
    { dutyId: "14", startTime: "", endTime: "12:45", dutyHours: "08:00", OThours: "1:30", NightHalt: "15", kms: "718",date:"" },
    { dutyId: "15", startTime: "16:00", endTime: "", dutyHours: "", OThours: "", NightHalt: "", kms: "" ,date:""},
    { dutyId: "NS/15", startTime: "15:15", endTime: "02:30", dutyHours: "06:30", OThours: "1:00", NightHalt: "125", kms: "556",date:"" },
    { dutyId: "16", startTime: "", endTime: "04:15", dutyHours: "06:30", OThours: "", NightHalt: "125", kms: "556",date:"" },
    { dutyId: "19", startTime: "06:00", endTime: "17:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "15", kms: "481" ,date:""},
    { dutyId: "20", startTime: "08:00", endTime: "19:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "15", kms: "481" ,date:""},
    { dutyId: "21", startTime: "07:10", endTime: "18:40", dutyHours: "10:00", OThours: "2:00", NightHalt: "15", kms: "481",date:"" },
    { dutyId: "22", startTime: "08:00", endTime: "19:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "481" ,date:""},
    { dutyId: "24", startTime: "06:00", endTime: "17:45", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "386" ,date:""},
    { dutyId: "26", startTime: "06:45", endTime: "17:25", dutyHours: "08:30", OThours: "0:30", NightHalt: "15", kms: "382" ,date:""},
    { dutyId: "27", startTime: "06:30", endTime: "16:20", dutyHours: "08:30", OThours: "0:30", NightHalt: "", kms: "382" ,date:""},
    { dutyId: "29", startTime: "07:30", endTime: "20:15", dutyHours: "10:30", OThours: "2:30", NightHalt: "15", kms: "538",date:"" },
    { dutyId: "30", startTime: "06:45", endTime: "19:45", dutyHours: "10:30", OThours: "2:30", NightHalt: "", kms: "538" ,date:""},
    { dutyId: "34", startTime: "07:30", endTime: "18:00", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "439",date:"" },
    { dutyId: "35", startTime: "07:30", endTime: "19:15", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "439",date:"" },
    { dutyId: "36", startTime: "06:45", endTime: "17:30", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "420" ,date:""},
    { dutyId: "37", startTime: "06:45", endTime: "16:30", dutyHours: "08:30", OThours: "0:30", NightHalt: "", kms: "378" ,date:""},
    { dutyId: "39", startTime: "05:30", endTime: "18:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "480" ,date:""},
    { dutyId: "40", startTime: "07:45", endTime: "19:15", dutyHours: "09:45", OThours: "1:45", NightHalt: "65", kms: "410",date:"" },
    { dutyId: "41", startTime: "07:15", endTime: "19:15", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "410" ,date:""},
    { dutyId: "42", startTime: "07:00", endTime: "19:00", dutyHours: "08:45", OThours: "0:45", NightHalt: "15", kms: "240" ,date:""},
    { dutyId: "62", startTime: "06:00", endTime: "19:50", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "278" ,date:""},
    { dutyId: "43", startTime: "06:50", endTime: "18:45", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "364",date:"" },
    { dutyId: "45", startTime: "07:00", endTime: "16:30", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "426" ,date:""},
    { dutyId: "46", startTime: "08:15", endTime: "18:00", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "426",date:"" },
    { dutyId: "49", startTime: "06:00", endTime: "17:30", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "360" ,date:""},
    { dutyId: "51", startTime: "07:30", endTime: "19:05", dutyHours: "09:20", OThours: "1:20", NightHalt: "", kms: "302" ,date:""},
    { dutyId: "52", startTime: "08:15", endTime: "17:35", dutyHours: "09:45", OThours: "1:45", NightHalt: "15", kms: "431",date:"" },
    { dutyId: "53", startTime: "07:45", endTime: "16:00", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "431",date:"" },
    { dutyId: "54", startTime: "05:00", endTime: "16:30", dutyHours: "09:00", OThours: "1:00", NightHalt: "15", kms: "420",date:"" },
    { dutyId: "55", startTime: "08:15", endTime: "19:05", dutyHours: "09:00", OThours: "1:00", NightHalt: "", kms: "420" ,date:""},
    { dutyId: "57", startTime: "06:15", endTime: "18:00", dutyHours: "09:45", OThours: "1:45", NightHalt: "15", kms: "399" ,date:""},
    { dutyId: "58", startTime: "07:00", endTime: "17:30", dutyHours: "09:45", OThours: "1:45", NightHalt: "", kms: "404" ,date:""},
    { dutyId: "61/B", startTime: "13:00", endTime: "22:15", dutyHours: "08:00", OThours: "", NightHalt: "15", kms: "143" ,date:""},
    { dutyId: "61/A", startTime: "05:45", endTime: "12:05", dutyHours: "06:50", OThours: "", NightHalt: "", kms: "99" ,date:""},
    { dutyId: "65", startTime: "07:30", endTime: "19:30", dutyHours: "09:20", OThours: "1:20", NightHalt: "", kms: "182" ,date:""},
    { dutyId: "67/B", startTime: "14:00", endTime: "22:10", dutyHours: "08:00", OThours: "", NightHalt: "15", kms: "99" ,date:""},
    { dutyId: "67/A", startTime: "05:30", endTime: "12:25", dutyHours: "06:55", OThours: "", NightHalt: "", kms: "136" ,date:""},
    { dutyId: "71/B", startTime: "13:30", endTime: "21:15", dutyHours: "08:00", OThours: "", NightHalt: "15", kms: "124",date:"" },
    { dutyId: "71/A", startTime: "06:30", endTime: "12:50", dutyHours: "07:30", OThours: "", NightHalt: "", kms: "136" ,date:""},
    { dutyId: "72/B", startTime: "13:00", endTime: "22:25", dutyHours: "08:00", OThours: "", NightHalt: "15", kms: "135",date:"" },
    { dutyId: "72/A", startTime: "05:45", endTime: "12:25", dutyHours: "06:00", OThours: "", NightHalt: "", kms: "138",date:"" },
    { dutyId: "73", startTime: "07:30", endTime: "21:00", dutyHours: "08:30", OThours: "0:30", NightHalt: "15", kms: "232",date:"" },
    { dutyId: "74", startTime: "06:00", endTime: "14:55", dutyHours: "08:00", OThours: "", NightHalt: "", kms: "200",date:""},
    { dutyId: "75", startTime: "07:30", endTime: "21:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "15", kms: "463",date:"" },
    { dutyId: "76", startTime: "09:30", endTime: "21:10", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "463" ,date:""},
    { dutyId: "77", startTime: "07:45", endTime: "19:35", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "200" ,date:""},
    { dutyId: "81", startTime: "08:00", endTime: "19:45", dutyHours: "09:30", OThours: "1:30", NightHalt: "15", kms: "376",date:"" },
    { dutyId: "82", startTime: "06:00", endTime: "18:00", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "350" ,date:""},
    { dutyId: "83", startTime: "08:00", endTime: "20:00", dutyHours: "09:15", OThours: "1:15", NightHalt: "15", kms: "310" ,date:""},
    { dutyId: "84", startTime: "06:00", endTime: "16:35", dutyHours: "09:10", OThours: "1:10", NightHalt: "", kms: "277" ,date:""},
    { dutyId: "86", startTime: "10:30", endTime: "21:10", dutyHours: "09:15", OThours: "1:15", NightHalt: "15", kms: "310",date:"" },
    { dutyId: "87", startTime: "06:00", endTime: "14:55", dutyHours: "08:00", OThours: "", NightHalt: "", kms: "277" ,date:""},
    { dutyId: "89", startTime: "07:15", endTime: "18:20", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "291" ,date:""},
    { dutyId: "90", startTime: "07:30", endTime: "19:30", dutyHours: "09:45", OThours: "1:45", NightHalt: "15", kms: "296",date:"" },
    { dutyId: "91", startTime: "06:15", endTime: "17:35", dutyHours: "09:15", OThours: "1:15", NightHalt: "", kms: "279" ,date:""},
    { dutyId: "92", startTime: "06:15", endTime: "17:25", dutyHours: "09:15", OThours: "1:15", NightHalt: "", kms: "240" ,date:""},
    { dutyId: "93", startTime: "06:00", endTime: "18:00", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "314" ,date:""},
    { dutyId: "94", startTime: "07:15", endTime: "18:30", dutyHours: "09:15", OThours: "1:15", NightHalt: "15", kms: "425" ,date:""},
    { dutyId: "95", startTime: "07:45", endTime: "16:45", dutyHours: "08:30", OThours: "0:30", NightHalt: "", kms: "378",date:"" }, 
    { dutyId: "96", startTime: "06:15", endTime: "20:00", dutyHours: "10:30", OThours: "2:30", NightHalt: "15", kms: "531",date:"" },
    { dutyId: "97", startTime: "05:45", endTime: "17:45", dutyHours: "10:30", OThours: "2:30", NightHalt: "", kms: "531",date:"" },
    { dutyId: "98", startTime: "17:45", endTime: "", dutyHours: "", OThours: "", NightHalt: "", kms: "" ,date:""},
    { dutyId: "98/NS", startTime: "19:15", endTime: "05:45", dutyHours: "06:00", OThours: "", NightHalt: "15", kms: "564" ,date:""},   
    { dutyId: "99", startTime: "", endTime: "08:45", dutyHours: "06:00", OThours: "", NightHalt: "15", kms: "564" ,date:""},
    { dutyId: "100", startTime: "08:00", endTime: "21:00", dutyHours: "10:30", OThours: "2:30", NightHalt: "65", kms: "565",date:"" },
    { dutyId: "101", startTime: "07:30", endTime: "19:45", dutyHours: "10:30", OThours: "2:30", NightHalt: "", kms: "565" ,date:""},
    { dutyId: "106", startTime: "06:00", endTime: "18:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "466",date:"" },
    { dutyId: "108", startTime: "07:15", endTime: "15:15", dutyHours: "08:00", OThours: "", NightHalt: "125", kms: "252" ,date:""},
    { dutyId: "110", startTime: "07:30", endTime: "18:20", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "269" ,date:""},
    { dutyId: "111", startTime: "13:00", endTime: "22:10", dutyHours: "08:30", OThours: "0:30", NightHalt: "15", kms: "231",date:"" },
    { dutyId: "112", startTime: "06:45", endTime: "16:05", dutyHours: "08:30", OThours: "0:30", NightHalt: "", kms: "231" ,date:""},
    { dutyId: "120", startTime: "06:30", endTime: "18:10", dutyHours: "09:30", OThours: "1:30", NightHalt: "", kms: "300",date:"" },
    { dutyId: "94", startTime: "07:15", endTime: "18:30", dutyHours: "08:45", OThours: "0:45", NightHalt: "15", kms: "390" ,date:""},
    { dutyId: "95", startTime: "07:45", endTime: "16:45", dutyHours: "08:30", OThours: "0:30", NightHalt: "", kms: "378" ,date:""},
    { dutyId: "12", startTime: "06:00", endTime: "18:30", dutyHours: "10:00", OThours: "2:00", NightHalt: "", kms: "480" },
  ];

  constructor(private api: ApiCallsService, private route: Router,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.filteredDuties);
  }
 
  
  sendFirstFilteredDuty(): void {
    if (
      this.filteredDuties.length > 0 &&
      Object.keys(this.filteredDuties[0]).length > 0
    ) {
      const firstDuty = this.filteredDuties[0];
      console.log("Sending first duty:", firstDuty);

    } else {
      alert("No duties available to send.");
    }
  }

  AddDutyById(): void {
    console.log("Filtered duties:", this.filteredDuties);


    if (this.dutyIdSearch.trim()) {
      const duty = this.dutyListData.find(
        (d) => d.dutyId === this.dutyIdSearch
      );

      this.dutyIdSearch = "";

      if (duty) {
        const existingDutyIndex = Object.keys(this.filteredDuties[0]).findIndex(
          (key) => {
            const existingDuty = this.filteredDuties[0][key];
            return existingDuty.dutyId === duty.dutyId;
          }
        );

        if (existingDutyIndex !== -1) {
          console.log(
            "Duty already exists:",
            this.filteredDuties[0][existingDutyIndex]
          );
        }

        const newIndex = Object.keys(this.filteredDuties[0]).length;
        this.filteredDuties[0][newIndex] = duty;
        console.log("Duty added:", duty);
    const newduty = duty
        let payload = 
          {
            "id": this.Eid,
               newduty 
                }
        this.api.addDuty(payload).subscribe(
          (response) => {
            console.log('Duty added successfully:', response);
            // this.updateEmployeeData();
            this.searchEmployeeById();
            this.updateEmployeeData()
          },
          (error) => {
            console.error('Error adding duty:', error);
            alert('Error adding duty entry. Please try again.');
          }
        );
      

        // this.sendFirstFilteredDuty();
        // this.updateEmployeeData();
      

        this.totalValues = false;
      } else {
        alert("Duty ID not found in the list.");
      }
    } else {
      alert("Please enter a Duty ID to search.");
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
            this.Eid = this.employeeIdSearch;

            if (Array.isArray(tasks)) {
              this.filteredDuties = tasks;

              this.totalValues = false;
            } else {
              this.filteredDuties = [tasks];
              // this.calculateTotal()
              this.totalValues = false;
              this.isLoading = false;
              // this.Eid ='';
            }
            console.log(this.filteredDuties[0]);
          } else {
            this.snackBar.open(
              `No tasks found for the given Employee ID`,
              'Close', 
              {
                duration: 5000,
                panelClass: ['custom-snackbar',]
              }
            );
            this.employeeIdSearch = "";
            this.filteredDuties = [];
            this.isLoading = false;
            this.Eid = "";
          }
        },
        (error) => {
          this.snackBar.open(
            `No employee present with this employee ID: ${this.employeeIdSearch}`,
            'Close', 
            {
              duration: 2000,
              panelClass: ['custom-snackbar',]
            }
          );
        
          console.error("Error fetching tasks:", error);
          this.filteredDuties = [];
          this.employeeIdSearch = "";
          this.isLoading = false;
          this.Eid = "";
        }
      );
    } else {
    
      this.snackBar.open(
        `Please enter an Employee ID to search !!`,
        'Close', 
        {
          duration: 2000,
          panelClass: ['custom-snackbar',]
        }
      );
    
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

      this.api.SaveData(payload).subscribe(
        (res) => {
          this.successtxt = true;
          this.calculateTotal();
          this.isLoading = false;
          this.snackBar.open(
            `${res.message}.`,
            'Close', 
            {
              duration:4000,
              panelClass: ['custom-snackbar',]
            }
          );
          this.searchEmployeeById();
          
         
          console.log("Employee data updated successfully", res);
        },
        
        (error) => {
          this.snackBar.open(
            `Error updating employee data. Please try again or plz enter proper Employee Id.`,
            'Close', 
            {
              duration:2000,
              panelClass: ['custom-snackbar',]
            }
          );
          console.error("Error updating data:", error);

          this.isLoading = false;
          
        }
      );
      
    } else {
      this.snackBar.open(
        `No data to update or Employee ID is missing.`,
        'Close', 
        {
          duration: 2000,
          panelClass: ['custom-snackbar',]
        }
      );
      this.isLoading = false;
    }
  }

  loadDuties(): void {
    const updatedDuties: Duty[] = [];

    Object.keys(this.filteredDuties[0]).forEach((key) => {
      const duty = this.filteredDuties[0][key];

      // Check if duty is valid and has all necessary properties
      if (duty && typeof duty === "object" && "dutyId" in duty) {
        updatedDuties.push({
          dutyId: duty.dutyId,
          startTime: duty.startTime || "", // Ensure all properties are defined
          endTime: duty.endTime || "",
          dutyHours: duty.dutyHours || "",
          OThours: duty.OThours || "",
          NightHalt: duty.NightHalt || "",
          kms: duty.kms || "",
          date: duty.date || "",
        });
      }
    });

    // Update the state to reflect the array format
    this.filteredDuties = [...updatedDuties]; // Ensure it's an array
    console.log("Duties loaded:", this.filteredDuties);
  }
  convertToUppercase() {
    this.employeeIdSearch = this.employeeIdSearch.toUpperCase();
  }
  DutyToUppercase(){
    this.dutyIdSearch = this.dutyIdSearch.toUpperCase();
  }
  deleteDutyie(data:any): void {
  console.log(data.value.date)
  console.log(this.Eid);
  let payload = {
     "id": "1504C",
  "key": "3"
  }
  this.api.deleteObject(this.Eid,data.key).subscribe((res=>{
    this.searchEmployeeById();
    this.snackBar.open('Deleted successfully !', 'Close', {
      duration: 3000,
      panelClass: ['custom-snackbar'],
    });
  }))
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
        const [hours, minutes] = duty.dutyHours.split(":").map(Number); // Split the duty hours into hours and minutes
        totalHours += hours;
        totalMinutes += minutes;
      }

      if (duty.OThours) {
        const [otHours, otMinutes] = duty.OThours.split(":").map(Number); // Split the OT hours into hours and minutes
        totalOThours += otHours * 60 + otMinutes; // Convert to total minutes and sum
      }

      // Sum night halt
      totalNightHalt += Number(duty.NightHalt) || 0;

      // Sum KMS (convert to number)
      totalKms += Number(duty.kms) || 0;
    }

    // Convert totalMinutes to hours if it exceeds 60
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60; // remaining minutes after converting to hours

    const otTotalHours = Math.floor(totalOThours / 60);
    const otTotalMinutes = totalOThours % 60;

    // Format total duty hours in HH:mm
    const formattedDutyHours = `${String(totalHours).padStart(2, "0")}:${String(
      totalMinutes
    ).padStart(2, "0")}`;
    const formattedOThours = `${String(otTotalHours).padStart(2, "0")}:${String(
      otTotalMinutes
    ).padStart(2, "0")}`;

    // Store the totals
    // this.totalValues = {
    //   totalDutyHours: formattedDutyHours,
    //   totalOThours,
    //   totalNightHalt,
    //   totalKms,
    // };
  }

  exportToExcel() {
    if (
      !this.filteredDuties ||
      this.filteredDuties.length === 0 ||
      !this.filteredDuties[0]
    ) {
      alert("No duties available to export.");
      return;
    }
  
    // Log the filtered duties before processing
    console.log("Filtered Duties: ", this.filteredDuties);
  
    const dutiesArray = Object.values(this.filteredDuties[0]);
  
    // Helper function to format date to dd/mm/yyyy
    const formatDate = (dateString: any) => {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = date.getFullYear();
      // return `${day}/${month}/${year}`;
      return `${day}`;
    };
  
    // Sort dutiesArray by date in descending order
  
    dutiesArray.sort((a: any, b: any) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime(); // Ascending order
    });
  
    // Prepare the table data without headings
    let tableData = dutiesArray.map((duty: Duty) => [
      formatDate(duty.date), // Full date formatted as dd/mm/yyyy
      duty.dutyId,           // Schedule No
      duty.startTime,        // Start Time
      duty.endTime,          // End Time
      duty.dutyHours,        // Duty Hours
      "",
      duty.OThours,          // OT Hours
      "",
      duty.NightHalt,        // Night Allowance (default to 0 if undefined)
      "",
      duty.kms,              // KMS (default to 0 if undefined)
    ]);
  
    // Remove the last entry from the tableData array
    tableData.pop();
  
    // If tableData is empty after removing the last entry, return early
    if (tableData.length === 0) {
      alert("No duties found for exporting.");
      return;
    }
  
    // Log tableData before exporting
    console.log("Table Data: ", tableData);
  
    // Create the indexed table data with indexing based on date
    const indexedTableData = [
      [
        "ದಿನಾಂಕ", "ಕರ್ತವ್ಯ ಸಂಖ್ಯೆ", "ಪ್ರಾರಂಭ ಸಮಯ",
        "ಮುಕ್ತಯ ಸಮಯ", "ಡ್ಯೂಟಿ ಗಂಟೆಗಳು", "ಕಡಿತ ಭತ್ಯೆ",
        "ಭತ್ಯೆ ಗಂಟೆಗಳು", "ಕಡಿತ ಕಿ.ಮೀ", "ರಾತ್ರಿ ಭತ್ಯೆ",
        "ಟ.ಭತ್ಯೆ", "ಕಿ.ಮೀ"
      ], 
      ...tableData,
    ];
  
    // Create the worksheet from the indexed array of arrays with headers
    const worksheet = XLSX.utils.aoa_to_sheet(indexedTableData);
  
    const workbook = {
      Sheets: {
        "Duty Data": worksheet,
      },
      SheetNames: ["Duty Data"],
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
        const [hours, minutes] = duty.dutyHours.split(":").map(Number); // Split the duty hours into hours and minutes
        totalHours += hours;
        totalMinutes += minutes;
      }

      // Handle OT hours (convert HH:mm format to minutes and sum)
      if (duty.OThours) {
        const [otHours, otMinutes] = duty.OThours.split(":").map(Number); // Split the OT hours into hours and minutes
        totalOThours += otHours * 60 + otMinutes; // Convert to total minutes and sum
      }

      // Sum night halt
      totalNightHalt += Number(duty.NightHalt) || 0;

      // Sum KMS (convert to number)
      totalKms += Number(duty.kms) || 0;
    }

    // Convert total minutes to hours if it exceeds 60
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60; // remaining minutes after converting to hours

    // Convert totalOThours from minutes to hours and minutes
    const otTotalHours = Math.floor(totalOThours / 60);
    const otTotalMinutes = totalOThours % 60;

    // Format total duty hours in HH:mm
    const formattedDutyHours = `${String(totalHours).padStart(2, "0")}:${String(
      totalMinutes
    ).padStart(2, "0")}`;
    const formattedOThours = `${String(otTotalHours).padStart(2, "0")}:${String(
      otTotalMinutes
    ).padStart(2, "0")}`;

    this.totalValues = {
      totalDutyHours: formattedDutyHours,
      totalOThours: formattedOThours,
      totalNightHalt,
      totalKms,
    };
  }
}
