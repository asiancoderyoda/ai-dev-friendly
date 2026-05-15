- Semantic Embedding
- Dependency Traversal
- Postgres integration
- Vector DB integration
- Hybrid Retrieval
- Incremental Indexing
- git diff awareness
- Patch Generator
- Scoped file modification
- Planning Agent (TODO - with debate planner) for ticket classification, impact module/file prediction
- Coding Agent
- Coverage Agent (TODO)
- Reviewer Agent
- Langgraph Orchastration
- Langsmith Tracing (TODO)
- Feedback Loop (TODO)

RUN THE SYSTEM
Terminal 1:
npx ts-node packages/queue/src/worker.ts
Terminal 2:
npx ts-node packages/queue/src/enqueue.ts