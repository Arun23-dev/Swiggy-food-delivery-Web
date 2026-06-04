import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, MapPin, Lock, Bell, Edit2, Trash2, Plus,
  Save, X, CheckCircle, AlertCircle, Home, Building, Navigation,
  Shield, LogOut, Eye, EyeOff, ChevronRight, Star, Phone,
  Calendar, Award, CreditCard, Gift, Settings, HelpCircle,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  updateUserProfile,
  logoutUser,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../slices/UserSlice';

// ── Validation Schemas ─────────────────────────────────────────────────────────
const profileSchema = z.object({
  firstName: z.string()
    .min(3, 'First name must be at least 3 characters')
    .max(20, 'First name cannot exceed 20 characters'),
  lastName: z.string()
    .min(3, 'Last name must be at least 3 characters')
    .max(20, 'Last name cannot exceed 20 characters')
    .optional(),
  emailId: z.string()
    .email('Invalid email address')
    .max(30, 'Email cannot exceed 30 characters')
    .toLowerCase(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password cannot exceed 50 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const addressSchema = z.object({
  label: z.enum(['Home', 'Office', 'Other']),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  pincode: z.string()
    .length(6, 'Pincode must be exactly 6 digits')
    .regex(/^\d+$/, 'Pincode must contain only numbers'),
  isDefault: z.boolean().default(false),
});

// ── Shimmer Components ─────────────────────────────────────────────────────────
const ShimmerField = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
    <div className="h-10 bg-gray-200 rounded-xl"></div>
  </div>
);

const ShimmerAddressCard = () => (
  <div className="animate-pulse rounded-2xl p-4 bg-gray-50">
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  </div>
);

// ── Reusable Components ────────────────────────────────────────────────────────
const FieldRow = ({ label, value, icon: Icon, last }) => (
  <div className={`flex justify-between items-center py-3 ${!last ? 'border-b border-gray-100' : ''}`}>
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <span className="text-sm text-gray-500 font-medium">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-800">{value || '—'}</span>
  </div>
);

const AddressCard = ({ address, isDefault, onEdit, onDelete, onSetDefault }) => {
  const Icon = address.label === 'Home' ? Home : address.label === 'Office' ? Building : Navigation;
  const iconColor = address.label === 'Home' ? 'text-orange-500' : address.label === 'Office' ? 'text-blue-500' : 'text-gray-400';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      whileHover={{ scale: 1.01 }}
      className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer ${isDefault ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' : 'bg-gray-50 border-gray-100 hover:border-orange-200'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-2 rounded-xl shadow-sm transition-all ${isDefault ? 'bg-orange-100 scale-110' : 'bg-white'}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-gray-800">{address.label}</p>
            {isDefault && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                <Star className="w-2.5 h-2.5 fill-current" /> Default
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {address.street}, {address.city} — {address.pincode}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-orange-500 hover:scale-110"
            aria-label="Edit address"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-red-500 hover:scale-110"
            aria-label="Delete address"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {!isDefault && (
            <button
              onClick={onSetDefault}
              className="text-[11px] font-bold text-orange-500 hover:text-orange-600 px-2 py-1 rounded-lg hover:bg-orange-50 transition-all whitespace-nowrap"
            >
              Set default
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const PasswordField = ({ label, name, register, error }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          {...register(name)}
          className={`w-full px-4 py-2.5 pr-10 border-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition text-sm ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const Section = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 100 }}
    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
  >
    {children}
  </motion.div>
);

const SectionTop = ({ icon: Icon, title, description, action }) => (
  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-gray-50">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-md">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-800">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
    {action}
  </div>
);

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function ProfileSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, authLoading } = useSelector((state) => state.user);

  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const addresses = user?.address || [];

  // React Hook Forms
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailId: '',
    }
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'Home',
      street: '',
      city: '',
      pincode: '',
      isDefault: false,
    }
  });

  // Sync form with user data
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        emailId: user.emailId || user.email || '',
      });
    }
  }, [user, profileForm]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => setToast(p => ({ ...p, show: false })), 3000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleUpdateProfile = async (data) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      setEditMode(false);
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleChangePassword = async (data) => {
    try {
      await dispatch(changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })).unwrap();
      setShowPasswordModal(false);
      passwordForm.reset();
      showToast('Password changed successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    }
  };

  const handleSaveAddress = async (data) => {
    try {

      const isEditing = Boolean(editingAddress);
      if (isEditing) {

        await dispatch(
          updateAddress({
            addressId: editingAddress._id,
            addressData: {
              ...data,
              isDefault: data.isDefault || addresses.length === 0,
            },
          })
        ).unwrap();

        closeAddressModal();

        showToast('Address updated!');
      } else {
        await dispatch(
          addAddress({
            ...data,
            isDefault: data.isDefault || addresses.length === 0,
          })
        ).unwrap();
        closeAddressModal();
        showToast('Address added!');
      }


    } catch (err) {
      showToast(err.message || 'Failed to save address', 'error');
    }
  };

  const handleEditAddress = (address) => {

    setEditingAddress(address);
    addressForm.reset({
      label: address.label,
      street: address.street,
      city: address.city,
      pincode: address.pincode,
      isDefault: address.isDefault || false,
    });
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      showToast('Address deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete address', 'error');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await dispatch(setDefaultAddress(addressId)).unwrap();
      showToast('Default address updated');
    } catch (err) {
      showToast(err.message || 'Failed to set default', 'error');
    }
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    addressForm.reset({
      label: 'Home',
      street: '',
      city: '',
      pincode: '',
      isDefault: false,
    });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <p className="text-gray-600 mb-6 text-lg">Please login to view your profile</p>
          <Button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl px-8 py-2.5 shadow-lg"
          >
            Login Now
          </Button>
        </motion.div>
      </div>
    );
  }

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const email = user?.emailId || user?.email || '';

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold ${toast.type === 'success'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-red-500 to-rose-600'
              }`}
          >
            {toast.type === 'success'
              ? <CheckCircle className="w-5 h-5" />
              : <AlertCircle className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account information and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-5">

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-amber-500/10 rounded-full blur-2xl"></div>

            <div className="relative">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-orange-100">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{initials || '?'}</span>
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-100 hover:bg-orange-50 transition-all hover:scale-110"
                >
                  <Edit2 className="w-3.5 h-3.5 text-orange-500" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-5">{fullName || 'Your Name'}</h2>
              <p className="text-sm text-gray-500 mt-1">{email}</p>

              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                Verified Account
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            {[
              { icon: Mail, label: 'Email', value: email, color: 'from-blue-400 to-blue-600' },
              { icon: MapPin, label: 'Addresses', value: `${addresses.length} saved`, color: 'from-orange-400 to-amber-500' },
              { icon: Calendar, label: 'Member Since', value: new Date(user?.createdAt).getFullYear() || '2024', color: 'from-purple-400 to-purple-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex items-center gap-3 hover:shadow-lg transition-all group">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-all group-hover:translate-x-1" />
              </div>
            ))}
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-red-100 p-5"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Account Settings</p>
            <div className="space-y-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center gap-3 text-sm text-gray-700 hover:text-orange-600 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all font-medium group"
              >
                <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Change Password
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-sm text-red-600 hover:text-red-700 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all font-medium group"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Logout
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Information */}
          <Section delay={0.1}>
            <SectionTop
              icon={User}
              title="Personal Information"
              description="Manage your personal details"
              action={
                !editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-all hover:gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )
              }
            />
            <div className="p-6">
              {editMode ? (
                <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        {...profileForm.register('firstName')}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition ${profileForm.formState.errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                      />
                      {profileForm.formState.errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        {...profileForm.register('lastName')}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition ${profileForm.formState.errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          }`}
                      />
                      {profileForm.formState.errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      {...profileForm.register('emailId')}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition ${profileForm.formState.errors.emailId ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                    />
                    {profileForm.formState.errors.emailId && (
                      <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.emailId.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl px-6 shadow-md"
                    >
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        profileForm.reset();
                      }}
                      variant="outline"
                      className="rounded-xl px-6 border-2"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <FieldRow label="Full Name" value={fullName} icon={User} />
                  <FieldRow label="Email" value={email} icon={Mail} last />
                </div>
              )}
            </div>
          </Section>

          {/* Addresses */}
          <Section delay={0.15}>
            <SectionTop
              icon={MapPin}
              title="Saved Addresses"
              description="Manage your delivery locations"
              action={


                <Button
                  onClick={() => {

                    if (addresses.length === 3) {
                      showToast("You can only add up to 3 addresses", "error");
                      return;
                    }
                    setEditingAddress(null);
                    addressForm.reset({ label: 'Home', street: '', city: '', pincode: '', isDefault: false });
                    setShowAddressModal(true);
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs h-9 px-4 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add New
                </Button>
              }
            />
            <div className="p-6 space-y-3">
              {addresses?.length === 0 ? (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl py-12 text-center">
                  <MapPin className="w-16 h-16 text-orange-200 mx-auto mb-4" />
                  <p className="text-base font-semibold text-gray-600">No saved addresses yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first address for faster checkout</p>
                  <button
                    onClick={
                      
                      
                      () =>{
                         if (addresses.length >= 3) {
                      showToast("You can only add up to 3 addresses", "error");
                      return;
                    }
                    setShowAddressModal(true)
                      } }
                    className="mt-5 text-sm font-bold text-orange-500 hover:text-orange-600 transition-all inline-flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Address
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address._id}
                      address={address}
                      isDefault={address.isDefault}
                      onEdit={() => handleEditAddress(address)}
                      onDelete={() => handleDeleteAddress(address._id)}
                      onSetDefault={() => handleSetDefaultAddress(address._id)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <Modal onClose={() => setShowPasswordModal(false)} title="Change Password">
            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-5">
              <PasswordField
                label="Current Password"
                name="currentPassword"
                register={passwordForm.register}
                error={passwordForm.formState.errors.currentPassword?.message}
              />
              <PasswordField
                label="New Password"
                name="newPassword"
                register={passwordForm.register}
                error={passwordForm.formState.errors.newPassword?.message}
              />
              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                register={passwordForm.register}
                error={passwordForm.formState.errors.confirmPassword?.message}
              />
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex-1 rounded-xl py-2.5 shadow-md">
                  Update Password
                </Button>
                <Button type="button" onClick={() => setShowPasswordModal(false)} variant="outline" className="flex-1 rounded-xl border-2">
                  Cancel
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <Modal onClose={closeAddressModal} title={editingAddress ? 'Edit Address' : 'Add New Address'}>
            <form onSubmit={addressForm.handleSubmit(handleSaveAddress)} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Address Label</label>
                <select
                  {...addressForm.register('label')}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-sm"
                >
                  <option>Home</option>
                  <option>Office</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  placeholder="House number, building, street"
                  {...addressForm.register('street')}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none ${addressForm.formState.errors.street ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                />
                {addressForm.formState.errors.street && (
                  <p className="text-xs text-red-500 mt-1">{addressForm.formState.errors.street.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  {...addressForm.register('city')}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none ${addressForm.formState.errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                />
                {addressForm.formState.errors.city && (
                  <p className="text-xs text-red-500 mt-1">{addressForm.formState.errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit pincode"
                  {...addressForm.register('pincode')}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none ${addressForm.formState.errors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                />
                {addressForm.formState.errors.pincode && (
                  <p className="text-xs text-red-500 mt-1">{addressForm.formState.errors.pincode.message}</p>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  {...addressForm.register('isDefault')}
                  className="w-4 h-4 accent-orange-500 rounded"
                />
                <span className="text-sm font-semibold text-gray-700">Set as default address</span>
              </label>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex-1 rounded-xl py-2.5 shadow-md">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </Button>
                <Button type="button" onClick={closeAddressModal} variant="outline" className="flex-1 rounded-xl border-2">
                  Cancel
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal Component
function Modal({ onClose, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}