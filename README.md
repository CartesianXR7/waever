[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Weaver

A modern, interactive visualization tool for RDF (Resource Description Framework) and Turtle ontology files.

## Features

- Interactive force-directed graph visualization
- Support for RDF/XML and Turtle file formats
- Dynamic node filtering by type
- Customizable force simulation parameters
- Search functionality with fuzzy matching
- Zoom and pan controls
- Export options (PNG, PDF)
- Custom color schemes for different node types
- Detailed node information display

## Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/weaver.git

# Navigate to project directory
cd weaver

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. Launch the application
2. Click the file upload button
3. Select an RDF (.rdf, .owl) or Turtle (.ttl) file
4. Click "Visualize" to generate the graph

## Tech Stack

- React
- D3.js for visualization
- N3.js for RDF parsing
- Tailwind CSS for styling
- Vite for build tooling

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
