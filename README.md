## RMD ENGINEERING COLLEGE


## Predicting Hospital Readmissions <-> Team SuperNexis - 5

### Chatbot and API keys

- The chatbot widget appears on the Home and Dashboard pages. Unauthenticated users are prompted to sign in.
- Authenticated users can ask domain questions handled by the backend `/chat` endpoint.
- Do not expose provider or LLM API keys in the frontend. Keep keys on the server in environment variables and consume them only in backend code.
  - For FastAPI on Azure App Service, configure Application settings for environment variables.
  - Access keys via `os.getenv('YOUR_API_KEY_NAME')` inside `backend/app.py`.
- The current `/chat` route is rules‑based. To enable LLM responses later, add server-side calls using the stored key and return the response to the client.