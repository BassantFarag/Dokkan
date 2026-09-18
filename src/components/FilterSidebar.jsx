const FilterSidebar = ({ filter, setFilter }) => {

  const clearFilters = () => {
    setFilter({
      category: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "Default",
    });
  };

  return (
    <div className="bg-brand-card p-6 rounded-2xl shadow-sm border border-brand-border w-full lg:w-72 xl:w-80 shrink-0 text-brand-primary">
      
   
      <div className="mb-6">
        <h3 className="font-bold text-brand-primary mb-3 text-base">
          Category
        </h3>

        <div className="space-y-2 text-sm text-brand-secondary">

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value="all"
          
              checked={filter.category === "all"}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  category: e.target.value,
                })
              }
              className="accent-brand-gold focus:ring-brand-gold"
            />
            <span>All</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-brand-primary transition-colors">
            <input
              type="radio"
              name="category"
              value="home"
              checked={filter.category === "home"}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  category: e.target.value,
                })
              }
              className="accent-brand-gold focus:ring-brand-gold"
            />
            <span>Home</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value="phones"
              checked={filter.category === "phones"}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  category: e.target.value,
                })
              }
              className="accent-brand-gold focus:ring-brand-gold"
            />
            <span>Phones</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value="electronics"
              checked={filter.category === "electronics"}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  category: e.target.value,
                })
              }
              className="accent-brand-gold focus:ring-brand-gold"
            />
            <span>Electronics</span>
          </label>
        </div>
      </div>

    
      <div className="mb-6">
        <h3 className="font-bold text-brand-primary mb-3 text-base">
          Price Range
        </h3>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filter.minPrice}
            onChange={(e) =>
              setFilter({
                ...filter,
                minPrice: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-brand-main border border-brand-border rounded-lg text-sm text-brand-primary placeholder:text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-gold"
          />

          <input
            type="number"
            placeholder="Max"
            value={filter.maxPrice}
            onChange={(e) =>
              setFilter({
                ...filter,
                maxPrice: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-brand-main border border-brand-border rounded-lg text-sm text-brand-primary placeholder:text-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-gold"
          />
        </div>
      </div>

   
      <div className="mb-6">
        <h3 className="font-bold text-brand-primary mb-3 text-base">
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
          className="w-full px-3 py-2 bg-brand-main border border-brand-border rounded-lg text-sm text-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-gold"
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
        className="w-full py-2.5 border border-brand-gold text-brand-gold font-medium rounded-xl text-sm hover:bg-brand-gold hover:text-brand-main transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;

