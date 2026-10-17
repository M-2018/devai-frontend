import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./views/dashboard/dashboard').then(m => m.Dashboard) 
  },
  { 
    path: 'workspace', 
    loadComponent: () => import('./views/repository-workspace/repository-workspace').then(m => m.RepositoryWorkspaceComponent) 
  },
  { 
    path: 'aider', 
    loadComponent: () => import('./views/aider-console/aider-console').then(m => m.AiderConsoleComponent) 
  },
  { 
    path: 'chat', 
    loadComponent: () => import('./views/chat-module/chat-module').then(m => m.ChatModuleComponent) 
  },
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];