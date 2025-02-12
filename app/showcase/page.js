"use client";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ProductShowcase = dynamic(() => import('../../components/ProductShowcase'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

export default function ShowcasePage() {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <ProductShowcase />
    </Suspense>
  );
}
