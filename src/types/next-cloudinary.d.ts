declare module 'next-cloudinary' {
    import { FC, ReactNode } from 'react';

    interface CloudinaryResult {
        info: {
            secure_url: string;
            public_id: string;
            [key: string]: unknown;
        };
        event: string;
        [key: string]: unknown;
    }

    // Define the widget type
    interface CloudinaryWidget {
        open: () => void;
        close: () => void;
        destroy: () => void;
        [key: string]: unknown;
    }

    interface CldUploadWidgetProps {
        children: (props: { open: () => void }) => ReactNode;
        onUpload: (result: CloudinaryResult) => void;
        onWidgetReady?: (widget: CloudinaryWidget) => void;
        uploadPreset?: string;
        options?: {
            maxFiles?: number;
            resourceType?: string;
            sources?: string[];
            showUploadMoreButton?: boolean;
            multiple?: boolean;
            styles?: {
                palette?: {
                    [key: string]: string;
                };
                fonts?: {
                    default: null;
                    [key: string]: {
                        url: string;
                        active: boolean;
                    } | null;
                };
            };
            [key: string]: unknown;
        };
    }

    export const CldUploadWidget: FC<CldUploadWidgetProps>;
}
