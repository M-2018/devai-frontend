import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-status.html',
  styleUrl: './system-status.scss'
})
export class SystemStatus {
  @Input() status: any; // Recibe el objeto de estado desde el componente padre (App)
  @Input() models: any[] = []; // Lista de modelos de IA para mostrar en la interfaz
}