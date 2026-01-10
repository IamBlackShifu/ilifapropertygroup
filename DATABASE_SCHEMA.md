# Database Schema Design

## Entity Relationship Overview

```
Users ──┬─── Properties
        ├─── Contractors
        ├─── Documents
        ├─── Projects
        └─── Payments

Properties ──── Verifications
          ──── Reservations

Contractors ──── Verifications
            ──── ProjectAssignments

Projects ──── WorkflowStages
         ──── Inspections
         ──── Payments

Verifications ──── Documents

Payments ──── Transactions
```

## Core Entities

### 1. Users
Primary entity for all platform users.

```sql
Table: users
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
email               VARCHAR(255) UNIQUE NOT NULL
password_hash       VARCHAR(255) NOT NULL
first_name          VARCHAR(100) NOT NULL
last_name           VARCHAR(100) NOT NULL
phone               VARCHAR(20)
role                ENUM('BUYER', 'OWNER', 'CONTRACTOR', 'SUPPLIER', 'AGENT', 'ADMIN')
email_verified      BOOLEAN DEFAULT FALSE
is_active           BOOLEAN DEFAULT TRUE
is_suspended        BOOLEAN DEFAULT FALSE
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP DEFAULT NOW()
last_login          TIMESTAMP
profile_image_url   VARCHAR(500)

INDEXES:
  - email (UNIQUE)
  - role
  - is_active
  - created_at
```

### 2. RefreshTokens
Manages JWT refresh tokens for authentication.

```sql
Table: refresh_tokens
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
token_hash          VARCHAR(255) NOT NULL UNIQUE
expires_at          TIMESTAMP NOT NULL
is_revoked          BOOLEAN DEFAULT FALSE
created_at          TIMESTAMP DEFAULT NOW()
device_info         JSONB

INDEXES:
  - user_id
  - token_hash (UNIQUE)
  - expires_at
```

### 3. Roles & Permissions (Optional - for fine-grained control)

```sql
Table: permissions
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
name                VARCHAR(100) UNIQUE NOT NULL
description         TEXT
resource            VARCHAR(100) NOT NULL
action              VARCHAR(50) NOT NULL

Table: role_permissions
─────────────────────────────────────────────────────────
role                ENUM('BUYER', 'OWNER', 'CONTRACTOR', 'SUPPLIER', 'AGENT', 'ADMIN')
permission_id       UUID REFERENCES permissions(id)
PRIMARY KEY (role, permission_id)
```

### 4. Properties

```sql
Table: properties
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
owner_id            UUID NOT NULL REFERENCES users(id)
title               VARCHAR(200) NOT NULL
description         TEXT
property_type       ENUM('LAND', 'HOUSE', 'APARTMENT', 'COMMERCIAL')
price               DECIMAL(15, 2) NOT NULL
currency            VARCHAR(3) DEFAULT 'USD'
location_city       VARCHAR(100) NOT NULL
location_area       VARCHAR(100)
location_address    TEXT
coordinates_lat     DECIMAL(10, 8)
coordinates_lng     DECIMAL(11, 8)
size_sqm            DECIMAL(10, 2)
bedrooms            INTEGER
bathrooms           INTEGER
status              ENUM('DRAFT', 'PENDING_VERIFICATION', 'VERIFIED', 'RESERVED', 'SOLD') DEFAULT 'DRAFT'
is_verified         BOOLEAN DEFAULT FALSE
verified_at         TIMESTAMP
is_featured         BOOLEAN DEFAULT FALSE
view_count          INTEGER DEFAULT 0
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP DEFAULT NOW()

INDEXES:
  - owner_id
  - status
  - is_verified
  - property_type
  - location_city
  - price
  - created_at
```

### 5. PropertyImages

```sql
Table: property_images
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
property_id         UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
image_url           VARCHAR(500) NOT NULL
is_primary          BOOLEAN DEFAULT FALSE
display_order       INTEGER DEFAULT 0
uploaded_at         TIMESTAMP DEFAULT NOW()

INDEXES:
  - property_id
  - is_primary
```

