'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import LeafletMap with SSR disabled to prevent window is not defined error on Next.js build
const DynamicLeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] rounded-2xl bg-slate-100/80 backdrop-blur-md flex flex-col items-center justify-center border border-slate-200 shadow-inner">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-semibold text-slate-600 mt-4 animate-pulse">
        ഭൂപടം തയ്യാറാകുന്നു...
      </p>
      <p className="text-xs text-slate-400 mt-1">
        Loading interactive map assets...
      </p>
    </div>
  ),
});

interface MapLoaderProps {
  mode: 'view' | 'route' | 'pick';
  pharmacies?: any[];
  selectedPharmacyId?: string | null;
  onSelectPharmacy?: (id: string) => void;
  userLat?: number;
  userLng?: number;
  pharmacyLat?: number;
  pharmacyLng?: number;
  onLocationSelected?: (lat: number, lng: number) => void;
  onRouteCalculated?: (distance: number, duration: number) => void;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

export default function MapLoader(props: MapLoaderProps) {
  return <DynamicLeafletMap {...props} />;
}
