import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowUpRight } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import AuthShell from "../components/AuthShell";
import FormInput from "../components/FormInput";
import AuthButton from "../components/AuthButton";
import { login, authMe } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email").email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await login(values);
      const token = res?.data?.token || res?.data?.data?.token;
      const user = res?.data?.user || res?.data?.data?.user;

      if (!token) throw new Error("no-token");

      loginSuccess(token, user);

      try {
        const meRes = await authMe();
        const freshUser = meRes?.data?.user || meRes?.data?.data || meRes?.data;
        if (freshUser && typeof freshUser === "object") {
          loginSuccess(token, { ...user, ...freshUser });
        }
      } catch (e) {
        console.error("authMe failed:", e?.response?.data || e);
      }

      toast.success("Welcome back to Dokkan ");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.message === "no-token" ? "Something went wrong, please try again" : "Incorrect email or password");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign In"
      subtitle="Great to see you again at Dokkan"
      footer={
        <span className="text-[#7a6f68] dark:text-[#a0948c]">
          Don't have an account?{" "}
          <NavLink to="/register" className="font-semibold text-[#2a2421] hover:underline dark:text-[#f3ece7]">
            Sign up
          </NavLink>
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormInput
          label="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-[#a0948c] hover:text-[#c2a38e] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register("password")}
        />

        <div className="mb-6 flex justify-end">
          <NavLink to="/forgot-password" className="text-xs font-medium text-[#c2a38e] hover:underline">
            Forgot password?
          </NavLink>
        </div>

        <AuthButton type="submit" loading={loading}>
          <span>Sign In</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </AuthButton>
      </form>
    </AuthShell>
  );
}