### 6. Contractors

```sql
Table: contractors
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
company_name        VARCHAR(200) NOT NULL
registration_number VARCHAR(100)
description         TEXT
services_offered    TEXT[] -- Array of services
years_experience    INTEGER
employees_count     INTEGER
location_city       VARCHAR(100)
location_address    TEXT
is_verified         BOOLEAN DEFAULT FALSE
verified_at         TIMESTAMP
rating_average      DECIMAL(3, 2) DEFAULT 0.00
rating_count        INTEGER DEFAULT 0
status              ENUM('PENDING', 'VERIFIED', 'SUSPENDED') DEFAULT 'PENDING'
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP DEFAULT NOW()

INDEXES:
  - user_id (UNIQUE)
  - is_verified
  - status
  - location_city
  - rating_average
```

### 7. ServiceCategories

```sql
Table: service_categories
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
name                VARCHAR(100) UNIQUE NOT NULL
description         TEXT
icon                VARCHAR(50)
is_active           BOOLEAN DEFAULT TRUE

Table: contractor_services
─────────────────────────────────────────────────────────
contractor_id       UUID REFERENCES contractors(id) ON DELETE CASCADE
service_id          UUID REFERENCES service_categories(id)
PRIMARY KEY (contractor_id, service_id)
```

### 8. Documents

```sql
Table: documents
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
uploaded_by         UUID NOT NULL REFERENCES users(id)
related_entity_type ENUM('PROPERTY', 'CONTRACTOR', 'PROJECT', 'USER')
related_entity_id   UUID NOT NULL
document_type       ENUM('OWNERSHIP_DEED', 'COMPANY_REGISTRATION', 'TAX_CLEARANCE', 
                         'INSURANCE', 'LICENSE', 'IDENTITY', 'CONTRACT', 'OTHER')
file_name           VARCHAR(255) NOT NULL
file_path           VARCHAR(500) NOT NULL
file_size           INTEGER NOT NULL
mime_type           VARCHAR(100) NOT NULL
uploaded_at         TIMESTAMP DEFAULT NOW()
expires_at          TIMESTAMP

INDEXES:
  - uploaded_by
  - related_entity_type, related_entity_id
  - document_type
```

### 9. Verifications

```sql
Table: verifications
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
entity_type         ENUM('PROPERTY', 'CONTRACTOR', 'SUPPLIER', 'USER')
entity_id           UUID NOT NULL
submitted_by        UUID NOT NULL REFERENCES users(id)
reviewed_by         UUID REFERENCES users(id)
status              ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED') DEFAULT 'PENDING'
submission_notes    TEXT
review_notes        TEXT
submitted_at        TIMESTAMP DEFAULT NOW()
reviewed_at         TIMESTAMP
expires_at          TIMESTAMP
badge_issued        BOOLEAN DEFAULT FALSE

INDEXES:
  - entity_type, entity_id
  - submitted_by
  - reviewed_by
  - status
  - submitted_at
```

### 10. Projects

```sql
Table: projects
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
client_id           UUID NOT NULL REFERENCES users(id)
property_id         UUID REFERENCES properties(id)
project_name        VARCHAR(200) NOT NULL
project_type        ENUM('NEW_CONSTRUCTION', 'RENOVATION', 'EXTENSION', 'LANDSCAPING')
description         TEXT
budget              DECIMAL(15, 2)
currency            VARCHAR(3) DEFAULT 'USD'
start_date          DATE
expected_end_date   DATE
actual_end_date     DATE
status              ENUM('PLANNING', 'IN_PROGRESS', 'INSPECTION', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNING'
current_stage_id    UUID
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP DEFAULT NOW()

INDEXES:
  - client_id
  - property_id
  - status
  - start_date
```

### 11. WorkflowStages

