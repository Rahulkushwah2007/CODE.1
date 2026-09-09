import { AppLanguage } from '../types';

export interface Translations {
  // Brand & Top Header
  appName: string;
  appSubtitle: string;
  safeZonesTag: string;
  searchPlaceholder: string;
  nearby15km: string;
  verifiedSafeZones: string;
  found: string;
  bedsLeft: string;
  darkTheme: string;
  paperTheme: string;
  countryAll: string;
  countryInd: string;
  countryNpl: string;
  languageSelect: string;

  // Sidebar / Navigation Tabs
  coreReliefOps: string;
  eocIncidentCoord: string;
  tabShelters: string;
  tabRegisterShelter: string;
  tabResources: string;
  tabProfile: string;
  tabCommand: string;
  tabIntake: string;
  tabVolunteers: string;
  tabAnalytics: string;
  tabSettings: string;
  tabAlerts: string;
  addNewShelter: string;
  privateOrPublic: string;
  registerBadge: string;
  criticalAlertBadge: string;

  // Metrics Strip
  activeShelters: string;
  ofVerifiedFacilities: string;
  bedsAvailable: string;
  totalCapacity: string;
  emergencyHelpline: string;
  callNow: string;

  // Shelter Roster View Filters
  filterShelters: string;
  filterAllTypes: string;
  filterGovtCamp: string;
  filterSchool: string;
  filterStadium: string;
  filterCommunityHall: string;
  filterHospitalSupported: string;
  filterReligiousFacility: string;

  filterAllStates: string;
  filterAvailable: string;
  filterLimited: string;
  filterCritical: string;

  filterFeaturesLabel: string;
  medicalSupport: string;
  drinkingWater: string;
  hotFood: string;
  wheelchairAccessible: string;

  viewBoth: string;
  viewMap: string;
  viewCards: string;

  // Shelter Cards
  atCapacity: string;
  kmAway: string;
  occupancyLabel: string;
  vacantBeds: string;
  callHotline: string;
  directions: string;
  bookAdvance: string;
  fullState: string;
  verifiedShelter: string;
  aadhaarVerified: string;
  policeVerified: string;
  publicFacility: string;
  privateFacility: string;

  // Guidelines & Accordion
  admissionProtocolsTitle: string;
  guidelinesQ1: string;
  guidelinesA1: string;

  // Booking Modal
  bookingModalTitle: string;
  bookingModalSubtitle: string;
  evacueeCountLabel: string;
  specialNeedsLabel: string;
  specialNeedsPlaceholder: string;
  cancelBtn: string;
  confirmBookingBtn: string;
  bookingConfirmedTitle: string;
  bookingCodeLabel: string;
  bookingInstructions: string;
  closeBtn: string;

  // Bottom Sheet Details
  shelterDetailsTitle: string;
  capacityOverview: string;
  contactCoordinator: string;
  getDirectionsBtn: string;

  // Mobile Nav
  mobileShelters: string;
  mobileResources: string;
  mobileAlerts: string;
  mobileProfile: string;

  // Additional Views & Actions
  shelterManager: string;
  capacityStatus: string;
  analytics: string;
  alerts: string;
  resources: string;
  registerShelter: string;
  familyIntake: string;
  profile: string;
  settings: string;
  nearbyShelters: string;
  viewShelterDetails: string;
  sendAlert: string;
  requestSupplies: string;
  updateInventory: string;
  cancel: string;
  confirm: string;
  save: string;
  occupancy: string;
  add: string;
  remove: string;
  familyInfo: string;
  members: string;
  requirements: string;
  allocation: string;
  confirmedPass: string;
  headOfFamily: string;
  phoneNumber: string;
  totalMembers: string;
  nextStep: string;
  previousStep: string;
  fastRegistration: string;
  fullName: string;
  role: string;
  language: string;
  saveChanges: string;
  shelterName: string;
  shelterAddress: string;
  totalCapacity: string;
  registerShelterBtn: string;
  resourceInventory: string;
}

