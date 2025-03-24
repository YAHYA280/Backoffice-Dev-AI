'use client';

import type { ICGUCard } from 'src/contexts/types/configuration';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';

import { useGetCGUByTitle } from 'src/shared/actions/configuration';

import { ConfigurationDetailsView } from 'src/shared/sections/configuration/view/configuration-details-view';

// ----------------------------------------------------------------------

// Default ICGUCard object
const defaultCGU: ICGUCard = {
  id: '',
  title: '',
  description: '',
  content: '',
  version: '',
  publishDate: Date.now(), // or a default date value
  expirationDate: undefined, // or a default date value
  active: false,
  author: { name: '', avatarUrl: undefined },
  lastModifiedAt: Date.now(), // or a default date value
};

export default function ConfigurationDetailsPage() {
  const params = useParams();
  const title = typeof params.title === 'string' ? params.title : '';

  const { data: cgu, loading, error } = useGetCGUByTitle(title);

  const [isDeleting, setIsDeleting] = useState(false);

  const [localCGU, setLocalCGU] = useState<ICGUCard>(defaultCGU);

  useEffect(() => {
    if (cgu) {
      setLocalCGU(structuredClone(cgu));
    }
  }, [cgu]);

  useEffect(() => {
    if (error) {
      notFound();
    }
  }, [error]);

  const handleDelete = (id: string) => {
    setIsDeleting(true);
    // Delete API
    setIsDeleting(false);
  };

  // Function to update the active status in mock data
  const handleUpdateActive = (id: string, active: boolean) => {
    const updatedCGU: ICGUCard = {
      ...localCGU,
      active,
    };

    setLocalCGU(updatedCGU);

    const promise = new Promise((resolve) => setTimeout(resolve, 1000));
    toast.promise(promise, {
      loading: 'Chargement...',
      success: 'Le text légal est actif!',
      error: "Quelque chose s'est mal passé!",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cgu) {
    return notFound();
  }

  return (
    <ConfigurationDetailsView
      cgu={localCGU}
      onDelete={handleDelete}
      onUpdateActive={handleUpdateActive}
    />
  );
}
