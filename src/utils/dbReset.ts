// Database Reset Utility for Development
// This file helps reset the IndexedDB database during development

export const resetDatabase = async () => {
  try {
    // Close any existing connections
    if (typeof window !== 'undefined' && window.indexedDB) {
      const deleteRequest = window.indexedDB.deleteDatabase('PlasticSurgeonDB');
      
      return new Promise((resolve, reject) => {
        deleteRequest.onsuccess = () => {
          console.log('Database deleted successfully');
          // Reload the page to reinitialize the database
          window.location.reload();
          resolve(true);
        };
        
        deleteRequest.onerror = () => {
          console.error('Failed to delete database');
          reject(false);
        };
        
        deleteRequest.onblocked = () => {
          console.warn('Database deletion blocked - close all app tabs first');
          reject(false);
        };
      });
    }
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

// Add to window for easy access in dev tools
if (typeof window !== 'undefined') {
  (window as any).resetDatabase = resetDatabase;
}