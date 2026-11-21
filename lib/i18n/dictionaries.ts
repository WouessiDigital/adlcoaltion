// All public-facing copy for adlcoalition.org, in English and French.
// To change wording, edit it here only. TypeScript fails the build if a French line is missing.
// French: Canadian French (fr-CA). The French org name is a proposal pending ADLC approval.

export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const LOCALE_COOKIE = 'adlc_lang'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

const en = {
  meta: {
    title: 'African Diaspora Leaders Coalition',
    description:
      'Uniting African voices in Canada to shape policy, foster investment, and drive sustainable development across Africa.',
  },
  nav: {
    home: 'Home',
    about: 'About Us',
    policy: 'Policy Advocacy',
    calendar: 'Calendar',
    join: 'Join Us',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchToShort: 'FR',
    switchLabel: 'Voir le site en français',
  },
  hero: {
    title: 'Advancing Canada-Africa relations through African Diaspora leadership',
    subtitle:
      'Uniting African voices in Canada to shape policy, foster investment, and drive sustainable development across Africa.',
    becomeMember: 'Become a Member',
    learnMore: 'Learn More',
  },
  about: {
    title: 'About ADLC',
    p1: 'The African Diaspora Leaders Coalition (ADLC) is a dynamic alliance of African-descended professionals in Canada, including investors, academics, artists, athletes, and corporate leaders, committed to advancing African affairs through strategic collaboration with the Government of Canada and the private sector.',
    p2: 'We serve as a platform to amplify Diaspora leadership, design impactful policies, and unlock opportunities for mutual growth between Canada and Africa.',
    imageAlt: 'ADLC members gathered at a coalition event',
    missionTitle: 'Our Mission',
    mission:
      'To convene a diverse, cross-sectoral network of African Diaspora leaders from across Canada who are committed to mobilizing their lived experience, professional expertise, and global networks with mutual respect and dignity. Through principled collaboration, we aim to influence foreign policy, catalyze economic opportunity, and co-create solutions that promote equity, innovation, and shared progress between Canada and African nations.',
    visionTitle: 'Our Vision',
    vision:
      'To be the preeminent platform of African Diaspora leadership in Canada, united in advancing bold, equitable, and enduring partnerships that redefine and strengthen Canada-Africa relations for mutual prosperity.',
  },
  policy: {
    whatWeDo: 'What We Do',
    policyAdvocacy: 'Policy Advocacy',
    policyText:
      'Provide actionable recommendations to support Canada-Africa economic, diplomatic and development cooperation.',
    economic: 'Economic Cooperation',
    diaspora: 'Diaspora Engagement',
    knowledge: 'Knowledge Engagement',
    iconAlt: 'Policy advocacy icon',
    imageAlt: 'Policy advocacy',
  },
  committee: {
    title: 'Meet the Interim Leadership Committee',
    intro:
      'Meet our diverse network of thought leaders shaping Africa’s future, from corporate executives and researchers to artists and entrepreneurs.',
    seeAll: 'See All Members',
    showLess: 'Show Less',
  },
  join: {
    title: 'Join the Movement',
    text: 'ADLC is a recognized non-profit organization dedicated to creating a new framework for Diaspora-led diplomacy and development. Join our growing alliance to define the next chapter of Africa-Canada relations.',
    newsletter: 'Join our Newsletter',
  },
  form: {
    name: 'Your Name',
    email: 'Your Email',
    message: 'Your Message',
    submit: 'Become a Member',
    submitting: 'Submitting...',
    success: 'Thank you! Your submission has been received.',
    errEmail: 'Please enter a valid email address.',
    errNameRequired: 'Please enter your name.',
    errName: 'Please enter a valid full name.',
    errMessage: 'Please enter a message.',
    errGeneric: 'Submission failed. Please try again.',
    errRate: 'Too many attempts. Please wait a few minutes and try again.',
    privacy:
      'We use this information only to respond to your membership request. It is accessible to ADLC administrators and is not shared for marketing purposes.',
  },
  footer: {
    about: 'About',
    contact: 'Contact',
    blog: 'Blog',
    resources: 'Resources',
    designedBy: 'Designed by Wouessi Inc.',
    rights: '© 2026 African Diaspora Leaders Coalition. All Rights Reserved.',
  },
  calendar: {
    title: 'Events',
    iframeTitle: 'ADLC events calendar',
  },
}

export type Dictionary = typeof en

