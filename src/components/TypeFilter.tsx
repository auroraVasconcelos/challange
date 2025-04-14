
import typeColorMap from "@/lib/typeColor";

interface TypeFilterProps {
  types: string[];
  selectedTypes: string[];
  onChange: (type: string[]) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ types, selectedTypes, onChange }) => {
  return (
      <div className="flex flex-wrap gap-4 sm:grid sm:grid-cols-1 ">
        {types.map((type) => (
          <div key={type} className="flex items-center gap-1">
            <input
            type="checkbox"
            className={`
              appearance-none w-3 h-3 border border-black dark:border-gray-300 rounded
              checked:bg-black checked:border-transparent dark:checked:bg-gray-300
            `}
            checked={selectedTypes.includes(type)}
            onChange={() => {
              if (selectedTypes.includes(type)) {
                onChange(selectedTypes.filter((t) => t !== type));
              } else {
                onChange([...selectedTypes, type]);
              }
            }}
          />
            {/* <span className="border border-white h-3 w-3"></span> */}
            <span className="text-sm text-gray-800 dark:text-gray-100 capitalize">{type}</span>
            <span
              key={type}
              className={`inline-block w-3 h-3 rounded-full`}
              style={{ backgroundColor: typeColorMap[type] }}
            ></span>
          </div>
        ))}
      </div>
  );
};

export default TypeFilter;