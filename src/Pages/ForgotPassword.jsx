import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowUpRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import AuthShell from "../components/AuthShell";
import FormInput from "../components/FormInput";
import AuthButton from "../components/AuthButton";
import { forgotPasswordSendOTP, forgotPasswordVerifyOTP } from "../api/authApi";

const emailSchema = z.object({
  email: z.string().min(1, "Please enter your email").email("Please enter a valid email"),
});

const resetSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const OTP_LENGTH = 6;

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp + new password
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({ resolver: zodResolver(emailSchema) });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm({ resolver: zodResolver(resetSchema) });

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const requestOtp = async (values) => {
    setLoading(true);
    try {
      await forgotPasswordSendOTP({ email: values.email });
      setEmail(values.email);
      setStep(2);
      setResendTimer(60);
      toast.success("We've sent a verification code to your email 📩");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't send the code, please try again");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0 || !email) return;
    setLoading(true);
    try {
      await forgotPasswordSendOTP({ email });
      setResendTimer(60);
      toast.info("A new code is on its way");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't resend the code, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setOtpError("");
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setOtp(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || ""));
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const submitReset = async (values) => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setOtpError("Please enter the full code");
      return;
    }
    setLoading(true);
    try {
      await forgotPasswordVerifyOTP({ email, otp: code, newPassword: values.newPassword });
      toast.success("Your password has been reset 🎉 Please sign in");
      navigate("/login", { replace: true });
    } catch (err) {
      setOtpError(err?.response?.data?.message || "That code is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={step === 1 ? "Forgot Password?" : "Reset Your Password"}
      subtitle={
        step === 1
          ? "Enter your email and we'll send you a verification code"
          : `We sent a ${OTP_LENGTH}-digit code to ${email}`
      }
      footer={
        <span className="text-[#7a6f68] dark:text-[#a0948c]">
          Remembered your password?{" "}
          <NavLink to="/login" className="font-semibold text-[#2a2421] hover:underline dark:text-[#f3ece7]">
            Sign in
          </NavLink>
        </span>
      }
    >
      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                step >= s
                  ? "bg-[#c2a38e] text-zinc-950"
                  : "bg-[#e4dcd5] text-[#a0948c] dark:bg-[#2e2623]"
              }`}
            >
              {s}
            </div>
            {s === 1 && <div className={`h-px w-8 ${step >= 2 ? "bg-[#c2a38e]" : "bg-[#e4dcd5] dark:bg-[#2e2623]"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="email"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleEmailSubmit(requestOtp)}
            noValidate
          >
            <FormInput
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              error={emailErrors.email?.message}
              {...registerEmail("email")}
            />

            <AuthButton type="submit" loading={loading} className="mt-2">
              <span>Send Code</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </AuthButton>
          </motion.form>
        ) : (
          <motion.form
            key="reset"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleResetSubmit(submitReset)}
            noValidate
          >
            <div className="mb-2 flex justify-center gap-2" dir="ltr" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className={`h-12 w-11 rounded-xl border bg-[#f7f2ed] text-center text-lg font-bold text-[#2a2421] outline-none transition-colors dark:bg-[#1f1a18] dark:text-[#f3ece7] ${
                    otpError
                      ? "border-red-400"
                      : "border-[#e4dcd5] focus:border-[#c2a38e] dark:border-[#38302c]"
                  }`}
                />
              ))}
            </div>
            {otpError && <p className="mb-2 text-center text-xs text-red-500">{otpError}</p>}

            <div className="mb-5 mt-3 flex items-center justify-center gap-1 text-xs text-[#7a6f68] dark:text-[#a0948c]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c2a38e]" />
              <span>Enter the code, then set a new password</span>
            </div>

            <FormInput
              label="New Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={resetErrors.newPassword?.message}
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
              {...registerReset("newPassword")}
            />
            <FormInput
              label="Confirm New Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={resetErrors.confirmPassword?.message}
              {...registerReset("confirmPassword")}
            />

            <AuthButton type="submit" loading={loading} className="mt-2">
              <span>Reset Password</span>
              <ShieldCheck className="h-4 w-4" />
            </AuthButton>

            <div className="mt-5 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 font-medium text-[#7a6f68] hover:text-[#2a2421] dark:text-[#a0948c] dark:hover:text-[#f3ece7]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>

              <button
                type="button"
                onClick={resendOtp}
                disabled={resendTimer > 0}
                className="font-semibold text-[#c2a38e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}