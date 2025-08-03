// src/components/SimpleTable.js
import React from "react";

export default function SimpleTable({ columns = [], rows = [] }) {
  if (!columns.length) return <div className="text-gray-500">No columns</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 text-sm">
        <thead className="sticky top-0 bg-blue-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={[
                  "px-3 py-2 border-b font-semibold whitespace-nowrap",
                  c.align === "right" ? "text-right" : "text-left",
                ].join(" ")}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-3 text-center text-gray-500">
                No data
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr
                key={i}
                className={["border-b", i % 2 ? "bg-gray-50" : "bg-white"].join(" ")}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[
                      "px-3 py-2 align-top whitespace-nowrap",
                      c.align === "right" ? "text-right" : "text-left",
                    ].join(" ")}
                  >
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
