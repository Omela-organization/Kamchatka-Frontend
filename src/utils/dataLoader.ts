// utils/dataLoader.ts

export const loadData = async (fileName: string) => {
    try {
      const response = await fetch(`/api/loadData?fileName=${fileName}`);
      if (!response.ok) {
        throw new Error('Failed to load data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  };
  