# Crave & Sip Website Starter

A mobile-first, single-page website and WhatsApp ordering starter for Crave & Sip. Built with standard HTML, CSS and vanilla JavaScript so it can be opened and edited in Visual Studio Code.

## What's included

- `index.html` — homepage, menu, brand story, group orders, FAQs, footer, cart drawer, checkout and order review.
- `styles.css` — responsive visual system using the approved Berry Fresh palette.
- `products.js` — editable product catalogue, WhatsApp number and delivery-fee configuration.
- `app.js` — menu filtering, cart, quantity controls, local cart persistence, checkout validation and WhatsApp message generation.
- `privacy.html` — draft privacy notice that must be reviewed before launch.

## Run locally

1. Download and unzip the project.
2. Open the `crave-and-sip-website` folder in VS Code.
3. Open `index.html` in a browser. For the most reliable local development workflow, install the **Live Server** extension in VS Code, right-click `index.html`, and choose **Open with Live Server**.
4. Internet access is needed for the temporary Unsplash images and Google Fonts. The cart and checkout logic itself is frontend-only.

No package manager or build step is required.

## Configuration

### WhatsApp number

Edit `window.CRAVE_CONFIG` at the top of `products.js`:

```js
whatsappNumber: "2348024850065"
```

Use the international number with digits only: no `+`, spaces or hyphens.

### Product catalogue and prices

Edit `window.CRAVE_PRODUCTS` in `products.js`. Each item includes:

- `id` — unique identifier
- `name`
- `category` — `zobo`, `classic`, `juice` or `blend` (used by menu filters)
- `description`
- `price` — integer amount in Nigerian naira
- `size` — current provisional size
- `image` and `imageAlt`
- `colour` and optional `badge`
- `available` — set to `false` to hide an item from the menu

The current eight products and prices are **provisional sample content only**, not an approved Crave & Sip menu. Confirm product names, descriptions, ingredients, sizes, photographs and prices before launch. All current sample products use 50cl because no alternative size/pricing has been confirmed.

### Delivery fee

`deliveryFee` is `null` by default in `products.js`. Keep it null until the business confirms a clear delivery pricing rule. The checkout will then say the delivery fee and final total need to be confirmed. If a fixed delivery fee is officially approved, set it to a number in naira. If delivery varies by area, replace this simple setting with a confirmed area-based rule before presenting a final total.

### Images and logo

The site uses temporary, free-to-use Unsplash stock photography for visual development. These are illustrative stock photos, not photos of Crave & Sip's actual drinks. The Unsplash License permits free personal and commercial use subject to its terms; attribution is not required, though appreciated. Review the official license before launch: https://unsplash.com/license.

The temporary logo is now a simple text-only wordmark, not a final approved logo. Replace the image URLs in `index.html`, `products.js` and `styles.css` with the brand's approved drink photography when available. If any image is changed, confirm its specific license and retain any required attribution. The current external images need an internet connection to load.

### Business details still to confirm

- Final approved product menu, descriptions, ingredients, sizes and prices
- Original product photos and approved logo
- Delivery coverage, fee rules and expected delivery timing
- Payment methods and group-order terms
- Official location and social media profiles
- Privacy notice and any actual analytics/hosting data practices

## How WhatsApp checkout works

1. A customer adds products to the cart and changes quantities.
2. The cart calculates line totals and subtotal from `products.js`.
3. Checkout validates required contact and delivery fields.
4. The customer reviews the order details.
5. The website creates a formatted WhatsApp message from the actual cart and form values and opens a `wa.me` link to the configured business number.
6. The customer reviews the prefilled message and presses **Send** in WhatsApp.

Opening WhatsApp does **not** send the message automatically and does not mean the business has received or accepted an order. Availability, delivery fee, final total and timing must be confirmed by the business. This is a frontend-only starter: it does not store orders in a business database, accept payments, or verify inventory on a server.

If the business later needs automatic order ingestion, staff notifications, stock validation or payment processing, add a secure backend and/or the supported WhatsApp Business Platform. Do not put API secrets in browser JavaScript.

## Design and accessibility

- Berry Pink: `#E8336D`
- Grape Purple: `#6B2D8B`
- Soft Blush: `#FFF0F4`
- Mint: `#7ED9B5`
- Dark Ink: `#241230`

The site includes responsive layouts, semantic page sections, visible focus styles, skip navigation, labels and validation messages, keyboard dismissal of overlays, and reduced-motion handling.

## Design references reviewed

The layout uses general patterns observed on these live beverage websites; the implementation is original and does not copy their proprietary assets or layouts:

- Pressed Juicery — clear product groupings and strong product photography: https://pressed.com/
- Cawston Press — flavour-led product catalogue and a distinct brand voice: https://cawstonpress.com/
- innocent Drinks — approachable brand storytelling and concise brand messaging: https://www.innocentdrinks.co.uk/
- JOE & THE JUICE — visible menu and ordering pathways: https://www.joejuice.com/
- JuSea case study — a focused ordering journey for a juice bar: https://www.lookin.nz/work/jusea

## Temporary stock image register

The site currently references the following images from Unsplash's image CDN. The images are used as temporary visual placeholders and may be cropped by the site layout:

- `photo-1546173159-315724a31696` — hero and sample drink card imagery
- `photo-1513558161293-cdac6e126e49` — citrus drink imagery
- `photo-1536935338788846bb9981813` — colourful drink imagery
- `photo-1600271886742-f049cd451bba` — juice imagery
- `photo-1497534446932-c925b458314e` — drink imagery
- `photo-1527761939622-911b9b4f9e8c` — pink drink imagery
- `photo-1553530666-ba11a7da3888` — smoothie imagery
- `photo-1532634896-26909d0d4b4c` — occasion-card background imagery

Official license: https://unsplash.com/license. Photographer credit is not required by the Unsplash License but is appreciated. Check for any third-party trademarks, recognizable people, or other rights if applicable. These temporary images should not be presented as the brand's own product photos.

## Pre-launch QA checklist

- [ ] Replace all temporary Unsplash stock photography with approved Crave & Sip drink images (or reconfirm the chosen stock photos and license for ongoing use).
- [ ] Replace the text-only temporary wordmark with the official Crave & Sip logo.
- [ ] Confirm every menu item, variant and price.
- [ ] Confirm WhatsApp number and test on Android, iOS and desktop.
- [ ] Confirm delivery fee logic and payment arrangements.
- [ ] Test cart add/remove, quantity changes, empty cart, and persistence.
- [ ] Test required checkout fields and order-message contents.
- [ ] Confirm privacy notice matches actual practices.
- [ ] Test keyboard navigation, colour contrast, mobile widths and broken images.
- [ ] Add hosting, domain, analytics and SEO details only when confirmed.

## Project status

This is an editable development starter. It is not a deployed public website. Before launch, verify the business content, external images, device behavior and all order flows with the actual business owner.
