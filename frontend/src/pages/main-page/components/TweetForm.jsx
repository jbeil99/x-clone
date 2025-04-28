import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Calendar, Globe2, Film, BarChart2, Smile, Image, X } from 'lucide-react';
import { addTweet } from '../../../api/tweets';
import { toast } from 'react-toastify';

const tweetSchema = z.object({
    content: z.string()
        .min(1, { message: "Tweet cannot be empty" })
        .max(280, { message: "Tweet must be 280 characters or less" }),
    image: z.any()
        .optional()
        .nullable()
        .refine(file => !file || file.size <= 5 * 1024 * 1024, {
            message: "Image must be 5MB or less"
        })
        .refine(file => !file || ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), {
            message: "Only JPEG, PNG, and GIF images are supported"
        })
});

export default function TweetForm() {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid }
    } = useForm({
        resolver: zodResolver(tweetSchema),
        defaultValues: {
            content: "",
            image: null
        },
        mode: "onChange"
    });

    const content = watch("content");

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            console.log("Tweet submitted:", data);
            const res = await addTweet(data)
            console.log(res)
            toast.success("Tweet submitted")

        } catch (error) {
            console.error("Error posting tweet:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setValue("image", file, { shouldValidate: true });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setValue("image", null, { shouldValidate: true });
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="border-b border-gray-800">
            <form onSubmit={handleSubmit(onSubmit)} className="pt-3 pb-0 px-4">
                <div className="flex gap-3">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-11 h-11 rounded-full object-cover mt-1" />
                    <div className="flex-1 min-w-0">
                        <textarea
                            className="w-full bg-transparent outline-none resize-none text-xl mb-1 placeholder:text-gray-400 dark:text-white"
                            placeholder="What's happening?"
                            rows="2"
                            {...register("content")}
                        />

                        {errors.content && (
                            <div className="text-red-500 text-sm mb-2">{errors.content.message}</div>
                        )}

                        {previewUrl && (
                            <div className="mb-3 relative">
                                <div className="border border-gray-800 rounded-lg overflow-hidden">
                                    <div className="relative">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-32 object-cover"
                                        />
                                        <button
                                            onClick={handleRemoveFile}
                                            className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                                            type="button"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-2 bg-gray-900 text-sm border-t border-gray-800">
                                        <span className="truncate block">{watch("image")?.name}</span>
                                    </div>
                                </div>
                                {errors.image && (
                                    <div className="text-red-500 text-sm mt-1">{errors.image.message}</div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-1 mb-2">
                            <Globe2 className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-500 text-sm font-bold cursor-pointer hover:underline">Everyone can reply</span>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-500">
                                {content?.length > 0 && (
                                    <span className={content.length > 280 ? "text-red-500" : ""}>
                                        {content.length}/280
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="border-b border-gray-800 mb-2" />
                        <div className="flex items-center justify-between py-2">
                            <div className="flex gap-2 text-blue-500">
                                <button
                                    className="p-1.5 hover:bg-blue-900/30 rounded-full relative"
                                    onClick={() => fileInputRef.current.click()}
                                    title="Add image"
                                    type="button"
                                >
                                    <Image className="w-5 h-5" />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/jpeg,image/png,image/gif"
                                        className="hidden"
                                    />
                                </button>
                                <button className="p-1.5 hover:bg-blue-900/30 rounded-full" title="Add GIF" type="button">
                                    <Film className="w-5 h-5" />
                                </button>
                                <button className="p-1.5 hover:bg-blue-900/30 rounded-full" title="Add poll" type="button">
                                    <BarChart2 className="w-5 h-5" />
                                </button>
                                <button className="p-1.5 hover:bg-blue-900/30 rounded-full" title="Add emoji" type="button">
                                    <Smile className="w-5 h-5" />
                                </button>
                                <button className="p-1.5 hover:bg-blue-900/30 rounded-full" title="Schedule" type="button">
                                    <Calendar className="w-5 h-5" />
                                </button>
                                <button className="p-1.5 hover:bg-blue-900/30 rounded-full" title="Add location" type="button">
                                    <MapPin className="w-5 h-5" />
                                </button>
                            </div>
                            <button
                                className="bg-white text-black px-5 py-1.5 rounded-full font-bold disabled:opacity-50 opacity-90 hover:bg-gray-200 transition"
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                {isSubmitting ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}