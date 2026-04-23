import { useState } from "react";
import CreatableSelect from "react-select/creatable";

export default function CategoryDropdown({options, setOptions,selected,setSelected}) {
  // ✅ Create new category
  const handleCreate = (inputValue) => {
    const trimmed = inputValue.trim();

    if (!trimmed) return;

    
    const exists = options.some(
      (opt) => opt.label.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) return;

    const newOption = {
      value: trimmed.toLowerCase().replace(/\s+/g, "_"),
      label: trimmed
    };

    setOptions((prev) => [...prev, newOption]);
    setSelected(newOption);

  };
  const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#e5e7eb",
    borderRadius: "12px",
    padding: "1px",
    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
    border: "none",
    textAlign: "center",
    fontSize: "1.25rem",
    fontWeight: 500,
    color: "#000000",
  }),

  valueContainer: (base) => ({
    ...base,
    justifyContent: "center",
    color: "#000000",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#000000" // 👈 placeholder color
  }),
  input: (base) => ({
    ...base,
    textAlign: "center",
    color: "#000000",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#d1d5db" : "white",
    cursor: "pointer",
    color: "#000000",
  })
};
  return (
    <div className="w-full max-w-sm">
      <CreatableSelect
        value={selected}
        onChange={setSelected}
        options={options}
        onCreateOption={handleCreate}
        placeholder="Select or create category"
        styles={customStyles}
        formatCreateLabel={(input) => `+ Add "${input}"`}
        isClearable
        required
      />
    </div>
  );
}