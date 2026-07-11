---
title: "Extracting Colors from an Image: Pickers, Palettes and Naming"
description: "Three ways to pull colors out of an image, all on-device: pick a pixel for its exact HEX/RGB/HSL (or use the EyeDropper API), extract a dominant palette with median-cut, and find the nearest CSS color name by CIEDE2000. How each works and why nothing is uploaded."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/color/image-color-picker/", "/color/color-name-finder/", "/color/oklch-color-picker/"]
keywords:
  - color picker from image
  - extract color palette from image
  - get hex color from image
  - eyedropper tool
  - color name from hex
  - dominant colors image
heroImage: /blog/color-from-image-guide.png
heroAlt: "Three on-device ways to get colors from an image: pick, palette, name"
faqs:
  - q: "How do I get the HEX color of a pixel in an image?"
    a: "Open the image in an image color picker and click the pixel — the tool reads that pixel's exact color and shows the HEX, RGB and HSL values. In a browser that supports the EyeDropper API (Chrome, Edge), you can also sample any pixel anywhere on your screen."
  - q: "How is a color palette extracted from an image?"
    a: "By color quantization. Median-cut is the common method: it puts all the image's pixels in one box, repeatedly splits the box along its widest color channel, and averages each final box into one representative color — yielding the image's dominant palette. It runs in the browser on a canvas."
  - q: "What is the EyeDropper API?"
    a: "A browser feature (Chrome and Edge) that lets a web page open the operating system's eyedropper so you can pick a color from anywhere on screen, not just an uploaded image. Where it isn't available, picking from an uploaded image still works."
  - q: "How do I find the name of a color?"
    a: "Convert the color to CIELAB and measure its CIEDE2000 (ΔE) distance to each standard CSS color name; the smallest distance is the closest name. This is an exact perceptual measurement, unlike a chatbot's guess."
  - q: "Is my image uploaded when I pick colors from it?"
    a: "No — a good in-browser tool draws the image to a canvas and reads pixels locally. The image never leaves your device, which matters for screenshots of unreleased work or private photos."
  - q: "What image formats can I use?"
    a: "Any your browser can display — JPG, PNG, WebP, GIF, and usually AVIF. Large images are scaled down for picking, which doesn't change the colors."
draft: false
---

**There are three distinct jobs when you want colors from an image — pick one pixel, pull the whole
palette, or name a color — and all three can run entirely in your browser.** No upload, no watermark,
nothing sent to a server. Here's how each works.

<aside class="key-takeaways">

**Key takeaways**

- **Pick:** click a pixel for its exact HEX/RGB/HSL — or use the **EyeDropper API** to grab any pixel on screen.
- **Palette:** **median-cut** quantization reduces the image to its handful of dominant colors.
- **Name:** nearest CSS color name by **CIEDE2000 (ΔE)** — a measurement, not a guess.
- All of it runs **on-device** on a canvas; the image is **never uploaded**.

</aside>

## The three jobs

<figure>
<img src="/blog/infographic-color-from-image.svg" alt="Infographic: three on-device ways to get colors from an image. 1, Pick — click a pixel for exact HEX, RGB, HSL, or use the EyeDropper API for any pixel on screen. 2, Palette — median-cut quantization splits pixels along their widest color axis and averages each group into dominant colors. 3, Name — convert to CIELAB and find the nearest CSS color name by CIEDE2000 distance. Nothing is uploaded." width="1200" height="640" loading="lazy" />
<figcaption>Pick a pixel, extract the palette, or name a color — all locally.</figcaption>
</figure>

## 1. Pick a single color

The simplest job: what colour is *that* pixel? An [image color picker](/color/image-color-picker/) draws
your image to a canvas, and clicking reads the pixel's exact red/green/blue values, shown as HEX, RGB and
HSL to copy.

For picking outside an uploaded image — say, a color in another app — modern Chrome and Edge expose the
**EyeDropper API**, which opens the operating system's own eyedropper so you can sample *any* pixel on
your screen. Where the API isn't available, picking from the uploaded image still works everywhere.

## 2. Extract a palette

Pulling the *dominant* colors is a quantization problem: an image has thousands of distinct pixel colors,
and you want to reduce them to a representative handful. The classic method is **median cut**:

1. Put all the sampled pixels into one "box" in RGB space.
2. Find the box's **widest channel** (the axis — red, green or blue — with the largest spread) and split
   it at the median into two boxes.
3. Repeat on the box with the widest range until you have as many boxes as colors you want.
4. **Average** each final box into one representative color.

The result is the image's dominant palette, ready to export as CSS or Tailwind variables. It runs
pixel-by-pixel on the canvas — the same [image color picker](/color/image-color-picker/) does both the
pick and the palette.

## 3. Name a color

Sometimes you have a hex and want a *name* — "what would you call `#2f855a`?" The honest way to answer is
a **perceptual measurement**, not a guess:

1. Convert your color and every standard CSS named color to **CIELAB**, a perceptually organised space.
2. Compute the **CIEDE2000 (ΔE)** distance from your color to each name.
3. The smallest distance is the nearest name (`#2f855a` → *seagreen*).

A ΔE under about 2.3 is a "just noticeable difference", so a small ΔE means the name is essentially
exact. This is exactly the kind of nearest-of-N calculation a language model gets wrong — it names a
plausible but not actually closest color. The [color name finder](/color/color-name-finder/) measures it.

## Why on-device matters here

Images are often private — a screenshot of an unreleased design, a client's photo, a product mockup.
Doing all of this in the browser (canvas pixel reads, in-memory quantization, local ΔE math) means the
image never leaves your device. You can prove it: open DevTools' network tab, or go offline mid-use, and
everything keeps working.

## Quick summary

To get colors from an image, match the tool to the job: **pick** a pixel (or use the EyeDropper API) for
an exact HEX/RGB/HSL, **extract** a palette with median-cut quantization, and **name** a color by nearest
CIEDE2000 distance to the CSS names. All three run on-device with no upload — start with the
[image color picker](/color/image-color-picker/) and the [color name finder](/color/color-name-finder/).

*Sources: median-cut color quantization (Heckbert, 1982); CIEDE2000 color-difference formula; the MDN
EyeDropper API. Educational information.*
