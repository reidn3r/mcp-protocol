export interface InputSchemaDto {
  $schema: string;
}

export interface ToolDto {
  name: string;
  description: string;
  inputSchema: InputSchemaDto;
}

export interface GetToolsResultDto {
  tools: ToolDto[];
}

export interface GetToolsResponseDto {
  jsonrpc: string;
  id: number;
  result: GetToolsResultDto;
}

export interface TaskContentDto {
  type: string;
  text: string;
}

export interface TaskResultDto {
  content: TaskContentDto[];
}

export interface CreateTaskResponseDto {
  jsonrpc: string;
  id: number;
  result: TaskResultDto;
}
