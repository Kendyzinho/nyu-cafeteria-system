import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // Este componente ahora solo actúa como el punto de entrada para el enrutador.
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent {
  title = 'nyu-cafeteria-frontend';
}
