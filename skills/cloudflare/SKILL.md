---
name: Cloudflare
description: Skill for deploying to Cloudflare Pages/Workers
---

# Cloudflare Skill

This skill provides instructions for deploying applications to Cloudflare.

## Overview
Cloudflare Pages is used for hosting static sites and front-end frameworks.

## Instructions
- Ensure `wrangler` is installed: `npm install -D wrangler`.
- Login with `npx wrangler login`.
- Configure `wrangler.json` with `pages_build_output_dir`.
- Deploy using `npx wrangler pages deploy <dist-folder>`.
