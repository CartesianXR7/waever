import RDFVisualizer from './RDFVisualizer'

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">RDF Ontology Visualizer</h1>
      <label className="block mb-4">
        <span className="text-gray-700">Upload RDF File:</span>
        <input
          type="file"
          accept=".rdf"
          className="mt-2 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </label>
      <RDFVisualizer />
    </div>
  )
}

export default App
