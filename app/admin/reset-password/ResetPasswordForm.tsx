"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoIosHome } from "react-icons/io";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Logo from "../../../public/LOGO.png";
import Image from "next/image";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid or missing reset token");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      if (result.error) {
        setError(result.error.message || "Failed to reset password");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className=''>
        <Image src={Logo} alt="ADLC logo" width={200} height={200} className="absolute top-15 p-4 left-25" />

      </div>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">

        <Card className="w-[30%] max-w-md">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 ">
                <Label htmlFor="password" className="mb-4">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!token}
                  className="mb-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="mb-4">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!token}
                  className="mb-4"

                />
              </div>
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-[#16205B] mb-4"
                disabled={loading || !token}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              <Button asChild variant="outline" className="w-full  text-black bg-[#F8F6F5] hover:bg-[#FF7300] hover:text-white">
                <Link href="/admin/login">Back to Login</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
