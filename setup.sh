#!/bin/bash

# LIFX MCP Server Helper Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}LIFX MCP Server Helper${NC}"
echo "=========================="

# Check if LIFX_TOKEN is set
if [ -z "$LIFX_TOKEN" ]; then
    echo -e "${RED}❌ LIFX_TOKEN environment variable not set${NC}"
    echo "Please set your LIFX token:"
    echo "  export LIFX_TOKEN=\"your_token_here\""
    exit 1
fi

echo -e "${GREEN}✅ LIFX_TOKEN is set${NC}"

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Function to build the project
build_project() {
    echo -e "${YELLOW}Building project...${NC}"
    npm run build
    echo -e "${GREEN}✅ Project built successfully${NC}"
}

# Function to test the server
test_server() {
    echo -e "${YELLOW}Testing server...${NC}"
    node test.js
}

# Function to setup Claude Desktop config
setup_claude() {
    local config_path="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    local current_path=$(pwd)
    
    echo -e "${YELLOW}Setting up Claude Desktop configuration...${NC}"
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$config_path")"
    
    # Create or update config
    if [ -f "$config_path" ]; then
        echo -e "${YELLOW}Backing up existing config...${NC}"
        cp "$config_path" "$config_path.backup"
    fi
    
    # Update the template with the current path
    sed "s|/Users/huanlu/Developer/lightMCP|$current_path|g" claude_desktop_config.json > temp_config.json
    sed "s|your_lifx_token_here|$LIFX_TOKEN|g" temp_config.json > "$config_path"
    rm temp_config.json
    
    echo -e "${GREEN}✅ Claude Desktop configuration updated${NC}"
    echo "Config location: $config_path"
    echo -e "${YELLOW}Please restart Claude Desktop to apply changes${NC}"
}

# Main menu
case "${1:-}" in
    "install")
        install_deps
        ;;
    "build")
        build_project
        ;;
    "test")
        test_server
        ;;
    "setup")
        install_deps
        build_project
        setup_claude
        ;;
    "claude")
        setup_claude
        ;;
    *)
        echo "Usage: $0 {install|build|test|setup|claude}"
        echo ""
        echo "Commands:"
        echo "  install  - Install npm dependencies"
        echo "  build    - Build the TypeScript project"
        echo "  test     - Test the server configuration"
        echo "  setup    - Full setup (install, build, configure Claude)"
        echo "  claude   - Configure Claude Desktop only"
        echo ""
        echo "Make sure to set LIFX_TOKEN environment variable first:"
        echo "  export LIFX_TOKEN=\"your_token_here\""
        ;;
esac
