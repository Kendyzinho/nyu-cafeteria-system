import { Component } from '@angular/core';

@Component({
  selector: 'app-student-layout',
  template: `
    <header class="site-header">
      <h1>NYU Cafeteria System</h1>
    </header>
    <main>
      <nav class="tabs">
        <a routerLink="/menu" routerLinkActive="active" class="tab-btn">Menú del Día</a>
        <a routerLink="/order" routerLinkActive="active" class="tab-btn">Hacer Pedido</a>
        <a routerLink="/my-orders" routerLinkActive="active" class="tab-btn">Mis Pedidos</a>
        <a routerLink="/history" routerLinkActive="active" class="tab-btn">Historial</a>
        <a routerLink="/plans" routerLinkActive="active" class="tab-btn">Planes</a>
      </nav>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      /* Nueva paleta de colores moderna y minimalista */
      --primary-color: #413330; /* Marrón oscuro para elementos activos */
      --text-color: #2c211d;    /* Marrón más oscuro para texto principal */
      --bg-color: #c0a792;      /* Fondo Beige */
      --bg-alt-color: #c0a792; /* Fondo Beige */
      --border-color: #413330;  /* Marrón oscuro para bordes */
      --font-family: 'Inter', sans-serif; /* Tipografía limpia */
    }

    .site-header {
      background-color: var(--bg-color);
      color: var(--text-color);
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .site-header h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      text-align: center;
    }

    main {
      padding: 1.5rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      background-color: var(--bg-alt-color);
      min-height: calc(100vh - 80px); /* Ajustar altura */
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: 0.8rem 1.2rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-color);
      opacity: 0.6;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .tab-btn:hover,
    .tab-btn.active {
      opacity: 1;
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
  `]
})
export class StudentLayoutComponent { }