export const translations: Record<AppLanguage, Translations> = {
  en: {
    // Brand & Top Header
    appName: 'RESQTECH',
    appSubtitle: 'National Disaster Safe Zones & Relocations',
    safeZonesTag: 'SAFE ZONES',
    searchPlaceholder: 'Search shelter, safe zone, city, district...',
    nearby15km: 'Nearby (15km)',
    verifiedSafeZones: 'Verified Safe Zones',
    found: 'found',
    bedsLeft: 'BEDS LEFT',
    darkTheme: 'Dark',
    paperTheme: 'Light',
    countryAll: 'All',
    countryInd: 'IND',
    countryNpl: 'NPL',
    languageSelect: 'Language',

    // Sidebar
    coreReliefOps: 'Core Relief Operations',
    eocIncidentCoord: 'EOC & Incident Coordination',
    tabShelters: 'Shelters & Safe Zones',
    tabRegisterShelter: 'Register New Shelter',
    tabResources: 'Relief Resources',
    tabProfile: 'Evacuee Profile & Pass',
    tabCommand: 'Command Center',
    tabIntake: 'Family Intake Wizard',
    tabVolunteers: 'Volunteer Network',
    tabAnalytics: 'Disaster Analytics',
    tabSettings: 'System Telemetry',
    tabAlerts: 'Live Alerts',
    addNewShelter: 'Add New Shelter',
    privateOrPublic: 'Private or Public facility',
    registerBadge: 'Register',
    criticalAlertBadge: 'Alert',

    // Metrics Strip
    activeShelters: 'Active Shelters',
    ofVerifiedFacilities: 'of Verified Facilities',
    bedsAvailable: 'Beds Available',
    totalCapacity: 'Capacity',
    emergencyHelpline: 'Emergency Helpline',
    callNow: 'Call',

    // Shelter Roster View Filters
    filterShelters: 'Filter Shelters',
    filterAllTypes: 'All Shelter Types',
    filterGovtCamp: 'Govt Relief Camp',
    filterSchool: 'School / College',
    filterStadium: 'Stadium / Arena',
    filterCommunityHall: 'Community Hall',
    filterHospitalSupported: 'Hospital-Supported',
    filterReligiousFacility: 'Religious Facility',

    filterAllStates: 'All Occupancy States',
    filterAvailable: 'Available (Vacant Beds)',
    filterLimited: 'Limited Capacity',
    filterCritical: 'Near Full Capacity',

    filterFeaturesLabel: 'Filter Features:',
    medicalSupport: 'Medical Support',
    drinkingWater: 'Drinking Water',
    hotFood: 'Hot Food',
    wheelchairAccessible: 'Wheelchair Accessible',

    viewBoth: 'Both (Map & Cards)',
    viewMap: 'Map View',
    viewCards: 'Card View',

    // Shelter Cards
    atCapacity: 'AT CAPACITY',
    kmAway: 'km away',
    occupancyLabel: 'Occupancy',
    vacantBeds: 'Vacant Beds',
    callHotline: 'Call Hotline',
    directions: 'Directions',
    bookAdvance: 'Book Centre in Advance',
    fullState: 'Full',
    verifiedShelter: 'Verified Shelter',
    aadhaarVerified: 'Aadhaar Verified',
    policeVerified: 'Local Police Verified',
    publicFacility: 'Public',
    privateFacility: 'Private',

    // Guidelines & Accordion
    admissionProtocolsTitle: 'Emergency Shelter Admission Protocols & Guidelines',
    guidelinesQ1: 'What documents or verification are required upon shelter arrival?',
    guidelinesA1: 'No mandatory national ID is required during life-safety evacuations. Anyone fleeing floodwaters, cyclones, or earthquakes is entitled to immediate admission. The digital QR pass expedites bed allocation and family registration.',

    // Booking Modal
    bookingModalTitle: 'Confirm Bed Reservation',
    bookingModalSubtitle: 'Reserve emergency accommodation for you and your family.',
    evacueeCountLabel: 'Number of Evacuees (Family members)',
    specialNeedsLabel: 'Medical or Special Assistance Requirements (Optional)',
    specialNeedsPlaceholder: 'E.g., elderly member requiring wheelchair, infant formula, insulin storage...',
    cancelBtn: 'Cancel',
    confirmBookingBtn: 'Confirm Booking & Generate Pass',
    bookingConfirmedTitle: 'Reservation Confirmed!',
    bookingCodeLabel: 'Your Emergency Transit Code',
    bookingInstructions: 'Show this verification code or digital QR upon arrival at the security gate for expedited entry.',
    closeBtn: 'Done & Return',

    // Bottom Sheet Details
    shelterDetailsTitle: 'Safe Zone Details',
    capacityOverview: 'Capacity & Logistics',
    contactCoordinator: 'Contact Coordinator',
    getDirectionsBtn: 'Get Driving / Walking Route',

    // Mobile Nav
    mobileShelters: 'Shelters',
    mobileResources: 'Resources',
    mobileAlerts: 'Alerts',
    mobileProfile: 'Profile',

    // Additional Views & Actions
    shelterManager: 'Shelter Manager',
    capacityStatus: 'Capacity Status',
    analytics: 'Disaster Analytics',
    alerts: 'Live Alerts & Warnings',
    resources: 'Relief Resources',
    registerShelter: 'Register Safe Zone Shelter',
    familyIntake: 'Family Intake & Registration',
    profile: 'Evacuee Profile & Pass',
    settings: 'System Telemetry & Settings',
    nearbyShelters: 'Nearby Alternative Shelters',
    viewShelterDetails: 'View Facility Details',
    sendAlert: 'Report Incident / Alert',
    requestSupplies: 'Request Emergency Logistics',
    updateInventory: 'Update Inventory',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    occupancy: 'Occupancy',
    add: 'Add',
    remove: 'Remove',
    familyInfo: 'Family Information',
    members: 'Family Members',
    requirements: 'Special Requirements',
    allocation: 'Shelter Allocation',
    confirmedPass: 'Confirmed Pass',
    headOfFamily: 'Head of Family',
    phoneNumber: 'Mobile / Contact Number',
    totalMembers: 'Total Family Members',
    nextStep: 'Next Step',
    previousStep: 'Previous Step',
    fastRegistration: 'Fast Registration & Bed Allocation',
    fullName: 'Full Name',
    role: 'Platform Role',
    language: 'Language',
    saveChanges: 'Save Information',
    shelterName: 'Shelter Facility Name',
    shelterAddress: 'Full Address / Location',
    totalCapacity: 'Total Capacity',
    registerShelterBtn: 'Register Shelter Facility',
    resourceInventory: 'Resource Inventory'
  },

  hi: {
    // Brand & Top Header
    appName: 'रेसक्यूटेक',
    appSubtitle: 'राष्ट्रीय आपदा सुरक्षित क्षेत्र एवं पुनर्वास',
    safeZonesTag: 'सुरक्षित क्षेत्र',
    searchPlaceholder: 'आश्रय, सुरक्षित क्षेत्र, शहर, जिला खोजें...',
    nearby15km: 'आस-पास (15 किमी)',
    verifiedSafeZones: 'सत्यापित सुरक्षित क्षेत्र',
    found: 'मिले',
    bedsLeft: 'बिस्तर शेष',
    darkTheme: 'डार्क',
    paperTheme: 'लाइट',
    countryAll: 'सभी',
    countryInd: 'भारत',
    countryNpl: 'नेपाल',
    languageSelect: 'भाषा',

    // Sidebar
    coreReliefOps: 'मुख्य राहत कार्य',
    eocIncidentCoord: 'ईओसी और घटना समन्वय',
    tabShelters: 'आश्रय और सुरक्षित क्षेत्र',
    tabRegisterShelter: 'नया आश्रय पंजीकृत करें',
    tabResources: 'राहत संसाधन',
    tabProfile: 'निकासी प्रोफ़ाइल और पास',
    tabCommand: 'कमांड सेंटर',
    tabIntake: 'परिवार पंजीकरण विज़ार्ड',
    tabVolunteers: 'स्वयंसेवक नेटवर्क',
    tabAnalytics: 'आपदा विश्लेषण',
    tabSettings: 'सिस्टम टेलीमेट्री',
    tabAlerts: 'लाइव अलर्ट',
    addNewShelter: 'नया आश्रय जोड़ें',
    privateOrPublic: 'निजी या सरकारी सुविधा',
    registerBadge: 'पंजीकरण',
    criticalAlertBadge: 'अलर्ट',

    // Metrics Strip
    activeShelters: 'सक्रिय आश्रय केंद्र',
    ofVerifiedFacilities: 'सत्यापित केंद्रों में से',
    bedsAvailable: 'उपलब्ध बिस्तर',
    totalCapacity: 'कुल क्षमता',
    emergencyHelpline: 'आपातकालीन हेल्पलाइन',
    callNow: 'कॉल करें',

    // Shelter Roster View Filters
    filterShelters: 'आश्रय फ़िल्टर करें',
    filterAllTypes: 'सभी प्रकार के आश्रय',
    filterGovtCamp: 'सरकारी राहत शिविर',
    filterSchool: 'स्कूल / कॉलेज',
    filterStadium: 'स्टेडियम / खेल परिसर',
    filterCommunityHall: 'सामुदायिक भवन',
    filterHospitalSupported: 'अस्पताल समर्थित केंद्र',
    filterReligiousFacility: 'धार्मिक एवं सामुदायिक केंद्र',

    filterAllStates: 'सभी उपलब्धता स्थिति',
    filterAvailable: 'उपलब्ध (खाली बिस्तर)',
    filterLimited: 'सीमित क्षमता',
    filterCritical: 'लगभग पूर्ण क्षमता',

    filterFeaturesLabel: 'सुविधाएं फ़िल्टर करें:',
    medicalSupport: 'चिकित्सा सहायता',
    drinkingWater: 'पीने का पानी',
    hotFood: 'गर्म भोजन',
    wheelchairAccessible: 'व्हीलचेयर सुलभ',

    viewBoth: 'दोनों (मानचित्र और कार्ड)',
    viewMap: 'केवल मानचित्र',
    viewCards: 'कार्ड दृश्य',

    // Shelter Cards
    atCapacity: 'पूर्ण क्षमता',
    kmAway: 'किमी दूर',
    occupancyLabel: 'उपस्थिति दर',
    vacantBeds: 'खाली बिस्तर',
    callHotline: 'हॉटलाइन पर कॉल करें',
    directions: 'दिशा-निर्देश',
    bookAdvance: 'पहले से केंद्र बुक करें',
    fullState: 'पूर्ण',
    verifiedShelter: 'सत्यापित सुरक्षित आश्रय',
    aadhaarVerified: 'आधार सत्यापित',
    policeVerified: 'स्थानीय पुलिस सत्यापित',
    publicFacility: 'सरकारी/सार्वजनिक',
    privateFacility: 'निजी सुविधा',

    // Guidelines & Accordion
    admissionProtocolsTitle: 'आपातकालीन आश्रय प्रवेश नियम और दिशानिर्देश',
    guidelinesQ1: 'आश्रय आगमन पर कौन से दस्तावेज़ या सत्यापन आवश्यक हैं?',
    guidelinesA1: 'जीवन सुरक्षा निकासी के दौरान कोई भी अनिवार्य राष्ट्रीय पहचान पत्र आवश्यक नहीं है। बाढ़, चक्रवात या भूकंप से विस्थापित प्रत्येक नागरिक तुरंत प्रवेश का हकदार है। डिजिटल क्यूआर पास बिस्तर आवंटन को तीव्र करता है।',

    // Booking Modal
    bookingModalTitle: 'बिस्तर आरक्षण की पुष्टि करें',
    bookingModalSubtitle: 'अपने और अपने परिवार के लिए आपातकालीन आवास सुरक्षित करें।',
    evacueeCountLabel: 'व्यक्तियों की संख्या (परिवार के सदस्य)',
    specialNeedsLabel: 'चिकित्सा या विशेष सहायता आवश्यकताएँ (वैकल्पिक)',
    specialNeedsPlaceholder: 'उदा. बुजुर्ग सदस्य के लिए व्हीलचेयर, शिशु आहार, इंसुलिन भंडारण...',
    cancelBtn: 'रद्द करें',
    confirmBookingBtn: 'बुकिंग की पुष्टि करें और पास प्राप्त करें',
    bookingConfirmedTitle: 'आरक्षण सफल रहा!',
    bookingCodeLabel: 'आपका आपातकालीन ट्रांज़िट कोड',
    bookingInstructions: 'शीघ्र प्रवेश के लिए मुख्य सुरक्षा द्वार पर यह सत्यापन कोड या डिजिटल क्यूआर दिखाएं।',
    closeBtn: 'संपन्न और वापस जाएं',

    // Bottom Sheet Details
    shelterDetailsTitle: 'सुरक्षित क्षेत्र विवरण',
    capacityOverview: 'क्षमता और रसद स्थिति',
    contactCoordinator: 'समन्वयक से संपर्क करें',
    getDirectionsBtn: 'मार्ग और दिशा-निर्देश प्राप्त करें',

    // Mobile Nav
    mobileShelters: 'आश्रय',
    mobileResources: 'संसाधन',
    mobileAlerts: 'अलर्ट',
    mobileProfile: 'प्रोफ़ाइल',

    // Additional Views & Actions
    shelterManager: 'आश्रय प्रबंधक',
    capacityStatus: 'क्षमता स्थिति',
    analytics: 'आपदा विश्लेषण',
    alerts: 'लाइव अलर्ट एवं चेतावनियाँ',
    resources: 'राहत संसाधन सूची',
    registerShelter: 'सुरक्षित आश्रय पंजीकृत करें',
    familyIntake: 'परिवार पंजीकरण',
    profile: 'निकासी प्रोफ़ाइल और पास',
    settings: 'सिस्टम सेटिंग्स',
    nearbyShelters: 'निकटवर्ती वैकल्पिक आश्रय',
    viewShelterDetails: 'सुविधा विवरण देखें',
    sendAlert: 'घटना / अलर्ट रिपोर्ट करें',
    requestSupplies: 'आपातकालीन आपूर्ति का अनुरोध करें',
    updateInventory: 'इन्वेंट्री अपडेट करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    save: 'सहेजें',
    occupancy: 'उपस्थिति',
    add: 'जोड़ें',
    remove: 'हटाएं',
    familyInfo: 'पारिवारिक जानकारी',
    members: 'परिवार के सदस्य',
    requirements: 'विशेष आवश्यकताएं',
    allocation: 'आश्रय आवंटन',
    confirmedPass: 'पुष्टि किया गया पास',
    headOfFamily: 'परिवार का मुखिया',
    phoneNumber: 'मोबाइल / संपर्क नंबर',
    totalMembers: 'कुल पारिवारिक सदस्य',
    nextStep: 'अगला कदम',
    previousStep: 'पिछला कदम',
    fastRegistration: 'त्वरित पंजीकरण एवं बिस्तर आवंटन',
    fullName: 'पूरा नाम',
    role: 'प्लेटफ़ॉर्म भूमिका',
    language: 'भाषा',
    saveChanges: 'जानकारी सहेजें',
    shelterName: 'आश्रय सुविधा का नाम',
    shelterAddress: 'पूरा पता / स्थान',
    totalCapacity: 'कुल क्षमता',
    registerShelterBtn: 'आश्रय सुविधा पंजीकृत करें',
    resourceInventory: 'संसाधन सूची'
  },

  gu: {
    // Brand & Top Header
    appName: 'રેસક્યુટેક',
    appSubtitle: 'રાષ્ટ્રીય આપત્તિ સુરક્ષિત વિસ્તારો અને સ્થળાંતર',
    safeZonesTag: 'સુરક્ષિત વિસ્તારો',
    searchPlaceholder: 'આશ્રય, સુરક્ષિત વિસ્તાર, શહેર, જિલ્લો શોધો...',
    nearby15km: 'નજીકમાં (15 કિમી)',
    verifiedSafeZones: 'ચકાસાયેલ સુરક્ષિત વિસ્તારો',
    found: 'મળ્યા',
    bedsLeft: 'પથારી બાકી',
    darkTheme: 'ડાર્ક',
    paperTheme: 'લાઇટ',
    countryAll: 'બધા',
    countryInd: 'ભારત',
    countryNpl: 'નેપાળ',
    languageSelect: 'ભાષા',

    // Sidebar
    coreReliefOps: 'મુખ્ય રાહત કામગીરી',
    eocIncidentCoord: 'EOC અને ઘટના સંકલન',
    tabShelters: 'આશ્રય અને સુરક્ષિત વિસ્તારો',
    tabRegisterShelter: 'નવો આશ્રય નોંધાવો',
    tabResources: 'રાહત સંસાધનો',
    tabProfile: 'સ્થળાંતર પ્રોફાઇલ અને પાસ',
    tabCommand: 'કમાન્ડ સેન્ટર',
    tabIntake: 'પરિવાર નોંધણી વિઝાર્ડ',
    tabVolunteers: 'સ્વયંસેવક નેટવર્ક',
    tabAnalytics: 'આપત્તિ વિશ્લેષણ',
    tabSettings: 'સિસ્ટમ ટેલિમેટ્રી',
    tabAlerts: 'લાઈવ ચેતવણીઓ',
    addNewShelter: 'નવો આશ્રય ઉમેરો',
    privateOrPublic: 'ખાનગી અથવા જાહેર સુવિધા',
    registerBadge: 'નોંધણી',
    criticalAlertBadge: 'ચેતવણી',

    // Metrics Strip
    activeShelters: 'સક્રિય આશ્રય કેન્દ્રો',
    ofVerifiedFacilities: 'ચકાસાયેલ સુવિધાઓમાંથી',
    bedsAvailable: 'ઉપલબ્ધ પથારી',
    totalCapacity: 'કુલ ક્ષમતા',
    emergencyHelpline: 'ઇમરજન્સી હેલ્પલાઇન',
    callNow: 'કૉલ કરો',

    // Shelter Roster View Filters
    filterShelters: 'આશ્રય ફિલ્ટર કરો',
    filterAllTypes: 'તમામ આશ્રય પ્રકારો',
    filterGovtCamp: 'સરકારી રાહત કેમ્પ',
    filterSchool: 'શાળા / કોલેજ',
    filterStadium: 'સ્ટેડિયમ / રમત પરિસર',
    filterCommunityHall: 'સામુદાયિક ભવન',
    filterHospitalSupported: 'હોસ્પિટલ સમર્થિત કેન્દ્ર',
    filterReligiousFacility: 'ધાર્મિક અને સામાજિક કેન્દ્ર',

    filterAllStates: 'બધી ઉપલબ્ધતા સ્થિતિઓ',
    filterAvailable: 'ઉપલબ્ધ (ખાલી પથારી)',
    filterLimited: 'મર્યાદિત ક્ષમતા',
    filterCritical: 'લગભગ સંપૂર્ણ ક્ષમતા',

    filterFeaturesLabel: 'સુવિધાઓ ફિલ્ટર કરો:',
    medicalSupport: 'તબીબી સહાય',
    drinkingWater: 'પીવાનું પાણી',
    hotFood: 'ગરમ ભોજન',
    wheelchairAccessible: 'વ્હીલચેર સુલભ',

    viewBoth: 'બંને (નકશો અને કાર્ડ)',
    viewMap: 'ફક્ત નકશો',
    viewCards: 'કાર્ડ દૃશ્ય',

    // Shelter Cards
    atCapacity: 'સંપૂર્ણ ક્ષમતા',
    kmAway: 'કિમી દૂર',
    occupancyLabel: 'રોકાણ દર',
    vacantBeds: 'ખાલી પથારી',
    callHotline: 'હોટલાઇન પર કૉલ કરો',
    directions: 'દિશાઓ મેળવો',
    bookAdvance: 'અગાઉથી કેન્દ્ર બુક કરો',
    fullState: 'સંપૂર્ણ',
    verifiedShelter: 'ચકાસાયેલ સુરક્ષિત આશ્રય',
    aadhaarVerified: 'આધાર ચકાસાયેલ',
    policeVerified: 'સ્થાનિક પોલીસ ચકાસાયેલ',
    publicFacility: 'જાહેર સુવિધા',
    privateFacility: 'ખાનગી સુવિધા',

    // Guidelines & Accordion
    admissionProtocolsTitle: 'ઇમરજન્સી આશ્રય પ્રવેશ નિયમો અને માર્ગદર્શિકા',
    guidelinesQ1: 'આશ્રય પર પહોંચવા માટે કયા દસ્તાવેજો કે ચકાસણી જરૂરી છે?',
    guidelinesA1: 'જીવન રક્ષા સ્થળાંતર દરમિયાન કોઈપણ રાષ્ટ્રીય ઓળખપત્ર ફરજિયાત નથી. પૂર, વાવાઝોડું કે ધરતીકંપથી પ્રભાવિત દરેક નાગરિક તાત્કાલિક પ્રવેશ મેળવવા હકદાર છે. ડિજિટલ પાસ પથારી ફાળવણી ઝડપી બનાવે છે.',

    // Booking Modal
    bookingModalTitle: 'પથારી આરક્ષણની પુષ્ટિ કરો',
    bookingModalSubtitle: 'તમારા અને તમારા પરિવાર માટે તાત્કાલિક આશ્રય સુરક્ષિત કરો.',
    evacueeCountLabel: 'વ્યક્તિઓની સંખ્યા (પરિવારના સભ્યો)',
    specialNeedsLabel: 'તબીબી અથવા વિશેષ સહાય જરૂરિયાતો (વૈકલ્પિક)',
    specialNeedsPlaceholder: 'દા.ત. વડીલ માટે વ્હીલચેર, બાળ આહાર, ઇન્સ્યુલિન સંગ્રહ...',
    cancelBtn: 'રદ કરો',
    confirmBookingBtn: 'બુકિંગની પુષ્ટિ કરો અને પાસ મેળવો',
    bookingConfirmedTitle: 'આરક્ષણ સફળ થયું!',
    bookingCodeLabel: 'તમારો ઇમરજન્સી ટ્રાન્ઝિટ કોડ',
    bookingInstructions: 'ઝડપી પ્રવેશ માટે પ્રવેશ દ્વાર પર આ વેરિફિકેશન કોડ અથવા ડિજિટલ QR બતાવો.',
    closeBtn: 'પૂર્ણ અને પાછા જાઓ',

    // Bottom Sheet Details
    shelterDetailsTitle: 'સુરક્ષિત વિસ્તાર વિગતો',
    capacityOverview: 'ક્ષમતા અને સંસાધન સ્થિતિ',
    contactCoordinator: 'સંકલન અધિકારીનો સંપર્ક કરો',
    getDirectionsBtn: 'રસ્તો અને દિશાઓ મેળવો',

    // Mobile Nav
    mobileShelters: 'આશ્રય',
    mobileResources: 'સંસાધનો',
    mobileAlerts: 'ચેતવણી',
    mobileProfile: 'પ્રોફાઇલ',

    // Additional Views & Actions
    shelterManager: 'આશ્રય વ્યવસ્થાપક',
    capacityStatus: 'ક્ષમતા સ્થિતિ',
    analytics: 'આપત્તિ વિશ્લેષણ',
    alerts: 'લાઈવ ચેતવણીઓ અને સૂચનાઓ',
    resources: 'રાહત સંસાધન યાદી',
    registerShelter: 'સુરક્ષિત આશ્રય નોંધાવો',
    familyIntake: 'પરિવાર નોંધણી',
    profile: 'સ્થળાંતર પ્રોફાઇલ અને પાસ',
    settings: 'સિસ્ટમ સેટિંગ્સ',
    nearbyShelters: 'નજીકના વૈકલ્પિક આશ્રય',
    viewShelterDetails: 'કેન્દ્રની વિગતો જુઓ',
    sendAlert: 'ઘટના / ચેતવણી રિપોર્ટ કરો',
    requestSupplies: 'ઇમરજન્સી સામાનની વિનંતી કરો',
    updateInventory: 'સ્ટોક અપડેટ કરો',
    cancel: 'રદ કરો',
    confirm: 'પુષ્ટિ કરો',
    save: 'સાચવો',
    occupancy: 'રોકાણ',
    add: 'ઉમેરો',
    remove: 'દૂર કરો',
    familyInfo: 'કુટુંબની માહિતી',
    members: 'કુટુંબના સભ્યો',
    requirements: 'વિશેષ જરૂરિયાતો',
    allocation: 'આશ્રય ફાળવણી',
    confirmedPass: 'પુષ્ટિ થયેલ પાસ',
    headOfFamily: 'કુટુંબના વડા',
    phoneNumber: 'મોબાઇલ / સંપર્ક નંબર',
    totalMembers: 'કુલ કુટુંબના સભ્યો',
    nextStep: 'આગળનું પગલું',
    previousStep: 'પાછલું પગલું',
    fastRegistration: 'ઝડપી નોંધણી અને પથારી ફાળવણી',
    fullName: 'પૂરું નામ',
    role: 'પ્લેટફોર્મ ભૂમિકા',
    language: 'ભાષા',
    saveChanges: 'માહિતી સાચવો',
    shelterName: 'આશ્રય કેન્દ્રનું નામ',
    shelterAddress: 'સંપૂર્ણ સરનામું / સ્થળ',
    totalCapacity: 'કુલ ક્ષમતા',
    registerShelterBtn: 'આશ્રય કેન્દ્ર નોંધાવો',
    resourceInventory: 'સંસાધન યાદી'
  }
};
