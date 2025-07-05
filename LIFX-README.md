# LIFX MCP Server

A Model Context Protocol (MCP) server for controlling LIFX smart lights. This server provides comprehensive control over LIFX lights including basic state management, color control, and advanced effects.

## Features

- **Light Control**: List, turn on/off, set brightness, and change colors
- **Effects**: Breathe, pulse, morph, flame, move, clouds, sunrise, sunset effects
- **Scenes**: List and activate saved LIFX scenes
- **Utility**: Color validation and cleaning cycles for LIFX Clean bulbs
- **Selectors**: Target specific lights or groups using LIFX selectors

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the server:
   ```bash
   npm run build
   ```

## Setup

### Get LIFX API Token

1. Go to [LIFX Cloud](https://cloud.lifx.com/settings)
2. Generate a personal access token
3. Copy the token for use in configuration

### Environment Variables

Set your LIFX API token as an environment variable:

```bash
export LIFX_TOKEN="your_lifx_token_here"
```

## Usage

### With Claude Desktop

Add the server to your Claude Desktop configuration in `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "lifx": {
      "command": "node",
      "args": ["/absolute/path/to/lifx-mcp-server/dist/index.js"],
      "env": {
        "LIFX_TOKEN": "your_lifx_token_here"
      }
    }
  }
}
```

### Standalone Testing

You can test the server directly:

```bash
# Set your token
export LIFX_TOKEN="your_lifx_token_here"

# Run the server
npm start
```

## Available Tools

### Basic Light Control

- **list_lights**: List all lights or lights matching a selector
- **set_state**: Set power, color, brightness, and other light properties
- **toggle_power**: Toggle lights on/off

### Effects

- **breathe_effect**: Smooth breathing effect
- **pulse_effect**: Pulsing effect
- **morph_effect**: Cycle through multiple colors
- **flame_effect**: Flickering flame effect
- **move_effect**: Moving light effect
- **clouds_effect**: Cloudy sky effect
- **sunrise_effect**: Sunrise simulation
- **sunset_effect**: Sunset simulation
- **effects_off**: Turn off all effects

### Scenes

- **list_scenes**: List all saved scenes
- **activate_scene**: Activate a specific scene

### Utilities

- **validate_color**: Validate color strings and get color properties
- **clean**: Start cleaning cycle (for LIFX Clean bulbs)

## LIFX Selectors

You can target specific lights using LIFX selectors:

- `all` - All lights
- `id:d3b2f2d97452` - Specific light by ID
- `group:Living Room` - All lights in a group
- `location:Home` - All lights in a location
- `label:Bedroom Lamp` - Light with specific label

## Color Formats

LIFX supports various color formats:

- Named colors: `red`, `blue`, `green`, `purple`, etc.
- Hex colors: `#ff0000`, `#00ff00`, `#0000ff`
- HSB: `hue:120 saturation:1.0 brightness:0.5`
- RGB: `rgb:255,0,0`
- Kelvin: `kelvin:3500 brightness:0.8`

## Example Usage with Claude

Once configured, you can ask Claude to:

- "Turn on all the lights"
- "Set the living room lights to blue"
- "Start a sunset effect on the bedroom lights"
- "List all my LIFX scenes"
- "Turn off all light effects"
- "Set the lights to 50% brightness"

## Error Handling

The server includes comprehensive error handling:

- Invalid LIFX token
- Network connectivity issues
- Invalid color formats
- Missing required parameters
- LIFX API rate limits

## Development

To run in development mode:

```bash
npm run dev
```

## License

MIT License
