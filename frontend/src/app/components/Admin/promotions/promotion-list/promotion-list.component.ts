import { Component, OnInit } from '@angular/core';
import { Promotion } from 'src/app/models/promotion';
import { PromotionsService } from 'src/app/services/promotions.service';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css']
})
export class PromotionListComponent implements OnInit {

  promotions: Promotion[] = [];
  errorMessage = '';

  constructor(private promotionsService: PromotionsService) {}

  ngOnInit(): void {
    this.cargarPromociones();
  }

  cargarPromociones(): void {
    this.promotionsService.getPromotions().subscribe({
      next: (data) => {
        this.promotions = data;
      },
      error: () => {
        this.errorMessage = 'Error al cargar promociones';
      }
    });
  }
}