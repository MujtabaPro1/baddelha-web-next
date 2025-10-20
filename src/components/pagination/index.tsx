"use client";

import { useStats, Pagination } from "react-instantsearch";
import React, { memo } from "react";

const _Pagination = () => {

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
        "w-full flex justify-between items-center p-4 mt-4 bg-white mt-2 rounded-lg"
      }
    >
      <Pagination
        className="paging"
        showFirst={false}
        showPrevious={true}
        showNext={true}
        showLast={false}
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
