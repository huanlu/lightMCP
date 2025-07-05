#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolResult,
  ListToolsResult,
  Tool,
  TextContent,
  ImageContent,
  EmbeddedResource,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';

// LIFX API Client
class LifxApiClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.lifx.com/v1',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async listLights(selector: string = 'all') {
    const response = await this.client.get(`/lights/${selector}`);
    return response.data;
  }

  async setState(selector: string, state: any) {
    const response = await this.client.put(`/lights/${selector}/state`, state);
    return response.data;
  }

  async setStates(states: any[], defaults?: any) {
    const body: any = { states };
    if (defaults) body.defaults = defaults;
    const response = await this.client.put('/lights/states', body);
    return response.data;
  }

  async stateDelta(selector: string, delta: any) {
    const response = await this.client.post(`/lights/${selector}/state/delta`, delta);
    return response.data;
  }

  async togglePower(selector: string, duration?: number) {
    const body = duration ? { duration } : {};
    const response = await this.client.post(`/lights/${selector}/toggle`, body);
    return response.data;
  }

  async breatheEffect(selector: string, params: any) {
    const response = await this.client.post(`/lights/${selector}/effects/breathe`, params);
    return response.data;
  }

  async moveEffect(selector: string, params: any) {
    const response = await this.client.post(`/lights/${selector}/effects/move`, params);
    return response.data;
  }

  async morphEffect(selector: string, params: any) {
    const response = await this.client.post(`/lights/${selector}/effects/morph`, params);
    return response.data;
  }

  async flameEffect(selector: string, params: any) {
    const response = await this.client.post(`/lights/${selector}/effects/flame`, params);
    return response.data;
  }

  async pulseEffect(selector: string, params: any) {
    const response = await this.client.post(`/lights/${selector}/effects/pulse`, params);
    return response.data;
  }

  async cloudsEffect(selector: string, params: any) {
    const response = await this.client.post(`/lights/${selector}/effects/clouds`, params);
    return response.data;
  }

  async sunriseEffect(selector: string, params: any) {
    const response = await this.client.post(`/lights/${selector}/effects/sunrise`, params);
    return response.data;
  }

  async sunsetEffect(selector: string, params: any) {
    const response = await this.client.post(`/lights/${selector}/effects/sunset`, params);
    return response.data;
  }

  async effectsOff(selector: string, powerOff?: boolean) {
    const body = powerOff ? { power_off: powerOff } : {};
    const response = await this.client.post(`/lights/${selector}/effects/off`, body);
    return response.data;
  }

  async cycle(selector: string, states: any[], direction?: string) {
    const body: any = { states };
    if (direction) body.direction = direction;
    const response = await this.client.post(`/lights/${selector}/cycle`, body);
    return response.data;
  }

  async listScenes() {
    const response = await this.client.get('/scenes');
    return response.data;
  }

  async activateScene(sceneId: string, duration?: number) {
    const body = duration ? { duration } : {};
    const response = await this.client.put(`/scenes/scene_id:${sceneId}/activate`, body);
    return response.data;
  }

  async validateColor(color: string) {
    const response = await this.client.get('/color', { params: { color } });
    return response.data;
  }

  async clean(selector: string, duration: number, powerOn?: boolean) {
    const body: any = { duration };
    if (powerOn !== undefined) body.power_on = powerOn;
    const response = await this.client.post(`/lights/${selector}/clean`, body);
    return response.data;
  }
}

