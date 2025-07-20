import { IsNotEmpty, IsString } from 'class-validator';

export type ActionType = 'create_task' | 'list_tasks' | 'get_task' | 'unknown';

export interface IntentResponseDto {
  action: ActionType;
  parameters: Record<string, any>;
}

export class UserPromptDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
