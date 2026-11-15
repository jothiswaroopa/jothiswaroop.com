---
name: Jothi Swaroop
description: The Rate Card. A personal site set like a printed trade rate card, with public prices, checked figures, film specimens and a tear-off reply card.
colors:
  emerald: "#005c42"
  salmon: "#ffb49b"
  strike: "#a3271b"
  stock: "#f3f4ee"
  stock-2: "#e8ebe2"
  stock-3: "#dde2d6"
  ink: "#0e1411"
  hairline: "rgb(14 20 17 / 0.22)"
  hairline-on-field: "rgb(243 244 238 / 0.32)"
typography:
  display:
    fontFamily: "Besley, Clarendon, Rockwell, Georgia, serif"
    fontSize: "clamp(2rem, 5.6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Besley, Clarendon, Rockwell, Georgia, serif"
    fontSize: "clamp(1.75rem, 4.6vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Besley, Clarendon, Rockwell, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.022em"
  numeral:
    fontFamily: "Besley, Georgia, serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.03em"
    fontFeature: "lnum"
  lede:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "lnum"
  body-small:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  caption:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  button:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  die-cut: "2px"
spacing:
  gutter-mobile: "20px"
  gutter: "40px"
  column-gap: "40px"
  section-mobile: "52px"
  section: "96px"
  container: "1440px"
  masthead: "96px"
components:
  button-fill:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.stock}"
    typography: "{typography.button}"
    rounded: "{rounded.die-cut}"
    padding: "0 20px"
    height: "48px"
  button-fill-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock}"
  button-fill-on-field:
    backgroundColor: "{colors.salmon}"
    textColor: "{colors.emerald}"
    typography: "{typography.button}"
    padding: "0 20px"
    height: "48px"
  button-fill-on-field-hover:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.emerald}"
  button-ghost:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.die-cut}"
    padding: "0 20px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock}"
  button-masthead:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.stock}"
    padding: "0 16px"
    height: "40px"
  field:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.stock}"
  reply-card:
    backgroundColor: "{colors.salmon}"
    textColor: "{colors.ink}"
    padding: "24px 32px 32px"
    width: "540px"
  reply-tab:
    backgroundColor: "{colors.salmon}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "8px 12px"
  stamp:
    textColor: "{colors.emerald}"
    typography: "{typography.label}"
    padding: "0.5em 0.8em 0.45em"
  form-line:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.55rem 0 0.5rem"
  masthead:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    height: "96px"
---

# Design System: Jothi Swaroop

## Overview

**Creative North Star: "The Rate Card"**

The site is a printed advertising rate card, the trade document a media buyer has held: a card stock, two inks, ruled tables, numbered specimens and a business reply card that tears off. Nothing on it is a screen convention dressed up. Prices sit on dot leaders, tables open under a Scotch rule, films sit inside printer's crop marks, the free first step is stamped on, and the form is an index card with a perforation. The page is dense and plainly read, like a document somebody would check, because the visitor is a sceptical buyer abroad deciding in a minute whether the figures are real.

Everything is flat print. Bond-white stock carries green-black ink; one deep emerald prints whole regions solid and reverses the type out of them; salmon is the stock of the reply card and of anything the reader answers or presses. Headlines and numerals are a Clarendon, everything else a Franklin Gothic, and figures are tabular Franklin, never a monospace costume. Motion is the press at work and nothing else: rules draw, numerals roll in like a tariff board, the stamp comes down, the reply card tears off. Content below the fold is simply there.

The world replaces an earlier look called "Ledger" (near-black, cream, amber, serif display) and was built to refuse the agency hero of a dark screen, one giant claim, a logo strip and stat tiles.

