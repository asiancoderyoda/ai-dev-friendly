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
Run presetup
npx ts-node .\apps\workers\index.ts

Terminal 1:
npx ts-node packages/queue/src/worker.ts
Terminal 2:
npx ts-node packages/queue/src/enqueue.ts

Start the application and trigger the feature
npx ts-node .\apps\workers\run-codegen.ts

Embeddings
```
{
    "summary": "\n            File: App.jsx\n            Summary: This file has 7898 characters.\n\n            Purpose: \n            import { useCallback, useEffect, useState } from \"react\";\r\nimport \"./App.css\";\r\n\r\nconst GEO_URL = \"https://geocoding-api.open-meteo.com/v1/search\";\r\nconst WEATHER_URL = \"https://api.open-meteo.com/v1/forecast\";\r\n        ",
    "name": "App",
    "filePath": "D:/Projects/avigyans-ai-world/ai-dev-friendly/repos/weather-app/src/App.jsx",
    "imports": [
        "react",
        "./App.css"
    ],
    "exports": [
        "default"
    ],
    "repoName": "weather-app"
}
```
![alt text](image-1.png)

Psql data
```
[
    {
        "idx": 0,
        "id": 5,
        "name": "wmoLabel",
        "repoName": "weather-app",
        "type": "function",
        "filePath": "D:/Projects/avigyans-ai-world/ai-dev-friendly/repos/weather-app/src/App.jsx",
        "summary": "\n            File: App.jsx\n            Summary: This file has 7898 characters.\n\n            Purpose: \n            import { useCallback, useEffect, useState } from \"react\";\r\nimport \"./App.css\";\r\n\r\nconst GEO_URL = \"https://geocoding-api.open-meteo.com/v1/search\";\r\nconst WEATHER_URL = \"https://api.open-meteo.com/v1/forecast\";\r\n        ",
        "imports": "react,./App.css",
        "exports": "default",
        "methods": null,
        "vectorId": "be041ae7-d829-4371-beda-1cc90a8a566c"
    }
]
```
![alt text](image.png)

TICKET
Title:
Change theme to "dark"

Description:
The current theme of the application is light, which can cause eye strain for users who prefer a darker interface. Implementing a dark theme will enhance user experience and provide an alternative visual option.

Acceptance Criteria:
1. A toggle switch is added to the user interface that allows users to switch between light and dark themes.
2. The dark theme should have a consistent color scheme that is easy on the eyes, with appropriate contrast for readability.
