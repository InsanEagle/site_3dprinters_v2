Product image pipeline for the public catalog

Folder structure:
- /public/product-images/<SKU>/cover.png
- /public/product-images/<SKU>/view-2.png
- /public/product-images/<SKU>/view-3.png

How it works:
1. Add prepared PNG files for a product into its SKU folder.
2. Register the SKU in data/product-image-assets.ts.
3. The site will use these local assets first.
4. If a SKU is not registered, the site falls back to the imported marketplace photos.

Notes:
- Use transparent-background PNG files for the main catalog flow.
- Keep one product per image.
- Keep consistent scale and framing across views.
- Use `cover.png` for the primary card image.
