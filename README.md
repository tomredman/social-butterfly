# Social Butterfly 🦋

Social Butterfly is a Social Media scheduling SaaS app, built using Vite, React, and Convex.

I'm creating a series of video where I walk through the creation of this app:

- Part 1: https://www.youtube.com/watch?v=QO23tgYNRYc
- Part 2: https://www.youtube.com/watch?v=urKQPReLRfo

## Description

This project aims to create a comprehensive social media management tool, focusing on post scheduling and analytics. It's being developed primarily through AI-assisted prompting using Cursor and various AI models.

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

## Environment Variables

### Convex Environment Variables

Set these in your Convex deployment:

- `FB_APP_ID`
- `FB_APP_SECRET`
- `FB_REDIRECT_URI`
- `JWT_SECRET`

These can be set in the Convex dashboard here: `https://dashboard.convex.dev/t/<team>/<project>/<deployment-name>/settings/environment-variables`

  <img width="337" alt="redman-2024-09-20-13 45 22" src="https://github.com/user-attachments/assets/c4b356df-1f00-4776-9294-7803bd20eb85">

### Local Environment Variables

Create a `.env.local` file in the root directory with:

- `VITE_CONVEX_URL`
- `VITE_FB_CONFIG_ID`
- `VITE_FB_APP_ID`
- `VITE_FB_REDIRECT_URI_APP_ID`
- `VITE_FB_APP_VERSION`

## Running the Project

1. Start the Vite development server:

   ```
   npm run dev
   ```

2. In a separate terminal, start the Convex development server:

   ```
   npx convex dev
   ```

   You can tail the logs with:

   ```
   npx convex dev --tail-logs
   ```

## Features

- Instagram post scheduling
- Facebook page management
- Post analytics
- Multi-account support

## Technologies

- Vite
- React
- TypeScript
- Convex
- Tailwind CSS
- Shadcn UI

## Contributing

This project is currently in development. Contributions, ideas, and feedback are welcome!

## License

[MIT License](LICENSE)
