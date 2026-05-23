import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  libraryOccupancy: number = 85;
  projectedPeakHour: string = '13:00 - 14:30';
  demandLevel: string = 'Alta';

  ngOnInit() {
    // Simulating fetching data from Library API (HU24)
    setTimeout(() => {
      this.libraryOccupancy = Math.floor(Math.random() * 40) + 60; // 60-100%
      if (this.libraryOccupancy > 80) {
        this.demandLevel = 'Crítica (Alerta)';
        this.projectedPeakHour = '12:30 - 15:00';
      } else {
        this.demandLevel = 'Moderada';
        this.projectedPeakHour = '13:00 - 14:00';
      }
    }, 1000);
  }
}
