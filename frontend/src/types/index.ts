import { GridRowId } from "@mui/x-data-grid";
import { Role } from "../enums/Role";
import { Status } from "../enums/Status";
import { instanceOf } from "../utils/TypeChecker";
import { DrugCategory } from "../enums/DrugCategory";
import { DrugForm } from "../enums/DrugForm";
import { SearchBy } from "../enums/SearchBy";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const isAuthResponse = (object: any): object is  AuthResponse => {
    return (typeof object === 'object' && object !== null && 'accessToken' in object && 'refreshToken' in object);
};

export interface Clinic {
    id: number;
    caption: string;
    description: string;
    doctors?: User[];
    patients?: Patient[];
    doctorUid?: string;
    dayOfWeek: string;
    time: string;
    status?: Status;
    updatedAt?: string;
};

export interface ClinicDetailsState {
    id: number;
    caption: string;
    description: string;
    doctors: Set<User>;
    patients: Set<Patient>;
    dayOfWeek: string;
    time: string;
    status: Status;
    updatedAt: string;
    loading: boolean;
};

export interface CreateClinicState {
    caption: string;
    description: string;
    dayOfWeek: string;
    time: string;
    loading: boolean;
};

export interface CreateEventState {
    title: string;
    description: string;
    visibility: string;
    date: string;
    time: string;
    loading: boolean;
};

export interface DashboardReport {
    adminCount: number;
    doctorCount: number;
    receptionistCount: number;
    pharmacistCount: number;
    patientCount: number;
    todayAppointmentCount: number;
    todayInvoiceCount: number;
    lowStockMedicineCount: number;
    todayIncomeCount: number;
};

export interface DashboardState {
    doctorCount: number,
    patientCount: number,
    pharmacistCount: number,
    receptionistCount: number,
    todayAppointmentCount: number,
    todayInvoiceCount: number,
    lowStockMedicineCount: number,
    todayIncomeCount: number,
    loading: boolean
};

export interface ErrorResponse {
    statusCode: number;
    message: string;
};

export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    owner: User;
    visibility?: string;
    createdAt: string;
    updatedAt: string;
};

export interface HardPasswordResetRequest {
    newPassword: string;
};

export interface LoginFormData {
    email: string | null;
    password: string | null;
};

export const isLoginFormData = (object: any): object is LoginFormData => {
    return instanceOf<LoginFormData>(object, ["email", "password"]);
}

export interface PageResponse <T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        },
        offset: number;
        unpaged: boolean;
        paged: boolean;
    },
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    },
    first: boolean;
    numberOfElements: number;
    empty: boolean;
};

export interface RegisterFormData {
    name: string | null;
    birthday: string | null;
    address: string | null;
    email: string | null;
    password: string | null;
    telephone: string | null;
    specialization: string | null;
    percentage: number | null;
    role: Role | null;
};

export const isRegisterFormData = (object: any): object is RegisterFormData => {
    return instanceOf<RegisterFormData>(object, []);
}

export interface RoleItem {
    value: number;
    label: string;
};

export interface ServerException {
    statusCode: number;
    message: string;
};

export interface SoftPasswordResetRequest {
    currentPassword: string;
    newPassword: string;
};

export interface SpecializationOption {
    id: number;
    label: string;
};

export type Timestamp = moment.Moment;

