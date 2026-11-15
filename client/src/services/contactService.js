import { apiClient, USE_MOCKS } from './api';
import { MOCK_TRUSTED_CONTACTS } from './mockData';

let localContacts = [...MOCK_TRUSTED_CONTACTS];

export const contactService = {
  async getContacts() {
    if (USE_MOCKS) {
      return { success: true, data: { contacts: localContacts } };
    }
    const response = await apiClient.get('/contacts');
    return response.data;
  },

  async addContact(contact) {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newContact = {
        ...contact,
        id: 'tc-' + Date.now(),
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      localContacts.push(newContact);
      return { success: true, data: newContact };
    }
    const response = await apiClient.post('/contacts', contact);
    return response.data;
  },

  async deleteContact(id) {
    if (USE_MOCKS) {
      localContacts = localContacts.filter((c) => c.id !== id);
      return { success: true };
    }
    const response = await apiClient.delete(`/contacts/${id}`);
    return response.data;
  },

  async notifyContacts(sessionId, customNote) {
    if (USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          alertsDispatched: localContacts.length,
          recipients: localContacts.map((c) => `${c.contactName} (${c.phoneNumber})`),
          deliveryStatus: 'QUEUED',
        },
      };
    }
    const response = await apiClient.post('/contacts/notify', { sessionId, customNote });
    return response.data;
  },
};
