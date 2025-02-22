# Voting System

## Setup Instructions

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
    - Copy `.env.example` to `.env`
    - Update the MongoDB connection string
    - Set up Cloudinary credentials (see below)
4. Run the development server:
    ```bash
    npm run dev
    ```

## Cloudinary Setup

This application uses Cloudinary for image storage. To set it up:

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your Cloudinary dashboard to get your cloud name, API key, and API secret
3. Create an upload preset:
    - Go to Settings > Upload
    - Scroll down to "Upload presets"
    - Click "Add upload preset"
    - Set "Upload preset name" to "voting_system" (or choose your own name)
    - Set "Signing Mode" to "Unsigned"
    - Save the preset
4. Update your `.env` file with the following values:
    ```
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="voting_system" # or your custom preset name
    ```

## Features

- User authentication
- Club management
- Voting system
- Drag and drop image upload for clubs (images are uploaded to Cloudinary on form submission)
