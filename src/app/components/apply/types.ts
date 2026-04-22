export interface Owner {
  fullName: string;
  title: string;
  ssn: string;
  dlState: string;
  dlNumber: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  dob: string;
  citizenshipForm: "A" | "B" | "";
  // Form A
  formADocType: string;
  formASignature: string;
  formADate: string;
  // Form B
  aNumber: string;
  formBDocType: string;
  formBSignature: string;
  formBDate: string;
}

export interface RelatedBusiness {
  ownerName: string;
  businessName: string;
  businessAddress: string;
}

export interface RentalAddress {
  address: string;
}

export interface WizardFormData {
  // Step 1 — Application Setup
  applicationType: string;
  applicationTypeOther: string;
  businessOperatedFrom: string;
  businessTypes: string[];
  businessTypeOther: string;
  detailedExplanation: string;
  // Restaurant/Bar conditionals
  serveFood: string;
  alcoholSales: string;
  abcStarted: string;
  vendingGaming: string;
  gamingCount: string;
  vendingCount: string;
  // Convenience/Grocery conditionals
  cgsServeFood: string;
  sellGasoline: string;
  pumpOwner: string;
  distributorName: string;
  retailVending: string;
  cgsVendingCount: string;
  cgsAlcohol: string;
  cgsAbcStarted: string;
  // Hotel/Motel conditionals
  roomCount: string;
  hotelServeFood: string;
  hotelAlcohol: string;
  hotelAbcStarted: string;
  hasManagementCompany: string;
  managementCompanyName: string;
  managementCompanyContact: string;

  // Step 2 — Business Information
  applicationDate: string;
  startDate: string;
  businessLegalName: string;
  tradeName: string;
  businessStructure: string;
  businessStructureOther: string;
  fein: string;
  alTaxId: string;
  physicalLocation: string;
  physStreet: string;
  physSuite: string;
  physCity: string;
  physState: string;
  physZip: string;
  sameAsPhysical: boolean;
  mailStreet: string;
  mailCity: string;
  mailState: string;
  mailZip: string;
  companyPhone: string;
  businessPhone: string;
  numEmployees: string;
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  contactEmail: string;

  // Step 3 — Owner & Officer Info
  owners: Owner[];
  hasRelatedBusiness: string;
  relatedBusinesses: RelatedBusiness[];

  // Step 4 — Property & Tax
  propertyOwnership: string;
  propOwnerName: string;
  propOwnerStreet: string;
  propOwnerCity: string;
  propOwnerState: string;
  propOwnerZip: string;
  propOwnerPhone: string;
  propOwnerEmail: string;
  hasPropManagement: string;
  propManagementName: string;
  propManagementContact: string;
  rentalAddresses: RentalAddress[];
  taxTypes: string[];
  taxFrequency: string;

  // Step 5 — Documents
  documentsAcknowledged: boolean;

  // Step 6 — Review & Submit
  printedName: string;
  printedTitle: string;
  signature: string;
  certDate: string;
  understand60Day: boolean;
  understandExpiry: boolean;
}

export function defaultFormData(): WizardFormData {
  const today = new Date().toISOString().split("T")[0];
  return {
    applicationType: "",
    applicationTypeOther: "",
    businessOperatedFrom: "",
    businessTypes: [],
    businessTypeOther: "",
    detailedExplanation: "",
    serveFood: "",
    alcoholSales: "",
    abcStarted: "",
    vendingGaming: "",
    gamingCount: "",
    vendingCount: "",
    cgsServeFood: "",
    sellGasoline: "",
    pumpOwner: "",
    distributorName: "",
    retailVending: "",
    cgsVendingCount: "",
    cgsAlcohol: "",
    cgsAbcStarted: "",
    roomCount: "",
    hotelServeFood: "",
    hotelAlcohol: "",
    hotelAbcStarted: "",
    hasManagementCompany: "",
    managementCompanyName: "",
    managementCompanyContact: "",
    applicationDate: today,
    startDate: "",
    businessLegalName: "",
    tradeName: "",
    businessStructure: "",
    businessStructureOther: "",
    fein: "",
    alTaxId: "",
    physicalLocation: "",
    physStreet: "",
    physSuite: "",
    physCity: "",
    physState: "AL",
    physZip: "",
    sameAsPhysical: true,
    mailStreet: "",
    mailCity: "",
    mailState: "AL",
    mailZip: "",
    companyPhone: "",
    businessPhone: "",
    numEmployees: "",
    contactName: "",
    contactTitle: "",
    contactPhone: "",
    contactEmail: "",
    owners: [defaultOwner()],
    hasRelatedBusiness: "",
    relatedBusinesses: [],
    propertyOwnership: "",
    propOwnerName: "",
    propOwnerStreet: "",
    propOwnerCity: "",
    propOwnerState: "",
    propOwnerZip: "",
    propOwnerPhone: "",
    propOwnerEmail: "",
    hasPropManagement: "",
    propManagementName: "",
    propManagementContact: "",
    rentalAddresses: [],
    taxTypes: [],
    taxFrequency: "",
    documentsAcknowledged: false,
    printedName: "",
    printedTitle: "",
    signature: "",
    certDate: today,
    understand60Day: false,
    understandExpiry: false,
  };
}

export function defaultOwner(): Owner {
  return {
    fullName: "",
    title: "",
    ssn: "",
    dlState: "",
    dlNumber: "",
    phone: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    citizenshipForm: "",
    formADocType: "",
    formASignature: "",
    formADate: "",
    aNumber: "",
    formBDocType: "",
    formBSignature: "",
    formBDate: "",
  };
}

export interface StepProps {
  data: WizardFormData;
  onChange: (field: keyof WizardFormData, value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveExit: () => void;
  goToStep?: (step: number) => void;
}
