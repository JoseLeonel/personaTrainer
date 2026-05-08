import { Controller, Get, Put, Param, Post, UseInterceptors, UploadedFile, Body, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClientsService } from '../../application/clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAllClients() {
    return this.clientsService.findAllClients();
  }

  @Get('trainer/:trainerId')
  async getTrainerClients(
    @Param('trainerId') trainerId: string,
    @Query('search') search?: string,
    @Query('objective') objective?: string,
    @Query('chargeType') chargeType?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.clientsService.getTrainerClients(parseInt(trainerId, 10), { search, objective, chargeType, limit, offset });
  }

  @Get('pending')
  async getPendingClients() {
    return this.clientsService.getPendingClients();
  }

  @Put(':id/approve')
  async approveClient(@Param('id') id: string) {
    return this.clientsService.approveClient(parseInt(id, 10));
  }

  @Get(':id')
  async getClient(@Param('id') id: string) {
    return this.clientsService.getClient(parseInt(id, 10));
  }

  @Post(':id/photos')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async uploadPhoto(
    @Param('id') id: string,
    @Body('photoType') photoType: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = `/uploads/${file.filename}`;
    return this.clientsService.uploadProgressPhoto(parseInt(id, 10), photoType, filePath);
  }

  @Get(':id/photos')
  async getPhotos(@Param('id') id: string) {
    return this.clientsService.getProgressPhotos(parseInt(id, 10));
  }
}
