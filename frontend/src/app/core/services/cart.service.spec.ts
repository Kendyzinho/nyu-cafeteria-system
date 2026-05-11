import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar un producto al carrito', (done) => {
    const mockProduct = { id: 1, name: 'Café', price: 100, stock: 10 };
    
    service.addItem(mockProduct);
    
    service.cartItems$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product.name).toBe('Café');
      expect(items[0].quantity).toBe(1);
      done();
    });
  });

  it('debería incrementar la cantidad si el producto ya existe y hay stock', (done) => {
    const mockProduct = { id: 2, name: 'Sandwich', price: 200, stock: 5 };
    
    service.addItem(mockProduct);
    service.addItem(mockProduct); // Agrega por segunda vez
    
    service.cartItems$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
      done();
    });
  });

  it('no debería agregar un producto sin stock', (done) => {
    const outOfStockProduct = { id: 3, name: 'Galleta', price: 50, stock: 0 };
    
    service.addItem(outOfStockProduct);
    
    service.cartItems$.subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('debería calcular correctamente el monto total', () => {
    const productA = { id: 1, name: 'Café', price: 100, stock: 10 }; // Usará price
    const productB = { id: 2, name: 'Torta', studentPrice: 150, price: 200, stock: 5 }; // Usará studentPrice
    
    service.addItem(productA);
    service.addItem(productB);
    service.addItem(productB); // 2 tortas
    
    // Total esperado: 100 + (150 * 2) = 400
    expect(service.getTotalAmount()).toBe(400);
  });

  it('debería limpiar el carrito', (done) => {
    const mockProduct = { id: 1, name: 'Café', price: 100, stock: 10 };
    service.addItem(mockProduct);
    
    service.clearCart();
    
    service.cartItems$.subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });
});
