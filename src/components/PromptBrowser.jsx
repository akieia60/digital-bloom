import { useState, useEffect } from 'react'

export default function PromptBrowser() {
  const [prompts, setPrompts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [loading, setLoading] = useState(true)

  const categories = [
    'All',
    'Rose Styling',
    'Animation',
    'Packaging',
    'Sports',
    'Silhouette'
  ]

  useEffect(() => {
    loadPrompts()
  }, [selectedCategory])

  async function loadPrompts() {
    setLoading(true)

    try {
      const { getAllPrompts, getPromptsByCategory } = await import('../lib/supabase')
      const data = selectedCategory === 'All'
        ? await getAllPrompts()
        : await getPromptsByCategory(selectedCategory)

      setPrompts(data)
    } finally {
      setLoading(false)
    }
  }

  function copyPromptToClipboard(prompt) {
    navigator.clipboard.writeText(prompt.full_prompt)
    alert('Prompt copied! Paste into Grok, Sora, or your AI tool.')
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">AI Prompt Library</h1>
      
      {/* Category Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompt Grid */}
      {loading ? (
        <div className="text-center py-12">Loading prompts...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map(prompt => (
            <div
              key={prompt.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPrompt(prompt)}
            >
              {/* Prompt Card */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{prompt.prompt_name}</h3>
                <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded text-sm">
                  ${prompt.recommended_price}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">
                {prompt.quick_description}
              </p>
              
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {prompt.animation_type}
                </span>
                {prompt.technical_specs?.resolution && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {prompt.technical_specs.resolution}
                  </span>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyPromptToClipboard(prompt)
                }}
                className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700"
              >
                Copy Prompt
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPrompt(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedPrompt.prompt_name}</h2>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded">
                {selectedPrompt.prompt_category}
              </span>
              <span className="ml-2 text-2xl font-bold text-rose-600">
                ${selectedPrompt.recommended_price}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">
              {selectedPrompt.quick_description}
            </p>
            
            {/* Full Prompt */}
            <div className="mb-4">
              <h3 className="font-bold mb-2">Full AI Prompt:</h3>
              <div className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap">
                {selectedPrompt.full_prompt}
              </div>
              <button
                onClick={() => copyPromptToClipboard(selectedPrompt)}
                className="mt-2 bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
              >
                Copy to Clipboard
              </button>
            </div>
            
            {/* Technical Specs */}
            {selectedPrompt.technical_specs && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">Technical Specs:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Resolution: {selectedPrompt.technical_specs.resolution}</div>
                  <div>FPS: {selectedPrompt.technical_specs.fps}</div>
                  <div>Aspect Ratio: {selectedPrompt.technical_specs.aspect_ratio}</div>
                  <div>Duration: {selectedPrompt.technical_specs.duration}s</div>
                </div>
              </div>
            )}
            
            {/* Song Suggestions */}
            {selectedPrompt.song_suggestions?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">Music Suggestions:</h3>
                <ul className="list-disc list-inside text-sm">
                  {selectedPrompt.song_suggestions.map((song, i) => (
                    <li key={i}>{song}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Tags */}
            {selectedPrompt.tags?.length > 0 && (
              <div>
                <h3 className="font-bold mb-2">Tags:</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedPrompt.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-200 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
