// src/components/UserForm.js
import React from "react";

export default function UserForm({ mode, onModeChange, onReset }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="mb-4">
      <fieldset className="flex items-center gap-3 border-0 p-0 m-0">
        <legend className="sr-only">View options</legend>

        <label className="inline-flex items-center gap-2">
          <span className="text-sm font-medium">Group by:</span>
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">None</option>
            <option value="employee">Employee</option>
            <option value="project">Project</option>
            <option value="date">Date</option>
            <option value="employee-project">Employee → Project</option>
            <option value="project-employee">Project → Employee</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onReset}
          className="text-sm px-3 py-1 rounded bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Reset
        </button>
      </fieldset>
    </form>
  );
}
