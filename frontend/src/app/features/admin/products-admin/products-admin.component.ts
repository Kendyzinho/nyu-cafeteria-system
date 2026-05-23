import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.css']
})
export class ProductsAdminComponent implements OnInit {
  products: any[] = [];
  showFormModal: boolean = false;
  productForm: FormGroup;
  isEditing: boolean = false;
  selectedProductId: number | null = null;

  constructor(
    private menuService: MenuService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      precio_estudiante: [0, [Validators.required, Validators.min(0)]],
      category: ['almuerzos', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      isDailyMenu: [false]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.menuService.getAll().subscribe({
      next: (data: any[]) => {
        this.products = data;
      },
      error: (err: any) => console.error('Error fetching products', err)
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.selectedProductId = null;
    this.productForm.reset({
      price: 0,
      precio_estudiante: 0,
      category: 'almuerzos',
      stock: 0,
      isDailyMenu: false
    });
    this.showFormModal = true;
  }

  openEditModal(product: any) {
    this.isEditing = true;
    this.selectedProductId = product.id;
    this.productForm.patchValue({
      name: product.nombre,
      description: product.description,
      price: product.precio,
      precio_estudiante: product.precio_estudiante,
      category: product.category,
      stock: product.stock_actual,
      isDailyMenu: product.isDailyMenu || false
    });
    this.showFormModal = true;
  }

  closeModal() {
    this.showFormModal = false;
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValues = this.productForm.value;

    const backendPayload = {
      nombre: formValues.name,
      descripcion: formValues.description,
      precio: formValues.price,
      categoria: formValues.category,
      stockActual: formValues.stock,
      disponible: formValues.stock > 0,
      fechaDisponible: new Date().toISOString()
    };

    if (this.isEditing && this.selectedProductId) {
      this.menuService.update(this.selectedProductId, backendPayload).subscribe({
        next: () => {
          alert('Producto actualizado exitosamente.');
          this.loadProducts();
          this.closeModal();
        },
        error: (err: any) => {
          console.error('Error updating', err);
          alert('Error al actualizar el producto. Revisa los datos.');
        }
      });
    } else {
      this.menuService.create(backendPayload).subscribe({
        next: () => {
          alert('Producto creado exitosamente.');
          this.loadProducts();
          this.closeModal();
        },
        error: (err: any) => {
          console.error('Error creating', err);
          alert('Error al crear el producto. Revisa los datos.');
        }
      });
    }
  }

  confirmDelete(product: any) {
    if (confirm(`¿Estás seguro que deseas eliminar "${product.nombre}"?`)) {
      this.menuService.delete(product.id).subscribe({
        next: () => {
          alert('Producto eliminado.');
          this.loadProducts();
        },
        error: (err: any) => {
          console.error('Error deleting', err);
          alert('Error al eliminar el producto.');
        }
      });
    }
  }
}
