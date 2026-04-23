import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/models/stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {

  stocks: Stock[] = [];
  errorMessage = '';

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.cargarStocks();
  }

  cargarStocks(): void {
    this.stockService.getStocks().subscribe({
      next: (data) => {
        this.stocks = data;
      },
      error: () => {
        this.errorMessage = 'Error al cargar stock';
      }
    });
  }

  getEstado(cantidad: number, umbralMinimo: number): string {
    if (cantidad <= 0) return 'Agotado';
    if (cantidad <= umbralMinimo) return 'Bajo stock';
    return 'Disponible';
  }

  getEstadoClase(cantidad: number, umbral: number): string {
  if (cantidad <= 0) return 'badge-pill badge-danger';
  if (cantidad <= umbral) return 'badge-pill badge-warning';
  return 'badge-pill badge-success';
}

}