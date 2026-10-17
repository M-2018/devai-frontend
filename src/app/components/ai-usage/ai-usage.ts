import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-usage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-usage.html',
  styleUrl: './ai-usage.scss'
})
export class AiUsage {
  @Input() models: any[] = [];
}