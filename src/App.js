import React, { useEffect, useMemo, useState } from "react";
import SimpleTable from "./components/SimpleTable";
import UserForm from "./components/UserForm";

import { groupByFields, sumNestedHours } from "./lib/utils";

/* ------------ helpers ------------- */
// UTC YYYY-MM-DD
function formatDateISO(d) {
  return new Date(d).toISOString().slice(0, 10);
}

// Derive a readable property name from the fieldPath.
// "employee.name" -> "employee", "project.name" -> "project", "date" -> "date"
function accessorFrom(fieldPath) {
  if (fieldPath === "date") return "date";
  const [root] = fieldPath.split(".");
  //if the root is not found, we return "value"  -fal
  return root || "value";
}

// Convert a totals map (e.g., { "Alice": 9 }) into sorted table rows
// using a meaningful property name (label), e.g., "employee".
function toRowsFromTotals(totalsByLabelValue, label) {
  const rows = [];
  for (const [labelValue, totalHours] of Object.entries(totalsByLabelValue)) {
    rows.push({ [label]: labelValue, hours: totalHours });
  }
  rows.sort((a, b) => b.hours - a.hours); // largest totals first
  return rows;
}

function buildFlatView(data = []) {
  const rows = [...data]
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
    .map((r) => ({
      project: r.project.name,
      employee: r.employee.name,
      date: formatDateISO(r.date), // display UTC day
      hours: r.hours,
    }));

  const columns = [
    { key: "project", header: "Project" },
    { key: "employee", header: "Employee" },
    { key: "date", header: "Date" },
    { key: "hours", header: "Hours", align: "right" },
  ];

  return { columns, rows };
}

// Builds a 2-column summary table with explicit labeling
function buildTwoColumnTable(data, fieldPath, headerLabel) {
  // 1) Choose a clear column/row property name
  const label = accessorFrom(fieldPath); // "employee" | "project" | "date"

  // 2) Normalize to UTC day when grouping by date
  const source =
    fieldPath === "date"
      ? data.map((r) => ({ ...r, date: formatDateISO(r.date) }))
      : data;

  // 3) Group by the requested field and 4) sum hours per group
  const groupedByLabel = groupByFields(source, [fieldPath]);
  const totalsByLabelValue = sumNestedHours(groupedByLabel);

  // 5) Convert to sorted table rows like: [{ employee: "Alice", hours: 9 }, ...]
  const rows = toRowsFromTotals(totalsByLabelValue, label);

  // 6) Columns use the readable key, not "key"
  const columns = [
    { key: label, header: headerLabel },
    { key: "hours", header: "Hours", align: "right" },
  ];

  return { columns, rows };
}

// two fields -> flatten nested object into rows with explicit keys
function buildTwoKeyTable(data, fieldA, fieldB, headerA, headerB) {
  const aKey = accessorFrom(fieldA); // "employee" | "project" | "date"
  const bKey = accessorFrom(fieldB);

  // Normalize date to UTC day if either field is "date"
  const needsDateNorm = (f) => f === "date";
  const source =
    needsDateNorm(fieldA) || needsDateNorm(fieldB)
      ? data.map((r) => ({ ...r, date: formatDateISO(r.date) }))
      : data;

  // Group and sum: { AValue: { BValue: totalHours } }
  const grouped = groupByFields(source, [fieldA, fieldB]);
  const summed = sumNestedHours(grouped); // { A: { B: number } }

  // Create a list of table rows from the nested totals object
  const rows = [];

  for (const [firstGroupName, totalsBySecondGroup] of Object.entries(summed)) {
    // firstGroupName = value for the first column (e.g., employee name)
    // totalsBySecondGroup = object where keys are second column values (e.g., project names)
    //                       and values are the total hours

    for (const [secondGroupName, totalHours] of Object.entries(totalsBySecondGroup)) {
      // secondGroupName = value for the second column (e.g., project name)
      // totalHours = summed hours for this combination of first+second group

      rows.push({
        [aKey]: firstGroupName,   // e.g., employee: "Alice"
        [bKey]: secondGroupName,  // e.g., project: "Project A"
        hours: totalHours,
      });
    }
  }

  // Sort rows so that the highest total hours come first
  rows.sort((rowA, rowB) => rowB.hours - rowA.hours);

  const columns = [
    { key: aKey, header: headerA },
    { key: bKey, header: headerB },
    { key: "hours", header: "Hours", align: "right" },
  ];

  return { columns, rows };
}

function computeView(mode, data) {
  switch (mode) {
    case "none":
      return buildFlatView(data);
    case "employee":
      return buildTwoColumnTable(data, "employee.name", "Employee");
    case "project":
      return buildTwoColumnTable(data, "project.name", "Project");
    case "date":
      return buildTwoColumnTable(data, "date", "Date"); // groups by UTC day

    // two-key aggregations
    case "employee-project":
      return buildTwoKeyTable(
        data,
        "employee.name",
        "project.name",
        "Employee",
        "Project"
      );
    case "project-employee":
      return buildTwoKeyTable(
        data,
        "project.name",
        "employee.name",
        "Project",
        "Employee"
      );

    default:
      return buildFlatView(data);
  }
}

/* ------------ component ------------- */
export default function App() {
  const [mode, setMode] = useState("none");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  }, []);

  const { columns, rows } = useMemo(() => computeView(mode, data), [mode, data]);

  return (
    <div className="p-4">
      <h1 className="text-blue-500 text-3xl font-bold mb-4">Multiple Aggregations</h1>

      <UserForm mode={mode} onModeChange={setMode} onReset={() => setMode("none")} />

      {loading && <div className="text-gray-500 mt-2">Loading…</div>}
      {error && <div className="text-red-600 mt-2">Error: {error}</div>}

      {!loading && !error && (
        <>
          <hr className="my-3" />
          <SimpleTable columns={columns} rows={rows} />
        </>
      )}
    </div>
  );
}
