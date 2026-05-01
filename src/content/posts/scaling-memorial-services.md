---
title: 'Scaling Memorial Services for Global Reach'
postContent: 'Every year, on the anniversary of a death, something predictable happens on our platform: traffic spikes. Not gradually — sharply. A memorial that receives a handful of visits in a typical week will receive thousands on the anniversary, as family members scattered across time zones all visit at once. Early in our history, those spikes broke things. This is the story of how we fixed that, and what we built along the way.'
category: 'Engineering'
author:
  name: 'Alex Chen'
  bio: 'Infrastructure & Platform Engineering at LastRite.'
date: '2024-04-28'
status: 'published'
version: 1
readingTime: 8
wordCount: 1600
coverImage:
  src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3Huz8BFCQuBrMBVizF696hUgjeZ9yUAFRYD0v5ABltuei3Sp9g3aKDUfbjIrSrEsrZhQMAFiHI5SLpm943PQPW9n3nni8dyCIjJMcENNuRohDdJrbh8yC4JlMhAeEDQ2lqPVfuFLP7371IMtn_xcI5MtmFlOk04i9MArfJDWfhB5GpV6BBHSQFS3waRMoq26AIChnrM8o07WP-35qe6dHzm5WMcra2_kh9D3B6pApWrg5w9Zvcgfi3fTgyswmCadYgC3LpO662Zoj'
  alt: 'close-up of complex circuit board with glowing emerald light pathways illuminating futuristic server architecture'
featured: false
draft: true
tags: ['engineering', 'infrastructure', 'performance']
---


Every year, on the anniversary of a death, something predictable happens on our platform: traffic spikes. Not gradually — sharply. A memorial that receives a handful of visits in a typical week will receive thousands on the anniversary, as family members scattered across time zones all visit at once.

Early in our history, those spikes broke things. Memorials went down at exactly the moments when people needed them most. This is the story of how we fixed that — and what we learned about building infrastructure for a fundamentally human use case.

## The Problem with Predictable Unpredictability

Most scaling challenges involve unpredictable load. A product goes viral, a news story drives traffic, an API endpoint gets hammered in a pattern no one anticipated. The standard playbook — horizontal scaling, autoscaling groups, load balancers — handles these cases reasonably well.

Our challenge was different. We knew the spikes were coming. We could predict them to within an hour, because we knew when every memorial was created, and anniversary traffic follows a near-identical pattern year over year. The problem was that we had tens of thousands of memorials, each with its own anniversary, and the spikes were distributed across the calendar in a way that was difficult to pre-provision for cost-effectively.

## What We Tried First

Our initial approach was to pre-warm cache aggressively. A few hours before a memorial's anniversary, our system would heat the CDN edge caches with the memorial's content, reducing the load on origin servers during the spike.

This worked until it didn't. Memorials that received genuine viral attention — those shared widely by families with large social networks — could generate traffic that exhausted even a warm cache. And our cache invalidation logic had a subtle bug that occasionally caused stale content to persist past edits, which was particularly painful for families updating memorials with new information on an anniversary.

## The Architecture We Landed On

After several iterations, we landed on a three-layer approach.

**Edge delivery via distributed CDN with per-memorial TTL management.** Memorial content is served from edge nodes geographically close to the visitor. TTLs are set based on the memorial's recent edit history — actively edited memorials get shorter TTLs, dormant ones get longer.

**Event-driven pre-warming with staggered rollout.** Rather than pre-warming all upcoming anniversary memorials at once, we stagger the pre-warming over a six-hour window. This spreads the load on our origin servers and allows us to catch failures before traffic arrives.

**Read replicas with regional promotion.** For our database layer, we run read replicas in each of our primary regions. During an anniversary spike, reads are routed to the nearest replica. If a replica falls behind on replication lag by more than a threshold, it is automatically demoted and traffic fails over.

## The Part That Surprised Us

The engineering challenge turned out to be the simpler half of the problem. The harder part was understanding *why* the old architecture failed at the moments it did.

We ran a post-mortem on the three most significant outages of the previous year and discovered a pattern: each one occurred not at the peak of an anniversary spike, but at the trailing edge — as traffic was declining, not rising. Our autoscaling logic was over-provisioning on the way up and then scaling down too aggressively, leaving us under-resourced for the long tail.

The fix was a simple change to our scale-in cooldown period. But finding it required building the tooling to understand our traffic patterns at a memorial level, not just an aggregate level. That tooling — a per-memorial traffic analytics system we built internally — has since become one of the most useful instruments we have for capacity planning.

## What's Next

We are currently working on a predictive pre-warming system that uses historical traffic data to model expected load at a memorial level, allowing us to provision more precisely rather than over-provisioning as a safety margin. We expect this to reduce our infrastructure costs meaningfully while improving reliability.

As always, we're glad to talk through any of this with the engineering community. If you're working on similar problems, reach out.
