const FilterSidebar = ({ filter, setFilter }) => {
  const clearFilters = () => {
    setFilter({
      category: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "Default",
    });
  };

  const handleCategoryChange = (value) => {
    setFilter({
      ...filter,
      category: value,
    });
  };

  return (
    <div className="w-full bg-brand-card p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-brand-border text-brand-primary">
      <div className="mb-6">
        <h3 className="font-bold text-brand-primary mb-3 text-sm sm:text-base">
          Category
        </h3>

        <div className="space-y-2.5 text-sm text-brand-secondary">
          <label className="flex items-center gap-3 cursor-pointer hover:text-brand-primary transition-colors">
            <input
              type="radio"
              name="category"
              value="all"
              checked={filter.category === "all"}
              onChange={() => handleCategoryChange("all")}
              className="w-4 h-4 accent-brand-gold focus:ring-brand-gold shrink-0"
            />

            <span>All</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-brand-primary transition-colors">
            <input
              type="radio"
              name="category"
              value="home"
              checked={filter.category === "home"}
              onChange={() => handleCategoryChange("home")}
              className="w-4 h-4 accent-brand-gold focus:ring-brand-gold shrink-0"
            />

            <span>Home</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-brand-primary transition-colors">
            <input
              type="radio"
              name="category"
              value="phones"
              checked={filter.category === "phones"}
              onChange={() => handleCategoryChange("phones")}
              className="w-4 h-4 accent-brand-gold focus:ring-brand-gold shrink-0"
            />

            <span>Phones</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-brand-primary transition-colors">
            <input
              type="radio"
              name="category"
              value="electronics"
              checked={filter.category === "electronics"}
              onChange={() => handleCategoryChange("electronics")}
              className="w-4 h-4 accent-brand-gold focus:ring-brand-gold shrink-0"
            />

            <span>Electronics</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-brand-primary mb-3 text-sm sm:text-base">
          Price Range
        </h3>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filter.minPrice}
            onChange={(e) =>
              setFilter({
                ...filter,
                minPrice: e.target.value,
              })
            }
            className="min-w-0 w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-brand-main border border-brand-border rounded-lg text-xs sm:text-sm text-brand-primary placeholder:text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all"
          />

          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filter.maxPrice}
            onChange={(e) =>
              setFilter({
                ...filter,
                maxPrice: e.target.value,
              })
            }
            className="min-w-0 w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-brand-main border border-brand-border rounded-lg text-xs sm:text-sm text-brand-primary placeholder:text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-brand-primary mb-3 text-sm sm:text-base">
          Sort By
        </h3>

        <select
          value={filter.sortBy}
          onChange={(e) =>
            setFilter({
              ...filter,
              sortBy: e.target.value,
            })
          }
          className="w-full px-3 py-2 sm:py-2.5 bg-brand-main border border-brand-border rounded-lg text-xs sm:text-sm text-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all"
        >
          <option value="Default">Default</option>
          <option value="Newest">Newest</option>
          <option value="LowToHigh">Price: Low to High</option>
          <option value="HighToLow">Price: High to Low</option>
          <option value="TopRated">Top Rated</option>
        </select>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="w-full py-2.5 sm:py-3 border border-brand-gold text-brand-gold font-medium rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-brand-gold hover:text-brand-main transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
