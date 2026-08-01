import React, { useState } from 'react'

const FilterSideBar = ({ allProduct, priceRange, setPriceRange, search, setSearch, selectedCategory, setSelectedCategory, selectedBrand, setSelectedBrand }) => {

    const categories = allProduct.map((p) => { return p.category });
    const uniqueCategories = ["All", ...new Set(categories)];

    const brands = allProduct.map((p) => { return p.brand });
    const uniqueBrands = ["All", ...new Set(brands)];

    const handleChangeMinRange = (e) => {
        let value = Number(e.target.value);
        if (value <= priceRange[1]) {
            setPriceRange([value, priceRange[1]]);
        }

    }
    const handleChangeMaxRange = (e) => {
        let value = Number(e.target.value);
        if (value >= priceRange[0]) {
            setPriceRange([priceRange[0], value]);
        }
    }

    const handleResetFilters = () => {
        setSearch('');
        setSelectedCategory('All');
        setSelectedBrand('All');
        setPriceRange([0, 999999]);
    }

    return (
        <div className="w-64 p-5 bg-[#f6f7f9] rounded-lg shadow-sm font-sans text-gray-800">
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value) }}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-500"
                />
            </div>
            <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-black">Category</h3>
                <div className="flex flex-col space-y-3">

                    {
                        uniqueCategories.map((category) => (
                            <label key={category} className="flex items-center text-[15px] cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category}
                                    checked={selectedCategory === category}
                                    onChange={() => setSelectedCategory(category)}
                                    className="w-4 h-4 mr-3 bg-white border-gray-400 text-black focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />
                                {category}
                            </label>
                        ))
                    }

                </div>
            </div>
            <div>
                <h3 className="mb-3 text-lg font-semibold text-black">Brand</h3>
                <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value) }} className="w-full px-3 py-2 text-[15px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 cursor-pointer shadow-sm">
                    {
                        uniqueBrands.map((brand, index) => (
                            <option key={index} value={brand}>{brand.toUpperCase()}</option>
                        ))
                    }

                </select>
            </div>
            <div className="">
                <h3 className="my-2 text-lg font-semibold text-black">Price Range</h3>
                <p className="text-sm text-gray-600 mb-2">Price Range: ₹{priceRange?.[0]} - ₹{priceRange?.[1]}</p>
                <div className="flex items-center align-start">
                    <input type="number" value={priceRange[0]} min="0" max="50000" onChange={handleChangeMinRange} className="w-full px-3 py-2 text-[15px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 cursor-pointer shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="mx-2 text-gray-600">-</span>
                    <input type="number" value={priceRange[1]} min="0" max="999999" onChange={handleChangeMaxRange} className="w-full px-3 py-2 text-[15px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 cursor-pointer shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none " />
                </div>
                <input type="range" value={priceRange[0]} onChange={handleChangeMinRange} min="0" max="50000" step="100" name="price" id="price" className="w-full mt-2" />
                <input type="range" value={priceRange[1]} onChange={handleChangeMaxRange} min="0" max="999999" step="100" name="price" id="price" className="w-full mt-1" />

            </div>

            <button onClick={handleResetFilters} className="w-full bg-[#E3007E] hover:bg-[#C2006B] text-white py-2.5 rounded-xl font-medium transition-colors duration-200 cursor-pointer">
                Reset Filters
            </button>
        </div>
    )
}

export default FilterSideBar