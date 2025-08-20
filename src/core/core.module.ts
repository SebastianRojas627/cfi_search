// src/core/core.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpServiceWrapper } from './services/http.service';

@Module({
  imports: [HttpModule],
  providers: [HttpServiceWrapper],
  exports: [HttpServiceWrapper],
})
export class CoreModule {}
