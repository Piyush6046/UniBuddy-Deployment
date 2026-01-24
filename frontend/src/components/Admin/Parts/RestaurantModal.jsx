
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Upload, Star } from 'lucide-react';

const RestaurantModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  type = 'add',
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'veg',
    rating: 0,
    description: '',
    address: { full: '', landmark: '', gully: '', building: '' },
    contact: '',
    images: [],
    menu: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const isEditMode = type === 'edit';

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        address: {
          full: initialData.address?.full || '',
          landmark: initialData.address?.landmark || '',
          gully: initialData.address?.gully || '',
          building: initialData.address?.building || ''
        },
        menu: initialData.menu || []
      });
      setImagePreviews(initialData.images || []);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'veg',
      rating: 0,
      description: '',
      address: { full: '', landmark: '', gully: '', building: '' },
      contact: '',
      images: [],
      menu: []
    });
    setImageFiles([]);
    setImagePreviews([]);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreviews(prev => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menu: [...prev.menu, { item: '', price: 0, type: 'veg', details: '' }]
    }));
  };

  const updateMenuItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      menu: prev.menu.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const removeMenuItem = (index) => {
    setFormData(prev => ({ ...prev, menu: prev.menu.filter((_, i) => i !== index) }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    if (!formData.address.full.trim()) newErrors['address.full'] = 'Address is required';
    if (formData.rating < 0 || formData.rating > 5) newErrors.rating = 'Rating must be 0–5';
    formData.menu.forEach((item, i) => {
      if (!item.item.trim()) newErrors[`menu.${i}.item`] = 'Item name is required';
      if (!item.price || item.price <= 0) newErrors[`menu.${i}.price`] = 'Valid price required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('type', formData.type);
    submitData.append('rating', formData.rating);
    submitData.append('description', formData.description);
    submitData.append('contact', formData.contact);
    submitData.append('address', JSON.stringify(formData.address));
    submitData.append('menu', JSON.stringify(formData.menu));
    imageFiles.forEach(file => submitData.append('images', file));

    if (isEditMode && initialData?.images) {
      const existingImages = imagePreviews.filter(p =>
        typeof p === 'string' && p.startsWith('http')
      );
      submitData.append('existingImages', JSON.stringify(existingImages));
    }

    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-[var(--bg-card)] text-[var(--text-primary)] w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl border border-[var(--border)]">

        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-card)] p-4 flex justify-between items-center border-b border-[var(--border)] z-10">
          <h2 className="text-xl font-bold">
            {isEditMode ? 'Edit Restaurant' : 'Add New Restaurant'}
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-square btn-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">

          {/* Basic Information */}
          <div className="card p-4 border border-[var(--border)] bg-[var(--bg-card)]">
            <h3 className="text-lg font-bold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Restaurant Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full bg-[var(--bg-tertiary)] ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter restaurant name"
                />
                {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="form-control">
                <label className="label">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="select select-bordered w-full bg-[var(--bg-tertiary)]"
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">Rating</label>
                <div className="relative">
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className={`input input-bordered w-full bg-[var(--bg-tertiary)] ${errors.rating ? 'input-error' : ''}`}
                  />
                  <Star className="absolute right-3 top-3 w-4 h-4 text-yellow-400" />
                </div>
                {errors.rating && <p className="text-error text-xs mt-1">{errors.rating}</p>}
              </div>

              <div className="form-control">
                <label className="label">Contact *</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full bg-[var(--bg-tertiary)] ${errors.contact ? 'input-error' : ''}`}
                  placeholder="Phone or email"
                />
                {errors.contact && <p className="text-error text-xs mt-1">{errors.contact}</p>}
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full bg-[var(--bg-tertiary)]"
                  placeholder="Tell us about this restaurant..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card p-4 border border-[var(--border)] bg-[var(--bg-card)]">
            <h3 className="text-lg font-bold mb-4">Address Details</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">Full Address *</label>
                <input
                  type="text"
                  name="address.full"
                  value={formData.address.full}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full bg-[var(--bg-tertiary)] ${errors['address.full'] ? 'input-error' : ''}`}
                  placeholder="Complete address"
                />
                {errors['address.full'] && <p className="text-error text-xs mt-1">{errors['address.full']}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">Landmark</label>
                  <input
                    type="text"
                    name="address.landmark"
                    value={formData.address.landmark}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-[var(--bg-tertiary)]"
                    placeholder="Near..."
                  />
                </div>
                <div className="form-control">
                  <label className="label">Street/Gully</label>
                  <input
                    type="text"
                    name="address.gully"
                    value={formData.address.gully}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-[var(--bg-tertiary)]"
                    placeholder="Street name"
                  />
                </div>
                <div className="form-control">
                  <label className="label">Building</label>
                  <input
                    type="text"
                    name="address.building"
                    value={formData.address.building}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-[var(--bg-tertiary)]"
                    placeholder="Building name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-4 border border-[var(--border)] bg-[var(--bg-card)]">
            <h3 className="text-lg font-bold mb-4">Images</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">Upload Images</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-muted)]">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-[var(--border)]"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 btn btn-xs btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="card p-4 border border-[var(--border)] bg-[var(--bg-card)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Menu Items</h3>
              <button
                type="button"
                onClick={addMenuItem}
                className="btn btn-sm btn-outline gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {formData.menu.length === 0 ? (
              <p className="text-[var(--text-muted)] text-center py-8">No menu items added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.menu.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]">
                    <div className="form-control">
                      <label className="label text-xs">Item Name *</label>
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => updateMenuItem(index, 'item', e.target.value)}
                        className={`input input-sm input-bordered w-full ${errors[`menu.${index}.item`] ? 'input-error' : ''}`}
                        placeholder="Item name"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label text-xs">Price *</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateMenuItem(index, 'price', parseFloat(e.target.value) || 0)}
                        className={`input input-sm input-bordered w-full ${errors[`menu.${index}.price`] ? 'input-error' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label text-xs">Type</label>
                      <select
                        value={item.type}
                        onChange={(e) => updateMenuItem(index, 'type', e.target.value)}
                        className="select select-sm select-bordered w-full"
                      >
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-Veg</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label text-xs">Details</label>
                      <input
                        type="text"
                        value={item.details}
                        onChange={(e) => updateMenuItem(index, 'details', e.target.value)}
                        className="input input-sm input-bordered w-full"
                        placeholder="Description"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <button
                        type="button"
                        onClick={() => removeMenuItem(index)}
                        className="btn btn-sm btn-square btn-error btn-outline"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-[var(--bg-card)] p-4 border-t border-[var(--border)] flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary gap-2"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantModal;