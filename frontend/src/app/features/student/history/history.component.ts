import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order';

interface Transaction {
  id: string;
  date: string;
  item: string;
  amount: number;
  method: 'Tarjeta' | 'Plan Residente' | 'Efectivo';
  status: 'Completado' | 'Pendiente' | 'Cancelado' | string;
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
  totalSpentMonth: number = 0;
  filteredTransactions: Transaction[] = [];
  filter: 'Todos' | 'Compras' | 'Canjes Plan' = 'Todos';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.orderService.getOrdersByUser(user.id).subscribe({

        next: (orders: Order[]) => {
          this.transactions = orders.map(o => {
            const isPlan = Number(o.total) === 0;
            return {
              id: `TRX-${o.id.toString().padStart(3, '0')}`,
              date: o.fechaCreacion,
              item: this.getItemsSummary(o.items || []),
              amount: Number(o.total),
              method: isPlan ? 'Plan Residente' : 'Tarjeta',
              status: this.capitalize(o.estado),
              horarioRetiro: o.horarioRetiro ?? null,
              type: isPlan ? 'Canje Plan' : 'Compra',
            };
          });
          this.applyFilter();
          this.calculateTotal();
        },
        error: (err) => console.error('Error cargando historial', err)
      });
    }
  }

  getItemsSummary(items: any[]): string {
    if (!items || items.length === 0) return 'Sin items';
    return items.map(i => {
      const name = i.nombre || `Producto #${i.comidaId || i.id}`;
      const qty = i.cantidad || i.quantity || 1;
      return `${qty}x ${name}`;
    }).join(', ');
  }

  capitalize(str: string): string {
    if (!str) return 'Pendiente';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  calculateTotal() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  this.totalSpentMonth = this.transactions
    .filter(t => {
      const trxDate = new Date(t.date);
      return (
        t.status === 'Completado' &&
        trxDate.getMonth() === currentMonth &&
        trxDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, current) => sum + current.amount, 0);
}

  getMethodClass(method: string): string {
    if (method === 'Plan Residente') return 'badge bg-info-pastel text-dark';
    if (method === 'Tarjeta') return 'badge bg-primary-pastel text-dark';
    return 'badge bg-secondary-pastel text-dark';
  }


  setFilter(filter: 'Todos' | 'Compras' | 'Canjes Plan') {
  this.filter = filter;
  this.applyFilter();
}

applyFilter() {
  if (this.filter === 'Todos') {
    this.filteredTransactions = this.transactions;
    return;
  }

  if (this.filter === 'Compras') {
    this.filteredTransactions = this.transactions.filter(t => t.type === 'Compra');
    return;
  }

  if (this.filter === 'Canjes Plan') {
    this.filteredTransactions = this.transactions.filter(t => t.type === 'Canje Plan');
  }
}
}