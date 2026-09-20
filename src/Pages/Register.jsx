import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowUpRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import AuthShell from "../components/AuthShell";
import FormInput from "../components/FormInput";
import AuthButton from "../components/AuthButton";
import { sendRegisterOTP, verifyRegisterOTP } from "../api/authApi";

// ✅ الأسماء مطابقة للـ backend: username, rePassword
const infoSchema = z
  .object({
    username: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Please enter your email").email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number").max(15, "Please enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

const OTP_LENGTH = 6;

export default function Register() {
  const [step, setStep] = useState(1); // 1 = info, 2 = otp
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(infoSchema) });

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

 
  const getErrorMessage = (err, fallback) => {
    const data = err?.response?.data;
    if (Array.isArray(data?.errors) && data.errors.length) {
      return data.errors.join(" • ");
    }
    return data?.message || err?.message || fallback;
  };

  // send payload
  const requestOtp = async (values) => {
    setLoading(true);
    try {
  
      const payload = {
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };

      const res = await sendRegisterOTP(payload);
      const data = res.data || {};

     
      if (data.success === false) {
        throw new Error(data.message || "Server rejected the request");
      }

      setUserInfo(payload);
      setStep(2);
      setResendTimer(60);
      toast.success(data.message || "We've sent a verification code to your email");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't send the code, please try again"));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // هراجع علي الشرط دا تاني 
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
    // clean otp
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    //check again 
    setOtp(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || ""));
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const submitOtp = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setOtpError("Please enter the full code");
      return;
    }
    setLoading(true);
    try {
      await verifyRegisterOTP({ email: userInfo.email, otp: code });
      toast.success("Your account is verified Please sign in to continue");
      navigate("/login", { replace: true });
    } catch (err) {
      setOtpError(getErrorMessage(err, "That code is invalid or has expired"));
      toast.error("That code is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0 || !userInfo){
       toast.error(`wait for ${resendTimer} S to resend the code`);
       return;}
    setLoading(true);
    try {
      await sendRegisterOTP(userInfo);
      setResendTimer(60);
      toast.info("A new code is on its way");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't resend the code, please try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={step === 1 ? "Create Your Account" : "Verify Your Email"}
      subtitle={
        step === 1
          ? "Join Dokkan in seconds"
          : `We sent a ${OTP_LENGTH}-digit code to ${userInfo?.email || "your email"}`
      }
      footer={
        step === 1 && (
          <span className="text-[#7a6f68] dark:text-[#a0948c]">
            Already have an account?{" "}
            <NavLink to="/login" className="font-semibold text-[#2a2421] hover:underline dark:text-[#f3ece7]">
              Sign in
            </NavLink>
          </span>
        )
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
            key="info"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit(requestOtp)}
            noValidate
          >
            <FormInput
              label="Full Name"
              icon={User}
              placeholder="Your name"
              error={errors.username?.message}
              {...register("username")}
            />
            <FormInput
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <FormInput
              label="Phone Number"
              icon={Phone}
              type="tel"
              placeholder="01xxxxxxxxx"
              error={errors.phone?.message}
              {...register("phone")}
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
            <FormInput
              label="Confirm Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.rePassword?.message}
              {...register("rePassword")}
            />

            <AuthButton type="submit" loading={loading} className="mt-2">
              <span>Create Account</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </AuthButton>
          </motion.form>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
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

            <div className="mb-6 mt-3 flex items-center justify-center gap-1 text-xs text-[#7a6f68] dark:text-[#a0948c]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c2a38e]" />
              <span>Stay on this page until the code is confirmed</span>
            </div>

            <AuthButton onClick={submitOtp} loading={loading}>
              <span>Verify Code</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}