import { Component } from '@angular/core';

@Component({
  selector: 'app-worker-layout',
  template: `
    <div class="worker-layout">
      <header>
        <h1>Panel del Trabajador</h1>
        <nav>
          <a routerLink="/worker" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Órdenes Pendientes</a>
          <a routerLink="/" class="logout">Salir</a>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class WorkerLayoutComponent { }