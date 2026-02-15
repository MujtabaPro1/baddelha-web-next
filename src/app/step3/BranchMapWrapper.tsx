'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the BranchMap component with no SSR
// This is necessary because Leaflet requires the window object
const BranchMap = dynamic(() => import('../../components/BranchMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-xl bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
    </div>
  ),
});

interface Branch {
  id: string;
  name: string;
  enName: string;
  arName: string;
  address: string;
  image?: string;
  location?: string;
  distance?: string;
  latitude?: number;
  longitude?: number;
}

interface BranchMapWrapperProps {
  branches: Branch[];
  selectedBranchId: string;
  onBranchSelect: (branchId: string) => void;
  onUserLocation?: (location: [number, number]) => void;
}

const BranchMapWrapper: React.FC<BranchMapWrapperProps> = ({
  branches,
  selectedBranchId,
  onBranchSelect,
  onUserLocation,
}) => {
  return (
    <BranchMap
      branches={branches}
      selectedBranchId={selectedBranchId}
      onBranchSelect={onBranchSelect}
      onUserLocation={onUserLocation}
    />
  );
};

export default BranchMapWrapper;
