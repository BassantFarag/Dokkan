import React, { forwardRef } from "react";

const FormInput = forwardRef(function FormInput(
  { label, icon: Icon, error, type = "text", rightElement, ...rest },
  ref
) {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-1.5 block text-xs font-semibold text-[#4a423d] dark:text-[#cdc0b8]">
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 rounded-xl border bg-[#f7f2ed] px-3.5 py-2.5 transition-colors dark:bg-[#1f1a18] ${
          error
            ? "border-red-400 dark:border-red-500"
            : "border-[#e4dcd5] focus-within:border-[#c2a38e] dark:border-[#38302c] dark:focus-within:border-[#c2a38e]"
        }`}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-[#a0948c]" />}
        <input
          ref={ref}
          type={type}
          className="w-full bg-transparent text-sm text-[#2a2421] placeholder-[#a0948c] outline-none dark:text-[#f3ece7]"
          {...rest}
        />
        {rightElement}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default FormInput;
