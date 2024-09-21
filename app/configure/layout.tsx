import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Steps from '@/components/Steps';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "create case",
  description: "Create a beautiful case",
};

export default function Layout({children}: {children: React.ReactNode}) {

  return (
    <MaxWidthWrapper className='flex-1 flex flex-col'>
      <Steps />
      {children}
    </MaxWidthWrapper>
  )
}
