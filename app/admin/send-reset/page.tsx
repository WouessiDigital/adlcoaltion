'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import React from 'react'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Logo from "../../../public/LOGO.png";
import Image from "next/image";
import { Quicksand } from 'next/font/google';
import { IoIosCheckmarkCircle } from "react-icons/io";

const quicksand = Quicksand({ subsets: ['latin'] });

const page = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // useSession is a React hook — must be called inside the component
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      // Basic client-side validation to avoid obvious typos
      const emailTrimmed = (email || "").trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      console.log("Requesting password reset for:", emailTrimmed);

      const result = await authClient.requestPasswordReset({
        email: emailTrimmed,
        redirectTo: "/admin/reset-password",
      });

      if (result.error) {
        // For security and better UX: do not reveal whether the email exists.
        // Log details for debugging, but show a neutral success message to the user.
        console.error('requestPasswordReset error', result.error);
        setSuccess(true);
      } else {
        setSuccess(true);
      }

    } catch (error) {
      setError("Failed to send reset link");
      console.error("Reset password error:", error)
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while session is loading
if (isPending) return null;

   // Block access if not signed in
  if (!session) {
      return (
         <div className={"min-h-screen flex items-center justify-center bg-[#F8F6F5]"}>
             <p className="text-gray-500">You are not authorized to view this page. <Link href="/admin/login" className="text-[#4B2E38] underline">Sign in</Link></p>
         </div>
     );
  }

  return (
    <div className="bg-white">
       <Image src={Logo} alt="ADLC logo" width={200} height={200} className="absolute top-15 p-4 left-25" />
      <div className="min-h-screen  flex  flex-col items-center justify-center">


        {success ? (
          <div className="space-y-8 w-[30%]">
            <Alert>
              <div className="flex flex-row items-center gap-1">
              <AlertTitle className="font-bold">Password Reset Link Sent</AlertTitle> <div className=""><IoIosCheckmarkCircle color="#4CAF50" /></div>
             </div>
              <AlertDescription>
                A password reset link has been sent to: {email}. Please check your email.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Card className=" max-w-sm shadow-sm w-[30%]">
            <CardHeader>
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <CardDescription>Enter your email to receive a password reset link</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-3xl text-sm outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
                )}
                <Button type="submit" className="w-full rounded-3xl bg-[#16205B]" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button type="button" variant="outline" className="w-full bg-transparent rounded-3xl" onClick={() => router.push("/admin/login")}>
                  Back to Login
                </Button>
              </form>

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default page;