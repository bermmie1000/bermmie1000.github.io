#!/bin/bash

# Image and Asset Optimization Script
# 이미지 및 에셋 최적화 스크립트

set -e

echo "🎨 Starting asset optimization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if imagemin-cli is installed
if ! command -v imagemin &> /dev/null; then
    echo -e "${YELLOW}⚠️  imagemin-cli not found. Installing...${NC}"
    npm install -g imagemin-cli imagemin-pngquant imagemin-mozjpeg imagemin-webp
fi

# Create optimized directory
OPTIMIZED_DIR="public/images/optimized"
mkdir -p "$OPTIMIZED_DIR"

echo ""
echo "📊 Original sizes:"
echo "─────────────────────────────────────"
if [ -d "public/images" ]; then
    du -sh public/images/
else
    echo -e "${RED}No images directory found${NC}"
    exit 1
fi

# Optimize PNG images
echo ""
echo "🖼️  Optimizing PNG images..."
if compgen -G "public/images/*.png" > /dev/null; then
    for img in public/images/*.png; do
        filename=$(basename "$img")
        echo "  Processing: $filename"

        # Using pngquant
        if command -v pngquant &> /dev/null; then
            pngquant --quality=65-80 --force --output "$OPTIMIZED_DIR/$filename" "$img"
        else
            imagemin "$img" --plugin=pngquant --plugin.quality='[0.65,0.80]' > "$OPTIMIZED_DIR/$filename"
        fi

        # Show size reduction
        original_size=$(du -h "$img" | cut -f1)
        optimized_size=$(du -h "$OPTIMIZED_DIR/$filename" | cut -f1)
        echo -e "    ${GREEN}$original_size → $optimized_size${NC}"
    done
else
    echo "  No PNG files found"
fi

# Optimize JPEG images
echo ""
echo "📸 Optimizing JPEG images..."
if compgen -G "public/images/*.{jpg,jpeg}" > /dev/null; then
    for img in public/images/*.{jpg,jpeg}; do
        [ -f "$img" ] || continue
        filename=$(basename "$img")
        echo "  Processing: $filename"

        # Using jpegoptim or imagemin
        if command -v jpegoptim &> /dev/null; then
            cp "$img" "$OPTIMIZED_DIR/$filename"
            jpegoptim --max=85 --strip-all "$OPTIMIZED_DIR/$filename"
        else
            imagemin "$img" --plugin=mozjpeg --plugin.quality=85 > "$OPTIMIZED_DIR/$filename"
        fi

        # Show size reduction
        original_size=$(du -h "$img" | cut -f1)
        optimized_size=$(du -h "$OPTIMIZED_DIR/$filename" | cut -f1)
        echo -e "    ${GREEN}$original_size → $optimized_size${NC}"
    done
else
    echo "  No JPEG files found"
fi

# Convert to WebP (modern format)
echo ""
echo "🌐 Converting to WebP format..."
if command -v cwebp &> /dev/null; then
    for img in public/images/*.{jpg,jpeg,png}; do
        [ -f "$img" ] || continue
        filename=$(basename "$img" | sed 's/\.[^.]*$/.webp/')
        echo "  Converting: $(basename "$img") → $filename"

        cwebp -q 80 "$img" -o "$OPTIMIZED_DIR/$filename" 2>/dev/null || true

        if [ -f "$OPTIMIZED_DIR/$filename" ]; then
            optimized_size=$(du -h "$OPTIMIZED_DIR/$filename" | cut -f1)
            echo -e "    ${GREEN}Created: $optimized_size${NC}"
        fi
    done
else
    echo -e "${YELLOW}  cwebp not found. Install webp for better compression:${NC}"
    echo "    brew install webp  # macOS"
    echo "    apt install webp   # Ubuntu/Debian"
fi

# Final summary
echo ""
echo "📊 Optimization Summary:"
echo "─────────────────────────────────────"
echo "Original directory: $(du -sh public/images/ | cut -f1)"
echo "Optimized directory: $(du -sh $OPTIMIZED_DIR | cut -f1)"
echo ""

# Calculate savings
original_bytes=$(du -sb public/images/ | cut -f1)
optimized_bytes=$(du -sb $OPTIMIZED_DIR | cut -f1)
savings=$((original_bytes - optimized_bytes))
savings_percent=$((savings * 100 / original_bytes))

echo -e "${GREEN}💾 Space saved: $savings_percent%${NC}"
echo ""
echo "🎯 Recommended next steps:"
echo "1. Review optimized images in: $OPTIMIZED_DIR"
echo "2. If satisfied, replace originals:"
echo "   cp -r $OPTIMIZED_DIR/* public/images/"
echo "3. Test the site: ./build.sh && npm run preview"
echo ""
echo "✅ Optimization complete!"