**Key Characteristics:**
- Card stock, green-black ink, one emerald that owns whole regions, salmon reply-card stock. No greys, shadows, glass or gradients.
- Besley (Clarendon) for headlines and numerals; Libre Franklin for text, labels and tabular figures. No monospace.
- Die-cut corners (2px), ruled boxes, four rule weights, Scotch rules over every table.
- Print furniture as the component language: dot leader, digit reel, stamp, crop marks, perforated reply card, form line.
- One currency per visitor, decided by the visitor's clock; dollars and rupees never meet.
- Motion plays an arrival once and leaves every figure true at rest; reduced motion is honoured.

## Colors

Two inks on a card: every colour is a role in a print job, and a region changes its whole palette at once by changing stock.

### Primary
- **Rate-Card Emerald** (`emerald`): the second ink. On card stock it is the accent: the fill button, the second half of the headline, check marks, focus rings, the stamp. As a field it prints whole regions solid (the rate card, the rates spread, the on-camera voices, the close, the footer, the mobile menu), and type reverses out to stock.

### Secondary
- **Reply-Card Salmon** (`salmon`): the stock of the business reply card and its corner tab. Outside the card it marks what the reader answers or presses: the play button on a film, the highlighted row of the figures table, text selection. Inside an emerald field it takes over as the accent, so the fill button and the stamp print salmon there.

### Tertiary
- **Correction Red** (`strike`): a proofreader's red for the struck-through or the wrong: the "Before" label on case pages, a strike line, a form error. It does not appear on the homepage and is never an accent.

### Neutral
- **Bond Stock** (`stock`): the card itself. Page ground, masthead, mobile action bar, and the reversed type inside a field.
- **Second Stock** (`stock-2`): a slightly deeper card for sections that are read as tables or long text (the timetable, the terms, forms, the about page) and the ground behind a screenshot exhibit.
- **Third Stock** (`stock-3`): the ground behind a photograph before it loads.
- **Green-Black Ink** (`ink`): all type, all strong rules, the hover state of buttons on stock.
- **Hairline** (`hairline`, and `hairline-on-field` inside emerald): the one tint. A 1px divider between rows inside a table; never text.

### Named Rules
**The Two Inks Rule.** A surface has a stock, ink, and at most one accent: emerald on stock and on salmon, salmon on emerald. There is no third accent and no grey. A new colour is a new stock for a whole region, not a tint for one element.

**The Whole Region Rule.** Emerald as a ground belongs to whole regions that run edge to edge or card-tall. It is never a small box, badge or tile.

**The Reply Stock Rule.** Salmon means "this answers back": the reply card, its tab, a play button, the row under the pointer. It is not decoration and it is not a section background.

## Typography

**Display Font:** Besley (with Clarendon, Rockwell, Georgia, serif)
**Body Font:** Libre Franklin (with Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif)
**Label/Mono Font:** none distinct. Labels and figures are Libre Franklin; the monospace token is aliased to the sans.

**Character:** A Clarendon and a Franklin Gothic are the two faces of a twentieth-century trade printer: the slab is confident and a little warm at headline size and gives prices real weight; the gothic is plain, dense and legible at caption size. Together they read as a document issued by a person, not a brand template.

### Hierarchy
- **Display** (600, clamp(2rem, 5.6vw, 5.5rem), 0.98, -0.03em): the page's one sentence. Homepage thesis and the h1 of a landing page; the second half may print in the accent.
- **Headline** (600, clamp(1.75rem, 4.6vw, 4.25rem), 1.02, -0.022em): one per section, a full sentence, balanced wrap. Secondary headings step down to clamp(1.75rem, 3vw, 2.5rem).
- **Title** (600, 1.5rem, to 2rem for offer names at desktop; 1.375rem to 1.625rem at 1.18 for questions and result figures): offer names, timetable cells, FAQ questions, names in the issuer block.
- **Numeral** (Besley 700, 2rem mobile to 2.5rem, 0.92, -0.03em, lining): prices on dot leaders and reported figures (1.75rem). The unit after it (/month) is 0.875rem Franklin 500.
- **Lede** (400, 1.125rem to 1.25rem in the hero, 1.625): the line under a headline, held to about 34rem.
- **Body** (400, 1.0625rem, 1.55, lining figures): running text, held to 40rem. Table notes and inclusions use 0.9375rem; captions and attributions 0.875rem.
- **Label** (600, 0.75rem, 0.08em, uppercase): column heads, the dateline (0.6875rem), the rate card's effective line, the reply-card stub. The stamp uses the same size at 700 and 0.1em.

