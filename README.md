# 🥗 PickyPlate - Decide What to Eat, Together

A meal planning web app that helps couples and friends solve the everyday “what should we eat?” dilemma - together.

**Live demo: https://pickyplate.vercel.app/**  

*Status: MVP - actively evolving. Parts of Supabase backend under development; UX improvements underway.*

<br>

## 💡 Overview

PickyPlate is inspired by a real-life problem: deciding what to eat with my partner. Friends shared the same pain - endless back-and-forth, options overload, forgotten favourites, and unsatisfying last-minute fallback decisions.

Built to make meal decisions easier and more enjoyable, with an emphasis on:

- **Mobile-first responsive UI**, since decisions usually happen on phones
- **Friendly, accessible UX and microcopy** to guide users
- **Clean, scalable code** with ESLint, Prettier, reusable components, and maintainable structure
- **Modern frontend best practices** with component-based architecture, TypeScript for type safety, **state management with** **React Context + hooks**, and **Conventional Commits** for clarity

<br>

## ✨ Features

- **Friend system** - Add, remove, and manage friends
- **Shared & personal food lists** - Save favourites and collaborate on shared lists with friends
- **Meal preferences matching** - Personalise results by location, time, cost, and cuisine priorities
- **Smart recommendations** - Tailored suggestions that reduce choice overload and speed up decisions
- **Thoughtful UX** - Friendly microcopy and illustrations for a more engaging experience
- **Accessibility-first** - ARIA labels, keyboard navigation, decorative elements hidden from screen readers, validated with Lighthouse audits
- **Responsive UI** - Mobile-first approach, tested across multiple screen sizes

<br>

## 🛠 Tech stack

| **Area** | **Solution** |
| --- | --- |
| **Frontend** | React, TypeScript, MUI |
| **Styling** | MUI theming, custom CSS |
| **Backend / API** | Supabase (PostgreSQL, REST API via PostgREST, Auth, Edge Functions, Storage) |
| **Code Quality** | ESLint, Prettier, Conventional Commits |
| **DevOps** | GitHub Actions (CI/CD), Vercel  |
| **Testing** | Manual testing, Lighthouse accessibility audits (scope to expand to unit tests) |

<br>

## 🧱 Architecture Highlights

- **Component-based design** with reusable UI
- **React Context** providers for authentication, preferences, and shared data
- **Clear separation of concerns**: components, pages, hooks, and utils
- **Accessibility built-in and validated**: ARIA labels, keyboard-friendly interactions, decorative images hidden from screen readers - validated with Lighthouse audits
- **Supabase PostgREST** for CRUD operations on tables (e.g. `user_profile`, `food_list`)
- **Supabase Edge Functions** for friend requests, shared food lists, etc.
- **Supabase Storage** for avatar assets
- **Supabase Auth with Row-Level Security (RLS)**

<br>

## 🚀 Getting started

Requirements:

- Node.js 18.18+ or 20.9+
- Supabase environment variables (`.env.local`)

Run locally:

```bash
# Clone repo
git clone https://github.com/yourusername/pickyplate.git
cd pickyplate

# Install dependencies
npm install

# Start dev server
npm run dev
```

<br>

## 🎯 Outcome

- Built an MVP solving a real problem I personally faced
- Built **reusable, accessible, and responsive components** in TypeScript
- Managed shared state using **React Context** and scalable patterns
- Balanced **UX goals with technical feasibility** and trade-offs
- Kept a clean Git history with **Conventional Commits**
- Set up CI/CD with **Vercel and GitHub Actions**

<br>

## 👋 About Me

I built PickyPlate to grow as a frontend developer and solve a real-world problem with empathy and code.

I’m excited to keep learning, contribute to product thinking, and deliver accessible, maintainable code alongside a collaborative team.
