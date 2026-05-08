import { Controller, Get, Param } from '@nestjs/common';
import { TrainerDashboardService } from './trainer-dashboard.service';

@Controller('trainer-dashboard')
export class TrainerDashboardController {
  constructor(private readonly dashboardService: TrainerDashboardService) {}

  @Get(':trainerId/metrics')
  getMetrics(@Param('trainerId') trainerId: string) {
    return this.dashboardService.getMetrics(parseInt(trainerId, 10));
  }
}
