"use client";

import { useSearchBox } from "react-instantsearch";
import { useEffect, useRef, useState, useCallback } from "react";
import {Search} from 'lucide-react';
 
export const SearchBox = () => {
  const [hasValue, setHasValue] = useState(false);
  const placeholderTexts = ['Baddehla Inventory'];
  const TYPING_SPEED = 120;
  const ERASING_SPEED = 60;
  const DELAY_AFTER_TYPING = 1000;
  const { query, refine } = useSearchBox();




  const [textIndex, setTextIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Store hasValue in a ref to avoid re-renders
  const hasValueRef = useRef(hasValue);

  // Update the ref whenever hasValue changes
  useEffect(() => {
    hasValueRef.current = hasValue;
  }, [hasValue]);





  useEffect(() => {
    if (hasValueRef.current) return; // Stop animation if user is typing

    const currentText = placeholderTexts[textIndex];
    let timeout: NodeJS.Timeout;

    // Typing
    if (!isDeleting && charIndex < currentText.length) {
      timeout = setTimeout(() => {
        setPlaceholder(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, TYPING_SPEED);

      // Wait after full text is typed
    } else if (!isDeleting && charIndex === currentText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, DELAY_AFTER_TYPING);

      // Deleting
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setPlaceholder(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, ERASING_SPEED);

      // Move to next word after deleting finishes
    } else if (isDeleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % placeholderTexts.length);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, hasValueRef.current]);


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
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white text-dark rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#f78f37] shadow-lg"
              />
            </div>
  </>
};
