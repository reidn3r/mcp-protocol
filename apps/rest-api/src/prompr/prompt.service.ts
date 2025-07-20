import { Injectable } from '@nestjs/common';
import { GetToolsResultDto } from 'src/dtos/tools.dto';

@Injectable()
export class PromptBuilder {
  buildIntentPrompt(message: string, tools: GetToolsResultDto): string {
    return `
    Você é um assistente que analisa mensagens de usuários e determina qual ação executar.
    As possíveis tarefas são: Criar e Buscar a lista de tarefas.
      Ferramentas Disponíveis:
      ${JSON.stringify(tools)}

      Para criar é necessário informar os parâmetros:
        - name: Nome da tarefa;
        - description: Descrição da Tarefa;
        - author:Autor da Tarefa.

      Para listar não é necessário parâmetros.

      Mensagem do usuário: ${message}
      Responda APENAS com um JSON no seguinte formato:
      {
        "action": "create_task" | "list_tasks" | "get_task",
        "parameters": {
          // parâmetros necessários baseados na ação
        }
      }

      Se não conseguir determinar a ação, use:
      {
        "action": "unknown",
        "parameters": {}
      }`;
  }
}
