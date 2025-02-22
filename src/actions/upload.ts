'use server';

interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    asset_id: string;
    version_id: string;
    width: number;
    height: number;
    format: string;
    created_at: string;
    resource_type: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    original_filename: string;
}

export async function uploadToCloudinary(base64Image: string): Promise<string> {
    try {
        if (!base64Image || !base64Image.startsWith('data:image')) {
            throw new Error('Invalid image data');
        }

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            throw new Error('Cloudinary configuration is missing');
        }

        console.log('Uploading to Cloudinary...');

        const formData = new FormData();
        formData.append('file', base64Image);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'voting-system/clubs');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cloudinary API error:', errorText);
            throw new Error(
                `Failed to upload image: ${response.status} ${response.statusText}`
            );
        }

        const data = (await response.json()) as CloudinaryUploadResponse;
        console.log('Upload successful, URL:', data.secure_url);
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error(
            error instanceof Error ? error.message : 'Failed to upload image'
        );
    }
}
