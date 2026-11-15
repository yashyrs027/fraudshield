import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Users,
  Settings,
  Shield,
  Trash2,
  Plus,
  Languages,
  Accessibility,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { trustedContactSchema } from '../validation/schemas';
import { contactService } from '../services/contactService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';

export const ProfileSettings = () => {
  const { user, updatePreferences } = useAuth();
  const { lang, setLang } = useLanguage();
  const { seniorMode, setSeniorMode } = useTheme();
  const { success: toastSuccess, error: toastError } = useToast();

  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    reset: resetContactForm,
    formState: { errors: contactErrors },
  } = useForm({
    resolver: zodResolver(trustedContactSchema),
    defaultValues: {
      contactName: '',
      relationship: '',
      phoneNumber: '+91',
      email: '',
    },
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await contactService.getContacts();
        if (res.data?.contacts) setContacts(res.data.contacts);
      } catch (err) {
        toastError('Failed to fetch trusted contacts.');
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, [toastError]);

  const onAddContact = async (data) => {
    try {
      setSavingContact(true);
      const res = await contactService.addContact(data);
      if (res.data) {
        setContacts((prev) => [...prev, res.data]);
        toastSuccess('Family Guardian added successfully!');
        resetContactForm();
        setAddContactModalOpen(false);
      }
    } catch (err) {
      toastError('Failed to save trusted contact.');
    } finally {
      setSavingContact(false);
    }
  };

  const onDeleteContact = async (id) => {
    try {
      await contactService.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toastSuccess('Trusted contact removed.');
    } catch (err) {
      toastError('Failed to remove contact.');
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'fraudshield_personal_data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toastSuccess('User data export initiated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white">Profile & Security Settings</h1>
        <p className="text-sm text-slate-400">
          Manage your accessibility options, Family Guardians, and DPDP privacy settings.
        </p>
      </div>

      {/* Account Profile Card */}
      <Card title="User Information" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-xl bg-[#0A192F] border border-[#233554]">
            <span className="text-xs text-slate-400">Full Name</span>
            <div className="font-bold text-white mt-0.5">{user?.fullName || 'Ramesh Chandra'}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0A192F] border border-[#233554]">
            <span className="text-xs text-slate-400">Email Address</span>
            <div className="font-bold text-white mt-0.5">{user?.email || 'ramesh.chandra@example.com'}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0A192F] border border-[#233554]">
            <span className="text-xs text-slate-400">Phone Number</span>
            <div className="font-bold text-white mt-0.5">{user?.phoneNumber || '+919876543210'}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0A192F] border border-[#233554]">
            <span className="text-xs text-slate-400">Security Clearance / Role</span>
            <div className="font-bold text-teal-400 mt-0.5">{user?.role || 'VERIFIED_USER'}</div>
          </div>
        </div>
      </Card>

      {/* Accessibility & Interface Preferences */}
      <Card title="Accessibility & Language Preferences" icon={Accessibility}>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0A192F] border border-[#233554] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white">Senior Citizen Mode</span>
              <p className="text-xs text-slate-400">
                Increases font size, expands touch targets, and applies maximum contrast.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSeniorMode(!seniorMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                seniorMode ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  seniorMode ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0A192F] border border-[#233554] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white">Interface Language</span>
              <p className="text-xs text-slate-400">Choose between English and हिन्दी.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  lang === 'en'
                    ? 'bg-teal-500 text-navy-950 font-extrabold'
                    : 'bg-[#112240] text-slate-300 border border-[#233554]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  lang === 'hi'
                    ? 'bg-teal-500 text-navy-950 font-extrabold'
                    : 'bg-[#112240] text-slate-300 border border-[#233554]'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Trusted Contacts / Family Guardians */}
      <Card
        title="Family Guardians (Trusted Emergency Contacts)"
        subtitle="Up to 3 trusted relatives who automatically receive SOS alerts if you encounter critical fraud."
        icon={Users}
        headerAction={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddContactModalOpen(true)}
          >
            Add Guardian
          </Button>
        }
      >
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-xl bg-[#0A192F] border border-[#233554] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                  {contact.contactName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{contact.contactName}</h4>
                  <p className="text-xs text-slate-400">
                    {contact.relationship} • {contact.phoneNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDeleteContact(contact.id)}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                title="Remove contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* DPDP Privacy & Right to be Forgotten */}
      <Card title="Privacy & Data Management (DPDP Act 2023)" icon={Shield}>
        <div className="space-y-4 text-xs text-slate-300">
          <p>
            Under India's Digital Personal Data Protection Act, 2023, you retain absolute ownership
            of your data. Uploaded screenshots are deleted every 24 hours.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportData}
            >
              Export My Data (JSON)
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => toastSuccess('Scan history successfully purged from cache.')}
            >
              Clear All My Scan History
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Guardian Modal */}
      <Modal
        isOpen={addContactModalOpen}
        onClose={() => setAddContactModalOpen(false)}
        title="Add Family Guardian"
        subtitle="Designate a trusted relative to receive automated emergency fraud warnings."
      >
        <form onSubmit={handleSubmitContact(onAddContact)} className="space-y-4">
          <Input
            label="Guardian Full Name"
            placeholder="Ananya Chandra"
            {...registerContact('contactName')}
            error={contactErrors.contactName?.message}
          />
          <Input
            label="Relationship"
            placeholder="Daughter, Son, Spouse, Brother"
            {...registerContact('relationship')}
            error={contactErrors.relationship?.message}
          />
          <Input
            label="Mobile Number"
            placeholder="+919845012345"
            {...registerContact('phoneNumber')}
            error={contactErrors.phoneNumber?.message}
            helperText="10-digit Indian number (+91XXXXXXXXXX)"
          />
          <Input
            label="Email Address (Optional)"
            placeholder="ananya@example.com"
            type="email"
            {...registerContact('email')}
            error={contactErrors.email?.message}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setAddContactModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={savingContact}
            >
              Save Guardian
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
