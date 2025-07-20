import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { serverConfig } from 'src/config/server.config';
import { IntentResponseDto, UserPromptDto } from 'src/dtos/mcp.dto';
import {
  CreateTaskResponseDto,
  GetToolsResponseDto,
  GetToolsResultDto,
} from 'src/dtos/tools.dto';
import { GeminiProvider } from 'src/llm/gemini-wrapper';
import { PromptBuilder } from 'src/prompr/prompt.service';

@Injectable()
export class McpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prompt: PromptBuilder,
    private readonly gemini: GeminiProvider,
  ) {}
  async run(data: UserPromptDto) {
    const tools = await this.getTools();
    const intentPrompt = this.prompt.buildIntentPrompt(data.prompt, tools);
    const llmIntentResponse = await this.gemini.generate(intentPrompt);
    const actionParams = this.parseIntentResponse(llmIntentResponse);

    return this.runAction(actionParams);
  }

  async runAction(data: IntentResponseDto) {
    const action = this.actionMapper(data.action);

    if (!action) {
      throw new Error(`Ação desconhecida ou não suportada: ${data.action}`);
    }

    const requestBody = {
      jsonrpc: '2.0',
      method: 'tools/call',
      id: Date.now(),
      params: {
        name: action,
        arguments: data.parameters,
      },
    };

    const response = await firstValueFrom(
      this.httpService.post<CreateTaskResponseDto>(
        serverConfig.mcpServerParams.url,
        requestBody,
        {
          headers: serverConfig.mcpServerParams.requestHeaders,
          responseType: 'json',
        },
      ),
    );
    return response.data;
  }

  async getTools(): Promise<GetToolsResultDto> {
    const response = await firstValueFrom(
      this.httpService.post<GetToolsResponseDto>(
        serverConfig.mcpServerParams.url,
        serverConfig.mcpServerParams.requestParams,
        {
          headers: serverConfig.mcpServerParams.requestHeaders,
        },
      ),
    );

    return response.data.result;
  }

  private parseIntentResponse(llmResponse: string): IntentResponseDto {
    try {
      // Tenta extrair o JSON da resposta, mesmo que venha com markdown ou texto adicional
      const jsonString = this.extractJsonString(llmResponse);

      if (!jsonString) {
        console.warn('No JSON found in LLM response:', llmResponse);
        return { action: 'unknown', parameters: {} };
      }

      const parsed = JSON.parse(jsonString);

      // Verifica se tem a estrutura mínima esperada
      if (parsed.action && typeof parsed.action === 'string') {
        return {
          action: parsed.action,
          parameters: parsed.parameters || {}
        };
      }

      return { action: 'unknown', parameters: {} };
    } catch (error) {
      console.error('Error parsing intent response:', error);
      return { action: 'unknown', parameters: {} };
    }
  }

  private extractJsonString(text: string): string | null {
    const jsonMatch = text.match(/\{(?:[^{}]|(?:\{[^{}]*\}))*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }

    if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
      return text.trim();
    }

    return null;
  }

  private actionMapper(action: string): string {
    const mapper: Record<string, string> = {
      create_task: 'create-new-task',
      list_tasks: 'list-all-tasks',
    };
    return mapper[action];
  }
}
