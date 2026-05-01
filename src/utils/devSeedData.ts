import type { DraftRecord } from './postStorage';

export type FakeDraftPayload = Omit<DraftRecord, 'id' | 'createdAt' | 'updatedAt'>;

const SEEDS: readonly FakeDraftPayload[] = [
  // ── Variant 1: Engineering ────────────────────────────────────
  {
    title: 'Anatomy of an Offline-First Memorial Viewer',
    slug: 'anatomy-offline-first-memorial-viewer',
    postContent:
      'Building memorial pages that load at graveside — on a 2G connection, under an overcast sky — forced us to rethink every assumption about network reliability in grief-adjacent software.',
    body: `## Why Connectivity Can't Be an Assumption

When a family gathers at a graveside to share a memorial, the last thing they should encounter is a spinner. Cellular coverage in cemeteries is notoriously poor — older sites are often in valleys, surrounded by stone, far from towers. We learned this the hard way in early user testing, and it reshaped our entire approach to the memorial viewer.

## The Cache-First Strategy

We implemented a service worker with a cache-first routing strategy for all memorial assets: the obituary text, photos, and tribute messages. Static shell assets are precached at install time; dynamic content (new tributes added after the initial visit) is served stale-while-revalidate.

\`\`\`js
// Workbox routing — memorial viewer
registerRoute(
  ({ url }) => url.pathname.startsWith('/memorial/'),
  new CacheFirst({ cacheName: 'memorial-pages', plugins: [new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 })] })
);
\`\`\`

## Background Sync for Tribute Submissions

When a visitor adds a tribute offline, we queue the request using the Background Sync API. The service worker replays the queue when connectivity is restored — no data is lost, and the family sees the tribute as soon as their device re-connects.

## What We Got Wrong First

Our first implementation cached the full HTML response. This worked until we added personalisation (the viewer greets you by name if you've left a tribute before). Cached HTML broke that entirely. The fix was to cache only the static shell and hydrate the personalised layer client-side from a tiny JSON endpoint — which is itself cache-first with a short TTL.

## The Result

Memorial pages now load in under 400ms on a cold cache over a simulated 3G connection. The service worker ships in production for all LastRite memorial URLs and has processed over 340,000 offline tribute submissions to date.`,
    category: 'Engineering',
    author: {
      name: 'Alex Chen',
      avatarUrl: undefined,
      bio: 'Infrastructure & Platform Engineering at LastRite.',
    },
    coverImage: {
      src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
      alt: 'Server rack with blinking amber indicator lights in a darkened data centre',
      caption: 'Photo by Taylor Vick on Unsplash',
    },
    tags: ['engineering', 'pwa', 'offline', 'service-worker'],
    featured: false,
    draft: true,
    status: 'draft',
    version: 1,
    seo: {
      metaTitle: 'Building Offline-First Memorials — LastRite Engineering',
      metaDescription:
        'How we built a cache-first memorial viewer that works on a 2G connection at a graveside.',
      keywords: ['offline-first', 'service worker', 'PWA', 'memorial'],
      ogImage: undefined,
      noIndex: false,
    },
  },

  // ── Variant 2: Product Updates ────────────────────────────────
  {
    title: 'Redesigning the Grief Timeline: 18 Months of Iteration',
    slug: 'redesigning-grief-timeline-18-months',
    postContent:
      'The timeline is the heart of every LastRite memorial — and for 18 months, it was also our most-complained-about feature. Here is what we got wrong, what we learned, and what we built instead.',
    body: `## The Problem With the Original Design

Our first timeline was horizontal: a scrubable bar of moments in chronological order, inspired by the interfaces people associate with film and music. It looked great in our design reviews. It felt wrong in practice. Grief is not linear. People return to the same moment — a birthday photo, a handwritten letter — many times across many sessions. A horizontal timeline punishes that kind of non-linear return.

## Key Decisions

The research was unambiguous. In 14 user sessions conducted with bereaved families 3–18 months after loss:

- **11 of 14** participants immediately scrolled back to the first item on load, regardless of where they had left off.
- **9 of 14** described the scrub gesture as "clinical" — one participant compared it to a medical scan.
- The three participants who didn't scroll back immediately had all previously worked in fields with timeline interfaces (video editing, financial services).

We pivoted to a vertical card-based layout. Each moment is a card. Cards stack chronologically, but the scroll position is remembered per-visitor. Returning to the same moment is just scrolling.

## The Colour Contrast Problem

During accessibility review, we found a serious issue: our original palette used mid-grey text on off-white cards for secondary information. The contrast ratio was 3.2:1 — legal under AA for large text, but not for the body-size strings we were rendering. For users reading in distress, in variable lighting conditions, we decided to exceed the minimum. All body text now renders at 6.5:1 minimum contrast in both light and dark modes.

## What We're Shipping

The redesigned timeline ships to all users in the next release. The horizontal timeline is being retired. Existing memorial links are unaffected — only the viewer experience changes. We've back-tested with 40 existing memorials and found zero content loss.`,
    category: 'Product Updates',
    author: {
      name: 'Sarah Miller',
      avatarUrl: undefined,
      bio: 'Co-founder & Head of Product at LastRite.',
    },
    coverImage: {
      src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80',
      alt: 'Open notebook with design wireframes and sticky notes arranged on a white desk',
      caption: 'Photo by UX Indonesia on Unsplash',
    },
    tags: ['product', 'design', 'ux', 'timeline'],
    featured: true,
    draft: true,
    status: 'draft',
    version: 1,
    seo: {
      metaTitle: 'Redesigning the Grief Timeline — LastRite Product',
      metaDescription:
        "Eighteen months of research and iteration behind the redesign of LastRite's core timeline feature.",
      keywords: ['product design', 'UX', 'memorial', 'grief'],
      ogImage: undefined,
      noIndex: false,
    },
  },

  // ── Variant 3: Stories ────────────────────────────────────────
  {
    title: "The Archivist: One Family's 40-Year Project to Digitise Their History",
    slug: 'archivist-family-40-year-project',
    postContent:
      "Margaret Osei spent four decades scanning, cataloguing, and annotating her family's history. When she discovered LastRite, she had one question: what happens to the archive after she is gone?",
    body: `## The Box Under the Stairs

Every family has a version of this box. Margaret's was a 1970s cardboard moving carton, sealed with packing tape that had long since turned amber and brittle, containing thirty years of Super 8 reels, 35mm negatives, and the kind of envelopes that hospitals use when they hand you something important and don't want it to get lost. She found it the year she retired — wedged behind a broken dehumidifier in a corner of the basement she hadn't visited in a decade.

She was a librarian for thirty-one years. She knew exactly what she was looking at.

## The Flood That Changed Everything

The digitisation project began not out of nostalgia but out of fear. In 2009, her cousin's house in Hull flooded. Three generations of photographs were destroyed in ninety minutes. Margaret had been meaning to start scanning for years; after the phone call from Hull, she started the following Saturday.

By 2014, she had digitised 4,200 items — photographs, letters, report cards, a single reel of Super 8 footage from a 1967 family holiday in Dorset that she'd had transferred to digital by a company in Birmingham. She'd built a filing system in a spreadsheet that her daughter described as "genuinely frightening." Every item had a date, a location, a list of people in the frame, and a notes field that sometimes ran to several paragraphs.

## The Question She Kept Returning To

Margaret is seventy-three now. She is healthy — she walks five miles every morning, has a garden that receives a significant amount of professional envy from her neighbours, and reads approximately one book a week. But she thinks about the archive in the way that people think about wills. Not with dread, but with the quiet, steady attention of someone who has decided to do something properly while there is still time.

"The thing I couldn't figure out," she told me, "is what happens to all of it when I'm not here to explain it. I could leave the files to my daughter. But she doesn't know who half these people are. The metadata is the memory. Without me, it's just a very large folder of JPEGs."

## What Comes After

LastRite gave Margaret a way to attach the metadata to the moments — and to make those moments navigable for her children and grandchildren after she's gone. She spent three months importing her archive. The notes field became tribute entries. The people in the frames became tagged participants with their own short biographies.

She is still adding to it. She told me she expects to be still adding to it when she is eighty. "That's not a problem," she said. "That's the point."`,
    category: 'Stories',
    author: {
      name: 'Julian Vane',
      avatarUrl: undefined,
      bio: 'Writer and ethicist exploring technology and mortality.',
    },
    coverImage: {
      src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
      alt: 'Dusty cardboard boxes of old photographs stacked in a warm amber-lit attic',
      caption: 'Photo by Unsplash',
    },
    tags: ['stories', 'legacy', 'family', 'archives'],
    featured: false,
    draft: true,
    status: 'draft',
    version: 1,
    seo: undefined,
  },

  // ── Variant 4: Milestones ─────────────────────────────────────
  {
    title: "Year Two: What We Got Wrong (and What We're Fixing)",
    slug: 'year-two-what-we-got-wrong',
    postContent:
      "Two years in, we think we've earned the right to be honest about the things we built too fast, launched too confidently, and have spent months quietly untangling. Here's what we got wrong.",
    body: `## What We Got Wrong

**We didn't involve grief counsellors early enough.** In our first year, we built several features — including the anniversary reminder system and the tribute notification digest — based on product intuition and user interviews that were too short and too focused on satisfaction rather than emotional impact. We launched them. They worked, in the narrow product sense. Then the support emails started.

The anniversary reminder, in particular, was too blunt. It sent a push notification on the date of death every year. For some families, that was exactly right. For others — people for whom the anniversary was a day they needed to move through privately — it was an intrusion. We should have involved a grief counsellor from the first design session. We didn't, because we were moving fast and thought we understood the problem. We didn't.

**Our notification cadence was wrong.** The tribute digest — a weekly email summarising new tributes left on a memorial — defaulted to every Tuesday. There was no particular reason for Tuesday. It was the day we'd picked internally. Families told us, months after the fact, that it had started to feel like a bill arriving. Grief doesn't operate on a Tuesday schedule.

**The export format didn't work with genealogy software.** We built a beautiful PDF export. We spent significant engineering time on it. Almost nobody used it for its intended purpose — sharing with family members — because the format that genealogists actually use is GEDCOM, and we hadn't heard of it when we designed the feature.

## What We're Fixing

The anniversary notifications are now opt-in, with three configurable modes: private (no notification), family-only (a quiet in-app indicator), and open (the original behaviour). The tribute digest is now configurable in frequency and day of week, defaulting to off. We're shipping GEDCOM export in Q3.

## What Comes Next

We're adding a grief counsellor as a permanent part-time member of the product team. Every significant feature that touches the moment-of-loss experience will be reviewed before development begins. This is not a public commitment we're making because it sounds good — we're writing it here because we want to be held to it.`,
    category: 'Milestones',
    author: {
      name: 'Sarah Miller',
      avatarUrl: undefined,
      bio: 'Co-founder & Head of Product at LastRite.',
    },
    coverImage: {
      src: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1200&q=80',
      alt: 'Person sitting at a desk writing in a journal under soft lamplight at night',
      caption: 'Photo by Unsplash',
    },
    tags: ['milestones', 'transparency', 'product'],
    featured: false,
    draft: true,
    status: 'draft',
    version: 1,
    seo: {
      metaTitle: 'Year Two Retrospective — LastRite',
      metaDescription:
        "An honest look at what we got wrong in our second year and what we're doing about it.",
      keywords: ['retrospective', 'milestones', 'transparency'],
      ogImage: undefined,
      noIndex: false,
    },
  },
] as const;

export function generateFakeDraft(): FakeDraftPayload {
  return { ...SEEDS[Math.floor(Math.random() * SEEDS.length)]! };
}
