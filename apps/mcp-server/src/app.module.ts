import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { McpModule } from '@rekog/mcp-nest';
import { TasksTool } from './server/tools/task-toolts';

@Module({
  imports: [
    PrismaModule,
    McpModule.forRoot({
      name: 'mcp-server',
      version: '1.0.0',
    }),
  ],
  controllers: [AppController],
  providers: [TasksTool],
})
export class AppModule {}
