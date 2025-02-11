export const searchStrains = async (criteria) => {
  try {
    const response = await fetch('/api/seeds');
    const strains = await response.json();

    return strains.filter(strain => {
      let matches = true;

      // Filter by properties (effects)
      if (criteria.properties && criteria.properties.length > 0) {
        matches = criteria.properties.every(prop => {
          switch (prop) {
            case 'high-cbd':
              return parseFloat(strain.cbd) >= 1.0;
            case 'high-thc':
              return parseFloat(strain.thc) >= 20.0;
            case 'relaxing':
              return strain.effect.toLowerCase().includes('relax');
            case 'pain-killer':
              return strain.effect.toLowerCase().includes('pain');
            case 'sleep':
              return strain.effect.toLowerCase().includes('sleep');
            case 'energy':
              return strain.effect.toLowerCase().includes('energy') || 
                     strain.effect.toLowerCase().includes('uplifting');
            default:
              return true;
          }
        });
      }

      // Filter by advanced criteria
      if (criteria.advanced) {
        const { thcMin, thcMax, cbdMin, cbdMax, flowerTime, type } = criteria.advanced;
        
        const strainThc = parseFloat(strain.thc);
        const strainCbd = parseFloat(strain.cbd);

        if (thcMin && strainThc < parseFloat(thcMin)) matches = false;
        if (thcMax && strainThc > parseFloat(thcMax)) matches = false;
        if (cbdMin && strainCbd < parseFloat(cbdMin)) matches = false;
        if (cbdMax && strainCbd > parseFloat(cbdMax)) matches = false;
        
        if (flowerTime && strain.flowertime !== flowerTime) matches = false;
        
        if (type && type !== 'all' && 
            strain.genetics.type.toLowerCase() !== type.toLowerCase()) {
          matches = false;
        }
      }

      return matches;
    });
  } catch (error) {
    console.error('Error searching strains:', error);
    return [];
  }
};
