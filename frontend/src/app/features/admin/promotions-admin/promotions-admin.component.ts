import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PromotionService } from '../../../core/services/promotion.service';

@Component({
  selector: 'app-promotions-admin',
  templateUrl: './promotions-admin.component.html',
  styleUrls: ['./promotions-admin.component.css']
})
export class PromotionsAdminComponent implements OnInit {
  promociones: any[] = [];
  productos: any[] = [];
  categorias: string[] = [];

  nuevaPromo: any = this.promoVacia();

  editandoId: number | null = null;

  constructor(
    private promotionService: PromotionService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cargarPromociones();
    this.cargarProductos();
  }

  promoVacia() {
    return {
      nombre: '',
      descripcion: '',
      descuento: 0,
      fechaInicio: '',
      fechaFin: '',
      activa: true,
      reqMatricula: false,
      reqResidencia: false,
      tipoAplicacion: 'todo',
      categoria: null,
      productosIds: []
    };
  }

  cargarPromociones() {
    this.promotionService.getPromociones().subscribe({
      next: (data) => this.promociones = data,
      error: (err) => console.error('Error al cargar promociones', err)
    });
  }

  cargarProductos() {
    this.http.get<any[]>('http://localhost:3000/api/menu').subscribe({
      next: (data) => {
        this.productos = data;
        // Extraer categorías únicas
        this.categorias = [...new Set(data.map((p: any) => p.categoria))];
      }
    });
  }

  crearPromocion() {
    if (!this.nuevaPromo.nombre || !this.nuevaPromo.descuento) {
      alert('Nombre y descuento son obligatorios');
      return;
    }

    const payload = { ...this.nuevaPromo };
    if (payload.tipoAplicacion !== 'producto') payload.productosIds = null;
    if (payload.tipoAplicacion !== 'categoria') payload.categoria = null;

    this.promotionService.crearPromocion(payload).subscribe({
      next: () => {
        alert('Promoción creada exitosamente');
        this.nuevaPromo = this.promoVacia();
        this.cargarPromociones();
      },
      error: () => alert('Error al crear promoción')
    });
  }

  editarPromocion(promo: any) {
    this.editandoId = promo.id;
    // Asegurar que productosIds sea un array
    if (!promo.productosIds) promo.productosIds = [];
  }

  guardarEdicion(promo: any) {
    const payload = {
      nombre: promo.nombre,
      descripcion: promo.descripcion,
      descuento: promo.descuento,
      fechaInicio: promo.fechaInicio,
      fechaFin: promo.fechaFin,
      activa: promo.activa,
      reqMatricula: promo.reqMatricula,
      reqResidencia: promo.reqResidencia,
      tipoAplicacion: promo.tipoAplicacion,
      categoria: promo.tipoAplicacion === 'categoria' ? promo.categoria : null,
      productosIds: promo.tipoAplicacion === 'producto' ? promo.productosIds : null
    };

    this.promotionService.actualizarPromocion(promo.id, payload).subscribe({
      next: () => {
        this.editandoId = null;
        alert('Promoción actualizada');
      },
      error: () => alert('Error al actualizar promoción')
    });
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.cargarPromociones();
  }

  eliminarPromocion(promo: any) {
    if (!confirm(`¿Eliminar la promoción "${promo.nombre}"?`)) return;

    this.promotionService.eliminarPromocion(promo.id).subscribe({
      next: () => {
        this.promociones = this.promociones.filter(p => p.id !== promo.id);
        alert('Promoción eliminada');
      },
      error: () => alert('Error al eliminar promoción')
    });
  }

  toggleProducto(promo: any, productoId: number) {
    if (!promo.productosIds) promo.productosIds = [];
    const index = promo.productosIds.indexOf(productoId);
    if (index > -1) {
      promo.productosIds.splice(index, 1);
    } else {
      promo.productosIds.push(productoId);
    }
  }

  productoSeleccionado(promo: any, productoId: number): boolean {
    return promo.productosIds && promo.productosIds.includes(productoId);
  }

  getNombresProductos(ids: number[]): string {
    if (!ids || ids.length === 0) return '-';
    return ids.map(id => {
      const prod = this.productos.find(p => p.id === id);
      return prod ? prod.nombre : `#${id}`;
    }).join(', ');
  }
}