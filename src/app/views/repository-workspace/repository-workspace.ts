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
  lastGeneratedHtml: string | null = null;

  constructor(
    private repoService: RepositoryService,
    private cdr: ChangeDetectorRef
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
    this.cdr.detectChanges();

    this.repoService.cloneRepository(this.repoUrl, this.sessionId).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
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
        const data = res?.data || res;
        this.logMessage(`--- INFORME DE SEGURIDAD ---`);
        if (data?.hasVulnerabilities && data?.results) {
          this.parseAndLogIssues(data.results, '🚨 Vulnerabilidad');
        } else {
          this.logMessage('✅ No se detectaron vulnerabilidades de seguridad.');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.logMessage(`❌ [Error] Falló el escaneo de seguridad.`);
        this.cdr.detectChanges();
      }
    });
  }

  runSyntaxCheck() {
    this.logMessage('Verificando sintaxis del proyecto...');
    this.repoService.checkSyntax(this.sessionId).subscribe({
      next: (res: any) => {
        const data = res?.data || res;
        this.logMessage(`--- VERIFICACIÓN DE SINTAXIS ---`);
        if (data?.hasSyntaxErrors && data?.syntaxErrors) {
          this.parseAndLogIssues(data.syntaxErrors, '⚠️ Error de Sintaxis');
        } else {
          this.logMessage('✅ Sintaxis correcta en todos los archivos.');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.logMessage(`❌ [Error] Falló la verificación de sintaxis.`);
        this.cdr.detectChanges();
      }
    });
  }

  runCodeReview() {
    this.logMessage('Ejecutando Code Review con IA...');
    this.repoService.auditRepository(this.sessionId).subscribe({
      next: (res: any) => {
        const data = res?.data || res;
        this.logMessage(`--- RESUMEN DE CODE REVIEW ---`);
        if (data?.securityIssues && data.securityIssues !== '[]') {
          this.logMessage(`[Seguridad]:`);
          this.parseAndLogIssues(data.securityIssues, '🚨 Vulnerabilidad');
        }
        if (data?.syntaxIssues && data.syntaxIssues !== '[]') {
          this.logMessage(`[Sintaxis]:`);
          this.parseAndLogIssues(data.syntaxIssues, '⚠️ Sintaxis');
        }
        if ((!data?.securityIssues || data.securityIssues === '[]') && (!data?.syntaxIssues || data.syntaxIssues === '[]')) {
          this.logMessage('✅ El código no presenta problemas relevantes.');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.logMessage(`❌ [Error] Falló el Code Review.`);
        this.cdr.detectChanges();
      }
    });
  }

  runGenerateDocs() {
    this.logMessage('Generando documentación automática con IA...');
    this.repoService.generateDocsAi(this.sessionId).subscribe({
      next: (res: any) => {
        const html = res?.data?.documentationHtml || res?.documentationHtml;
        if (html) {
          this.lastGeneratedHtml = html;
          this.logMessage('📄 [Docs] Documentación HTML generada con éxito.');
          this.logMessage('💡 Puedes previsualizarla o descargarla desde los botones habilitados abajo.');
        } else {
          this.logMessage('⚠️ Documentación generada pero sin contenido HTML.');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.logMessage(`❌ [Error] No se pudo generar la documentación.`);
        this.cdr.detectChanges();
      }
    });
  }

  // Método helper para convertir el JSON en texto amigable para la consola
  private parseAndLogIssues(jsonString: string, label: string) {
    try {
      const issues = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      if (Array.isArray(issues)) {
        issues.forEach((item: any) => {
          const archivo = item.Archivo || item.archivo || 'Desconocido';
          const linea = item.Linea || item.linea || '?';
          const problema = item.Problema || item.problema || 'Sin detalle';
          const codigo = item.CodigoAfectado || item.codigoAfectado || '';

          this.logMessage(`${label} en [${archivo}:${linea}]`);
          this.logMessage(`   ↳ Detalle: ${problema}`);
          if (codigo) {
            this.logMessage(`   ↳ Código: ${codigo}`);
          }
        });
      }
    } catch {
      this.logMessage(`Detalle: ${jsonString}`);
    }
  }

  // Método para abrir el HTML generado en una nueva pestaña del navegador
  openDocsInNewTab() {
    if (!this.lastGeneratedHtml) return;
    const blob = new Blob([this.lastGeneratedHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  // Método para descargar el HTML generado como archivo .html
  downloadDocsHtml() {
    if (!this.lastGeneratedHtml) return;
    const blob = new Blob([this.lastGeneratedHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DOCUMENTATION_AI_${this.sessionId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
}