// Legal page content for Digital Bloom.
//
// Written 2026-08-18 (A.K. lane) because the site had no Terms, Privacy, or
// Refund policy at all — which blocks Twilio carrier verification AND Google
// Ads advertiser approval.
//
// Two sections carry hard external requirements. Do not soften them without
// understanding why they exist:
//   • privacy → "Text messages and your phone number" contains the
//     no-sharing sentence US carriers look for during 10DLC / toll-free
//     review. Removing it fails the review.
//   • terms → "Text message delivery" mirrors the consent wording shown at
//     checkout (SMS_CONSENT_TEXT in Checkout.jsx). Keep them in sync.

export const LEGAL_ENTITY = 'Creative Vision LLC';
export const BRAND = 'Digital Bloom™';
export const BUSINESS_ADDRESS = '1914 J N Pease Pl, Ste 92343, Charlotte, NC 28262';
export const BUSINESS_PHONE = '(704) 312-0062';
export const CONTACT_EMAIL = 'hello@digitalbloom.store';
export const LAST_UPDATED = 'August 18, 2026';

export const LEGAL_DOCS = {
  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    intro: `These terms govern your use of digitalbloom.store and the ${BRAND} service, operated by ${LEGAL_ENTITY}. By buying or sending a bloom, you agree to them.`,
    sections: [
      {
        heading: 'What Digital Bloom is',
        body: [
          `${BRAND} sells personalized digital video gifts — we call them blooms. You choose a design, add a written message, and we deliver it to the person you name, or give you a link to deliver yourself.`,
          'Everything we sell is digital. Nothing is shipped. There is no physical product.',
        ],
      },
      {
        heading: 'Buying a bloom',
        body: [
          'Prices are shown in US dollars at checkout and are charged at the time of purchase. Payments are processed by Stripe; we never see or store your full card number.',
          'You must be at least 18 years old, or have permission from a parent or guardian, to make a purchase.',
        ],
      },
      {
        heading: 'Delivery',
        body: [
          'You choose how a bloom reaches its recipient: by email, or by text message. We deliver once. After a bloom is delivered it is marked as sent and cannot be re-sent from the same order.',
          'A delivered bloom can be opened a limited number of times — currently 30 views — after which the link expires. This protects the gift from being passed around indefinitely.',
          'If a delivery fails for a reason on our side, contact us and we will make it right.',
        ],
      },
      {
        heading: 'Text message delivery',
        body: [
          'If you choose text delivery, you are telling us that the recipient knows you and is happy to receive a one-time text containing their gift.',
          'We send one message per gift. We do not send marketing texts, and we do not enroll anyone in a recurring message program. Message and data rates may apply.',
          'Recipients can reply STOP to opt out of any further messages, or HELP for assistance. Do not use Digital Bloom to text people who have not agreed to hear from you.',
        ],
      },
      {
        heading: 'Your message content',
        body: [
          'You are responsible for what you write in a bloom. Do not use our service to harass, threaten, deceive, or impersonate anyone, or to send anything unlawful.',
          'We may refuse or cancel an order, and remove a bloom, if we believe it is being used this way. Where we cancel an undelivered order for this reason, we refund it.',
        ],
      },
      {
        heading: 'What we own, and what you own',
        body: [
          `The bloom designs, videos, artwork, and the ${BRAND} name and marks belong to ${LEGAL_ENTITY}. Buying a bloom gives you a personal, non-commercial licence to send and enjoy it — not ownership of the underlying artwork.`,
          'The words you write in your message remain yours.',
          'You may not resell our videos, strip our watermark, or use a bloom in advertising without written permission.',
        ],
      },
      {
        heading: 'Service availability',
        body: [
          'We work hard to keep the service running, but we do not promise uninterrupted availability. Features may change as the product develops.',
        ],
      },
      {
        heading: 'Limits on our liability',
        body: [
          'The service is provided as is. To the fullest extent permitted by law, our total liability for any claim relating to a bloom is limited to the amount you paid for that bloom.',
          'We are not liable for indirect or consequential losses — including a gift arriving later than you hoped, or a recipient not opening it.',
        ],
      },
      {
        heading: 'Governing law',
        body: [
          'These terms are governed by the laws of the State of North Carolina, United States, without regard to its conflict-of-law rules.',
        ],
      },
      {
        heading: 'Changes and contact',
        body: [
          'We may update these terms as the service evolves. The date at the top reflects the current version.',
          `Questions: ${CONTACT_EMAIL}, or write to ${LEGAL_ENTITY}, ${BUSINESS_ADDRESS}.`,
        ],
      },
    ],
  },

  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    intro: `${LEGAL_ENTITY} operates ${BRAND}. This policy explains what we collect, why, and what we never do with it.`,
    sections: [
      {
        heading: 'What we collect',
        body: [
          'From the buyer: your email address, the message you write, and your payment confirmation. Stripe handles the payment itself and we never receive your full card number.',
          "From the recipient you name: their first name, and either their email address or their mobile number — whichever delivery method you choose.",
          'Automatically: basic technical information such as pages viewed and whether a bloom has been opened, so we can tell you your gift arrived.',
        ],
      },
      {
        heading: 'Why we collect it',
        body: [
          'To deliver the gift you paid for, to confirm to you that it arrived, to answer your questions, and to meet our tax and accounting obligations.',
          'That is the whole list. We do not build advertising profiles from it.',
        ],
      },
      {
        heading: 'Text messages and your phone number',
        body: [
          'When you choose text delivery, we collect the recipient mobile number solely to deliver that one gift.',
          'No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent is not shared with any third parties.',
          'We send one message per gift. We do not run text marketing campaigns and we do not add anyone to a recurring message list. Recipients may reply STOP to opt out or HELP for help. Message and data rates may apply.',
        ],
      },
      {
        heading: 'Who we share data with',
        body: [
          'Only the service providers we need to run the business: Stripe for payments, Resend for email delivery, Twilio for text delivery, Supabase for our database, and Vercel for hosting. Each receives only what it needs to do its job.',
          'We do not sell your personal information. We do not trade or rent contact details. We will disclose information if the law requires it.',
        ],
      },
      {
        heading: 'How long we keep it',
        body: [
          'Order records are kept as long as needed for accounting and tax purposes. Delivery details — including recipient phone numbers and email addresses — are kept with the order they belong to.',
          'You can ask us to delete personal information that we are not legally required to retain.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          `Email ${CONTACT_EMAIL} to see what we hold about you, correct it, or ask us to delete it. We will respond within 30 days.`,
          'If you are a recipient and would rather not receive a bloom, reply STOP to the message or email us and we will remove your details.',
        ],
      },
      {
        heading: "Children's privacy",
        body: [
          'Digital Bloom is not directed at children under 13 and we do not knowingly collect their personal information.',
        ],
      },
      {
        heading: 'Security',
        body: [
          'Data is transmitted over encrypted connections and stored with reputable providers. No system is perfectly secure, but we take reasonable measures to protect what you give us.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          `${LEGAL_ENTITY}, ${BUSINESS_ADDRESS}. Phone ${BUSINESS_PHONE}. Email ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },

  refunds: {
    slug: 'refunds',
    title: 'Refund Policy',
    intro: 'Blooms are digital gifts, delivered instantly. Here is exactly when you can get your money back.',
    sections: [
      {
        heading: 'Before the bloom is delivered',
        body: [
          'Full refund, no questions asked. Email us with the address you used at checkout and we will refund the order.',
        ],
      },
      {
        heading: 'After the bloom is delivered',
        body: [
          'Because a delivered bloom has already been received and viewed, delivered orders are generally final.',
          'That said — if something went wrong, tell us. Wrong recipient, a bloom that would not play, a duplicate charge, a delivery that never arrived: we refund those. We would rather fix it than keep money from an unhappy customer.',
        ],
      },
      {
        heading: 'How to ask',
        body: [
          `Email ${CONTACT_EMAIL} with your order confirmation or the email address you checked out with. Tell us what happened. We respond within two business days.`,
          'Approved refunds go back to the original payment method and typically appear within 5–10 business days, depending on your bank.',
        ],
      },
      {
        heading: 'Chargebacks',
        body: [
          'Please contact us before disputing a charge with your bank. We can almost always resolve it faster ourselves.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          `${LEGAL_ENTITY}, ${BUSINESS_ADDRESS}. Phone ${BUSINESS_PHONE}. Email ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
};
