"use client";

import { useSearchBox } from "react-instantsearch";
import { useEffect, useRef, useState, useCallback } from "react";
import {Search} from 'lucide-react';
 
export const SearchBox = () => {
  const [hasValue, setHasValue] = useState(false);
  const { query, refine } = useSearchBox();



  // Store hasValue in a ref to avoid re-renders
  const hasValueRef = useRef(hasValue);

  // Update the ref whenever hasValue changes
  useEffect(() => {
    hasValueRef.current = hasValue;
  }, [hasValue]);






  // Memoize the onChange handler to prevent unnecessary re-renders
  const handleChange = useCallback((e: any) => {
    e.preventDefault();
    const value = e.target.value;
    refine(value);
    setHasValue(value.length > 0);

    // Count words by splitting on whitespace and filtering out empty strings

  }, [refine]);

  return <>
  
  <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={'Baddehla Inventory'}
                value={query}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white text-dark rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#f78f37] shadow-lg"
              />
            </div>
  </>
};