### Named Rules
**The Full-Strength Rule.** Text on rate-card surfaces prints in full ink at every size. Hierarchy comes from face, size and weight (400 text, 500 to 600 emphasis, 700 numerals and stamps), never from fading text toward grey.

**The Two Faces Rule.** Besley for anything set large or priced; Libre Franklin for everything else. Columns of figures use tabular lining Franklin. No monospace, no third face.

**The Heading Opens Rule.** A section opens with its Scotch rule and then its heading. The label style is for column heads, captions, the dateline and the printed furniture of a card (the reply card's stub imprint, the rate card's effective line); it never sits above a heading as a kicker. On an inner page a sub-section opens with `.opener`: a real `h2` in Besley at clamp(1.375rem, 2.1vw, 1.875rem), under a hairline rule. Text on every page is full-strength ink; only a form placeholder is lighter.

## Layout

A 1440px container with 20px gutters on phones and 40px from 768px, and a twelve-column grid with 40px column gaps from 1024px. The recurring split is seven columns of statement against five of evidence: thesis beside rate card, heading beside lede, figures table beside its screenshot exhibit, questions beside the for/not-for lists. Tables that compare run the full twelve (the timetable is 2/4/3/3).

Sections simply follow one another; rhythm comes from change of stock (stock, emerald field, second stock) and from the Scotch rule, not from gaps or cards. Section padding is 96px top and bottom from 768px and 52px below it. Inside a section the steps are 32px from rule to heading, 48px from heading to table, 16px to 32px for row padding.

The masthead is fixed and 96px tall: a 32px dateline strip under a 1px rule, then a 60px name-and-sections bar closed by a 4px rule. Anchors land 104px below the top. It leaves on scroll down and returns on scroll up. In the opening, the left column holds its place (sticky at 136px) while the tall rate card scrolls beside it; the screenshot exhibit beside the figures table does the same.

Responsive behaviour is structural. Below 1024px the hero reorders to sentence, actions, rate card, issuer, so the card's head and first price land in the first screen. Below 640px every dot-leader row stacks: the item takes its own line and the leader and price share the next. Below 768px a row of cards becomes a snap-scrolling swipe at 80vw per card, never a tall stack; table column heads become an inline label on each cell; the masthead collapses to name and a menu button, and a two-button action bar rises from the bottom once the opening has scrolled away. Touch targets are at least 44px and inputs are 16px.

### Named Rules
**The Scotch Opens Rule.** Every table and every section on stock opens under a Scotch rule (4px over 1px, 3px apart). Inside the rate card the same rule separates the offers.

**The Leader Never Stubs Rule.** A dot leader always has room to run. When the item is long, or the screen is a phone, the item takes its own line; the leader is never squeezed to a few dots.

## Elevation & Depth

There is none. The system is flat print: no shadows, no blur, no glass, no gradients; the stylesheet cancels any shadow or backdrop-blur utility outright. What reads as layering is paper: a change of stock under a region, a ruled box around a thing, and three objects that lie on the page at a slight angle because they were placed there by hand: the stamp (-4deg), the reply-card tab (3deg, straightening when pointed at) and the reply card itself (-1deg on desktop). The fixed masthead and mobile action bar are solid stock closed by a 4px rule.

### Named Rules
**The Flat Print Rule.** Depth is stock, rule and a small rotation. If something needs to stand out, it gets a different stock or a heavier rule, never a shadow.

## Shapes

Corners are die-cut, not rounded: 2px everywhere, and any rounded utility collapses to it. The only round forms are the two notches where the reply card's perforation meets its edges, which are holes punched through to the surface beneath.

