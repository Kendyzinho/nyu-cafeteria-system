import { Component, OnInit } from '@angular/core';

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
  // Datos simulados para el historial
  transactions: Transaction[] = [
    { id: 'TRX-001', date: '2026-04-25', item: 'Menú Ejecutivo - Bowl Quinoa', amount: 0, method: 'Plan Residente', status: 'Completado' },
    { id: 'TRX-002', date: '2026-04-24', item: 'Café Latte Grande + Muffing', amount: 4500, method: 'Tarjeta', status: 'Completado' },
    { id: 'TRX-003', date: '2026-04-23', item: 'Sándwich Ave Mayo', amount: 3200, method: 'Tarjeta', status: 'Completado' },
    { id: 'TRX-004', date: '2026-04-22', item: 'Menú Ejecutivo - Lasaña', amount: 0, method: 'Plan Residente', status: 'Completado' },
    { id: 'TRX-005', date: '2026-04-21', item: 'Bebida 500ml', amount: 1500, method: 'Efectivo', status: 'Completado' }
  ];

  totalSpentMonth: number = 9200;

  constructor() { }

  ngOnInit(): void { }

  // Función para asignar color según el método de pago
  getMethodClass(method: string): string {
    if (method === 'Plan Residente') return 'badge bg-info-pastel text-dark';
    if (method === 'Tarjeta') return 'badge bg-primary-pastel text-dark';
    return 'badge bg-secondary-pastel text-dark';
  }
}