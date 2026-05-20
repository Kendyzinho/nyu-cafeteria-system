import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';

interface Transaction {
  id: string;
  date: string;
  item: string;
  amount: number;
  method: 'Tarjeta' | 'Plan Residente' | 'Efectivo';
  status: 'Completado' | 'Pendiente' | 'Cancelado';
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  transactions: Transaction[] = [];
  totalSpentMonth: number = 0;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.transactions = data.map(order => ({
          id: `TRX-${order.id}`,
          date: new Date().toISOString().split('T')[0],
          item: `Pedido #${order.id}`,
          amount: order.total || 0,
          method: 'Tarjeta',
          status: 'Completado'
        }));
        
        this.calculateTotal();
      },
      error: () => {
        console.error('Error fetching orders');
      }
    });
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