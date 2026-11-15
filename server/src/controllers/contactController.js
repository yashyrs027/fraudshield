import { memoryStore } from '../config/db.js';

export const contactController = {
  async getContacts(req, res) {
    const userId = req.user.id;
    const contacts = [];
    for (const c of memoryStore.contacts.values()) {
      if (c.user_id === userId) {
        contacts.push({
          id: c.id,
          contactName: c.contact_name,
          relationship: c.relationship,
          phoneNumber: c.phone_number,
          email: c.email,
          isActive: c.is_active,
          createdAt: c.created_at,
        });
      }
    }
    res.json({ success: true, data: { contacts } });
  },

  async addContact(req, res) {
    const userId = req.user.id;
    const { contactName, relationship, phoneNumber, email } = req.body;

    const contactId = `tc_${Date.now()}`;
    const newContact = {
      id: contactId,
      user_id: userId,
      contact_name: contactName,
      relationship,
      phone_number: phoneNumber,
      email: email || null,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    memoryStore.contacts.set(contactId, newContact);

    res.status(201).json({
      success: true,
      data: {
        id: contactId,
        contactName,
        relationship,
        phoneNumber,
        email,
        isActive: true,
      },
    });
  },

  async deleteContact(req, res) {
    const { id } = req.params;
    memoryStore.contacts.delete(id);
    res.json({ success: true, data: { message: 'Contact deleted successfully.' } });
  },

  async notifyContacts(req, res) {
    const { sessionId, customNote } = req.body;
    const userId = req.user.id;

    const recipients = [];
    for (const c of memoryStore.contacts.values()) {
      if (c.user_id === userId) {
        recipients.push(`${c.contact_name} (${c.phone_number})`);
      }
    }

    res.json({
      success: true,
      data: {
        alertsDispatched: recipients.length,
        recipients,
        deliveryStatus: 'QUEUED',
        sessionId,
        note: customNote,
      },
    });
  },
};
