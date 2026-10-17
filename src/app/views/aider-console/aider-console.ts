import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-aider-console',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aider-console.html',
  styleUrl: './aider-console.scss'
})
export class AiderConsoleComponent {
  promptText: string = '';
  apiKey: string = ''; // Puede provenir de una variable global o compartida
  sessionId: string = 'session-default';

  logs: string[] = [
    '> [Aider] Inicializando sesión de desarrollo autónomo...',
    '> [Aider] Enlazado con motor Gemini Pro y workspace actual.',
    '> [Ready] Escribe un comando de ingeniería o refactorización abajo.'
  ];
  isLoading: boolean = false;

  constructor(private repoService: RepositoryService) {}

  logMessage(msg: string) {
    this.logs.push(`> ${msg}`);
  }

  runAiderFeature() {
    if (!this.promptText) return;

    const currentPrompt = this.promptText;
    this.promptText = '';
    this.isLoading = true;
    this.logMessage(`[Usuario / Aider]: ${currentPrompt}`);

    this.repoService.executeAiderFeature(this.sessionId, currentPrompt, this.apiKey).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.logMessage(`[Aider Output]: ${typeof res === 'object' ? JSON.stringify(res) : res}`);
      },
      error: (err) => {
        this.isLoading = false;
        this.logMessage(`[Error Aider]: ${err.message || 'Error al ejecutar comando.'}`);
      }
    });
  }

  runAnalyzeCode() {
    if (!this.promptText) return;

    const currentPrompt = this.promptText;
    this.promptText = '';
    this.isLoading = true;
    this.logMessage(`[Usuario / Consulta]: ${currentPrompt}`);

    this.repoService.analyzeRepository(this.sessionId, currentPrompt, this.apiKey).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.logMessage(`[Análisis Output]: ${typeof res === 'object' ? JSON.stringify(res) : res}`);
      },
      error: (err) => {
        this.isLoading = false;
        this.logMessage(`[Error Análisis]: ${err.message || 'Error al analizar el código.'}`);
      }
    });
  }
}