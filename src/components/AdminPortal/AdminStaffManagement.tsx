import React, { useState } from 'react';
import { User } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  Users,
  UserPlus,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Lock,
  Edit2,
  X,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminStaffManagementProps {
  staffList: User[];
  onRefreshData: () => void;
}

export const AdminStaffManagement: React.FC<AdminStaffManagementProps> = ({
  staffList,
  onRefreshData
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);

  // Add Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('staff');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Edit All Info Form State
  const [editStaffId, setEditStaffId] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'staff'>('staff');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');
  const [editPassword, setEditPassword] = useState('');
  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim() || !username.trim() || !password.trim() || !phone.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createStaff({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim() || username.trim(),
        phone: phone.trim(),
        password: password.trim(),
        role,
        status: 'active'
      });
      setShowAddModal(false);
      setFullName('');
      setUsername('');
      setEmail('');
      setPhone('');
      setPassword('');
      triggerToast('New staff account successfully created!');
      onRefreshData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create staff account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (staff: User) => {
    setEditStaffId(staff.id);
    setEditFullName(staff.fullName);
    setEditUsername(staff.username);
    setEditEmail(staff.email || staff.username);
    setEditPhone(staff.phone || '');
    setEditRole(staff.role);
    setEditStatus(staff.status === 'inactive' ? 'inactive' : 'active');
    setEditPassword('');
    setEditErrorMsg('');
    setShowEditModal(true);
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditErrorMsg('');

    if (!editFullName.trim() || !editUsername.trim() || !editPhone.trim() || !editEmail.trim()) {
      setEditErrorMsg('Full name, username, email, and phone number are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        fullName: editFullName.trim(),
        username: editUsername.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        role: editRole,
        status: editStatus
      };

      if (editPassword && editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      await api.updateStaff(editStaffId, payload);
      setShowEditModal(false);
      triggerToast(`Staff profile for "${editFullName}" successfully updated!`);
      onRefreshData();
    } catch (err: any) {
      setEditErrorMsg(err.message || 'Failed to update staff profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    if (!confirm(`Are you sure you want to set ${user.fullName}'s account to ${newStatus.toUpperCase()}?`)) {
      return;
    }
    try {
      await api.updateStaff(user.id, { status: newStatus });
      triggerToast(`${user.fullName}'s status changed to ${newStatus.toUpperCase()}.`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to update account status');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !newPassword.trim()) return;

    setIsSubmitting(true);
    try {
      await api.updateStaff(selectedStaff.id, { password: newPassword.trim() });
      setShowPasswordModal(false);
      setSelectedStaff(null);
      setNewPassword('');
      triggerToast(`Password successfully updated for ${selectedStaff.fullName}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
      {/* Toast notification */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg">Staff & Access Control Management</h3>
          <p className="text-xs text-slate-500">
            Create employee credentials, edit all personal & access details, and manage role permissions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1.5 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Staff Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffList.map(user => (
          <div
            key={user.id}
            className={`p-6 rounded-3xl border transition flex flex-col justify-between space-y-4 ${
              user.status === 'active'
                ? 'bg-slate-50 border-slate-200/80 shadow-2xs hover:border-slate-300'
                : 'bg-rose-50/40 border-rose-200/80 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  {user.role}
                </span>

                <button
                  onClick={() => handleToggleStatus(user)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                    user.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                  title="Click to toggle active/inactive status"
                >
                  {user.status === 'active' ? 'Active' : 'Deactivated'}
                </button>
              </div>

              <h4 className="font-bold text-slate-900 text-base">{user.fullName}</h4>
              <p className="font-mono text-xs text-slate-500 mt-0.5">{user.username}</p>

              <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <span>{user.phone || 'No phone recorded'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email || user.username}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[10px] text-slate-400">
                {user.lastLogin ? `Login: ${new Date(user.lastLogin).toLocaleDateString()}` : 'Never logged in'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(user)}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-lg transition shadow-2xs active:scale-95"
                  title="Edit full name, email, phone, role, status & password"
                >
                  <Edit2 className="w-3 h-3 text-emerald-700" />
                  <span>Edit Info</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedStaff(user);
                    setNewPassword('');
                    setShowPasswordModal(true);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg transition shadow-2xs active:scale-95"
                  title="Quick reset password"
                >
                  <KeyRound className="w-3 h-3 text-amber-500" />
                  <span>Pass</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT STAFF MODAL: ALLOWS ADMIN TO EDIT ALL INFORMATION */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 my-8">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white text-sm">Edit Staff Information</h4>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="p-6 space-y-4 text-xs">
              {editErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editErrorMsg}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmed Musa"
                  value={editFullName}
                  onChange={e => setEditFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Username / Login Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="staff@bazazsolar.ng"
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0813..."
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="staff@bazazsolar.ng"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Role & Permissions *
                  </label>
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as 'admin' | 'staff')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="staff">Staff (POS, Inventory, Customer Desk)</option>
                    <option value="admin">Administrator (Full System Control)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Account Status *
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="active">Active (Access Enabled)</option>
                    <option value="inactive">Deactivated (Access Suspended)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Change Password (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      placeholder="Leave blank to keep current"
                      value={editPassword}
                      onChange={e => setEditPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3 pr-10 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition"
                      title={showEditPassword ? 'Hide password' : 'Show password'}
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving Changes...' : 'Save All Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 my-8">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Create New Staff Profile</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-3.5 text-xs">
              {errorMsg && <p className="text-rose-600 font-bold">{errorMsg}</p>}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Usman Bello"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="usman@bazazsolar.ng"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="081..."
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Access Role *</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="staff">Staff (Sales POS & Inventory View)</option>
                    <option value="admin">Admin (Full Control)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showAddPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 4 chars"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3 pr-10 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddPassword(!showAddPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition"
                      title={showAddPassword ? 'Hide password' : 'Show password'}
                    >
                      {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md"
                >
                  {isSubmitting ? 'Creating...' : 'Create Staff Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Quick Password Reset: {selectedStaff.fullName}</h4>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Password *</label>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-3 pr-10 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition"
                    title={showResetPassword ? 'Hide password' : 'Show password'}
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
