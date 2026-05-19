import { Component, OnInit } from '@angular/core';
import { StockProducto, StockService } from '../../../core/services/stock.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-admin',
  templateUrl: './stock-admin.component.html',
  styleUrls: ['./stock-admin.component.css']
})
export class StockAdminComponent implements OnInit {
  productos: StockProducto[] = [];
  cargando = false;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.cargando = true;
    this.stockService.getProductos().subscribe({
      next: (data) => {
        this.productos = data.map(p => ({
          ...p,
          cantidad: Number(p.cantidad),
          umbralMinimo: Number(p.umbralMinimo),
        }));
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el listado de stock',
          icon: 'error',
          confirmButtonColor: '#4E342E'
        });
      }
    });
  }

  actualizarStock(producto: StockProducto): void {
    if (producto.cantidad < 0) {
      Swal.fire({
        title: 'Atención',
        text: 'La cantidad no puede ser negativa',
        icon: 'warning',
        confirmButtonColor: '#4E342E'
      });
      producto.cantidad = 0;
      return;
    }
    if (producto.umbralMinimo < 0) {
      Swal.fire({
        title: 'Atención',
        text: 'El umbral mínimo no puede ser negativo',
        icon: 'warning',
        confirmButtonColor: '#4E342E'
      });
      producto.umbralMinimo = 0;
      return;
    }

    this.stockService.actualizarStock(producto).subscribe({
      next: () => {
        if (producto.cantidad === 0) {
          Swal.fire({
            title: 'Bloqueado',
            text: `${producto.nombre} quedó bloqueado por falta de stock`,
            icon: 'info',
            confirmButtonColor: '#4E342E'
          });
        } else {
          Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: `Stock de ${producto.nombre} actualizado correctamente`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
        }
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: `No se pudo actualizar el stock de ${producto.nombre}`,
          icon: 'error',
          confirmButtonColor: '#4E342E'
        });
        this.cargarProductos();
      }
    });
  }

  estadoBadge(producto: StockProducto): { texto: string; clase: string } {
    if (producto.cantidad === 0) {
      return { texto: 'Agotado / Bloqueado', clase: 'badge-danger-custom' };
    }
    if (producto.cantidad <= producto.umbralMinimo) {
      return { texto: 'Stock bajo', clase: 'badge-warning-custom' };
    }
    return { texto: 'Disponible', clase: 'badge-success-custom' };
  }
}