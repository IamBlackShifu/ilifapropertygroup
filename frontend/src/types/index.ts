// User roles enum
export enum UserRole {
  BUYER = 'BUYER',
  OWNER = 'OWNER',
  CONTRACTOR = 'CONTRACTOR',
  SUPPLIER = 'SUPPLIER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

// Property types
export enum PropertyType {
  LAND = 'LAND',
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  COMMERCIAL = 'COMMERCIAL',
}

export enum PropertyStatus {
  DRAFT = 'DRAFT',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
}

// Verification status
export enum VerificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Project status
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  INSPECTION = 'INSPECTION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Stage status
export enum StageStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  INSPECTION_REQUIRED = 'INSPECTION_REQUIRED',
  INSPECTION_PASSED = 'INSPECTION_PASSED',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
}

// Payment status
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// User interface
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  emailVerified: boolean
  isActive: boolean
  profileImageUrl?: string
  createdAt: string
  updatedAt: string
}

// Property interface
export interface Property {
  id: string
  ownerId: string
  title: string
  description: string
  propertyType: PropertyType
  price: number
  currency: string
  locationCity: string
  locationArea?: string
  locationAddress?: string
  coordinatesLat?: number
  coordinatesLng?: number
  sizeSqm?: number
  bedrooms?: number
  bathrooms?: number
  status: PropertyStatus
  isVerified: boolean
  verifiedAt?: string
  isFeatured: boolean
  viewCount: number
  images: PropertyImage[]
  owner?: User
  createdAt: string
  updatedAt: string
}

export interface PropertyImage {
  id: string
  propertyId: string
  imageUrl: string
  isPrimary: boolean
  displayOrder: number
}

// Contractor interface
export interface Contractor {
  id: string
  userId: string
  companyName: string
  registrationNumber?: string
  description: string
  servicesOffered: string[]
  yearsExperience?: number
  employeesCount?: number
  locationCity?: string
  locationAddress?: string
  isVerified: boolean
  verifiedAt?: string
  ratingAverage: number
  ratingCount: number
  status: 'PENDING' | 'VERIFIED' | 'SUSPENDED'
  user?: User
  createdAt: string
  updatedAt: string
}

// Verification interface
export interface Verification {
  id: string
  entityType: 'PROPERTY' | 'CONTRACTOR' | 'SUPPLIER' | 'USER'
  entityId: string
  submittedBy: string
  reviewedBy?: string
  status: VerificationStatus
  submissionNotes?: string
  reviewNotes?: string
  submittedAt: string
  reviewedAt?: string
  expiresAt?: string
  badgeIssued: boolean
  documents?: Document[]
}

// Document interface
export interface Document {
  id: string
  uploadedBy: string
  relatedEntityType: 'PROPERTY' | 'CONTRACTOR' | 'PROJECT' | 'USER'
  relatedEntityId: string
  documentType: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  expiresAt?: string
}

// Project interface
export interface Project {
  id: string
  clientId: string
  propertyId?: string
  projectName: string
  projectType: 'NEW_CONSTRUCTION' | 'RENOVATION' | 'EXTENSION' | 'LANDSCAPING'
  description: string
  budget?: number
  currency: string
  startDate?: string
  expectedEndDate?: string
  actualEndDate?: string
  status: ProjectStatus
  currentStageId?: string
  client?: User
  property?: Property
  stages?: WorkflowStage[]
  createdAt: string
  updatedAt: string
}

// Workflow stage interface
export interface WorkflowStage {
  id: string
  projectId: string
  stageName: string
  stageOrder: number
  description?: string
  assignedContractorId?: string
  status: StageStatus
  paymentMilestone?: number
  paymentStatus: 'NOT_DUE' | 'PENDING' | 'PAID'
  startedAt?: string
  completedAt?: string
  notes?: string
  contractor?: Contractor
}

// Payment interface
export interface Payment {
  id: string
  payerId: string
  recipientId?: string
  relatedEntityType: 'PROPERTY' | 'PROJECT' | 'VERIFICATION' | 'STAGE'
  relatedEntityId: string
  amount: number
  currency: string
  paymentMethod: 'STRIPE' | 'PAYNOW' | 'BANK_TRANSFER'
  paymentProvider?: string
  providerPaymentId?: string
  status: PaymentStatus
  description?: string
  metadata?: Record<string, any>
  createdAt: string
  completedAt?: string
}

// Notification interface
export interface Notification {
  id: string
  userId: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  category: 'VERIFICATION' | 'PAYMENT' | 'PROJECT' | 'PROPERTY' | 'SYSTEM'
  title: string
  message: string
  linkUrl?: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface PropertyFormData {
  title: string
  description: string
  propertyType: PropertyType
  price: number
  currency: string
  locationCity: string
  locationArea?: string
  locationAddress?: string
  coordinatesLat?: number
  coordinatesLng?: number
  sizeSqm?: number
  bedrooms?: number
  bathrooms?: number
}

export interface ContractorProfileFormData {
  companyName: string
  registrationNumber?: string
  description: string
  servicesOffered: string[]
  yearsExperience?: number
  employeesCount?: number
  locationCity?: string
  locationAddress?: string
}
