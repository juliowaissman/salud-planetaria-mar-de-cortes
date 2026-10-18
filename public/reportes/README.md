# Reportes PDF

Un reporte por cada límite planetario y tema emergente, más el método de priorización.
El sitio los publica y cada página tiene su botón «Descargar en PDF».

Se generan con los guiones de `refs/herramientas/` (carpeta local, fuera del repositorio)
a partir de los mismos datos que el sitio (`src/data/`), así que dicen lo mismo que la
página correspondiente:

| Archivo | Contenido | Guion |
|---|---|---|
| `<id-del-límite>.pdf` (9) | Diagnóstico regional de cada límite | `gen_bnd.py all` |
| `<id-del-tema>.pdf` (3) | Diagnóstico de cada tema emergente | `gen_spot.py all` |
| `metodo-priorizacion.pdf` | Método de priorización regional | `gen_metodo.py` |

Las referencias siguen el formato APA 7 en español, igual que en el sitio.
Los reportes de trabajo anteriores («Diagnóstico y propuesta», con la verificación de
cada página) están en el historial de Git, antes del commit que creó esta carpeta.
