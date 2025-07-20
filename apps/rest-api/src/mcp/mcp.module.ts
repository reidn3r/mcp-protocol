import { Module } from '@nestjs/common';
import { McpService } from './mcp.service';
import { HttpModule } from '@nestjs/axios';
import { GeminiProvider } from 'src/llm/gemini-wrapper';
import { PromptBuilder } from 'src/prompr/prompt.service';
import { serverConfig } from 'src/config/server.config';

@Module({
  imports: [
    HttpModule,
    HttpModule.register({
      baseURL: serverConfig.mcpServerParams.url,
      timeout: 5000,
      headers: {
        Accept: 'application/json, text/event-stream',
        'Content-Type': 'application/json',
      },
    }),
  ],
  providers: [McpService, GeminiProvider, PromptBuilder],
  exports: [McpService],
})
export class McpModule {}
