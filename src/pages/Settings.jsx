import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Shield, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { storage, auth } from "../lib/firebase";

const Settings = () => {
  const navigate = useNavigate();

  const {
    user,
    updateUsername,
    changePassword,
    logoutAllDevices,
    isGoogleUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || ""); // readonly for now
  const [password, setPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const [emailNotif, setEmailNotif] = useState(true);
  const [projectAlert, setProjectAlert] = useState(true);

  /* 🔥 FINAL FIXED SAVE */
  const handleProfileSave = async () => {
    setLoading(true);

    try {
      let photoURL = user?.photoURL;

      // ✅ Upload avatar
      if (avatar) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, avatar);
        photoURL = await getDownloadURL(storageRef);
      }

      // ✅ Update Firebase Auth
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL,
      });

      // ✅ Update username in DB
      await updateUsername(name);

      toast.success("Profile updated 🚀");

    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false); // 🔥 NEVER gets stuck now
    }
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword(password);
      setPassword("");
      toast.success("Password updated 🔐");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="h-14 flex items-center px-6 border-b border-white/10 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
        <span className="text-sm text-gray-400">{user?.email}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-64 border-r border-white/10 p-4 space-y-2 bg-black/30">
          <MenuItem icon={<User size={18} />} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <MenuItem icon={<Shield size={18} />} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
          <MenuItem icon={<Bell size={18} />} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* PROFILE */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <Section title="Profile">

                  {/* AVATAR */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                      {avatar ? (
                        <img src={URL.createObjectURL(avatar)} className="w-full h-full object-cover" />
                      ) : user?.photoURL ? (
                        <img src={user.photoURL} className="w-full h-full object-cover" />
                      ) : (
                        <User />
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatar(e.target.files[0])}
                      className="text-sm"
                    />
                  </div>

                  <Input label="Username" value={name} onChange={(e) => setName(e.target.value)} />

                  {/* 🔒 EMAIL READ ONLY */}
                  <Input label="Email" value={email} disabled />

                  <div className="flex justify-end">
                    <Button onClick={handleProfileSave} loading={loading}>
                      Save Changes
                    </Button>
                  </div>

                </Section>
              </motion.div>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <motion.div key="security" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <Section title="Security">

                  <Input type="password" label="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                  <div className="flex gap-3">
                    <Button color="green" onClick={handlePasswordChange}>Update</Button>
                    <Button color="red" onClick={logoutAllDevices}>Logout</Button>
                  </div>

                  <p className="text-sm text-gray-400">
                    Google: {isGoogleUser ? "Connected ✅" : "Not Connected ❌"}
                  </p>

                </Section>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <Section title="Notifications">
                  <Toggle label="Email Notifications" value={emailNotif} onChange={setEmailNotif} />
                  <Toggle label="Project Alerts" value={projectAlert} onChange={setProjectAlert} />
                </Section>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* COMPONENTS */

const Section = ({ title, children }) => (
  <div className="max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 space-y-5 shadow-lg">
    <h2 className="text-xl font-semibold">{title}</h2>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400 mb-1 block">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
    />
  </div>
);

const Button = ({ children, onClick, loading, color = "cyan" }) => {
  const colors = {
    cyan: "bg-cyan-500 hover:bg-cyan-600",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-5 py-2.5 rounded-lg text-white font-medium transition ${
        colors[color]
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Saving..." : children}
    </button>
  );
};

const MenuItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${
      active
        ? "bg-cyan-500/20 text-cyan-400"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`}
  >
    {icon}
    <span>{label}</span>
  </div>
);

const Toggle = ({ label, value, onChange }) => (
  <div className="flex justify-between items-center">
    <span>{label}</span>
    <div
      onClick={() => onChange(!value)}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        value ? "bg-cyan-500" : "bg-gray-600"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full transition ${
          value ? "translate-x-6" : ""
        }`}
      />
    </div>
  </div>
);

export default Settings;