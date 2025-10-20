"use client";

import React, { useState } from "react";
import { RefinementList, useRefinementList, useClearRefinements } from "react-instantsearch";
import { useRouter } from "next/navigation";
import { Car, ChevronDown, ChevronRight, VariableIcon, VectorSquareIcon } from "lucide-react";

export const Filters = ({ isLanding = false }) => {
  const { refine: clearRefinements } = useClearRefinements();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState(["Make"]);

  const currentFilters = [
    {
      title: 'Make',
      icon: Car,
      attribute: "make",
    },
    {
      title: 'Model',
      attribute: "model",
      icon: Car,
    },
    {
      title: 'Body Type',
      attribute: "bodyType",
      icon: Car,
    },
    {
      title: 'Year',
      attribute: "modelYear",
      icon: Car,
    },
  ];

  const selectFilter = (value: string) => {
    if (selectedFilter?.includes(value)) {
      const filterArr = [...selectedFilter];
      const filterIndex = selectedFilter.indexOf(value);
      filterArr.splice(filterIndex, 1);
      setSelectedFilter(filterArr);
    } else {
      setSelectedFilter([...selectedFilter, value]);
    }
  };

  const renderIcon = (value: string) => {
    return (
      <>
        {selectedFilter?.includes(value) ? (
          <ChevronDown size={20} className="text-gray-700" />
        ) : (
          <ChevronRight size={20} className="text-gray-500" />
        )}
      </>
    );
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-soft">
      <div className="bg-white p-5 border-b w-64 flex items-center justify-between">
        <h2 className="font-bold text-xl text-gray-800">Filters</h2>
        {isLanding ? (
          <button 
            className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200" 
            onClick={() => {
              clearRefinements();
              router.push('/')
            }}
          >
            Clear All
          </button>
        ) : null}
      </div>

      {currentFilters?.map((filter, index) => {
        const isSelected = selectedFilter?.includes(filter?.title);
        return (
          <div
            key={"_Filters-" + index + "_Item"}
            className="w-64 border-gray-200 border-b last:border-b-0"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                selectFilter(filter?.title);
              }}
              className={`flex w-full items-center justify-between px-5 py-3.5 transition-colors duration-200 ${isSelected
                ? "bg-gray-100"
                : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <filter.icon
                  size={18}
                  className={`${isSelected ? "text-gray-800" : "text-gray-500"}`}
                />
                <span
                  className={`font-medium ${isSelected
                    ? "text-gray-900"
                    : "text-gray-700"
                  }`}
                >
                  {filter.title}
                </span>
              </div>
              {renderIcon(filter?.title)}
            </button>

            <div
              className={`${selectedFilter?.includes(filter?.title)
                ? "flex flex-col bg-white px-5 py-3 border-t border-gray-100"
                : "hidden"
              }`}
            >
              {filter.attribute === "make" || filter.attribute === "bodyType" || filter.attribute === "model" || filter.attribute === "modelYear" ? (
                <>
                  <RefinementList 
                    attribute={filter?.attribute}
                    classNames={{
                      root: "space-y-2",
                      labelText: "text-gray-600 ml-2 text-sm",
                      count: "text-gray-500 text-xs ml-1.5 bg-gray-100 px-1.5 py-0.5 rounded-full",
                      showMore: "mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200",
                      checkbox: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    }}
                  />
                  <hr
                    className={"my-3 border-gray-200"}
                    aria-hidden="true"
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export function VirtualFilters() {
  useRefinementList({ attribute: "make" });
  useRefinementList({ attribute: "model" });
  return null;
}
