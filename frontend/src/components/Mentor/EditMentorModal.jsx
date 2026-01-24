import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateMentor } from "../../services/operations/mentorAPI";
import toast from "react-hot-toast";
import { X, Upload, Plus, Trash2 } from "lucide-react";

const EditMentorModal = ({ mentor, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: mentor.name || "",
    email: mentor.email || "",
    phone: mentor.phone || "",
    image: null,
    department: mentor.department || "",
    passoutYear: mentor.passoutYear || "",
    companies: mentor.companies || [""],
    gender: mentor.gender || "Prefer not to say",
    domain: mentor.domain || "",
    resume: null,
  });

  const [preview, setPreview] = useState(mentor.image?.url || null);
  const [loading, setLoading] = useState(false);

  const departmentOptions = [
    "Computer Science Engineering", "Information Technology", "Electronics & Communication",
    "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
    "Chemical Engineering", "Aerospace Engineering", "Biotechnology", "Other"
  ];

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleCompanyChange = (index, value) => {
    const updatedCompanies = [...formData.companies];
    updatedCompanies[index] = value;
    setFormData((prev) => ({ ...prev, companies: updatedCompanies }));
  };

  const addCompany = () => {
    setFormData((prev) => ({
      ...prev,
      companies: [...prev.companies, ""]
    }));
  };

  const removeCompany = (index) => {
    const updatedCompanies = formData.companies.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, companies: updatedCompanies }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.department) return toast.error("Department is required");
    if (!formData.passoutYear) return toast.error("Passout year is required");

    const validCompanies = formData.companies.filter(company => company.trim());
    if (validCompanies.length === 0) return toast.error("At least one company is required");

    setLoading(true);
    const submitData = new FormData();

    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("department", formData.department);
    submitData.append("passoutYear", formData.passoutYear);
    submitData.append("gender", formData.gender);
    submitData.append("domain", formData.domain);
    submitData.append("companies", JSON.stringify(validCompanies));

    if (formData.image) submitData.append("image", formData.image);
    if (formData.resume) submitData.append("resume", formData.resume);

    dispatch(
      updateMentor(mentor._id, submitData, (success) => {
        setLoading(false);
        if (success) {
          toast.success("Mentor updated successfully");
          onSuccess && onSuccess();
        }
      })
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <div className="bg-[var(--bg-card)] text-[var(--text-primary)] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--border)]">
        <div className="sticky top-0 bg-[var(--bg-card)] border-b border-[var(--border)] px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Edit Mentor</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-square"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="text-center">
            <div className="mb-4">
              <img
                src={preview || "/default-avatar.png"}
                alt="Mentor"
                className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[var(--bg-tertiary)] shadow-md"
              />
            </div>
            <div className="flex justify-center">
              <label className="btn btn-outline btn-sm cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-[var(--bg-tertiary)]"
                placeholder="Enter mentor name"
              />
            </div>
            <div className="form-control">
              <label className="label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-[var(--bg-tertiary)]"
                placeholder="Enter email address"
              />
            </div>
            <div className="form-control">
              <label className="label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-[var(--bg-tertiary)]"
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-control">
              <label className="label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="select select-bordered w-full bg-[var(--bg-tertiary)]"
              >
                {genderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="select select-bordered w-full bg-[var(--bg-tertiary)]"
              >
                <option value="">Select Department</option>
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            {/* ... more fields ... */}
            <div className="form-control">
              <label className="label">Passout Year *</label>
              <input
                type="number"
                name="passoutYear"
                value={formData.passoutYear}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-[var(--bg-tertiary)]"
              />
            </div>
            <div className="form-control md:col-span-2">
              <label className="label">Domain/Specialization</label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-[var(--bg-tertiary)]"
              />
            </div>
          </div>


          {/* Companies */}
          <div className="form-control">
            <label className="label">Companies *</label>
            <div className="space-y-3">
              {formData.companies.map((company, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => handleCompanyChange(index, e.target.value)}
                    className="input input-bordered flex-1 bg-[var(--bg-tertiary)]"
                    placeholder={`Company ${index + 1}`}
                  />
                  {formData.companies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCompany(index)}
                      className="btn btn-square btn-error btn-outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addCompany}
                className="btn btn-sm btn-ghost gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </button>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="form-control">
            <label className="label">Resume</label>
            <div className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-tertiary)]">
              {mentor.resume && (
                <a
                  href={mentor.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary text-sm"
                >
                  View Current Resume
                </a>
              )}
              <label className="btn btn-sm btn-outline cursor-pointer ml-auto">
                <Upload className="w-4 h-4 mr-2" />
                Upload New
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[var(--bg-card)] border-t border-[var(--border)] px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Updating..." : "Update Mentor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMentorModal;