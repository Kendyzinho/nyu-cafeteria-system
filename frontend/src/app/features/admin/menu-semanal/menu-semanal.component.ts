import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { Product } from '../../../core/models/product';

interface WeeklyMenu {
  [dateStr: string]: {
    [category: string]: Product[];
  };
}

@Component({
  selector: 'app-menu-semanal',
  templateUrl: './menu-semanal.component.html',
  styleUrls: ['./menu-semanal.component.css']
})
export class MenuSemanalComponent implements OnInit {
  currentDate: Date = new Date();
  weekDays: { name: string; date: Date; dateStr: string }[] = [];
  
  // Catálogo completo de productos
  catalogProducts: Product[] = [];
  filteredCatalog: Product[] = [];
  searchTerm: string = '';
  selectedCategoryFilter: string = 'todos';
  
  // Planificación semanal guardada en LocalStorage
  weeklyPlan: WeeklyMenu = {};
  
  // Para control del modal de asignación
  showAddModal: boolean = false;
  targetDayDateStr: string = '';
  targetCategory: string = '';

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadCatalog();
    this.loadWeeklyPlan();
    this.generateWeek();
  }

  // Cargar catálogo de comida
  loadCatalog() {
    this.menuService.getAll().subscribe({
      next: (data) => {
        this.catalogProducts = data;
        this.filteredCatalog = data;
      },
      error: (err) => console.error('Error cargando el catálogo', err)
    });
  }

  // Carga persistida en LocalStorage
  loadWeeklyPlan() {
    const data = localStorage.getItem('nyu_weekly_menus');
    if (data) {
      this.weeklyPlan = JSON.parse(data);
    }
  }

  // Guardar en LocalStorage
  saveWeeklyPlan() {
    localStorage.setItem('nyu_weekly_menus', JSON.stringify(this.weeklyPlan));
  }

  // Genera los días de la semana (Lunes a Domingo) en base a currentDate
  generateWeek() {
    const startOfWeek = this.getMonday(new Date(this.currentDate));
    const days = [];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = this.formatDateKey(d);
      
      // Asegurar que exista la estructura para esta fecha
      if (!this.weeklyPlan[dateStr]) {
        this.weeklyPlan[dateStr] = {
          'Desayuno': [],
          'Almuerzo': [],
          'Cena': [],
          'Snack': []
        };
      }

      days.push({
        name: dayNames[i],
        date: d,
        dateStr: dateStr
      });
    }
    this.weekDays = days;
  }

  // Auxiliares de fechas
  getMonday(d: Date): Date {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para que empiece el lunes
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  formatDateKey(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getWeekRangeLabel(): string {
    if (this.weekDays.length === 0) return '';
    const first = this.weekDays[0].date;
    const last = this.weekDays[6].date;
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const firstStr = first.toLocaleDateString('es-ES', options);
    const lastStr = last.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return `${firstStr} - ${lastStr}`;
  }

  // Navegación
  prevWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeek();
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeek();
  }

  goToToday() {
    this.currentDate = new Date();
    this.generateWeek();
  }

  // Acciones sobre el menú
  openAssignModal(dateStr: string, category: string) {
    this.targetDayDateStr = dateStr;
    this.targetCategory = category;
    this.searchTerm = '';
    this.selectedCategoryFilter = 'todos';
    this.filterCatalog();
    this.showAddModal = true;
  }

  closeModal() {
    this.showAddModal = false;
  }

  filterCatalog() {
    let temp = this.catalogProducts;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      temp = temp.filter(p => p.nombre.toLowerCase().includes(term) || (p.descripcion && p.descripcion.toLowerCase().includes(term)));
    }
    if (this.selectedCategoryFilter !== 'todos') {
      temp = temp.filter(p => p.categoria === this.selectedCategoryFilter);
    }
    this.filteredCatalog = temp;
  }

  assignProduct(product: Product) {
    const dateStr = this.targetDayDateStr;
    const cat = this.targetCategory;
    
    if (!this.weeklyPlan[dateStr]) {
      this.weeklyPlan[dateStr] = {
        'Desayuno': [],
        'Almuerzo': [],
        'Cena': [],
        'Snack': []
      };
    }
    
    // Evitar duplicados del mismo producto en la misma categoría y día
    const exists = this.weeklyPlan[dateStr][cat].some(p => p.id === product.id);
    if (!exists) {
      this.weeklyPlan[dateStr][cat].push(product);
      this.saveWeeklyPlan();
    }
    this.closeModal();
  }

  removeProduct(dateStr: string, category: string, productId: number) {
    if (this.weeklyPlan[dateStr] && this.weeklyPlan[dateStr][category]) {
      this.weeklyPlan[dateStr][category] = this.weeklyPlan[dateStr][category].filter(p => p.id !== productId);
      this.saveWeeklyPlan();
    }
  }
  clearDayMenu(dateStr: string) {
    if (confirm('¿Estás seguro que deseas limpiar el menú completo de este día?')) {
      this.weeklyPlan[dateStr] = {
        'Desayuno': [],
        'Almuerzo': [],
        'Cena': [],
        'Snack': []
      };
      this.saveWeeklyPlan();
    }
  }

  hasMealsPlanned(dateStr: string): boolean {
    const plan = this.weeklyPlan[dateStr];
    if (!plan) return false;
    return (plan['Desayuno']?.length > 0) || 
           (plan['Almuerzo']?.length > 0) || 
           (plan['Cena']?.length > 0) || 
           (plan['Snack']?.length > 0);
  }
}
