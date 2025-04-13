interface TypeFilterProps {
  types: string[];
  selectedType: string;
  onChange: (type: string) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ types, selectedType, onChange }) => {
  return (
    <div className="mb-6">
      {/* Mobile dropdown */}
      <div className="sm:hidden flex justify-center">
        <select
          value={selectedType}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-300 px-4 py-2 pr-10 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          >
          <option value="">All</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-4 h-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Desktop buttons */}
      <div className="hidden sm:flex flex-wrap gap-2 justify-center mt-4">
        <button
          onClick={() => onChange("")}
          className={`px-4 py-2 rounded-full border ${
            selectedType === "" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`px-4 py-2 rounded-full border capitalize ${
              selectedType === type ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;