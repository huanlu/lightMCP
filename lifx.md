# LIFX HTTP API Endpoints

Below is a list of LIFX API endpoints, including how to call them, their paths, HTTP methods, and parameters (with required/optional status).

| Name | Method | Path | Parameters (required/optional) |
|------|--------|------|-------------------------------|
| List Lights | GET | /v1/lights/{selector} | selector (optional, default: all) |
| Set State | PUT | /v1/lights/{selector}/state | power (optional), color (optional), brightness (optional), duration (optional), infrared (optional), fast (optional) |
| Set States | PUT | /v1/lights/states | states (required), defaults (optional), fast (optional) |
| State Delta | POST | /v1/lights/{selector}/state/delta | power (optional), brightness (optional), duration (optional) |
| Toggle Power | POST | /v1/lights/{selector}/toggle | duration (optional) |
| Breathe Effect | POST | /v1/lights/{selector}/effects/breathe | color (required), from_color (optional), period (optional), cycles (optional), persist (optional), power_on (optional), peak (optional), fast (optional) |
| Move Effect | POST | /v1/lights/{selector}/effects/move | period (optional), power_on (optional), fast (optional) |
| Morph Effect | POST | /v1/lights/{selector}/effects/morph | palette (required), period (optional), power_on (optional), fast (optional) |
| Flame Effect | POST | /v1/lights/{selector}/effects/flame | period (optional), power_on (optional), fast (optional) |
| Pulse Effect | POST | /v1/lights/{selector}/effects/pulse | color (required), from_color (optional), period (optional), cycles (optional), persist (optional), power_on (optional), fast (optional) |
| Clouds Effect | POST | /v1/lights/{selector}/effects/clouds | period (optional), power_on (optional), fast (optional) |
| Sunrise Effect | POST | /v1/lights/{selector}/effects/sunrise | period (optional), power_on (optional), fast (optional) |
| Sunset Effect | POST | /v1/lights/{selector}/effects/sunset | period (optional), power_on (optional), fast (optional) |
| Effects Off | POST | /v1/lights/{selector}/effects/off | power_off (optional) |
| Cycle | POST | /v1/lights/{selector}/cycle | states (required), direction (optional), fast (optional) |
| List Scenes | GET | /v1/scenes | (none) |
| Activate Scene | PUT | /v1/scenes/scene_id:{scene_uuid}/activate | duration (optional), fast (optional) |
| Validate Color | GET | /v1/color | color (required) |
| Clean | POST | /v1/lights/{selector}/clean | duration (required), power_on (optional), fast (optional) |

**Notes:**
- All endpoints require authentication via an Authorization header with a Bearer token.
- For more details and parameter types, see the [LIFX API Reference](https://api.developer.lifx.com/reference).
