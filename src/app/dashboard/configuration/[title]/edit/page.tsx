'use client';

import type { ICGUCard } from 'src/contexts/types/configuration';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { paramCase } from 'src/utils/change-case';

import { _CGUData } from 'src/shared/_mock/_configuration';

import { ConfigurationEditView } from 'src/shared/sections/configuration/view/configuration-edit-view';
// You would replace this with your actual data fetching logic

export default function ConfigurationEditPage() {
  const params = useParams();
  const titleParam = typeof params.title === 'string' ? params.title : '';
  
  const [cgu, setCgu] = useState<ICGUCard | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchCGU = async () => {
      setLoading(true);
      try {
        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundCGU = _CGUData.find(item => paramCase(item.title) === titleParam);
        
        if (foundCGU) {
          setCgu(foundCGU);
        } else {
          setError('Texte légal non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Error fetching CGU:', err);
      } finally {
        setLoading(false);
      }
    };

    if (titleParam) {
      fetchCGU();
    }
  }, [titleParam]);

  const handleUpdateCGU = (id: string, updatedCGU: ICGUCard) => {
    
    // Update the local state
    setCgu(updatedCGU);
  };

  return (
    <ConfigurationEditView
      cgu={cgu}
      loading={loading}
      error={error}
      updateCGU={handleUpdateCGU}
    />
  );
}