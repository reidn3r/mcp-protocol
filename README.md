# Sistema LLM com Model Context Protocol

Sistema de processamento de linguagem natural que integra LLM (GEMINI 2.5 FLASH) com recursos externos via Model Context Protocol (MCP) para criação de Tarefas.

## Arquitetura

```mermaid
sequenceDiagram
    participant HOST as HOST<br/>(API Client/UX Interface)
    participant API as API Gateway<br/>(NestJS RESTful Service)
    participant LLM as LLM Processing Engine<br/>(GEMINI 2.5 FLASH)<br/>(Natural Language Understanding)<br/>(Prompt Engineering Layer)
    participant CLIENT as MCP Server<br/>(Model Context Protocol)<br/>(Resource Management)
    participant SERVER as Resource Layer<br/>(Tools, Documents,<br/>External APIs)

    HOST->>+API: HTTP POST /api/query<br/>{user_query, session_context}
    
    API->>+CLIENT: JSON-RPC 2.0 Request<br/>Method: list_resources<br/>Params: {query_context}
    CLIENT->>+SERVER: MCP Protocol Call<br/>discover_available_resources()
    SERVER-->>-CLIENT: MCP Response<br/>{resources[], capabilities[], schemas[]}
    CLIENT-->>-API: JSON-RPC 2.0 Response<br/>{available_tools, resource_metadata}
    
    API->>+LLM: Inference Request<br/>POST /v1/models/gemini-2.5-flash:generateContent<br/>{prompt, context, available_tools}
    Note over LLM: Intent Classification<br/>Resource Selection<br/>Parameter Extraction<br/>Action Planning
    LLM-->>-API: Generated Response<br/>{selected_tool, parameters, reasoning}
    
    API->>+CLIENT: JSON-RPC 2.0 Execute<br/>Method: invoke_tool<br/>Params: {tool_id, arguments}
    CLIENT->>+SERVER: MCP Tool Invocation<br/>execute_operation(tool_id, params)
    SERVER-->>-CLIENT: Operation Result<br/>{status, data, metadata}
    CLIENT-->>-API: JSON-RPC 2.0 Response<br/>{execution_result, performance_metrics}
    
    API-->>-HOST: HTTP 200 OK<br/>{processed_response, execution_trace}
```

## Componentes

- **API REST**: Serviço HTTP em NestJS
- **LLM Engine**: GEMINI 2.5 FLASH para processamento de linguagem natural
- **MCP Server**: Gerenciamento de recursos via Model Context Protocol
- **Resource Layer**: Tools, documentos e APIs externas

## Stack Técnico

- **Backend**: NestJS (TypeScript)
- **LLM**: Google GEMINI 2.5 FLASH
- **Protocol**: Model Context Protocol (MCP)
- **Comunicação**: JSON-RPC 2.0, REST API
- **Client**: API Client

## Acesso ao LLM (porta: 3000)
```bash
POST /mcp/tasks
Content-Type: application/json

{
  "query": "Sua consulta aqui",
}
```

## Configuração

Configure as variáveis de ambiente:

```env
GEMINI_API_KEY=your_api_key
```