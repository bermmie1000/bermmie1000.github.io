#!/bin/bash

# Wedding Invitation Local Build Script
# 로컬에서 프로덕션 빌드를 테스트하기 위한 스크립트

set -e

echo "🏗️  Starting local build process..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build with Vite
echo "⚡ Building with Vite..."
npm run build

# Create .nojekyll
echo "🔧 Creating .nojekyll..."
touch dist/.nojekyll

# Optional: Additional HTML optimization
if command -v html-minifier-terser &> /dev/null; then
    echo "📦 Further optimizing HTML..."
    find dist -name "*.html" -type f | while read file; do
        html-minifier-terser \
            --collapse-whitespace \
            --remove-comments \
            --minify-css true \
            --minify-js true \
            "$file" -o "$file"
    done
fi

# Calculate sizes
echo ""
echo "📊 Build Summary:"
echo "─────────────────────────────────────"
if [ -f "dist/index.html" ]; then
    echo "HTML size: $(du -h dist/index.html | cut -f1)"
fi
echo "Assets size: $(du -sh dist/assets 2>/dev/null | cut -f1 || echo 'N/A')"
echo "Total size: $(du -sh dist | cut -f1)"
echo "─────────────────────────────────────"

# List all files
echo ""
echo "📂 Build contents:"
find dist -type f | sort

echo ""
echo "✅ Build completed successfully!"
echo "📁 Output: ./dist"
echo ""
echo "To preview locally, run:"
echo "  npm run preview"
echo "  # or"
echo "  npx serve dist"
echo "  # or"
echo "  python3 -m http.server --directory dist 8000"
