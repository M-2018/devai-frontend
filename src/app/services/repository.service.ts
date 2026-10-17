import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private apiUrl = 'https://localhost:7281/api/repository'; 

  constructor(private http: HttpClient) {}

  public cloneRepository(repositoryUrl: string, sessionId: string): Observable<any> {
    // El backend espera CloneRepositoryRequest que contiene repositoryUrl y sessionId
    return this.http.post(`${this.apiUrl}/clone`, { repositoryUrl, sessionId });
  }

  public executeAiderFeature(sessionId: string, prompt: string, geminiApiKey: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/aider-feature`, { sessionId, prompt, geminiApiKey });
  }

  public scanSecurity(sessionId: string): Observable<any> {
    // El backend espera un Guid en crudo [FromBody] Guid sessionId
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/scan`, JSON.stringify(sessionId), { headers });
  }

  public auditRepository(sessionId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/audit`, JSON.stringify(sessionId), { headers });
  }

  public generateDocsAi(sessionId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/generate-documentation-ai`, JSON.stringify(sessionId), { headers });
  }

  public checkSyntax(sessionId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/check-syntax`, JSON.stringify(sessionId), { headers });
  }

  public fixVulnerabilities(sessionId: string, apiKey: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/aider-fix`, { sessionId, geminiApiKey: apiKey });
  }

  public analyzeRepository(sessionId: string, question: string, apiKey: string): Observable<any> {
    // El backend espera AnalyzeRepositoryRequest con question y sessionId
    return this.http.post(`${this.apiUrl}/analyze`, { sessionId, question, geminiApiKey: apiKey });
  }
}