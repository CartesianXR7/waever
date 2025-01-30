import { useState } from 'react';
import ForceGraph from './ForceGraph';
import { Parser as N3Parser } from 'n3';

export default function RDFVisualizer() {
  const [data, setData] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleVisualize = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const text = await selectedFile.text();
      const parsedData = await parseRDF(text);
      setData(parsedData);
      setFileUploaded(true);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to parse RDF file. Check format and structure.');
    } finally {
      setLoading(false);
    }
  };

  const parseRDF = async (content) => {
    if (content.trim().startsWith('<rdf:RDF') || content.trim().startsWith('<?xml')) {
      return parseRDFXML(content); // RDF/XML
    } else if (content.includes('@prefix') || content.includes('PREFIX')) {
      return parseTurtle(content); // Turtle
    } else {
      throw new Error('Unrecognized file format. Please upload a valid RDF/XML or Turtle file.');
    }
  };

  const parseRDFXML = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'application/xml');
    const nodes = new Map();
    const edges = [];

    doc.querySelectorAll('[rdf\\:about], [rdf\\:ID]').forEach((element) => {
      const id = element.getAttribute('rdf:about') || element.getAttribute('rdf:ID');
      const attributes = Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {});

      nodes.set(id, {
        id,
        name: element.querySelector('rdfs\\:label')?.textContent || id.split('#').pop(),
        type: determineNodeType(element),
        description: element.querySelector('rdfs\\:comment')?.textContent,
        attributes,
        cluster: getCluster(determineNodeType(element)),
      });
    });

    doc.querySelectorAll('[rdf\\:resource]').forEach((element) => {
      const source = findParentNodeId(element);
      const target = element.getAttribute('rdf:resource');
      if (source && target) {
        edges.push({
          source,
          target,
          type: element.tagName,
          label: element.tagName.split(':').pop(),
        });
      }
    });

    return { nodes: Array.from(nodes.values()), edges };
  };

  const parseTurtle = (content) => {
    return new Promise((resolve, reject) => {
      const parser = new N3Parser();
      const nodes = new Map();
      const edges = [];
      const quads = [];

      parser.parse(content, (error, quad, prefixes) => {
        if (error) reject(error);
        if (quad) {
          quads.push(quad);
        } else {
          quads.forEach((quad) => {
            const subject = quad.subject.value;
            const predicate = quad.predicate.value;
            const object = quad.object.value;

            if (!nodes.has(subject)) {
              nodes.set(subject, {
                id: subject,
                name: subject.split('#').pop() || subject.split('/').pop(),
                type: determineNodeTypeFromURI(subject),
                cluster: getCluster('Resource'),
              });
            }

            if (!nodes.has(object)) {
              nodes.set(object, {
                id: object,
                name: object.split('#').pop() || object.split('/').pop(),
                type: quad.object.termType === 'Literal' ? 'Literal' : determineNodeTypeFromURI(object),
                cluster: getCluster('Resource'),
              });
            }

            edges.push({
              source: subject,
              target: object,
              type: quad.object.termType === 'Literal' ? 'literal' : 'property',
              label: predicate.split('#').pop() || predicate.split('/').pop(),
            });
          });

          resolve({ nodes: Array.from(nodes.values()), edges });
        }
      });
    });
  };

  const determineNodeType = (element) => {
    const tagName = element.tagName.toLowerCase();
    if (tagName.includes('class')) return 'Class';
    if (tagName.includes('objectproperty')) return 'ObjectProperty';
    if (tagName.includes('datatype')) return 'DatatypeProperty';
    if (tagName.includes('annotation')) return 'AnnotationProperty';
    return 'Individual';
  };

  const determineNodeTypeFromURI = (uri) => {
    const lower = uri.toLowerCase();
    if (lower.includes('class')) return 'Class';
    if (lower.includes('property')) return 'Property';
    if (lower.includes('individual')) return 'Individual';
    return 'Resource';
  };

  const getCluster = (type) => {
    const clusterMap = {
      Class: 0,
      ObjectProperty: 1,
      DatatypeProperty: 2,
      AnnotationProperty: 3,
      Individual: 4,
      Resource: 5,
    };
    return clusterMap[type] || 0;
  };

  const findParentNodeId = (element) => {
    let current = element;
    while (current) {
      const id = current.getAttribute('rdf:about') || current.getAttribute('rdf:ID');
      if (id) return id;
      current = current.parentElement;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white">
      {!fileUploaded ? (
        <div className="absolute top-4 right-4 z-10 bg-gray-800/80 backdrop-blur p-4 rounded-lg shadow-xl w-80">
          <h2 className="text-lg font-bold mb-4">RDF Visualizer</h2>
          <div className="space-y-4">
            <input
              type="file"
              accept=".rdf,.owl,.xml,.ttl"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-medium
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                cursor-pointer"
            />
            {selectedFile && (
              <button
                onClick={handleVisualize}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Visualize'}
              </button>
            )}
            {error && (
              <div className="p-2 bg-red-900/50 rounded text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setFileUploaded(false)}
          className="absolute top-4 right-4 z-10 bg-gray-800/80 backdrop-blur p-2 rounded-lg"
        >
          Upload New File
        </button>
      )}
      {data && <ForceGraph data={data} />}
    </div>
  );
}

