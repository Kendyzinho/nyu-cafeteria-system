import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';

interface Transaction {
  id: string;
  date: string;
  item: string;
  amount: number;
  method: 'Tarjeta' | 'Plan Residente' | 'Efectivo';
  status: 'Completado' | 'Pendiente' | 'Cancelado';
  horarioRetiro: string | null;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  transactions: Transaction[] = [];
  totalSpentMonth: number = 0;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.orderService.getOrdersByUser(user.id).subscribe({
        next: (orders) => {
          this.transactions = orders.map(o => ({
            id: `TRX-${o.id.toString().padStart(3, '0')}`,
            date: o.fechaCreacion,
            item: this.getItemsSummary(o.items),
            amount: Number(o.total),
            method: 'Tarjeta',
            status: this.capitalize(o.estado) as any,
            horarioRetiro: o.horarioRetiro ?? null,
          }));
          this.calculateTotal();
        },
        error: (err) => console.error('Error cargando historial', err)
      });
    }
  }

  getItemsSummary(items: any[]): string {
    if (!items || items.length === 0) return 'Sin items';
    return items.map(i => {
      const name = i.product?.name || i.nombre || `Producto #${i.productId || i.id}`;
      const qty = i.quantity || i.cantidad || 1;
      return `${qty}x ${name}`;
    }).join(', ');
  }

  capitalize(str: string): string {
    if (!str) return 'Pendiente';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  calculateTotal() {
    this.totalSpentMonth = this.transactions
      .filter(t => t.status === 'Completado')
      .reduce((sum, current) => sum + current.amount, 0);
  }

  getMethodClass(method: string): string {
    if (method === 'Plan Residente') return 'badge bg-info-pastel text-dark';
    if (method === 'Tarjeta') return 'badge bg-primary-pastel text-dark';
    return 'badge bg-secondary-pastel text-dark';
  }
}