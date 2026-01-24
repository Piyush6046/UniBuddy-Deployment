
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  User,
  GraduationCap,
  Building2,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
} from "lucide-react";
import EditUserProfileModal from "./EditUserProfileModal";
import EditGuideProfileModal from "./EditGuideProfileModal";
import EditMentorModal from "../Mentor/EditMentorModal";
import ConfirmModel from "../Common/ConfirmModel";
import ScreenBlocker from "../ScreenBlocker";
import {
  deleteMentor,
} from "../../services/operations/mentorAPI";
import {
  deleteUserProfile,
} from "../../services/operations/profileAPI";
import {
  deleteGuide,
} from "../../services/operations/guideAPI";

const ProfileDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const guideData = user?.guideProfile;
  const mentorData = user?.mentorProfile;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Modals
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [showGuideEdit, setShowGuideEdit] = useState(false);
  const [showMentorEdit, setShowMentorEdit] = useState(false);

  // Delete confirms
  const [confirmUser, setConfirmUser] = useState(false);
  const [confirmGuide, setConfirmGuide] = useState(false);
  const [confirmMentor, setConfirmMentor] = useState(false);

  // ScreenBlocker loading
  const [loading, setLoading] = useState(false);

  const defaultImage =
    "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

  const cap = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

  // Deletion handlers
  const handleUserDelete = async () => {
    setLoading(true);
    await dispatch(deleteUserProfile(navigate));
    setLoading(false);
    setConfirmUser(false);
  };

  const handleGuideDelete = async () => {
    if (!guideData?._id) return;
    setLoading(true);
    await dispatch(deleteGuide(guideData._id, () => navigate("/dashboard")));
    setLoading(false);
    setConfirmGuide(false);
  };

  const handleMentorDelete = async () => {
    if (!mentorData?._id) return;
    setLoading(true);
    await dispatch(deleteMentor(mentorData._id, () => navigate("/dashboard")));
    setLoading(false);
    setConfirmMentor(false);
  };

  // Helper section rendering
  const InfoRow = ({ icon: Icon, text, colorClass = "text-[var(--accent)]" }) => (
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${colorClass}`} />
      <span className="text-[var(--text-secondary)] text-sm">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <h2 className="text-2xl font-bold mb-8">My Profile</h2>

      {/* Global ScreenBlocker */}
      <ScreenBlocker visible={loading} message="Processing deletion..." />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* ================= USER PROFILE ================= */}
        <div className="border border-[var(--border)] bg-[var(--bg-card)] rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">User Profile</h3>
            <span className="badge badge-primary">
              {cap(user?.role) || "User"}
            </span>
          </div>

          <div className="text-center mb-6">
            <img
              src={user?.profileImage?.url || defaultImage}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-[var(--border)]"
            />
            <h4 className="text-xl font-semibold mb-1 text-[var(--text-primary)]">{user?.name}</h4>
            <p className="text-[var(--text-secondary)]">{user?.email}</p>
          </div>

          <div className="space-y-3 flex-1">
            {user?.college && <InfoRow icon={Building2} text={user.college} />}
            {user?.phone && <InfoRow icon={Phone} text={user.phone} />}
            {user?.department && <InfoRow icon={GraduationCap} text={user.department} />}
            {user?.year && <InfoRow icon={Calendar} text={`Year ${user.year}`} />}
            {user?.gender && <InfoRow icon={User} text={user.gender} />}
          </div>

          <div className="border-t border-[var(--border)] mt-6 pt-4 flex gap-2">
            <button
              onClick={() => setShowUserEdit(true)}
              className="flex-1 btn btn-sm btn-ghost border border-[var(--border)]"
            >
              <Edit className="w-4 h-4 mr-1" /> Edit
            </button>
            <button
              onClick={() => setConfirmUser(true)}
              className="flex-1 btn btn-sm btn-danger border border-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </button>
          </div>

          {showUserEdit && (
            <EditUserProfileModal
              user={user}
              onClose={() => setShowUserEdit(false)}
              onSuccess={() => setShowUserEdit(false)}
            />
          )}
          {confirmUser && (
            <ConfirmModel
              isOpen={confirmUser}
              onConfirm={handleUserDelete}
              onCancel={() => setConfirmUser(false)}
              title="Delete Profile"
              message="Are you sure you want to delete your profile? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
            />
          )}
        </div>

        {/* ================= MENTOR PROFILE ================= */}
        <div className="border border-[var(--border)] bg-[var(--bg-card)] rounded-xl shadow-sm p-6 flex flex-col">
          {mentorData ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Mentor Profile
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${mentorData?.isApproved ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}
                >
                  {mentorData?.isApproved ? "Approved" : "Pending"}
                </span>
              </div>

              <div className="text-center mb-6">
                <img
                  src={mentorData?.image?.url || defaultImage}
                  alt="Mentor"
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-[var(--border)]"
                />
                <h4 className="text-xl font-semibold mb-1 text-[var(--text-primary)]">
                  {mentorData?.name}
                </h4>
                <p className="text-[var(--text-secondary)]">{mentorData?.email}</p>
              </div>

              <div className="space-y-3 flex-1">
                {mentorData?.department && <InfoRow icon={GraduationCap} text={mentorData.department} />}
                {mentorData?.domain && <InfoRow icon={Briefcase} text={mentorData.domain} />}
                {mentorData?.companies?.length > 0 && (
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-[var(--text-secondary)] text-sm">
                      {mentorData.companies.join(", ")}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--border)] mt-6 pt-4 flex gap-2">
                <button
                  onClick={() => setShowMentorEdit(true)}
                  className="flex-1 btn btn-sm btn-ghost border border-[var(--border)]"
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => setConfirmMentor(true)}
                  className="flex-1 btn btn-sm btn-danger border border-red-500/20"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>

              {showMentorEdit && (
                <EditMentorModal
                  mentor={mentorData}
                  onClose={() => setShowMentorEdit(false)}
                  onSuccess={() => setShowMentorEdit(false)}
                />
              )}
              {confirmMentor && (
                <ConfirmModel
                  isOpen={confirmMentor}
                  onConfirm={handleMentorDelete}
                  onCancel={() => setConfirmMentor(false)}
                  title="Delete Mentor"
                  message="Are you sure you want to delete your mentor profile?"
                  confirmText="Delete"
                  cancelText="Cancel"
                />
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-[var(--text-muted)] mb-4">No mentor profile yet</p>
              <button
                onClick={() => navigate("/mentor")}
                className="btn btn-primary"
              >
                Become a Mentor
              </button>
            </div>
          )}
        </div>

        {/* ================= GUIDE PROFILE ================= */}
        <div className="border border-[var(--border)] bg-[var(--bg-card)] rounded-xl shadow-sm p-6 flex flex-col">
          {guideData ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Guide Profile
                </h3>
                <span className="badge badge-secondary">
                  Guide
                </span>
              </div>

              <div className="text-center mb-6">
                <img
                  src={guideData?.image?.url || defaultImage}
                  alt="Guide"
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-[var(--border)]"
                />
                <h4 className="text-xl font-semibold mb-1 text-[var(--text-primary)]">
                  {guideData?.name}
                </h4>
                <p className="text-[var(--text-secondary)]">{guideData?.email}</p>
              </div>

              <div className="space-y-3 flex-1">
                {guideData?.department && <InfoRow icon={GraduationCap} text={guideData.department} />}
                {guideData?.year && <InfoRow icon={Calendar} text={`Year ${guideData.year}`} />}
                {(guideData?.city || guideData?.state) && (
                  <InfoRow icon={MapPin} text={[guideData.city, guideData.state].filter(Boolean).join(", ")} />
                )}
                {guideData?.phone && <InfoRow icon={Phone} text={guideData.phone} />}

                {(guideData?.gender || guideData?.pay) && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[var(--accent)]" />
                      <span className="text-[var(--text-secondary)] text-sm">{guideData.gender}</span>
                    </div>
                    <span className="badge badge-accent text-xs">
                      ₹{guideData.pay}/session
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--border)] mt-6 pt-4 flex gap-2">
                <button
                  onClick={() => setShowGuideEdit(true)}
                  className="flex-1 btn btn-sm btn-ghost border border-[var(--border)]"
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => setConfirmGuide(true)}
                  className="flex-1 btn btn-sm btn-danger border border-red-500/20"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>

              {showGuideEdit && (
                <EditGuideProfileModal
                  guide={guideData}
                  onClose={() => setShowGuideEdit(false)}
                  onSuccess={() => setShowGuideEdit(false)}
                />
              )}
              {confirmGuide && (
                <ConfirmModel
                  isOpen={confirmGuide}
                  onConfirm={handleGuideDelete}
                  onCancel={() => setConfirmGuide(false)}
                  title="Delete Guide"
                  message="Are you sure you want to delete this guide? This action cannot be undone."
                  confirmText="Delete"
                  cancelText="Cancel"
                />
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-[var(--text-muted)] mb-4">No guide profile yet</p>
              <button
                onClick={() => navigate("/guide")}
                className="btn btn-primary"
              >
                Become a Guide
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