Rules carry the structure, in four weights: a 1px hairline tint between rows inside a table; a 1px ink rule under rows of evidence and around ruled boxes; a 2px ink rule under column heads and over a list; a 4px ink rule closing the masthead, opening the action bar and forming the thick half of the Scotch rule. Two patterned rules have fixed meanings: 2px dotted is a leader between item and price; 2px dashed is a perforation. The stamp is a 2px border with a 1px outline 2px outside it.

Photographs of the issuer are printed in one ink (greyscale, multiplied into the stock they sit on). Films and screenshots are specimens and stay in full colour inside a 1px ink box. Icons are one drawn set on a 16px grid: 1.5 stroke, square ends, mitred joins, the weight of the card's rules.

## Components

Components are print furniture. Each one is something a printed rate card physically has.

### Buttons
- **Shape:** square (2px), 48px tall, 16px side padding (20px from 640px), label 0.9375rem at 600 followed by a 16px arrow that says where it goes (down for an anchor, up-right for an external link, right otherwise).
- **Fill:** the one action of a region, printed solid in the accent: emerald with stock type on stock; salmon with emerald type inside a field.
- **Ghost:** a ruled box, 1px ink border, ink type.
- **Quiet:** an underlined text link at 600 with an arrow, used to send the reader to an inner page.
- **Hover / Focus / Press:** fill and ghost both turn solid ink on hover and the arrow travels 4px; focus is a 2px accent outline 3px off; pressing moves the button down one pixel (120ms), never a bounce.
- **Masthead size:** the same two weights at 40px tall and 0.875rem.

### Rate table (signature)
One offer as a table: name in Besley, who it is for, then tiers as dot-leader rows between hairlines, with the price in Besley numerals and its unit in small Franklin. Below: the "Free first" stamp beside the free first step, a checked list of what is included, the guarantee, and one full-width fill button. Two tables separated by Scotch rules on a tall emerald field make the rate card; side by side on a full-bleed field they make the rates spread.

**The One Currency Rule.** A visitor sees one price list. The static page prints dollars; a visitor whose clock is in India gets rupees. Results earned in rupees carry a dollar gloss in brackets abroad and stand alone in India. Dollar and rupee prices never share a view and there is no currency switch.

### Price reel
Each digit of a price is a reel that settles on its figure (1.2s, 55ms stagger per digit). The real text is always present for readers, copying and search.

**The True At Rest Rule.** A price shows the right figure with no animation running. The roll is an arrival: once at load for what is on screen, once when the reader first reaches a price further down, again only when the list re-prints in the other currency. It is never tied to scroll position.

### Stamp
The one mark that is pressed on, not printed: uppercase 0.75rem at 700, double-ruled, rotated -4deg, in the accent. It scales down from 1.7 to 1 in 0.45s as it lands. Reserved for the free first step.

### Scotch rule and ruled tables
The Scotch rule draws left to right as it enters where scroll-driven animation exists and prints solid elsewhere. Tables are a 2px rule with label column heads, then rows on 1px ink rules. A row that links somewhere fills salmon under the pointer or focus and its arrow travels; in the figures table the highlighted row also puts its screenshot in the exhibit frame alongside.

### Specimen strip and crop marks
Films as a test strip: a horizontal, snap-scrolling row moved by drag, trackpad or two square arrow buttons, never by itself. Each film sits in a 1px ink box with 14px printer's ticks 20px off its corners, which open 4px when pointed at, and is captioned with title, client, kind and its number in the strip. The play button is a 56px salmon square with an ink rule; video loads only after a tap.

### Reply card (signature)
A salmon index card in two pieces, at most 540px wide. The stub carries the imprint "Business reply card", the addressee and a postage mark; a 2px dashed perforation with punched notches separates it from the body. The body is a Besley line, a sentence and two form lines, then a full-width fill button and two underlined alternatives. Sending it tears the body away (0.9s, drifting down-right and rotating 7deg as it fades) and prints "Received." on whatever the card was lying on. For a visitor in India the body carries WhatsApp actions instead of a form. A small salmon tab, rotated 3deg at the rate card's top corner, points to it.

