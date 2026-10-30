# FlavorVault

Discover and explore delicious recipes

1. Fork this repository.
2. Clone your fork locally.
3. Complete the coding exercise below.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) >= 22

## Running

```bash
npm ci
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

## Testing

```bash
npm run test
```

## Coding Exercise

Work through these challenges in order:

1. Incorporate more information into the recipe card.
   - Include the ingredients and instructions on the recipe card.
   - Optionally include a photo of the finished dish (can be a random placeholder photo, like https://picsum.photos/seed/recipe/200/300).
2. Add debouncing to the search input.
3. Fix failing tests.

Notes:

- There is a `useDebounce` hook already implemented in `src/hooks/useDebounce.ts`.

Rules:

- No use of LLMs or other AI code completion tools.
- Any public docs/snippets allowed.
- Keep commit history.
- The goal isn't to finish everything. Having a conversation is more important. Partial credit counts.

Stretch:

- Add a "Create Recipe" modal.
- Add an optimistic update mutation using `onMutate/onError/onSettled`.

Have fun & good luck!
