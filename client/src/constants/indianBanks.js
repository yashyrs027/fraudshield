export const INDIAN_BANKS_DIRECTORY = [
  {
    id: 'sbi',
    name: 'State Bank of India (SBI)',
    shortName: 'SBI',
    helpline: '18001234',
    altHelpline: '18002100',
    smsBlockNumber: '567676',
    smsFormat: 'BLOCK <Last 4 Digits of ATM Card>',
    officialDomain: 'onlinesbi.sbi',
    upiHandles: ['@sbi', '@oksbi'],
    disputePortal: 'https://crcf.sbi.co.in'
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    shortName: 'HDFC',
    helpline: '18002026161',
    altHelpline: '18602676161',
    smsBlockNumber: '5676712',
    smsFormat: 'BLOCK <Card Number>',
    officialDomain: 'hdfcbank.com',
    upiHandles: ['@hdfcbank', '@okhdfcbank'],
    disputePortal: 'https://www.hdfcbank.com/personal/useful-links/security/report-unauthorized-transactions'
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    shortName: 'ICICI',
    helpline: '18001080',
    altHelpline: '18001024242',
    smsBlockNumber: '5676766',
    smsFormat: 'BLOCK <Last 4 Digits of Account/Card>',
    officialDomain: 'icicibank.com',
    upiHandles: ['@icici', '@okicici'],
    disputePortal: 'https://www.icicibank.com/cyber-security'
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    shortName: 'Axis',
    helpline: '18604195555',
    altHelpline: '18605005555',
    smsBlockNumber: '5676782',
    smsFormat: 'BLOCK <Last 4 digits>',
    officialDomain: 'axisbank.com',
    upiHandles: ['@axisbank', '@okaxis'],
    disputePortal: 'https://www.axisbank.com/support/report-suspicious-activity'
  },
  {
    id: 'pnb',
    name: 'Punjab National Bank (PNB)',
    shortName: 'PNB',
    helpline: '18001802222',
    altHelpline: '18001032222',
    smsBlockNumber: '5607040',
    smsFormat: 'HOT <16-digit Card Number>',
    officialDomain: 'pnbindia.in',
    upiHandles: ['@pnb'],
    disputePortal: 'https://pnbindia.in'
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    shortName: 'BoB',
    helpline: '18005700',
    altHelpline: '18002584455',
    smsBlockNumber: '8422009988',
    smsFormat: 'BLOCK <Last 4 digits>',
    officialDomain: 'bankofbaroda.in',
    upiHandles: ['@barodampay'],
    disputePortal: 'https://www.bankofbaroda.in'
  }
];

export const NATIONAL_CYBER_CRIME = {
  helpline: '1930',
  portal: 'https://cybercrime.gov.in',
  chakshuPortal: 'https://sancharsaathi.gov.in/sfc/',
  rbiSachet: 'https://sachet.rbi.org.in'
};
