# Weaver

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<div align="center">
  <img src="/public/w-icon.svg" alt="Weaver Logo" width="120"/>
  <p><strong>A modern, interactive visualization tool for RDF and Turtle ontologies</strong></p>
  <p>Developed by <a href="https://wavebound.io">Wavebound, LLC</a></p>
</div>

  
<img width="2056" alt="weaver-controls-1" src="https://github.com/user-attachments/assets/43b5d0ea-c38c-4294-acbf-ffe66884d6c1" />

## SCREENSHOT 1 
### weaver visualization interface comes with...
- [X] (Top Right) File upload box where a user can upload either .rdf or .ttl files from a local machine
- [X] (Center Right) Follapsable control panel that includes:
++ Collision Force, Force Strength, and Link Distance
++ Node Color Pickers and Manual Hex Inputs
++ PNG & PDF screen capture exports (this grabs JUST the graph visualization)
- [X] (Bottom Right) Mannual Zoom buttons (may also use mouse or trackpad to Zoom in and out)
- [X] (Bottom Left) Dynamic Graph Legend to color categorize the available nodes in the uploaded file
- [X] (Top Left) Node Details Pop Up - This gives more information about a selected node on the spider graph
- [X] (Top Center) Collapsable Node Search Function
- [X] Full screen interactive animated graphing visualization
- [X] Node Mouseover Tooltips that give high level details of a node

<img width="2056" alt="weaver-controls-2" src="https://github.com/user-attachments/assets/a44e6720-cbe7-4d52-8bb0-a496f22320de" />

^^^

## SCREENSHOT 2 
- (Top Center) Expanded Node Search (uses fuzzy searching for better results)

## Overview

Weaver is a powerful web-based visualization tool designed to help users understand and explore RDF (Resource Description Framework) and Turtle ontology files through an interactive and intuitive interface. Built with modern web technologies, Weaver makes it easy to upload, analyze, and visualize complex ontological relationships.

## Features

### Core Functionality
- Direct file upload support for RDF/XML (.rdf, .owl) and Turtle (.ttl) formats
- Interactive force-directed graph visualization
- Dynamic node filtering by type
- Real-time graph manipulation

### Visualization Controls
- Customizable force simulation parameters
- Zoom and pan controls
- Node collision and link distance adjustments
- Custom color schemes for different node types

### Search & Analysis
- Fuzzy search functionality across all node properties
- Detailed node information display
- Connected node highlighting
- Type-based filtering

### Export Options
- High-quality PNG export
- PDF export functionality
- Configurable export settings

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/wavebound/weaver.git

# Navigate to project directory
cd weaver

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Basic Usage

1. Launch the application
2. Use the file upload button to select your RDF or Turtle file
3. Click "Visualize" to generate the interactive graph
4. Use the control panel to adjust visualization parameters
5. Export or share your visualization as needed

## Technology Stack

- **Frontend Framework**: React
- **Visualization**: D3.js
- **RDF Parsing**: N3.js
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Search**: Fuse.js

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

## Commercial Support

While Weaver is open-source under the MIT License, Wavebound, LLC offers several commercial services:

- Enterprise Support
- Custom Development
- Hosted Solutions
- Training & Implementation
- Integration Services

For commercial inquiries, please contact: support@wavebound.io

## License

Copyright (c) 2024 Wavebound, LLC. This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- D3.js community for their excellent visualization library
- N3.js team for their RDF parsing capabilities
- Our open source contributors

---

<div align="center">
  <p>Made with ❤️ by <a href="https://wavebound.io">Wavebound, LLC</a></p>
  <p>© 2024 Wavebound, LLC. All rights reserved.</p>
</div>
