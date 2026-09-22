import { Search } from "lucide-react";

export default function SearchCart({ search, setSearch }) {
  return (
    <div className="w-full mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
      <div className="relative flex-1 min-w-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-secondary">
          <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </div>

        <input
          type="text"
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-brand-card border border-brand-border rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-xs sm:text-sm text-brand-primary placeholder:text-brand-secondary transition-all"
        />
      </div>
    </div>
  );
}