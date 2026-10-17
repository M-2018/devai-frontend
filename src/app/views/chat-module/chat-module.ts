import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepositoryService } from '../../services/repository.service';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chat-module',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-module.html',
  styleUrl: './chat-module.scss'
})
export class ChatModuleComponent {
  userQuery: string = '';
  apiKey: string = '';
  sessionId: string = 'session-default';
  isLoading: boolean = false;

  messages: ChatMessage[] = [
    {
      sender: 'ai',
      text: '¡Hola! Soy tu asistente técnico para el desarrollo en .NET 10. ¿En qué puedo ayudarte hoy con tu API, los controladores, las entidades de Entity Framework Core o la configuración de servicios?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  constructor(private repoService: RepositoryService) {}

  sendMessage() {
    if (!this.userQuery.trim()) return;

    const query = this.userQuery;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Agregar mensaje del usuario
    this.messages.push({ sender: 'user', text: query, time: now });
    this.userQuery = '';
    this.isLoading = true;

    this.repoService.analyzeRepository(this.sessionId, query, this.apiKey).subscribe({
      next: (res) => {
        this.isLoading = false;
        const responseText = typeof res === 'string' ? res : (res?.result || JSON.stringify(res));
        this.messages.push({
          sender: 'ai',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.messages.push({
          sender: 'ai',
          text: `[Error al conectar con la API]: ${err.message || 'No se pudo recibir respuesta.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });
  }
}