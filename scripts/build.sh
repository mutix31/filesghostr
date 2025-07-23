#!/bin/bash
set -e

echo "🚀 Starting build for files.ghos.tr"

# Clean install
echo "📦 Installing dependencies..."
npm ci

# Build
echo "🔨 Building application..."
npm run build

echo "✅ Build completed!"
