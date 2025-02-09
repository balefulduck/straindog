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
    terpenes: '',
    effect: '',
    imageUrl: '',
  });

  const resetForm = () => {
    setEditForm({
      id: '',
      title: '',
      breeder: '',
      description: '',
      thc: '',
      cbd: '',
      terpenes: '',
      effect: '',
      imageUrl: '',
    });
    setSelectedSeed(null);
  };

  const handleSelectSeed = (seed) => {
    setSelectedSeed(seed);
    setEditForm(seed);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedSeeds = selectedSeed
      ? seeds.map(seed => seed.id === selectedSeed.id ? editForm : seed)
      : [...seeds, { ...editForm, id: Date.now() }];
    
    try {
      // Here we'll add the API call to update the server
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
              <label htmlFor="terpenes">Terpenes</label>
              <input
                type="text"
                id="terpenes"
                name="terpenes"
                value={editForm.terpenes}
                onChange={handleInputChange}
              />
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
            <div className={styles.formField + ' ' + styles.fullWidth}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>
          <div className={styles.formActions}>
            {selectedSeed && (
              <button
                type="button"
                onClick={() => handleDelete(selectedSeed.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            )}
            <button type="submit" className={styles.saveButton}>
              {selectedSeed ? 'Update' : 'Create'} Seed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeedListEditor;
