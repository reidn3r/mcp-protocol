import { Body, Controller, Post } from '@nestjs/common';
import { UserPromptDto } from 'src/dtos/mcp.dto';
import { McpService } from './mcp.service';

@Controller()
export class McpController {
  constructor(private readonly mcpService: McpService) {}
  @Post('/mcp/tasks')
  runUserQuery(@Body() data: UserPromptDto) {
    return this.mcpService.run(data);
  }
}
