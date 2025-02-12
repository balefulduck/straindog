"use client";
import { useState, useEffect } from 'react';
import styles from './SeedListEditor.module.css';

const SeedListEditor = ({ isOpen, onClose, seedList, onUpdateSeedList }) => {
  const [seeds, setSeeds] = useState(seedList);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    breeder: '',
    description: '',
    thc: '',
    cbd: '',
    terpenes: [{ name: '', percentage: '' }],
    genetics: {
      mother: '',
      father: '',
      type: ''
    },
    effect: '',
    flowertime: '',
    imageUrl: '',
    seedlist: {
      seedcount: null
    }
  });

  const resetForm = () => {
    setEditForm({
      id: '',
      title: '',
      breeder: '',
      description: '',
      thc: '',
      cbd: '',
      terpenes: [{ name: '', percentage: '' }],
      genetics: {
        mother: '',
        father: '',
        type: ''
      },
      effect: '',
      flowertime: '',
      imageUrl: '',
      seedlist: {
        seedcount: null
      }
    });
    setSelectedSeed(null);
  };

  const handleSelectSeed = (seed) => {
    setSelectedSeed(seed);
    setEditForm(seed);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('genetics.')) {
      const geneticField = name.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        genetics: {
          ...prev.genetics,
          [geneticField]: value
        }
      }));
    } else if (name.startsWith('seedlist.')) {
      const seedlistField = name.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        seedlist: {
          ...prev.seedlist,
          [seedlistField]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTerpeneChange = (index, field, value) => {
    setEditForm(prev => {
      const newTerpenes = [...prev.terpenes];
      newTerpenes[index] = {
        ...newTerpenes[index],
        [field]: value
      };
      return {
        ...prev,
        terpenes: newTerpenes
      };
    });
  };

  const addTerpene = () => {
    setEditForm(prev => ({
      ...prev,
      terpenes: [...prev.terpenes, { name: '', percentage: '' }]
    }));
  };

  const removeTerpene = (index) => {
    setEditForm(prev => ({
      ...prev,
      terpenes: prev.terpenes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedSeeds = selectedSeed
      ? seeds.map(seed => seed.id === selectedSeed.id ? editForm : seed)
      : [...seeds, { ...editForm, id: Date.now() }];
    
    try {
      const response = await fetch('/api/seeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSeeds),
      });

      if (!response.ok) throw new Error('Failed to update seeds');
      
      setSeeds(updatedSeeds);
      onUpdateSeedList(updatedSeeds);
      resetForm();
    } catch (error) {
      console.error('Error updating seeds:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedSeeds = seeds.filter(seed => seed.id !== id);
      
      const response = await fetch('/api/seeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSeeds),
      });

      if (!response.ok) throw new Error('Failed to delete seed');

      setSeeds(updatedSeeds);
      onUpdateSeedList(updatedSeeds);
      resetForm();
    } catch (error) {
      console.error('Error deleting seed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.editorContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Seed List</h2>
          <button onClick={() => resetForm()} className={styles.addButton}>
            + New Seed
          </button>
        </div>
        <div className={styles.seedList}>
          {seeds.map(seed => (
            <div
              key={seed.id}
              className={`${styles.seedItem} ${selectedSeed?.id === seed.id ? styles.selected : ''}`}
              onClick={() => handleSelectSeed(seed)}
            >
              <div className={styles.seedItemContent}>
                <img src={seed.imageUrl} alt={seed.title} className={styles.seedThumbnail} />
                <div className={styles.seedInfo}>
                  <h3>{seed.title}</h3>
                  <p>{seed.breeder}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.editorMain}>
        <div className={styles.editorHeader}>
          <h2>{selectedSeed ? 'Edit Seed' : 'New Seed'}</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editForm.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="breeder">Breeder</label>
              <input
                type="text"
                id="breeder"
                name="breeder"
                value={editForm.breeder}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="flowertime">Flowering Time (days)</label>
              <input
                type="number"
                id="flowertime"
                name="flowertime"
                value={editForm.flowertime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formSection}>
              <h3>Genetics</h3>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label htmlFor="genetics.mother">Mother</label>
                  <input
                    type="text"
                    id="genetics.mother"
                    name="genetics.mother"
                    value={editForm.genetics.mother}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="genetics.father">Father</label>
                  <input
                    type="text"
                    id="genetics.father"
                    name="genetics.father"
                    value={editForm.genetics.father}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="genetics.type">Type</label>
                  <input
                    type="text"
                    id="genetics.type"
                    name="genetics.type"
                    value={editForm.genetics.type}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Terpenes</h3>
              {editForm.terpenes.map((terpene, index) => (
                <div key={index} className={styles.terpeneEntry}>
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>Name</label>
                      <input
                        type="text"
                        value={terpene.name}
                        onChange={(e) => handleTerpeneChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label>Percentage</label>
                      <input
                        type="text"
                        value={terpene.percentage}
                        onChange={(e) => handleTerpeneChange(index, 'percentage', e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTerpene(index)}
                    className={styles.removeTerpeneButton}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTerpene}
                className={styles.addTerpeneButton}
              >
                + Add Terpene
              </button>
            </div>

            <div className={styles.formField}>
              <label htmlFor="effect">Effect</label>
              <input
                type="text"
                id="effect"
                name="effect"
                value={editForm.effect}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="thc">THC %</label>
              <input
                type="text"
                id="thc"
                name="thc"
                value={editForm.thc}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="cbd">CBD %</label>
              <input
                type="text"
                id="cbd"
                name="cbd"
                value={editForm.cbd}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={editForm.imageUrl}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formField}>
              <label htmlFor="seedcount">Seeds per Pack</label>
              <input
                type="number"
                id="seedcount"
                name="seedlist.seedcount"
                value={editForm.seedlist?.seedcount || ''}
                onChange={handleInputChange}
                min="0"
                placeholder="Number of seeds per pack"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {selectedSeed ? 'Update' : 'Create'} Seed
            </button>
            {selectedSeed && (
              <button
                type="button"
                onClick={() => handleDelete(selectedSeed.id)}
                className={styles.deleteButton}
              >
                Delete Seed
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeedListEditor;
