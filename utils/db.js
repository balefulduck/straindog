// Client-side API calls for database operations
// No direct database connection here - all operations go through API routes

export async function getAllStrains() {
  try {
    const response = await fetch('/api/seeds');
    if (!response.ok) {
      throw new Error('Failed to fetch strains');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching strains:', error);
    throw error;
  }
}

export async function getStrainById(id) {
  try {
    const response = await fetch(`/api/seeds?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch strain');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching strain:', error);
    throw error;
  }
}

export async function updateStrain(strain) {
  try {
    const response = await fetch('/api/seeds', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(strain),
    });
    if (!response.ok) {
      throw new Error('Failed to update strain');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating strain:', error);
    throw error;
  }
}