### Inputs / Fields
- **Style:** a form line. No box: a label above, the answer written on a 1px ink rule, transparent ground, 16px text.
- **Focus:** the rule thickens to 2px and takes the accent; no outline ring.
- **Placeholder:** the one place text is a tint of ink.

### Navigation
- **Dateline:** a 32px strip of 0.6875rem labels: "Rate card" and the month of issue, the clocks, and "Certified Performance Marketer". The clocks read "{visitor's time} your time · {time} in Chennai" abroad and Chennai time alone for a visitor in India; on phones only the clocks show. Below 768px the strip holds the clocks only, and "Certified Performance Marketer" sits under the name in the masthead bar, at the same label size, so the credential shows on every screen.
- **Masthead:** the name in Besley 1.5rem, six section links at 0.9375rem and 500 whose underline slides in on hover (the current section is underlined 2px), then a ghost and a fill button at masthead size.
- **Mobile:** a 44px ruled menu button; the menu is a full-screen emerald field wiped down from the top with the sections in Besley 2.5rem on hairlines and the two actions beneath. A bottom bar closed by a 4px rule carries the page's two exits.
- **Footer:** the back of the card, on the field: one Besley line, a Scotch rule, the index of links and a colophon naming the two typefaces. No motion.

### Inner-page patterns
Inner pages reuse the same furniture: display h1, specimen strip, Scotch-ruled step tables on second stock, three ruled columns for limits, the rate table beside the reply card on a field, disclosure rows (a Besley question with a plus that turns 45deg) under a 2px rule. The about page sets a ruled portrait and the recognition photographs down a two-fifths left column beside the timeline on desktop, then runs full width below it; on phones the photographs return to reading order.

### Arrival motion
One easing throughout: cubic-bezier(0.16, 1, 0.3, 1). At load, in CSS and before any script: the headline rises line by line from behind a mask (0.95s, 90ms stagger), the rest of the opening fades up 10px, prices roll, the stamp presses. Further down, only prices and stamps replay, once, when 60% in view. With reduced motion, travel is removed and colour changes stay.

## Do's and Don'ts

### Do:
- **Do** build new surfaces from the print furniture: Scotch rule, dot leader, ruled table, stamp, crop marks, form line, reply card.
- **Do** give a section one stock (stock, second stock or the emerald field) and let the stock supply its ink, rule and accent.
- **Do** set every price in Besley numerals on a dot leader, with a free first step beside the list.
- **Do** print text in full ink and make hierarchy with face, size and weight.
- **Do** keep corners at 2px and separate things with rules of the four weights (1px hairline, 1px ink, 2px, 4px).
- **Do** keep "Certified Performance Marketer" in the dateline and the issuer block.
- **Do** show one currency per visitor, and gloss rupee results in dollars abroad.
- **Do** label what a figure is: counted in Ads Manager, client-reported, or a concept film.
- **Do** make a phone row of cards a swipe, stack a long leader row, and keep touch targets at 44px or more.
- **Do** let motion be an arrival that leaves the element true at rest, and honour reduced motion.

### Don't:
- **Don't** add greys, shadows, glass, blur or gradients.
- **Don't** round corners beyond 2px or put content in floating cards.
- **Don't** use emerald as a small box, badge or tile, or salmon as a section background.
- **Don't** set a small uppercase label above a heading as a kicker.
- **Don't** use a monospace or a third typeface.
- **Don't** show dollar and rupee prices together or add a currency switch.
- **Don't** auto-scroll anything: no marquees, no self-advancing strips.
- **Don't** tie a price or a stamp to scroll position, or fade and slide ordinary content in on scroll.
- **Don't** open a page with a dark hero, a logo strip or stat tiles.
- **Don't** bounce, spring or overshoot; a press travels one pixel.
