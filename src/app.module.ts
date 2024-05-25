import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { Redis } from 'ioredis';

@Module({
  imports: [ChatModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'REDIS',
      useValue: new Redis({
        host: 'localhost',
        port: 6379,
      }),
    },
  ],
})
export class AppModule {}
