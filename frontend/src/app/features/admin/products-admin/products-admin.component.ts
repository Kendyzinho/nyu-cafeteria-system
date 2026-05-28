import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.css']
})
export class ProductsAdminComponent implements OnInit {
  products: Product[] = [];
  categorias: string[] = [];
  showFormModal: boolean = false;
  productForm: FormGroup;
  isEditing: boolean = false;
  selectedProductId: number | null = null;
  searchTerm: string = '';

  constructor(
    private menuService: MenuService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoria: ['Almuerzo', Validators.required],
      stock_actual: [0, [Validators.required, Validators.min(0)]],
      imagen_url: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.menuService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

  loadProducts() {
    this.menuService.getAll().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err: any) => console.error('Error fetching products', err)
    });
  }

  get filteredProducts(): Product[] {
    if (!this.searchTerm.trim()) {
      return this.products;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.products.filter(product => 
      product.nombre.toLowerCase().includes(term) || 
      (product.descripcion && product.descripcion.toLowerCase().includes(term)) ||
      product.categoria.toLowerCase().includes(term)
    );
  }

  openCreateModal() {
    this.isEditing = false;
    this.selectedProductId = null;
    this.productForm.reset({
      precio: 0,
      categoria: 'Almuerzo',
      stock_actual: 0,
      imagen_url: ''
    });
    this.showFormModal = true;
  }

  openEditModal(product: Product) {
    this.isEditing = true;
    this.selectedProductId = product.id;
    this.productForm.patchValue({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      stock_actual: product.stock_actual,
      imagen_url: product.imagen_url || ''
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
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      precio: formValues.precio,
      categoria: formValues.categoria,
      stock_actual: formValues.stock_actual,
      disponible: formValues.stock_actual > 0,
      imagen_url: formValues.imagen_url || null
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

  confirmDelete(product: Product) {
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
