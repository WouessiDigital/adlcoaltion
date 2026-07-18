'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoIosClose } from "react-icons/io";
import { useState } from 'react';
import LogoIcon from '../public/logo-icon.png'
import { z } from 'zod';
import Image from 'next/image';


const schema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    name: z.string()
        .min(1, { message: 'Please enter your name.' })
        .regex(/^[A-Za-z]+([ '-][A-Za-z]+)*$/, { message: 'Please enter a valid full name.' }),
    message: z.string().min(1, { message: 'Please enter a message.' })
});

type FormFields = z.infer<typeof schema>;

const Form = () => {
    const [success, setSuccess] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            setSuccess(null); // reset previous success

            const url =
                typeof window !== "undefined"
                    ? `${window.location.origin}/admin/api/submissions`
                    : "/admin/api/submissions";

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(result?.error || "Submission failed");
            }

            reset();
            setSuccess("Thank you! Your submission has been received.");

            // Optional: auto-hide success after 4 seconds
            setTimeout(() => setSuccess(null), 4000);

        } catch (error: any) {
            setSuccess(null);
            setError("root", {
                type: "manual",
                message: error?.message || "Submission failed. Please try again.",
            });
        }
    };

    return (

        <div className='mb-6 sm:mb-8 w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit(onSubmit)}>
                    {errors.name && <span className='text-red-500'>{errors.name.message}</span>}
                    <input type="text" className='w-full border p-3 rounded-md' placeholder="Your Name" {...register("name")} />
                    {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
                    <input type="email" className='w-full border p-3 rounded-md' placeholder="Your Email" {...register("email")} />
                    {errors.message && <span className='text-red-500'>{errors.message.message}</span>}
                    <textarea rows={6} className='w-full border p-3 rounded-md  min-h-[10rem] resize-y' placeholder="Your Message" {...register("message")} />
                    <div className="flex justify-center flex-col gap-4 items-center">
                        {success && (
                            <div className="rounded-md bg-green-50 border border-[#FF7300] p-3 text-green-700 text-center text-sm">
                                {success}
                            </div>
                        )}
                        <button type="submit" className="rounded-full bg-[#FF7300] px-4 py-4 sm:w-40 sm:w-70 text-md sm:text-2xl text-white font-semibold shadow-md transition-all duration-300 hover:bg-[#facc15] hover:shadow-lg active:scale-95" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Become A Member"}</button>
                    </div>
                    {errors.root && <span className='text-red-500'>{errors.root.message}</span>}
                </form>
            </div>
        </div>

    )
}

export default Form