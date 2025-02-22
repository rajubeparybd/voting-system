'use client';

import { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClubSchema, ClubFormValues } from '@/validation/club';
import { getClub, updateClub } from '@/actions/club';
import { uploadToCloudinary } from '@/actions/upload';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PositionsInput } from '@/components/club/PositionsInput';
import { ImageUpload } from '@/components/ui/image-upload';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

// Define the status options
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'PENDING'] as const;
type ClubStatus = (typeof STATUS_OPTIONS)[number];

export default function EditClubPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const imagePreviewRef = useRef<string | null>(null);

    const form = useForm<ClubFormValues>({
        resolver: zodResolver(ClubSchema),
        defaultValues: {
            name: '',
            description: '',
            image: '',
            status: 'ACTIVE' as ClubStatus,
            open_date: '',
            positions: [],
        },
    });

    useEffect(() => {
        const fetchClub = async () => {
            try {
                const club = await getClub(resolvedParams.id);
                if (club) {
                    // Format the date for the input field (YYYY-MM-DD)
                    const formattedDate = club.open_date
                        ? new Date(club.open_date).toISOString().split('T')[0]
                        : '';

                    form.reset({
                        name: club.name,
                        description: club.description,
                        image: club.image,
                        status: club.status as ClubStatus,
                        open_date: formattedDate,
                        positions: club.positions || [],
                    });
                } else {
                    toast.error('Club not found');
                    router.push('/admin/clubs');
                }
            } catch (error) {
                console.error('Failed to fetch club:', error);
                toast.error('Failed to load club data');
                router.push('/admin/clubs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClub();
    }, [resolvedParams.id, form, router]);

    const onSubmit = async (values: ClubFormValues) => {
        console.log('Form values before update:', values);
        setIsSubmitting(true);

        try {
            // If we have a selected file, upload it to Cloudinary
            if (selectedFile && imagePreviewRef.current) {
                try {
                    const imageUrl = await uploadToCloudinary(
                        imagePreviewRef.current
                    );
                    values.image = imageUrl;
                } catch (error) {
                    console.error('Failed to upload image:', error);
                    toast.error('Failed to upload image');
                    setIsSubmitting(false);
                    return;
                }
            } else if (values.image === 'pending-upload') {
                // If we have a pending upload but no file, something went wrong
                toast.error('Image is required but no file was selected');
                setIsSubmitting(false);
                return;
            }

            // Now update the club with the updated values
            await updateClub(resolvedParams.id, values);
            toast.success('Club updated successfully');
            router.push('/admin/clubs');
        } catch (error) {
            console.error('Failed to update club:', error);
            toast.error('Failed to update club');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);

        // If file is null, clear the image value
        if (!file) {
            form.setValue('image', '');
            imagePreviewRef.current = null;
            return;
        }

        // Create a base64 preview and store it in the ref
        const reader = new FileReader();
        reader.onload = e => {
            const result = e.target?.result as string;
            imagePreviewRef.current = result;

            // Set a temporary value to pass validation
            // The actual URL will be set after Cloudinary upload
            form.setValue('image', 'pending-upload');
        };
        reader.readAsDataURL(file);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                        <p className="text-gray-400">Loading club data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <Button
                variant="ghost"
                className="mb-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                onClick={() => router.push('/admin/clubs')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clubs
            </Button>

            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">
                    Edit Club
                </h1>
                <p className="text-gray-400">Update club information</p>
            </div>

            <div className="mx-auto max-w-2xl">
                <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Club Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter club name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter club description"
                                                className="min-h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Club Image
                                        </FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                onFileChange={handleFileChange}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Status
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select club status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map(status => (
                                                    <SelectItem
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            status
                                                                .slice(1)
                                                                .toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="open_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Open Date (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="positions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">
                                            Positions
                                        </FormLabel>
                                        <FormControl>
                                            <PositionsInput
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Club'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
