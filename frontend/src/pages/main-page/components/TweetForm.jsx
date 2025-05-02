import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Calendar, Globe2, Film, BarChart2, Smile, Image, X, Video } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { postTweets } from '../../../store/slices/tweets';

const tweetSchema = z.object({
    content: z.string()
        .max(280, { message: "Tweet must be 280 characters or less" })
        .optional(),
    media: z.any()
        .optional()
        .nullable()
        .refine(file => !file || file.size <= 100 * 1024 * 1024, {
            message: "Media must be 100MB or less"
        })
        .refine(file => !file || ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mpeg', 'video/quicktime'].includes(file?.type), {
            message: "Only JPEG, PNG, GIF images, and MP4, MPEG, MOV videos are supported"
        })
}).superRefine((data, ctx) => {
    if (!data.content && data.media) {
        return z.NEVER;
    }
    if (!data.content && !data.media) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Tweet cannot be empty (either text or media is required)",
            path: ['content'],
        });
        return z.NEVER;
    }
});

export default function TweetForm({ parent, isReply = false, author, setReplies, replies }) {
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const buttonText = !isReply ? ['Post', 'Posting'] : ['Reply', 'Replying'];
    const textAreaText = !isReply ? "What's happening" : "Post Your Reply";
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isValid }
    } = useForm({
        resolver: zodResolver(tweetSchema),
        defaultValues: {
            content: "",
            media: null
        },
        mode: "onChange"
    });

    const content = watch("content");
    const media = watch("media");

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            console.log("Tweet submitted:", data);
            const action = await dispatch(postTweets({ data, parent }));
            if (isReply) {
                setReplies([action.payload, ...replies])
            }
            reset({
                content: "",
                media: null
            })
            setPreviewUrl(null);
            setMediaType(null);

        } catch (error) {
            console.error("Error posting tweet:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setValue("media", file, { shouldValidate: true });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            if (file.type.startsWith('image/')) {
                setMediaType('image');
            } else if (file.type.startsWith('video/')) {
                setMediaType('video');
            } else {
                setMediaType(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setValue("media", null, { shouldValidate: true });
        setPreviewUrl(null);
        setMediaType(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="border-b border-gray-800">
            <form onSubmit={handleSubmit(onSubmit)} className="pt-3 pb-0 px-4">
                <div className="flex gap-3">
                    <img src={user?.avatar_url} alt={user?.username} className="w-11 h-11 rounded-full object-cover mt-1" />
                    <div className="flex-1 min-w-0">
                        {isReply ? <div className="text-xs text-gray-400 mb-2">
                            Replying to <span className="text-blue-400">@{author?.username}</span>
                        </div> : ""}

                        <textarea
                            className="w-full bg-transparent outline-none resize-none text-xl mb-1 placeholder:text-gray-400 dark:text-white"
                            placeholder={textAreaText}
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
                                        {mediaType === 'image' && (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-32 object-cover"
                                            />
                                        )}
                                        {mediaType === 'video' && (
                                            <video
                                                src={previewUrl}
                                                controls
                                                className="w-full h-32 object-cover"
                                            />
                                        )}
                                        <button
                                            onClick={handleRemoveFile}
                                            className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                                            type="button"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-2 bg-gray-900 text-sm border-t border-gray-800">
                                        <span className="truncate block">{watch("media")?.name}</span>
                                    </div>
                                </div>
                                {errors.media && (
                                    <div className="text-red-500 text-sm mt-1">{errors.media.message}</div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                {content?.length > 0 && (
                                    <span className={content.length > 280 ? "text-red-500" : ""}>
                                        {content.length}/280
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div className="flex gap-2 text-blue-500">
                                <button
                                    className="p-1.5 hover:bg-blue-900/30 rounded-full relative"
                                    onClick={() => fileInputRef.current.click()}
                                    title="Add image or video"
                                    type="button"
                                >
                                    <Image className="w-5 h-5" />
                                    <Video className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/jpeg,image/png,image/gif,video/mp4,video/mpeg,video/quicktime"
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
                                {isSubmitting ? buttonText[1] : buttonText[0]}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}