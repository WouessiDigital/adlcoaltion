'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoIosClose } from "react-icons/io";
import { useState } from 'react';
import LogoIcon from '../public/logo-icon.png'
import { z } from 'zod';
import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { useI18n } from '../lib/i18n/LocaleProvider';
import type { Dictionary } from '../lib/i18n/dictionaries';


// Names may contain accents and other letters (Hélène Côté, Ngozi Adébáyọ̀), spaces, hyphens and apostrophes.
// The previous A-Z only rule rejected most French and many African names.
const makeSchema = (f: Dictionary['form']) => z.object({
    email: z.string().email({ message: f.errEmail }),
    name: z.string()
        .trim()
        .min(1, { message: f.errNameRequired })
        .regex(/^[\p{L}\p{M}]+([ '’.-]+[\p{L}\p{M}]+)*\.?$/u, { message: f.errName }),
    message: z.string().min(1, { message: f.errMessage })
});

type FormFields = z.infer<ReturnType<typeof makeSchema>>;

const Form = () => {
    const [success, setSuccess] = useState<string | null>(null);
    const { t, locale } = useI18n();
    const schema = useMemo(() => makeSchema(t.form), [t]);
    const honeypot = useRef<HTMLInputElement>(null);

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

            // PHP endpoint on the same host (public/api/submit.php).
            const url = "/api/submit.php";

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, locale, website: honeypot.current?.value || '' }),
            });

            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(res.status === 429 || result?.code === "RATE_LIMITED" ? t.form.errRate : t.form.errGeneric);
            }

            reset();
            setSuccess(t.form.success);

            // Optional: auto-hide success after 4 seconds
            setTimeout(() => setSuccess(null), 4000);

        } catch (error: any) {
            setSuccess(null);
            setError("root", {
                type: "manual",
                message: error?.message || t.form.errGeneric,
            });
        }
    };

    return (

        <div className='mb-6 sm:mb-8 w-full flex justify-center'>
            <div className='w-full max-w-3xl'>
                <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit(onSubmit)}>
                    {/* Honeypot for spam bots: hidden from people and screen readers */}
                    <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                    {errors.name && <span id='err-name' className='text-red-500'>{errors.name.message}</span>}
                    <input type="text" className='w-full border p-3 rounded-md' placeholder={t.form.name} aria-label={t.form.name} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} {...register("name")} />
                    {errors.email && <span id='err-email' className='text-red-500'>{errors.email.message}</span>}
                    <input type="email" className='w-full border p-3 rounded-md' placeholder={t.form.email} aria-label={t.form.email} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} {...register("email")} />
                    {errors.message && <span id='err-message' className='text-red-500'>{errors.message.message}</span>}
                    <textarea rows={6} className='w-full border p-3 rounded-md  min-h-[10rem] resize-y' placeholder={t.form.message} aria-label={t.form.message} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-message' : undefined} {...register("message")} />
                    <div className="flex justify-center flex-col gap-4 items-center">
                        {success && (
                            <div className="rounded-md bg-green-50 border border-[#FF7300] p-3 text-green-700 text-center text-sm">
                                {success}
                            </div>
                        )}
                        <button type="submit" className="rounded-full bg-[#FF7300] px-4 py-4 sm:w-40 sm:w-70 text-md sm:text-2xl text-white font-semibold shadow-md transition-all duration-300 hover:bg-[#facc15] hover:shadow-lg active:scale-95" disabled={isSubmitting}>{isSubmitting ? t.form.submitting : t.form.submit}</button>
                    </div>
                    {errors.root && <span className='text-red-500' role='alert'>{errors.root.message}</span>}
                    <p className='text-xs text-gray-500 text-center'>{t.form.privacy}</p>
                </form>
            </div>
        </div>

    )
}

export default Form