import { useState } from "react";

export default function Table({ data, columns }) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Search filter
  const filteredData = data.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Sort function
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const valA = a[sortColumn];
    const valB = b[sortColumn];

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Sort handler
  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded mb-3 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <table className="w-full border-collapse shadow-md">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="p-3 cursor-pointer border"
                onClick={() => handleSort(col.accessor)}
              >
                {col.label}
                {sortColumn === col.accessor &&
                  (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-100">
              {columns.map((col) => (
                <td key={col.accessor} className="p-3 border">
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}