# QR Code Scanner - Airtable Interface Extension

A custom Airtable Interface Extension that extends Airtable's built-in Interfaces with custom UI functionality.

## Overview

This project is an Airtable Interface Extension built with TypeScript and React. Interface Extensions allow you to create custom UI components that integrate seamlessly with your Airtable bases, providing specialized functionality tailored to your specific workflows.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Airtable Blocks SDK** - Interface Extensions API
- **pnpm** - Package manager

## Project Structure

```
qr_code_scanner/
├── frontend/
│   ├── index.tsx        # Main entry point
│   └── style.css        # Global styles
├── block.json           # Extension configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm package manager
- An Airtable account with access to Interface Extensions

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run type checking:
   ```bash
   pnpm typecheck
   ```

3. Run linting:
   ```bash
   pnpm lint
   ```

## Development

The main application code is located in `frontend/index.tsx`. This is where you'll implement your custom interface logic.

### Key Concepts

- **Interface Extensions** extend Airtable's Interfaces with custom UI
- Use `@airtable/blocks/interface/ui` for hooks and utilities
- Use `@airtable/blocks/interface/models` for data models
- The entry point uses `initializeBlock({ interface: () => <YourComponent /> })`

### Available Scripts

- `pnpm lint` - Run ESLint to check code quality
- `pnpm typecheck` - Run TypeScript type checking

## Airtable Blocks SDK

This extension uses the Airtable Blocks SDK for Interface Extensions:

- Import hooks from `@airtable/blocks/interface/ui`
- Import models from `@airtable/blocks/interface/models`
- Access base data using `useBase()`, `useRecords()`, etc.
- Use custom properties to make your extension configurable

## License

See [LICENSE.md](LICENSE.md) for details.
