export interface SampleScam {
  title: string;
  category: string;
  text: string;
}

export const SAMPLE_SCAMS: SampleScam[] = [
  {
    title: 'Bank KYC Block Alert (Phishing)',
    category: 'Bank and UPI scams',
    text: 'Dear Customer, your HDFC Bank account will be SUSPENDED today due to pending PAN Card KYC update. Click immediately to update: http://hdfc-kyc-verify-update.com/login or call 9876543210 to avoid account blocking.',
  },
  {
    title: 'Lottery Prize Winner SMS',
    category: 'Lottery and prize scams',
    text: 'CONGRATULATIONS! Your mobile number has won Rs. 25,00,000 in Kaun Banega Crorepati (KBC) Lucky Draw 2026. To claim your prize money, contact Manager Sharma via WhatsApp at +91-9988776655 immediately!',
  },
  {
    title: 'Fake Courier / Delivery Scam',
    category: 'Delivery and parcel scams',
    text: 'IndiaPost: Your package could not be delivered because incorrect address details were provided. Please update your delivery address within 24 hours to re-schedule: https://indiapost-parcel-tracking.net/update',
  },
  {
    title: 'Part-Time Work From Home Job Scam',
    category: 'Fake job offers',
    text: 'Work From Home Opportunity! Earn Rs. 5,000 daily by simply rating YouTube videos and Google Maps listings. No experience required. Initial training fee of Rs. 500 applies. Message us on Telegram @HR_Recruiter_99.',
  },
  {
    title: 'Electricity Bill Disconnection Warning',
    category: 'Impersonation scams',
    text: 'URGENT ALERT from State Electricity Board: Your electricity power supply will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Please pay immediately by contacting the electricity officer at 7001234567.',
  },
];
