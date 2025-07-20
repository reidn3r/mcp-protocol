import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { McpModule } from './mcp/mcp.module';
import { APP_PIPE } from '@nestjs/core';
import { McpController } from './mcp/mcp.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  imports: [McpModule, ConfigModule.forRoot({
    isGlobal: true,  
    envFilePath: '.env'
  })],
  controllers: [AppController, McpController],
})
export class AppModule {}
