import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  showSuccessMessage = false;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true') {
        this.showSuccessMessage = true;
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => this.showSuccessMessage = false, 5000);
      }
    });

    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.orderService.getHistory().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading history', err);
        this.loading = false;
      }
    });
  }
}
