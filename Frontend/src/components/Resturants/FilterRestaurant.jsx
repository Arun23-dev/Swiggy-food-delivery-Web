import React, { useState } from "react";

const sortOptions = [
    { id: "relevance", label: "Relevance (Default)" },
    { id: "delivery", label: "Delivery Time" },
    { id: "rating", label: "Rating" },
    { id: "low_to_high", label: "Cost: Low to High" },
    { id: "high_to_low", label: "Cost: High to Low" },
];

const chips = [
    { id: "offers", label: "Offers" },
    { id: "rating_4", label: "Ratings 4.0+" },
    { id: "300_600", label: "Rs. 300–Rs. 600" },
    { id: "less_300", label: "Less than Rs. 300" },
    { id: "pure_veg", label: "Pure Veg" },
    { id: "non_veg", label: "Non Veg" },
];

function FilterRestaurant({ onSortChange, onFilterChange, activeFilter }) {
    const [selected, setSelected] = useState("relevance");
    const [dropDown, setDropDown] = useState(false);

    const toggleDropDown = () => setDropDown((prev) => !prev);

    const handleApply = () => {
        setDropDown(false);
        onSortChange(selected);
    };

    return (
        <div className="flex items-center gap-2 flex-wrap py-3">

            {/* ── Sort By Button ── */}
            <div className="relative">

                <button
                    onClick={toggleDropDown}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 cursor-pointer select-none"
                >
                    Sort By
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* ── Sort Dropdown ── */}
                {dropDown && (
                    <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                        <div className="px-5 pt-4 pb-2">
                            {sortOptions.map((option, index) => (
                                <div key={option.id}>
                                    <div
                                        className="flex items-center justify-between py-3 cursor-pointer"
                                        onClick={() => setSelected(option.id)}
                                    >
                                        {option.id === "relevance" ? (
                                            <span className="text-gray-800 font-bold text-base leading-snug">
                                                Relevance<br />(Default)
                                            </span>
                                        ) : (
                                            <span className={`text-base ${selected === option.id ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
                                                {option.label}
                                            </span>
                                        )}
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected === option.id ? "border-red-500" : "border-gray-300"}`}>
                                            {selected === option.id && <div className="w-3 h-3 rounded-full bg-red-500" />}
                                        </div>
                                    </div>
                                    {index < sortOptions.length - 1 && <div className="h-px bg-gray-100" />}
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-gray-200" />

                        <button
                            onClick={handleApply}
                            className="w-full text-center text-red-500 font-bold text-lg py-4 hover:text-red-600 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {/* ── Filter Button ── */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-800 rounded-full text-gray-800 text-sm font-medium shadow-sm hover:bg-gray-50 transition-all">
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilter.length > 0 ? activeFilter.length : 1}
                </span>
                Filter
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
                </svg>
            </button>

            {/* ── Cost Sort Chip ── */}
            <button
                onClick={toggleDropDown}
                className={`flex items-center gap-1.5 px-4 py-2 border rounded-full text-sm font-medium shadow-sm transition-all ${selected === "high_to_low" || selected === "low_to_high"
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
            >
                {selected === "low_to_high" ? "Cost: Low to High" : "Cost: High to Low"}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* ── Bolt 15 mins ── */}
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50 transition-all">
                <span className="font-bold text-gray-900 text-xs">
                    Bolt<span className="text-orange-500">⚡</span>
                </span>
                15 mins
            </button>

            {/* ── Toggleable Filter Chips ── */}
            {chips.map((chip) => (
                <button
                    key={chip.id}
                    onClick={() => onFilterChange(chip.id)}
                    className={`px-4 py-2 border rounded-full text-sm font-medium shadow-sm transition-all ${activeFilter
                        .includes(chip.id)
                        ? "bg-gray-800 text-white border-gray-800"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                >
                    {chip.label}
                </button>
            ))}

            {/* ── Cuisines ── */}
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50 transition-all">
                Cuisines
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

        </div>
    );
}

export default FilterRestaurant;
