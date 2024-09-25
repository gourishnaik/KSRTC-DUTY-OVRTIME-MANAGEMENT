import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, switchMap } from 'rxjs';
interface Duty {
  dutyId: string;
  startTime: string;
  endTime: string;
  dutyHours: string;
  OThours: string;
  NightHalt: string;
  kms: string;
}

interface Task {
  id: string;
  [key: string]: Duty | string; // Allow for duty objects or strings
}
@Injectable({
  providedIn: 'root'
})

export class ApiCallsService {
  private jsonapiEndpointUrl = 'http://localhost:3000/Createtask';

  constructor(private http: HttpClient) { }


  createTask(taskData: any): Observable<any> {
    return this.http.post<any>(this.jsonapiEndpointUrl, taskData);
  }
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonapiEndpointUrl);
  }
 
  
  getTaskById(taskId: string): Observable<any> {
    return this.http.get<any>(`${this.jsonapiEndpointUrl}/${taskId}`);
  }
  updateTask(updatedTaskData: any): Observable<any> {
    return this.http.put<any>(`${this.jsonapiEndpointUrl}/${updatedTaskData.id}`, updatedTaskData);
  }
 


  deleteDuty(taskId: string, dutyId: string): Observable<any> {
    // Step 1: Fetch the task
    return this.http.get<Task>(`${this.jsonapiEndpointUrl}/${taskId}`).pipe(
      switchMap((task) => {
        // Step 2: Remove the duty
        const updatedDuties: { [key: string]: Duty } = {};
        
        Object.entries(task).forEach(([key, value]) => {
          if (typeof value === 'object' && value.dutyId !== dutyId) {
            updatedDuties[key] = value as Duty; // Type assertion
          }
        });

        // Step 3: Update the task
        const updatedTask = {
          ...task,
          ...updatedDuties,
        };

        // Send the updated task back to the server
        return this.http.put<any>(`${this.jsonapiEndpointUrl}/${taskId}`, updatedTask);
      })
    );
  }
  

  checkIfEmployeeIdExists(employeeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.jsonapiEndpointUrl}?id=${employeeId}`);
  }

  
 
}
