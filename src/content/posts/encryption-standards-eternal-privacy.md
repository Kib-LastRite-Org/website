---
title: 'Encryption Standards for Eternal Privacy'
postContent: 'When someone entrusts LastRite with their most personal memories — the final letter a father left for his children, the video of a grandmother telling her immigration story for the first time — they are making an act of radical vulnerability. Our responsibility to protect that trust is not just a legal obligation. It is a moral one. This post explains the zero-knowledge architecture that underpins every piece of data on our platform.'
category: 'Engineering'
author: 'Marcus Thorne'
date: '2024-04-15'
readTime: '12 min'
image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR4wFsbcuM2aZ_-zJw6DJZW0L0PL_9vLFnWZJFWmG0GT91EU3dFcTWoHWd1gmQfLFSrZFjpKJmZgmjYRu1h4aRxXlMn84U8EFCNntuH-YDE8hWqltwxi0OnMgSAOERxE-dBU3d3WNpHpYsovDJ4BYYNggbAWq2TCPVwh5oEBuUKQ-Hnqi9RzVluOCOMHLbcICVczeBInqruDJyyESm6jK2Lps3qa2MS7jndJvkkJPllEj3FwnVXQ_aQE2EoqD8AlPP91KZZmedBplL'
imageAlt: 'macro photography of a single glowing tree leaf with golden veins against a deep dark background'
featured: false
draft: true
tags: ['engineering', 'security', 'privacy']
---


When someone entrusts LastRite with their most personal memories — the final letter a father left for his children, the video of a grandmother telling her immigration story for the first time — they are making an act of radical vulnerability. Our responsibility to protect that trust is not just a legal obligation. It is a moral one.

This post is a deep dive into how we think about privacy at LastRite, the zero-knowledge architecture we've built, and what it actually means for the people who use our platform.

## The Problem with "Encrypted at Rest"

Most cloud services will tell you that your data is "encrypted at rest and in transit." This is true in a narrow technical sense, but it conceals an important caveat: they hold the encryption keys. That means a subpoena, a breach, a disgruntled employee, or a shift in company ownership could expose your data without your knowledge or consent.

For most services — a notes app, a photo library — this is an acceptable tradeoff. For a platform that stores obituaries, deathbed recordings, and final messages, we believe it is not.

## Zero-Knowledge Architecture

LastRite uses a client-side encryption model. When you upload content to our platform, it is encrypted on your device before it ever leaves. The keys used for encryption are derived from your passphrase using a key derivation function (we use Argon2id) and are never transmitted to our servers in plaintext.

This means that when your data lands on our infrastructure, we are storing an opaque blob of ciphertext. We cannot read it. Our engineers cannot read it. A court order compelling us to produce your data would yield nothing useful — we simply do not have the plaintext.

## Key Sharing and Legacy Access

Zero-knowledge encryption creates an obvious challenge: how do you share access with family members, or grant posthumous access to the people your content is meant for?

We solve this through envelope encryption combined with asymmetric key exchange. When you designate a Legacy Contact, we generate a shared secret using their public key and a key fragment derived from yours. This allows them to decrypt content you have explicitly designated for them — without either party ever exposing their master key to our servers.

## Threat Model

No system is perfectly secure, and we believe in being honest about our threat model. The risks we have designed against include:

- **Server-side compromise**: An attacker who gains access to our storage cannot read user content.
- **Credential-based access**: Without the user's passphrase, even someone with valid session credentials cannot decrypt content.
- **Legal compulsion**: We cannot produce plaintext we do not possess.

The risks we have *not* fully mitigated include device-level compromise and passphrase recovery. If you lose your passphrase and have not set up a recovery mechanism, your encrypted content is unrecoverable. We make this explicit during onboarding.

## What This Means in Practice

Building a zero-knowledge system adds real complexity — to our architecture, to our UX, and to our support operations. Key recovery flows are harder to build safely. Sharing features require more careful design. We've accepted those costs because we believe the people who choose LastRite deserve a platform that takes their privacy as seriously as they take the lives it helps preserve.

In a future post, we'll go deeper on our key recovery flows and how we balanced security with practical usability.
