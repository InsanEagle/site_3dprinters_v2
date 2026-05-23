Product image pipeline for the public catalog

Folder structure:
- /public/product-images/<SKU>/card.png
- /public/product-images/<SKU>/cover.png
- /public/product-images/<SKU>/view-2.png
- /public/product-images/<SKU>/view-3.png

How it works:
1. Add prepared PNG files for a product into its SKU folder.
2. Register the SKU in data/product-image-assets.ts.
3. ProductCard uses card.png through the cardImage resolver when configured.
4. Product galleries use cover.png and view-* files through the images resolver when configured.
5. The site will use these local assets first.
6. If a SKU is not registered, the site falls back to the imported marketplace photos.

Notes:
- Use transparent-background PNG files for the main catalog flow.
- Keep one product per image.
- Keep consistent scale and framing across views.
- Use `card.png` for ProductCard/cardImage assets.
- Use `cover.png` and `view-*` for product gallery assets.
- Do not use temporary product-cards-test paths in committed asset config.
- Do not store source Figma files, temp exports, or zip archives here.
