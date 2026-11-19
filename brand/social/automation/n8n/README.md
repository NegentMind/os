# social/automation/n8n — orquestador de contenido (local, $0)

n8n self-hosted (fair-code, ejecuciones ilimitadas): Schedule → genera contenido → publica directo (Discord/LinkedIn/X-leve) o deja borradores (IG/Threads/TikTok/Reddit).

## Instalación (Docker recomendado)
```powershell
docker volume create n8n_data
docker run -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
# http://localhost:5678
```
~0.3–1 GB RAM idle. SQLite por defecto.

## Límites reales
- OAuth exige callback HTTPS: túnel (`cloudflared`) solo para el paso de OAuth, luego apagar. `http://localhost` no vale.
- Sin dominio público: solo flujos de salida (Schedule→POST). Sin webhooks entrantes.
- Credenciales NO viajan en el JSON: se re-vinculan al importar. Fijar `type`/`typeVersion`.
- Comunidad: el agente (opencode) genera los JSON y se importan por UI/API.

## Seguridad
- No exponer el puerto en el router. `N8N_BASIC_AUTH_*` activado.
- Backup de `N8N_ENCRYPTION_KEY` + volumen. Nunca commitear secrets.
- Flujos versionados en `workflows/` (JSON sin credenciales).
