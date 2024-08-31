import { db } from "@/db";
import { notFound } from "next/navigation";
import React from "react";
import DesignPreview from "./DesignPreview";

interface PriviewPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function PriviewPage({ searchParams }: PriviewPageProps) {
  const { id } = searchParams;
  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configration = await db.configuration.findUnique({
    where: {id}
  })
  if (!configration) {
    return notFound()
  }

  return <DesignPreview configuration={configration} />
}
