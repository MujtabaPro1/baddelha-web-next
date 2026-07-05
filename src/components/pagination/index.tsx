"use client";

import { useStats, Pagination } from "react-instantsearch";
import React, { memo, useState, useEffect } from "react";

const _Pagination = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const Stats = () => {
    const { nbPages, page } = useStats();


    return (
      <p className="text-sm text-textGrey hidden lg:flex">
        Showing {page + 1} of {nbPages} pages
      </p>
    );
  };

  return (
    <div
      className={
        "w-full flex flex-col sm:flex-row justify-center sm:justify-between items-center p-2 sm:p-4 mt-4 bg-white mt-2 rounded-lg gap-2"
      }
    >
      <Pagination
        className="paging"
        showFirst={false}
        showPrevious={true}
        showNext={true}
        showLast={false}
        padding={isMobile ? 1 : 3}
        onClick={() => {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 1000)

        }}
      />

      <Stats />
    </div>
  );
};

export const PaginationComponent = memo(_Pagination);
