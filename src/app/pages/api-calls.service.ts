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
  private KsrtcBackendEndPoint = 'http://localhost:8000/api/KsrtcOtdata'

  constructor(private http: HttpClient) { }


  
  createEmployee(payload: any) {
    return this.http.post<{ message: string, newId: string }>('http://localhost:8000/api/createEmployee', payload);
  }
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.KsrtcBackendEndPoint);
  }
 
  
  getTaskById(taskId: string): Observable<any> {
    return this.http.get<any>(`${this.KsrtcBackendEndPoint}/${taskId}`);
  }
  updateTask(updatedTaskData: any): Observable<any> {
    return this.http.put<any>(`${this.jsonapiEndpointUrl}/${updatedTaskData.id}`, updatedTaskData);
  }
 
  addDuty(payload:any): Observable<any> {
    const url = `${this.KsrtcBackendEndPoint}/Newduty`;
    return this.http.post(url,payload);
  }

  
  deleteDuty(deleteReq:any): Observable<any> {
    const url = `${this.KsrtcBackendEndPoint}/deleteObject`;
    return this.http.delete<any>(url,deleteReq);
  }

  deleteObject(id: string, key: string): Observable<any> {
    return this.http.delete(`${this.KsrtcBackendEndPoint}/deleteObject`, {
      body: { id, key }
    });
  }


  SaveData(data: any): Observable<any> {
    return this.http.put(`${this.KsrtcBackendEndPoint}/updateData`, data);
  }
 deleteEverything(){
  return this.http.post<any>(`${this.KsrtcBackendEndPoint}/resetData`, {});
 }
  
 
}
