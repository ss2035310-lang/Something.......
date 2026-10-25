# Sales page and thank-you page: setup guide

**Product:** 25 Free AI Tools Every Student Should Know (PDF, 2026 Edition)

## What is in this folder

| File | Purpose |
|---|---|
| `index.html` | The sales page |
| `thank-you.html` | The page buyers land on after paying (has the download button) |
| `styles.css` | Shared design |
| `config.js` | **The only file you edit.** Payment link, download link, price, contact |
| `script.js` | Shared behaviour. You do not need to edit this |
| `assets/` | The real eBook cover (two sizes, two formats) and a 1200x630 social-share image `og-image.jpg` |

The PDF itself is **not** in this folder on purpose. Do not upload it next to the site files (see "Protecting the download").

## 1. Where to paste your details (all in `config.js`)

| What | Variable | Example |
|---|---|---|
| Payment checkout link | `PAYMENT_URL` | `https://your-provider.com/checkout/abc123` |
| Secure ebook download link | `EBOOK_DOWNLOAD_URL` | `https://files.example.com/your-ebook.pdf` |
| Price | `PRICE_TEXT` | `$9` |
| Brand name | `BRAND_NAME` | `Acme Study` |
| Contact email | `CONTACT_EMAIL` | `support@yourdomain.com` |
| Refund policy text | `REFUND_POLICY_TEXT` | Write exactly what you offer |
| Policy pages | `PRIVACY_URL`, `TERMS_URL`, `REFUND_URL` | `privacy.html` or a full https:// link |

Rules the page enforces for you:

- Every "Get this eBook" button uses the one `PAYMENT_URL`, as a normal link in the same tab.
- If `PAYMENT_URL` is missing or is not an `https://` link, the buttons are switched off and a yellow setup banner appears. Nothing links to an invented checkout.
- If `EBOOK_DOWNLOAD_URL` is missing or invalid, the download button is switched off and a setup box appears.
- Anything still showing as `[INSERT ...]` is highlighted in yellow so you can spot it.

You should also update these in the files themselves:

- `index.html`: replace `YOUR-DOMAIN.com` in the Open Graph tags with your real domain (search for it), and add the canonical link mentioned in the head comment.
- `index.html`, product details: the page count (28, A4) and file size (about 92 KB) match the PDF as it is today. Update them if you change the PDF.

## 2. Hosting the site

Any static host works. The site has no build step and no server code.

- **Netlify:** log in, open "Sites", then drag the whole folder into the deploy area.
- **Cloudflare Pages:** create a project, choose "Direct Upload" and upload the folder.
- **GitHub Pages:** put the files in a repository, then enable Pages in the repository settings.
- **Your own hosting:** upload everything with the same folder structure, so `assets/` stays next to the HTML files.

Use HTTPS (all of the above do this by default). Open `index.html` locally by double-clicking it to preview.

## 3. Payment gateway: success redirect

1. Open your payment provider's dashboard and find the setting for the page buyers go to after a **successful** payment (often called "success URL", "redirect URL" or "confirmation page").
2. Enter the full live address of the thank-you page, for example `https://yourdomain.com/thank-you.html`.
3. The address must match exactly where you hosted the file, including `https://`, the domain, and the file name.
4. Make a test purchase, if your provider has a test mode, and confirm you land on the page.

Optional: rename `thank-you.html` to something hard to guess, such as `thanks-k7x2p9.html`, and use that address in the gateway. The page already tells search engines not to index it, and the sales page does not link to it.

## 4. Protecting the download (important)

A static thank-you page **cannot verify payment**. Anyone who knows or is sent its address can open it, and that includes the download link. A redirect is a convenience, not proof of purchase.

For stronger protection, from best to simplest:

1. **Use your payment provider's own delivery feature**, if it has one (authenticated downloads or digital-product delivery). The provider checks payment and hands out the file.
2. **Use expiring or signed download links** from your file host, generated per purchase.
3. **Use a small backend** (for example a serverless function) that checks the payment with the provider and only then returns a download link. This needs server-side code. This site does not include it and does not pretend to.
4. If you stay with the simple setup: keep the PDF off the public site folder, use a long unguessable file name, keep the thank-you page address private, and accept that a determined person could share the link.

**Never put API keys, tokens, webhooks secrets or passwords in `config.js` or any other file on this site.** Everything in these files is public.

## 5. Hosting the PDF so it downloads cleanly

- `EBOOK_DOWNLOAD_URL` should point **directly to the PDF file** (ending in `.pdf` or a provider download link), not to a preview page.
- The button sets a suggested file name with the HTML `download` attribute. Browsers only honour that when the file is on the **same domain** as the page. For files on another domain, set the response header `Content-Disposition: attachment; filename="25-Free-AI-Tools-Every-Student-Should-Know.pdf"` on the file host, or accept that some browsers will open the PDF in a tab (the page tells people how to save it).
- Share links from cloud drives often open a preview page. Use the provider's "direct download" form of the link, or a proper file host.

## 6. Testing checklist

**Before launch**
- [ ] `config.js` has real values and no yellow banners appear on either page
- [ ] No `[INSERT ...]` text remains (price, contact, refund, policy links)
- [ ] Refund text says only what you actually offer
- [ ] Open Graph tags use your real domain; `assets/og-image.jpg` loads at that address

**Mobile (a real phone, plus a 360 px wide browser window)**
- [ ] No sideways scrolling anywhere
- [ ] Menu button opens and closes the navigation
- [ ] Cover appears below the hero text
- [ ] Sticky "Get this eBook" bar appears after the hero and hides near the product card and final section, never covering text
- [ ] FAQ items open and close

**Desktop and tablet**
- [ ] Cover sits to the right of the hero text on wide screens
- [ ] Cards line up in clean grids at tablet and desktop widths
- [ ] Keyboard only: Tab reaches every link and button, focus is always visible, FAQ opens with Enter or Space

**Purchase flow**
- [ ] Every "Get this eBook" button (header, hero, product card, final section, sticky bar) goes to your checkout, in the same tab
- [ ] Checkout shows the correct product and price
- [ ] After a successful test payment you land on `thank-you.html`
- [ ] A cancelled or failed payment does **not** send you to the thank-you page

**Download**
- [ ] "Download Your eBook" downloads or opens the correct PDF on phone and desktop
- [ ] The PDF is the right edition and opens without errors
- [ ] The download link is not visible in a public folder listing or search results

## 7. Accuracy notes

All product claims on the sales page come from the PDF itself: 25 tools, 6 categories, 5 workflows, 8 cheat-sheet prompts, a 7-day plan, a quick reference table, a glossary, seven responsible-use rules, 28 A4 pages. The three preview cards reproduce the eBook's own wording for ChatGPT, Elicit and Quizlet.

There are no testimonials, ratings, sales numbers, bonuses, guarantees, discounts or countdowns. Add a refund promise, updates promise or bonus only if you really offer it.

The "Honest by design" section repeats what the eBook already discloses, including that it was written with the help of an AI assistant that is also one of the 25 tools. Edit or remove it only if the eBook changes.

Free plans and limits change quickly. Review the eBook and the FAQ answer about free plans whenever a tool changes its pricing.
