#!/bin/bash

# EasyPanel Build Script
echo "🚀 Starting build process for files.ghos.tr"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
