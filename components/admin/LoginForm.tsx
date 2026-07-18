'use client'
import React from 'react'
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});
type FormFields = z.infer<typeof schema>;

const LoginForm = () => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({ resolver: zodResolver(schema) });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate async operation
            console.log('Login data:', data);
        } catch (error) {
            setError('root', { type: 'manual', message: 'Submission failed' });
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white p-6 md:p-8 rounded-md shadow-sm">
                <h2 className="text-2xl font-semibold text-center mb-6">Admin Dashboard</h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <label className="text-sm font-medium">Email</label>
                    {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
                    <input type="email" className='w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16205B]' placeholder="your@email.com" {...register('email')} />

                    <label className="text-sm font-medium">Password</label>
                    {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
                    <input type="password" className='w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16205B]' placeholder="••••••••" {...register('password')} />

                    <div className="flex justify-center">
                        <button type="submit" className="rounded-full bg-[#16205B] mt-4 px-6 py-2 w-full md:w-auto text-md text-white font-semibold shadow-md transition-all duration-300 hover:bg-[#0f1a4a] active:scale-95" disabled={isSubmitting}>{isSubmitting ? 'Logging In…' : 'Login'}</button>
                    </div>

                    {errors.root && <span className='text-red-500 text-center'>{errors.root.message}</span>}
                </form>
            </div>
        </div>
    )
}

export default LoginForm