```sql
Table: workflow_stages
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE
stage_name          VARCHAR(100) NOT NULL
stage_order         INTEGER NOT NULL
description         TEXT
assigned_contractor_id UUID REFERENCES contractors(id)
status              ENUM('PENDING', 'IN_PROGRESS', 'INSPECTION_REQUIRED', 
                         'INSPECTION_PASSED', 'COMPLETED', 'BLOCKED') DEFAULT 'PENDING'
payment_milestone   DECIMAL(15, 2)
payment_status      ENUM('NOT_DUE', 'PENDING', 'PAID') DEFAULT 'NOT_DUE'
started_at          TIMESTAMP
completed_at        TIMESTAMP
notes               TEXT

INDEXES:
  - project_id, stage_order
  - assigned_contractor_id
  - status
```

### 12. Inspections

```sql
Table: inspections
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
project_id          UUID NOT NULL REFERENCES projects(id)
stage_id            UUID REFERENCES workflow_stages(id)
inspector_id        UUID REFERENCES users(id)
inspection_type     ENUM('SITE_SURVEY', 'FOUNDATION', 'STRUCTURAL', 'ELECTRICAL', 
                         'PLUMBING', 'FINAL', 'OTHER')
scheduled_date      TIMESTAMP
completed_date      TIMESTAMP
status              ENUM('SCHEDULED', 'IN_PROGRESS', 'PASSED', 'FAILED', 'CANCELLED')
findings            TEXT
photos              JSONB -- Array of photo URLs
created_at          TIMESTAMP DEFAULT NOW()

INDEXES:
  - project_id
  - stage_id
  - inspector_id
  - status
  - scheduled_date
```

### 13. Payments

```sql
Table: payments
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
payer_id            UUID NOT NULL REFERENCES users(id)
recipient_id        UUID REFERENCES users(id)
related_entity_type ENUM('PROPERTY', 'PROJECT', 'VERIFICATION', 'STAGE')
related_entity_id   UUID NOT NULL
amount              DECIMAL(15, 2) NOT NULL
currency            VARCHAR(3) DEFAULT 'USD'
payment_method      ENUM('STRIPE', 'PAYNOW', 'BANK_TRANSFER')
payment_provider    VARCHAR(50)
provider_payment_id VARCHAR(255)
provider_intent_id  VARCHAR(255)
status              ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING'
description         TEXT
metadata            JSONB
created_at          TIMESTAMP DEFAULT NOW()
completed_at        TIMESTAMP

INDEXES:
  - payer_id
  - recipient_id
  - related_entity_type, related_entity_id
  - provider_payment_id
  - status
  - created_at
```

### 14. Transactions

```sql
Table: transactions
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
payment_id          UUID NOT NULL REFERENCES payments(id)
transaction_type    ENUM('CHARGE', 'REFUND', 'TRANSFER', 'FEE')
amount              DECIMAL(15, 2) NOT NULL
currency            VARCHAR(3) DEFAULT 'USD'
provider_tx_id      VARCHAR(255)
status              ENUM('PENDING', 'SUCCESS', 'FAILED')
error_message       TEXT
created_at          TIMESTAMP DEFAULT NOW()
processed_at        TIMESTAMP

INDEXES:
  - payment_id
  - provider_tx_id
  - status
```

### 15. Notifications

```sql
Table: notifications
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
type                ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR')
category            ENUM('VERIFICATION', 'PAYMENT', 'PROJECT', 'PROPERTY', 'SYSTEM')
title               VARCHAR(200) NOT NULL
message             TEXT NOT NULL
link_url            VARCHAR(500)
is_read             BOOLEAN DEFAULT FALSE
read_at             TIMESTAMP
created_at          TIMESTAMP DEFAULT NOW()

INDEXES:
  - user_id, is_read
  - created_at
  - category
```

### 16. AuditLogs

```sql
Table: audit_logs
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES users(id)
action              VARCHAR(100) NOT NULL
entity_type         VARCHAR(50)
entity_id           UUID
old_values          JSONB
new_values          JSONB
ip_address          VARCHAR(45)
user_agent          TEXT
created_at          TIMESTAMP DEFAULT NOW()

INDEXES:
  - user_id
  - entity_type, entity_id
  - action
  - created_at
```

### 17. Reservations