export interface User {
    id: number;
    name: string;
    password: string;
    referenceId: string;
    imagePath: string;
    birthday: string;
    email: string;
    address: string;
    telephone: string;
    percentage: number;
    specialization: string;
    status: number;
    role: number;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    authorities: any[];
    credentialsNonExpired: boolean;
    enabled: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export interface UsersListState {
    role: Role;
    selectedIds: Set<GridRowId>;
    list: User[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    searchKey: string;
    searchBy: SearchBy;
    loading: boolean;
};

export interface Patient {
    id: number;
    name: string;
    referenceId: string;
    birthday: string;
    age: number;
    email: string;
    address: string;
    telephone: string;
    allergiesNote: string;
    prescriptions: any[];
    createdAt: Date;
    updatedAt: Date;
};

export interface AssignPatientsDto {
    clinicId: number;
    patientIds: GridRowId[];
};

export interface PrescriptionDto {
    id: number;
    prescriptionLines: PrescriptionLineDto[];
    patientId: number;
    patientName: string;
    patientReferenceId: string;
    doctorId: number;
    doctorName: string;
    doctorReferenceId: string;
};

export interface PrescriptionCreateRequest {
    patientId: number;
    doctorId: number;
    prescriptionLines: PrescriptionLineDto[]
};

export interface PrescriptionLineDto {
    description: string;
};

export interface AppointmentDto {
    id: number;
    patientId: number;
    patientName: string;
    clinicId: number;
    clinicName: string;
    doctorId: number;
    doctorName: string;
    queuePosition: number;
    referenceId: string;
    createdAt: string;
    uupdatedAt: string;
};

export interface AppointmentCreateRequest {
    patientId: number;
    clinicId: number;
    doctorId: number;
    queuePosition: number;
};

export interface ItemDto {
    id: number;
    itemCode: string;
    stockId: number;
    caption: string;
    description: string;
    initialQty: number;
    currentQty: number;
    category: DrugCategory;
    form: DrugForm;
    strength: number;
    unitPurchasePrice: number;
    unitSellingPrice: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export interface ItemCreateRequest {
    stockId: number;
    caption: string;
    description: string;
    category: DrugCategory;
    form: DrugForm;
    strength: number;
    initialQty: number;
    currentQty: number;
    unitPurchasePrice: number;
    unitSellingPrice: number;
};

export interface StockDto {
    id: number;
    caption: string;
    vendor: string;
    date: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface StockCreateRequest {
    caption: string;
    vendor: string;
    date: string;
};

export interface InvoiceRecord {
    id?: number;
    itemId: number;
    itemCode: string;
    description: string;
    unitPrice: number;
    quantity?: number;
    total?: number;
};

export interface DrugCategoryOption {
    id: string;
    label: string;
};

export type DrugFormOption = DrugCategoryOption;

export interface InvoiceDto {  
    id: number;
    number: number;
    date: string;
    subtotal: number;
    balance: number;
    pharmacistId: number;
    pharmacistName: string;
    patientId: number;
    patientName: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export interface Invoice {
    id: number;
    number: number;
    date: number;
    subTotal: number;
    pharmacistName: string;
    patientName: string;
    records: InvoiceRecord[];
    paidAmount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export interface InvRecord {
    id: number;
    itemCaption: string;
    itemSellingPrice: number;
    quantity: number;
    total: number;
};

export interface InvoiceRecordDto {
    id: number;
    invoiceId: number;
    invoiceNumber: number;
    itemId: number;
    itemCaption: string;
    itemSellingPrice: number;
    quantity: number;
    total: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export interface CreateInvoiceRequest {
    number: number;
    date: string;
    subtotal: number;
    discount: number;
    paidAmount: number;
    balance: number;
    pharmacistId: number;
    patientId: number;
    records: CreateInvoiceRecordRequest[];
};

export interface CreateInvoiceRecordRequest {
    invoiceId: number;
    invoiceNumber: number;
    itemId: number;
    quantity: number;
    total: number;
};

export interface UserDistributionByRoleType {
    count: number;
    role: string;
};

export interface AccountCreationTrendType {
    creationDate: string;
    accountsCreated: number;
};

export type UserAccountCreationTrendType = AccountCreationTrendType;

export type PatientRegistrationTrendType = AccountCreationTrendType;

export interface PatientAgeDistributionTrendType {
    ageGroup: string;
    totalPatients: number;
};

export interface UserAccountsSummaryType {
    total: number;
    adminCount: number;
    doctorCount: number;
    receptionistCount: number;
    pharmacistCount: number;
};

export interface PatientRegistrationSummaryType {
    totalPatients: number;
    newPatientsInPeriod: number;
    age50Plus: number;
    age25To49: number;
    age18To24: number;
    age10To17: number;
    ageBelow10: number;
};

export interface PrescriptionIssueDistributionType {
    doctorId: number;
    doctorRefId: string;
    doctorName: string;
    prescriptionCount: number;
    percentageOfTotal: number;
};

export interface PrescriptionIssueTrendType {
    prescriptionDate: string;
    totalPrescriptions: number;
}

export interface PrescriptionSummaryType {
    totalPrescriptions: number;
    prescriptionsInPeriod: number;
    avgItemsPerPrescription: number;
}

export interface ClinicAppointmentDistributionType {
    clinicId: number;
    clinicName: string;
    appointmentCount: number;
    appointmentPercentage: number;
}

export interface ClinicPatientRegTrendType {
    clinicId: number;
    clinicName: string;
    patientCount: number;
}

export interface ClinicSummaryType {
    totalClinics: number;
    clinicWithHighestAvgPatients: number;
    highestAvgPatientsPercentage: number;
    clinicWithHighestAvgAppointments: number;
    highestAvgAppointmentsPercentage: number;
    busiestDayOfWeek: string;
};

export interface AppointmentTrendType {
    appointmentDate: string;
    appointmentCount: number;
};

export interface AppointmentSummaryType {
    totalAppointments: number;
    averageAppointmentsPerDay: number;
    dateWithHighestAppointments: string;
    topPatientName: string;
    totalAppointmentsForTopPatient: number;
};

export interface VendorWiseStockDistributionType {
    vendorName: string;
    totalStockItems: number;
    stockPercentage: number;
};

export interface StockArrivalTrendType {
    stockDate: string;
    newStockCount: number;
}

export interface StockSummaryType {
    topVendorName: string;
    topVendorStockCount: number;
    fastestMovingItemName: string;
    fastestMovingItemQty: number;
    slowestMovingItemName: string;
    slowestMovingItemQty: number;
    lowStockItemCount: number;
};

export interface SalesTrendType {
    saleDate: string;
    totalSales: number;
};

export interface TopSaleType {
    itemName: string;
    qtySold: number;
    percentage: number;
}

export interface SaleSummaryType {
    totalRevenue: number;
    totalItemsSold: number;
    totalInvoicesIssued: number;
    patientWithHighestRevenue: string;
    highestRevenue: number;
    patientWithLowestRevenue: string;
    lowestRevenue: number;
    avgRevenuePerPatient: number;
};  