const fr: Dictionary = {
  meta: {
    title: 'Coalition des leaders de la diaspora africaine',
    description:
      'Rassembler les voix africaines au Canada pour contribuer à l’élaboration des politiques, stimuler l’investissement et favoriser le développement durable en Afrique.',
  },
  nav: {
    home: 'Accueil',
    about: 'À propos',
    policy: 'Politiques publiques',
    calendar: 'Calendrier',
    join: 'Adhérer',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    switchToShort: 'EN',
    switchLabel: 'View the site in English',
  },
  hero: {
    title: 'Faire progresser les relations Canada-Afrique grâce au leadership de la diaspora africaine',
    subtitle:
      'Rassembler les voix africaines au Canada pour contribuer à l’élaboration des politiques, stimuler l’investissement et favoriser le développement durable en Afrique.',
    becomeMember: 'Devenir membre',
    learnMore: 'En savoir plus',
  },
  about: {
    title: 'À propos de l’ADLC',
    p1: 'La Coalition des leaders de la diaspora africaine (ADLC) est une alliance dynamique de professionnels d’ascendance africaine établis au Canada : investisseurs, universitaires, artistes, athlètes et dirigeants d’entreprise. Ses membres s’engagent à faire progresser les enjeux africains grâce à une collaboration stratégique avec le gouvernement du Canada et le secteur privé.',
    p2: 'Nous offrons une plateforme qui met en valeur le leadership de la diaspora, contribue à l’élaboration de politiques porteuses de changement et crée des possibilités de croissance mutuelle entre le Canada et l’Afrique.',
    imageAlt: 'Membres de l’ADLC réunis lors d’un événement de la coalition',
    missionTitle: 'Notre mission',
    mission:
      'Réunir, partout au Canada, un réseau diversifié de leaders de la diaspora africaine issus de différents secteurs, déterminés à mettre à profit leur expérience, leur expertise professionnelle et leurs réseaux internationaux, dans un esprit de respect mutuel et de dignité. Grâce à une collaboration fondée sur des principes communs, nous cherchons à influencer la politique étrangère, à stimuler les possibilités économiques et à élaborer ensemble des solutions qui favorisent l’équité, l’innovation et un progrès commun entre le Canada et les pays africains.',
    visionTitle: 'Notre vision',
    vision:
      'Être la principale plateforme de leadership de la diaspora africaine au Canada, en rassemblant ses membres autour de partenariats audacieux, équitables et durables qui redéfinissent et renforcent les relations Canada-Afrique dans un esprit de prospérité mutuelle.',
  },
  policy: {
    whatWeDo: 'Ce que nous faisons',
    policyAdvocacy: 'Plaidoyer en politiques publiques',
    policyText:
      'Formuler des recommandations concrètes pour soutenir la coopération économique, diplomatique et en matière de développement entre le Canada et l’Afrique.',
    economic: 'Coopération économique',
    diaspora: 'Engagement de la diaspora',
    knowledge: 'Mobilisation des connaissances',
    iconAlt: 'Icône du plaidoyer en politiques publiques',
    imageAlt: 'Plaidoyer en politiques publiques',
  },
  committee: {
    title: 'Découvrez le comité de direction intérimaire',
    intro:
      'Notre réseau diversifié réunit des personnalités influentes qui contribuent à façonner l’avenir de l’Afrique : dirigeants d’entreprise, chercheurs, artistes et entrepreneurs.',
    seeAll: 'Voir tous les membres',
    showLess: 'Voir moins',
  },
  join: {
    title: 'Joignez-vous au mouvement',
    text: 'L’ADLC est un organisme sans but lucratif reconnu qui œuvre à établir un nouveau cadre de diplomatie et de développement porté par la diaspora. Joignez-vous à notre alliance grandissante pour écrire ensemble le prochain chapitre des relations Canada-Afrique.',
    newsletter: 'Abonnez-vous à notre infolettre',
  },
  form: {
    name: 'Votre nom',
    email: 'Votre courriel',
    message: 'Votre message',
    submit: 'Devenir membre',
    submitting: 'Envoi en cours…',
    success: 'Merci! Votre demande a bien été reçue.',
    errEmail: 'Veuillez saisir une adresse courriel valide.',
    errNameRequired: 'Veuillez saisir votre nom.',
    errName: 'Veuillez saisir votre nom complet.',
    errMessage: 'Veuillez saisir un message.',
    errGeneric: 'L’envoi a échoué. Veuillez réessayer.',
    errRate: 'Trop de tentatives. Veuillez patienter quelques minutes, puis réessayer.',
    privacy:
      'Nous utilisons ces renseignements uniquement pour répondre à votre demande d’adhésion. Ils sont accessibles aux administrateurs de l’ADLC et ne sont pas communiqués à des fins de marketing.',
  },
  footer: {
    about: 'À propos',
    contact: 'Contact',
    blog: 'Blogue',
    resources: 'Ressources',
    designedBy: 'Site Web conçu par Wouessi Inc.',
    rights: '© 2026 Coalition des leaders de la diaspora africaine. Tous droits réservés.',
  },
  calendar: {
    title: 'Événements',
    iframeTitle: 'Calendrier des événements de l’ADLC',
  },
}