```sql
Table: reservations
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
property_id         UUID NOT NULL REFERENCES properties(id)
buyer_id            UUID NOT NULL REFERENCES users(id)
reservation_date    TIMESTAMP DEFAULT NOW()
expiry_date         TIMESTAMP NOT NULL
deposit_amount      DECIMAL(15, 2)
deposit_paid        BOOLEAN DEFAULT FALSE
status              ENUM('ACTIVE', 'EXPIRED', 'CONVERTED', 'CANCELLED') DEFAULT 'ACTIVE'
notes               TEXT

INDEXES:
  - property_id
  - buyer_id
  - status
  - expiry_date
```

### 18. Reviews

```sql
Table: reviews
─────────────────────────────────────────────────────────
id                  UUID PRIMARY KEY
reviewer_id         UUID NOT NULL REFERENCES users(id)
reviewed_entity_type ENUM('CONTRACTOR', 'PROPERTY')
reviewed_entity_id  UUID NOT NULL
rating              INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)
comment             TEXT
is_verified_purchase BOOLEAN DEFAULT FALSE
is_visible          BOOLEAN DEFAULT TRUE
created_at          TIMESTAMP DEFAULT NOW()
updated_at          TIMESTAMP DEFAULT NOW()

INDEXES:
  - reviewed_entity_type, reviewed_entity_id
  - reviewer_id
  - rating
  - created_at
```

## Database Relationships

### One-to-Many
- Users → Properties (one user owns many properties)
- Users → Projects (one client creates many projects)
- Users → Documents (one user uploads many documents)
- Properties → PropertyImages
- Projects → WorkflowStages
- Projects → Inspections
- Payments → Transactions

### One-to-One
- Users → Contractors (one contractor profile per user)
- Projects → current_stage_id (self-reference)

### Many-to-Many
- Contractors ↔ ServiceCategories (via contractor_services)
- Projects ↔ Contractors (via WorkflowStages assignments)

## Common Query Patterns

### 1. Get all verified properties in a city
```sql
SELECT * FROM properties 
WHERE is_verified = TRUE 
  AND location_city = 'Harare'
  AND status = 'VERIFIED'
ORDER BY created_at DESC;
```

### 2. Get contractor with verification status
```sql
SELECT c.*, v.status as verification_status
FROM contractors c
LEFT JOIN verifications v ON v.entity_type = 'CONTRACTOR' AND v.entity_id = c.id
WHERE c.user_id = ?;
```

### 3. Get project stages with payment status
```sql
SELECT ws.*, c.company_name, ws.payment_status
FROM workflow_stages ws
LEFT JOIN contractors c ON ws.assigned_contractor_id = c.id
WHERE ws.project_id = ?
ORDER BY ws.stage_order;
```

### 4. Get user notifications (unread count)
```sql
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = ? AND is_read = FALSE;
```

## Indexes Strategy

### Primary Indexes
- All primary keys (UUID)
- Unique constraints (email, registration_number)

### Foreign Key Indexes
- All foreign key columns for join performance

### Search Indexes
- location_city, property_type for property search
- status fields for filtering
- created_at for chronological queries

### Composite Indexes
- (entity_type, entity_id) for polymorphic relations
- (user_id, is_read) for notification queries
- (project_id, stage_order) for workflow queries

## Data Integrity Rules

### Cascade Rules
- User deletion → Cascade to refresh_tokens, notifications
- Property deletion → Cascade to property_images
- Project deletion → Cascade to workflow_stages, inspections
- Payment → No cascade (keep records for audit)

### Constraints
- Email uniqueness
- Rating values (1-5)
- Payment amounts (positive values)
- Stage order uniqueness per project
- One primary image per property

## Performance Considerations

### Partitioning (Future)
- audit_logs by created_at (monthly partitions)
- notifications by created_at (quarterly partitions)

### Archiving Strategy
- Archive completed projects after 2 years
- Archive old audit logs after 1 year
- Keep all payment records permanently

### Connection Pooling
- Min connections: 10
- Max connections: 50
- Connection timeout: 30s
