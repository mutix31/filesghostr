export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🚀 Deployment Status</h1>

        <div className="grid gap-6">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">✅ Application Status</h2>
            <p className="text-gray-300">files.ghos.tr is running successfully!</p>
            <p className="text-sm text-gray-400 mt-2">Build Time: {new Date().toISOString()}</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">📋 System Info</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">Node.js:</span> {process.version}
              </p>
              <p>
                <span className="text-gray-400">Platform:</span> {process.platform}
              </p>
              <p>
                <span className="text-gray-400">Architecture:</span> {process.arch}
              </p>
              <p>
                <span className="text-gray-400">Environment:</span> {process.env.NODE_ENV}
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">🔧 Features</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>File Upload</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Dark/Light Theme</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>File Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Expiry Settings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>View/Download Limits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>500MB File Limit</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/30">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">⚠️ Troubleshooting</h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-white">If you see Git messages:</h3>
                <p className="text-gray-300">
                  Messages like "Deploy service: Initialized repository" are normal Git operations, not errors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Build Issues:</h3>
                <p className="text-gray-300">Check EasyPanel build logs for actual error messages.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Runtime Issues:</h3>
                <p className="text-gray-300">Ensure port 3000 is configured and memory limits are sufficient.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🏠 Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
