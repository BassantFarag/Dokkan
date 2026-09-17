const FilterSidebar = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full lg:w-72 xl:w-80 shrink-0">
      
      {/* 1. فئة المنتجات Category */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3 text-base">Category</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category" 
              defaultChecked 
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category" 
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>Phones</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category" 
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span>Electronics</span>
          </label>
        </div>
      </div>

      {/* 2. نطاق السعر Price Range */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3 text-base">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 3. الترتيب Sort By */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3 text-base">Sort By</h3>
        <select
          defaultValue="Default"
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="Default">Default</option>
          <option value="Newest">Newest</option>
          <option value="LowToHigh">Price: Low to High</option>
          <option value="HighToLow">Price: High to Low</option>
          <option value="TopRated">Top Rated</option>
        </select>
      </div>

      {/* 4. زر مسح الفلاتر Clear All Filters */}
      <button 
        type="button"
        className="w-full py-2.5 border border-indigo-600 text-indigo-600 font-medium rounded-xl text-sm hover:bg-indigo-50 transition-colors"
      >
        Clear All Filters
      </button>

    </div>
  );
};

export default FilterSidebar;