// Initialize the server
const server = new Server(
  {
    name: 'lifx-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Get LIFX token from environment
const LIFX_TOKEN = process.env.LIFX_TOKEN;
if (!LIFX_TOKEN) {
  console.error('LIFX_TOKEN environment variable is required');
  process.exit(1);
}

const lifxClient = new LifxApiClient(LIFX_TOKEN);

// Define tool schemas
const toolDefinitions: Tool[] = [
  {
    name: 'list_lights',
    description: 'List all LIFX lights or lights matching a selector',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights (e.g., "all", "id:d3b2f2d97452", "group:Living Room")',
          default: 'all',
        },
      },
    },
  },
  {
    name: 'set_state',
    description: 'Set the state of lights (power, color, brightness, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        power: {
          type: 'string',
          enum: ['on', 'off'],
          description: 'Turn lights on or off',
        },
        color: {
          type: 'string',
          description: 'Color to set (e.g., "red", "hue:120 saturation:1.0", "#ff0000")',
        },
        brightness: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Brightness level (0.0 to 1.0)',
        },
        duration: {
          type: 'number',
          description: 'Duration of the transition in seconds',
        },
        infrared: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Infrared level (0.0 to 1.0)',
        },
      },
    },
  },
  {
    name: 'toggle_power',
    description: 'Toggle the power state of lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        duration: {
          type: 'number',
          description: 'Duration of the transition in seconds',
        },
      },
    },
  },
  {
    name: 'breathe_effect',
    description: 'Apply a breathe effect to lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        color: {
          type: 'string',
          description: 'Color for the effect (required)',
        },
        from_color: {
          type: 'string',
          description: 'Starting color for the effect',
        },
        period: {
          type: 'number',
          description: 'Period of the effect in seconds',
        },
        cycles: {
          type: 'number',
          description: 'Number of cycles',
        },
        persist: {
          type: 'boolean',
          description: 'Whether the effect should persist',
        },
        power_on: {
          type: 'boolean',
          description: 'Whether to turn lights on',
        },
        peak: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Peak brightness (0.0 to 1.0)',
        },
      },
      required: ['color'],
    },
  },
  {
    name: 'pulse_effect',
    description: 'Apply a pulse effect to lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        color: {
          type: 'string',
          description: 'Color for the effect (required)',
        },
        from_color: {
          type: 'string',
          description: 'Starting color for the effect',
        },
        period: {
          type: 'number',
          description: 'Period of the effect in seconds',
        },
        cycles: {
          type: 'number',
          description: 'Number of cycles',
        },
        persist: {
          type: 'boolean',
          description: 'Whether the effect should persist',
        },
        power_on: {
          type: 'boolean',
          description: 'Whether to turn lights on',
        },
      },
      required: ['color'],
    },
  },
  {
    name: 'morph_effect',
    description: 'Apply a morph effect to lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        palette: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of colors for the palette (required)',
        },
        period: {
          type: 'number',
          description: 'Period of the effect in seconds',
        },
        power_on: {
          type: 'boolean',
          description: 'Whether to turn lights on',
        },
      },
      required: ['palette'],
    },
  },
  {
    name: 'flame_effect',
    description: 'Apply a flame effect to lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        period: {
          type: 'number',
          description: 'Period of the effect in seconds',
        },
        power_on: {
          type: 'boolean',
          description: 'Whether to turn lights on',
        },
      },
    },
  },
  {
    name: 'move_effect',
    description: 'Apply a move effect to lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        period: {
          type: 'number',
          description: 'Period of the effect in seconds',
        },
        power_on: {
          type: 'boolean',
          description: 'Whether to turn lights on',
        },
      },
    },
  },
  {
    name: 'clouds_effect',
    description: 'Apply a clouds effect to lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        period: {
          type: 'number',
          description: 'Period of the effect in seconds',
        },
        power_on: {
          type: 'boolean',
          description: 'Whether to turn lights on',
        },
      },
    },
  },
  {
    name: 'sunrise_effect',
    description: 'Apply a sunrise effect to lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        period: {
          type: 'number',
          description: 'Period of the effect in seconds',
        },
        power_on: {
          type: 'boolean',
          description: 'Whether to turn lights on',
        },
      },
    },
  },
  {
    name: 'sunset_effect',
    description: 'Apply a sunset effect to lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        period: {
          type: 'number',
          description: 'Period of the effect in seconds',
        },
        power_on: {
          type: 'boolean',
          description: 'Whether to turn lights on',
        },
      },
    },
  },
  {
    name: 'effects_off',
    description: 'Turn off all effects on lights',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        power_off: {
          type: 'boolean',
          description: 'Whether to turn lights off',
        },
      },
    },
  },
  {
    name: 'list_scenes',
    description: 'List all available LIFX scenes',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'activate_scene',
    description: 'Activate a LIFX scene',
    inputSchema: {
      type: 'object',
      properties: {
        scene_id: {
          type: 'string',
          description: 'UUID of the scene to activate',
        },
        duration: {
          type: 'number',
          description: 'Duration of the transition in seconds',
        },
      },
      required: ['scene_id'],
    },
  },
  {
    name: 'validate_color',
    description: 'Validate a color string and get its properties',
    inputSchema: {
      type: 'object',
      properties: {
        color: {
          type: 'string',
          description: 'Color string to validate',
        },
      },
      required: ['color'],
    },
  },
  {
    name: 'clean',
    description: 'Start a cleaning cycle on LIFX Clean bulbs',
    inputSchema: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Selector for lights',
          default: 'all',
        },
        duration: {
          type: 'number',
          description: 'Duration of the cleaning cycle in seconds',
        },
        power_on: {
          type: 'boolean',
          description: 'Whether to turn lights on',
        },
      },
      required: ['duration'],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: toolDefinitions };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: any;

    switch (name) {
      case 'list_lights':
        result = await lifxClient.listLights(args?.selector as string);
        break;

      case 'set_state':
        const state: any = {};
        if (args?.power) state.power = args.power;
        if (args?.color) state.color = args.color;
        if (args?.brightness !== undefined) state.brightness = args.brightness;
        if (args?.duration !== undefined) state.duration = args.duration;
        if (args?.infrared !== undefined) state.infrared = args.infrared;
        result = await lifxClient.setState((args?.selector as string) || 'all', state);
        break;

      case 'toggle_power':
        result = await lifxClient.togglePower((args?.selector as string) || 'all', args?.duration as number);
        break;

      case 'breathe_effect':
        if (!args?.color) {
          throw new Error('Color is required for breathe effect');
        }
        const breatheParams: any = { color: args.color };
        if (args?.from_color) breatheParams.from_color = args.from_color;
        if (args?.period !== undefined) breatheParams.period = args.period;
        if (args?.cycles !== undefined) breatheParams.cycles = args.cycles;
        if (args?.persist !== undefined) breatheParams.persist = args.persist;
        if (args?.power_on !== undefined) breatheParams.power_on = args.power_on;
        if (args?.peak !== undefined) breatheParams.peak = args.peak;
        result = await lifxClient.breatheEffect((args?.selector as string) || 'all', breatheParams);
        break;

      case 'pulse_effect':
        if (!args?.color) {
          throw new Error('Color is required for pulse effect');
        }
        const pulseParams: any = { color: args.color };
        if (args?.from_color) pulseParams.from_color = args.from_color;
        if (args?.period !== undefined) pulseParams.period = args.period;
        if (args?.cycles !== undefined) pulseParams.cycles = args.cycles;
        if (args?.persist !== undefined) pulseParams.persist = args.persist;
        if (args?.power_on !== undefined) pulseParams.power_on = args.power_on;
        result = await lifxClient.pulseEffect((args?.selector as string) || 'all', pulseParams);
        break;

      case 'morph_effect':
        if (!args?.palette || !Array.isArray(args.palette)) {
          throw new Error('Palette array is required for morph effect');
        }
        const morphParams: any = { palette: args.palette };
        if (args?.period !== undefined) morphParams.period = args.period;
        if (args?.power_on !== undefined) morphParams.power_on = args.power_on;
        result = await lifxClient.morphEffect((args?.selector as string) || 'all', morphParams);
        break;

      case 'flame_effect':
        const flameParams: any = {};
        if (args?.period !== undefined) flameParams.period = args.period;
        if (args?.power_on !== undefined) flameParams.power_on = args.power_on;
        result = await lifxClient.flameEffect((args?.selector as string) || 'all', flameParams);
        break;

      case 'move_effect':
        const moveParams: any = {};
        if (args?.period !== undefined) moveParams.period = args.period;
        if (args?.power_on !== undefined) moveParams.power_on = args.power_on;
        result = await lifxClient.moveEffect((args?.selector as string) || 'all', moveParams);
        break;

      case 'clouds_effect':
        const cloudsParams: any = {};
        if (args?.period !== undefined) cloudsParams.period = args.period;
        if (args?.power_on !== undefined) cloudsParams.power_on = args.power_on;
        result = await lifxClient.cloudsEffect((args?.selector as string) || 'all', cloudsParams);
        break;

      case 'sunrise_effect':
        const sunriseParams: any = {};
        if (args?.period !== undefined) sunriseParams.period = args.period;
        if (args?.power_on !== undefined) sunriseParams.power_on = args.power_on;
        result = await lifxClient.sunriseEffect((args?.selector as string) || 'all', sunriseParams);
        break;

      case 'sunset_effect':
        const sunsetParams: any = {};
        if (args?.period !== undefined) sunsetParams.period = args.period;
        if (args?.power_on !== undefined) sunsetParams.power_on = args.power_on;
        result = await lifxClient.sunsetEffect((args?.selector as string) || 'all', sunsetParams);
        break;

      case 'effects_off':
        result = await lifxClient.effectsOff((args?.selector as string) || 'all', args?.power_off as boolean);
        break;

      case 'list_scenes':
        result = await lifxClient.listScenes();
        break;

      case 'activate_scene':
        if (!args?.scene_id) {
          throw new Error('Scene ID is required');
        }
        result = await lifxClient.activateScene(args.scene_id as string, args?.duration as number);
        break;

      case 'validate_color':
        if (!args?.color) {
          throw new Error('Color is required');
        }
        result = await lifxClient.validateColor(args.color as string);
        break;

      case 'clean':
        if (!args?.duration) {
          throw new Error('Duration is required for clean cycle');
        }
        result = await lifxClient.clean((args?.selector as string) || 'all', args.duration as number, args?.power_on as boolean);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('LIFX MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