export const dictionaries: Record<Locale, Dictionary> = { en, fr }

// Committee members. Roles are per language; French titles are gendered and need ADLC confirmation.
export type Member = {
  id: string
  name: string
  image: string
  linkedin: string | null
  role: Record<Locale, string>
  hiddenOnMobile: boolean
}

export const members: Member[] = [
  {
    id: 'Jude-Kong',
    name: 'Jude Kong',
    image: '/committee/JudeKong.png',
    linkedin: 'https://www.linkedin.com/in/dzevela/',
    role: {
      en: 'Executive Director at Africa-Canada AI & Data Innovation Consortium',
      fr: 'Directeur général, Consortium Afrique-Canada pour l’innovation en IA et en données',
    },
    hiddenOnMobile: false,
  },
  {
    id: 'Kofi-Achampong',
    name: 'Kofi Achampong',
    image: '/committee/KofiAchampong.png',
    // Live site linked this card to Jude Kong's profile. Add Kofi's real LinkedIn URL here.
    linkedin: null,
    role: {
      en: 'Principal Lawyer & Government Relations Advisor at Achampong Law',
      fr: 'Avocat principal et conseiller en relations gouvernementales, Achampong Law',
    },
    hiddenOnMobile: false,
  },
  {
    id: 'Minerva-Gray',
    name: 'Minerva Saddler Gray',
    image: '/committee/MinervaGray.png',
    linkedin: 'https://www.linkedin.com/in/minervavsaddlergray/',
    role: { en: 'Founder of Kuinua Consulting', fr: 'Fondatrice, Kuinua Consulting' },
    hiddenOnMobile: false,
  },
  {
    id: 'Nerissa-Allen',
    name: 'Nerissa Allen',
    image: '/committee/NerissaAllen.png',
    linkedin: 'https://www.linkedin.com/in/nerissa-allen/',
    role: {
      en: 'Co-Founder & President of Black Business Association of BC',
      fr: 'Cofondatrice et présidente, Black Business Association of BC',
    },
    hiddenOnMobile: false,
  },
  {
    id: 'Patrick-Makokoro',
    name: 'Patrick Makokoro',
    image: '/committee/PatrickMakokoro.png',
    linkedin: 'https://www.linkedin.com/in/patrick-makokoro/',
    role: { en: 'Principal Consultant at HuUbuntu Consulting', fr: 'Consultant principal, HuUbuntu Consulting' },
    hiddenOnMobile: true,
  },
  {
    id: 'Perry-Chuinkam',
    name: 'Perry Chuinkam',
    image: '/committee/PerryChuinkam.png',
    linkedin: 'https://www.linkedin.com/in/perry-chuinkam-66076211/',
    role: { en: 'Vice President of Morgan Stanley', fr: 'Vice-président, Morgan Stanley' },
    hiddenOnMobile: true,
  },
  {
    id: 'Tapfuma-Musewe',
    name: 'Tapfuma Musewe',
    image: '/committee/TapfumaMusewe.png',
    linkedin: 'https://www.linkedin.com/in/tapfuma-musewe/',
    role: { en: 'President of ESG Global Advisors', fr: 'Président, ESG Global Advisors' },
    hiddenOnMobile: true,
  },
  {
    id: 'Sereine-MN',
    name: 'Sereine M. N.',
    image: '/committee/SereineMN.png',
    linkedin: 'https://www.linkedin.com/in/sereine-m-n-74236584/',
    role: { en: 'Administrator at Desjardins', fr: 'Administratrice, Desjardins' },
    hiddenOnMobile: true,
  },
]
