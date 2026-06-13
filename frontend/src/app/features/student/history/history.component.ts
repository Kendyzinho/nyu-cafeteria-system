import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order';

interface Transaction {
  id: string;
  rawId: number;
  date: string;
  item: string;
  items: { nombre: string; cantidad: number; precio: number }[];
  amount: number;
  method: 'Tarjeta' | 'Plan Residente' | 'Efectivo';
  status: string;
  horarioRetiro: string | null;
  type: 'Compra' | 'Canje Plan';
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filter: 'Todos' | 'Compras' | 'Canjes Plan' = 'Todos';
  expandedId: string | null = null;

  // Filtros de fecha
  fechaDesde: string = '';
  fechaHasta: string = '';

  // Estadísticas
  totalSpentMonth: number = 0;
  totalPedidos: number = 0;
  promedioPedido: number = 0;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.orderService.getOrdersByUser(user.id).subscribe({
        next: (orders: Order[]) => {
          this.transactions = orders.map(o => {
            const isPlan = Number(o.total) === 0;
            const rawItems = (o.items || []).map((i: any) => ({
              nombre: i.nombre || `Producto #${i.comidaId || i.id}`,
              cantidad: i.cantidad || i.quantity || 1,
              precio: Number(i.price || i.precio || i.precioUnitario || 0),
            }));
            return {
              id: `TRX-${o.id.toString().padStart(3, '0')}`,
              rawId: o.id,
              date: o.fechaCreacion,
              item: rawItems.map(i => `${i.cantidad}x ${i.nombre}`).join(', ') || 'Sin ítems',
              items: rawItems,
              amount: Number(o.total),
              method: isPlan ? 'Plan Residente' : 'Tarjeta',
              status: this.capitalize(o.estado),
              horarioRetiro: o.horarioRetiro ?? null,
              type: isPlan ? 'Canje Plan' : 'Compra',
            };
          });
          this.applyFilter();
          this.calculateStats();
        },
        error: (err) => console.error('Error cargando historial', err)
      });
    }
  }

  capitalize(str: string): string {
    if (!str) return 'Pendiente';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  calculateStats() {
  const now = new Date();
  const mes = now.getMonth();
  const anio = now.getFullYear();

  // 'Pagado' = ya procesado, 'Completado' = si admin lo marca así
  const esPagado = (t: Transaction) => t.status === 'Pagado' || t.status === 'Completado';

  const delMes = this.transactions.filter(t => {
    const d = new Date(t.date);
    return esPagado(t) && d.getMonth() === mes && d.getFullYear() === anio;
  });

  this.totalSpentMonth = delMes.reduce((s, t) => s + t.amount, 0);
  this.totalPedidos = this.transactions.filter(esPagado).length;
  this.promedioPedido = this.totalPedidos > 0
    ? this.transactions.filter(esPagado).reduce((s, t) => s + t.amount, 0) / this.totalPedidos
    : 0;
}

  setFilter(filter: 'Todos' | 'Compras' | 'Canjes Plan') {
    this.filter = filter;
    this.applyFilter();
  }

  applyFilter() {
    let result = this.transactions;

    if (this.filter === 'Compras') result = result.filter(t => t.type === 'Compra');
    if (this.filter === 'Canjes Plan') result = result.filter(t => t.type === 'Canje Plan');

    if (this.fechaDesde) {
      const desde = new Date(this.fechaDesde);
      result = result.filter(t => new Date(t.date) >= desde);
    }
    if (this.fechaHasta) {
      const hasta = new Date(this.fechaHasta);
      hasta.setHours(23, 59, 59);
      result = result.filter(t => new Date(t.date) <= hasta);
    }

    this.filteredTransactions = result;
  }

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  getMethodClass(method: string): string {
    if (method === 'Plan Residente') return 'badge bg-info-pastel text-dark';
    if (method === 'Tarjeta') return 'badge bg-primary-pastel text-dark';
    return 'badge bg-secondary-pastel text-dark';
  }
}