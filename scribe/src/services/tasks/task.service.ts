import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost/backend/tasks';

  constructor(private http: HttpClient, private authService: AuthService) {}

  saveTask(taskData: any): Observable<any> {
    const userId = this.authService.getUserId();
    taskData.user_id = userId;
    return this.http.post(`${this.apiUrl}/save-task.php`, taskData);
  }

  updateTask(taskData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-task.php`, taskData);
  }

  getTask(taskId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-task.php?task_id=${taskId}`);
  }

  getUserTasks(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(`${this.apiUrl}/get-user-tasks.php?user_id=${userId}`);
  }
}
