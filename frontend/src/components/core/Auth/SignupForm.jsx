
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, EyeOff, User, Mail, Phone, Building, Briefcase, GraduationCap, Lock, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { sendOtp } from "../../../services/operations/authAPI";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    department: "",
    year: "",
    college: "Veermata Jijabai Technological Institute (VJTI)",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    name,
    gender,
    email,
    password,
    confirmPassword,
    phone,
    department,
    year,
    college,
  } = formData;

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  const departmentOptions = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Production Engineering",
    "Textile Technology",
    "Diploma Studies",
  ];

  const yearOptions = [
    { value: 1, label: "1st Year" },
    { value: 2, label: "2nd Year" },
    { value: 3, label: "3rd Year" },
    { value: 4, label: "4th Year" },
  ];

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Full name is required");
    if (!gender) return toast.error("Please select gender");
    if (!email.trim()) return toast.error("Email address is required");
    if (!password || password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");
    if (!phone.trim() || phone.length < 10) return toast.error("Valid 10-digit phone is required");
    if (!department) return toast.error("Please select your department");
    if (!year) return toast.error("Please select your year");

    const signupData = {
      name: name.trim(),
      gender,
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      department: department.trim(),
      year: parseInt(year),
      college: college.trim(),
      role: "student",
    };

    dispatch(sendOtp(signupData, navigate));
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-[var(--bg-primary)]">
        <div className="loader loader-lg"></div>
        <p className="text-[var(--text-secondary)] font-medium animate-pulse">Setting up your portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[var(--bg-tertiary)] to-[var(--bg-card)] p-8 border-b border-[var(--border)] text-center">
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
            Create <span className="text-[var(--accent)]">Account</span>
          </h1>
          <p className="text-[var(--text-secondary)]">Join the VJTI UniBuddy community today.</p>
        </div>

        <form onSubmit={handleOnSubmit} className="p-8 space-y-6">
          {/* Section: Personal Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)] ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleOnChange}
                    placeholder="John Doe"
                    className="input pl-10 h-11"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)] ml-1">Gender</label>
                <select
                  name="gender"
                  value={gender}
                  onChange={handleOnChange}
                  className="input select h-11"
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)] ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder="email@vjti.ac.in"
                    className="input pl-10 h-11"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)] ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={handleOnChange}
                    placeholder="10-digit mobile number"
                    className="input pl-10 h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Academic Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> Academic Information
            </h2>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)] ml-1">College / University</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={college}
                  readOnly
                  className="input pl-10 h-11 opacity-60 cursor-not-allowed bg-[var(--bg-tertiary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)] ml-1">Department</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <select
                    name="department"
                    value={department}
                    onChange={handleOnChange}
                    className="input select pl-10 h-11"
                  >
                    <option value="">Select Dept</option>
                    {departmentOptions.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)] ml-1">Academic Year</label>
                <select
                  name="year"
                  value={year}
                  onChange={handleOnChange}
                  className="input select h-11"
                >
                  <option value="">Select Year</option>
                  {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Security */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)] ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Min. 6 characters"
                    className="input pl-10 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)] ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleOnChange}
                    placeholder="Repeat password"
                    className="input pl-10 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)]"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-12 text-lg font-bold flex items-center justify-center gap-2 group shadow-lg"
          >
            Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-[var(--text-secondary)] text-sm">
            Already a member?{" "}
            <Link to="/login" className="text-[var(--accent)] font-bold hover:underline">
              Log in instead
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
