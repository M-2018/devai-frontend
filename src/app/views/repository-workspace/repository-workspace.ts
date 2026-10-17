import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-repository-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repository-workspace.html',
  styleUrl: './repository-workspace.scss'
})
export class RepositoryWorkspaceComponent {
  apiKey: string = '';
  repoUrl: string = 'https://github.com/M-2018/Calc.git';
  sessionId: string = 'b22b408d-8018-4813-8e76-1043cbe77458';
  
  logs: string[] = [
    '> [System] Workspace inicializado correctamente en entorno .NET 10.',
    '> [System] Esperando acción del usuario (Clonar repositorio o ejecutar análisis)...'
  ];
  isCloned: boolean = false;
  isLoading: boolean = false;

  constructor(
    private repoService: RepositoryService,
    private cdr: ChangeDetectorRef // Inyectamos la detección de cambios
  ) {}

  logMessage(msg: string) {
    this.logs.push(`> ${msg}`);
  }

  onCloneRepository() {
    if (!this.repoUrl) {
      alert('Por favor ingresa la URL del repositorio.');
      return;
    }

    this.isLoading = true;
    this.logMessage(`Clonando repositorio: ${this.repoUrl}...`);
    this.cdr.detectChanges(); // Forzar actualización inicial de UI

    this.repoService.cloneRepository(this.repoUrl, this.sessionId).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzar reactivación del botón
        console.log('Finalize ejecutado -> isLoading =', this.isLoading);
      })
    ).subscribe({
      next: (response: any) => {
        this.isCloned = true;
        this.logMessage(`[Éxito] Repositorio clonado correctamente. Total archivos: ${response?.totalFiles ?? 3}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isCloned = false;
        const errorMsg = err.error?.message || err.message || err.statusText;
        this.logMessage(`[Error] No se pudo clonar el repositorio: ${errorMsg}`);
        this.cdr.detectChanges();
      }
    });
  }

  runSecurityScan() {
    this.logMessage('Ejecutando escaneo de seguridad...');
    this.repoService.scanSecurity(this.sessionId).subscribe({
      next: (res: any) => {
        this.logMessage(`[Seguridad] Resultado: ${JSON.stringify(res)}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.logMessage(`[Error] Falló el escaneo de seguridad.`);
        this.cdr.detectChanges();
      }
    });
  }

  runSyntaxCheck() {
    this.logMessage('Verificando sintaxis del proyecto (.NET 10)...');
    this.repoService.checkSyntax(this.sessionId).subscribe({
      next: (res: any) => {
        this.logMessage(`[Sintaxis] Resultado: ${JSON.stringify(res)}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.logMessage(`[Error] Falló la verificación de sintaxis.`);
        this.cdr.detectChanges();
      }
    });
  }

  runCodeReview() {
    this.logMessage('Ejecutando Code Review con IA...');
    this.repoService.auditRepository(this.sessionId).subscribe({
      next: (res: any) => {
        this.logMessage(`[Code Review] Resultado: ${JSON.stringify(res)}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.logMessage(`[Error] Falló el Code Review.`);
        this.cdr.detectChanges();
      }
    });
  }

  runGenerateDocs() {
    this.logMessage('Generando documentación automática...');
    this.repoService.generateDocsAi(this.sessionId).subscribe({
      next: (res: any) => {
        this.logMessage(`[Docs] Documentación generada con éxito.`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.logMessage(`[Error] No se pudo generar la documentación.`);
        this.cdr.detectChanges();
      }
    });
  }
}