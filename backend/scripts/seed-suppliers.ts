import { PrismaClient, UserRole, ProductCategory, SupplierStatus, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedSuppliers() {
  console.log('🌱 Seeding suppliers...');

  const suppliersData = [
    {
      email: 'contact@premiumbuilding.co.zw',
      password: 'supplier123',
      companyName: 'Premium Building Supplies',
      description: 'Leading supplier of cement, bricks, and roofing materials across Zimbabwe. Over 15 years of experience.',
      categories: [ProductCategory.CEMENT, ProductCategory.BRICKS, ProductCategory.ROOFING],
      yearsInBusiness: 15,
      locationCity: 'Harare',
      locationAddress: 'Industrial Site, Harare',
      websiteUrl: 'https://premiumbuilding.co.zw',
      isVerified: true,
      deliveryAvailable: true,
      deliveryRadius: 50,
      products: [
        {
          name: 'PPC Cement 50kg',
          description: 'Premium Portland cement suitable for all construction needs',
          category: ProductCategory.CEMENT,
          unit: 'bag',
          price: 18.50,
          stockQuantity: 500,
          minOrderQty: 10,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
          isFeatured: true,
        },
        {
          name: 'Clay Bricks (Standard)',
          description: 'High-quality clay bricks, 222x106x73mm',
          category: ProductCategory.BRICKS,
          unit: 'piece',
          price: 0.35,
          stockQuantity: 10000,
          minOrderQty: 100,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
          isFeatured: true,
        },
        {
          name: 'Zinc Roofing Sheets',
          description: 'IBR profile zinc sheets, 3m length',
          category: ProductCategory.ROOFING,
          unit: 'sheet',
          price: 12.00,
          stockQuantity: 200,
          minOrderQty: 5,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
      ],
    },
    {
      email: 'info@steelmasters.co.zw',
      password: 'supplier123',
      companyName: 'Steel Masters Zimbabwe',
      description: 'Your trusted partner for steel reinforcement, structural steel, and metal roofing.',
      categories: [ProductCategory.STEEL, ProductCategory.ROOFING],
      yearsInBusiness: 12,
      locationCity: 'Bulawayo',
      locationAddress: 'Heavy Industrial Area, Bulawayo',
      websiteUrl: 'https://steelmasters.co.zw',
      isVerified: true,
      deliveryAvailable: true,
      deliveryRadius: 100,
      products: [
        {
          name: 'Steel Reinforcement Bars Y12',
          description: 'High tensile steel reinforcement bars, 12mm diameter',
          category: ProductCategory.STEEL,
          unit: 'meter',
          price: 2.50,
          stockQuantity: 1000,
          minOrderQty: 20,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
          isFeatured: true,
        },
        {
          name: 'Angle Iron 50x50x6mm',
          description: 'Structural angle iron for construction',
          category: ProductCategory.STEEL,
          unit: 'meter',
          price: 8.50,
          stockQuantity: 300,
          minOrderQty: 10,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
      ],
    },
    {
      email: 'sales@timbercrafts.co.zw',
      password: 'supplier123',
      companyName: 'Timber Crafts & Carpentry',
      description: 'Quality timber, doors, windows, and custom carpentry services.',
      categories: [ProductCategory.TIMBER, ProductCategory.DOORS_WINDOWS],
      yearsInBusiness: 8,
      locationCity: 'Mutare',
      locationAddress: 'Sakubva Industrial, Mutare',
      websiteUrl: null,
      isVerified: true,
      deliveryAvailable: true,
      deliveryRadius: 30,
      products: [
        {
          name: 'Pine Timber 50x100mm',
          description: 'Treated pine timber for roofing and construction',
          category: ProductCategory.TIMBER,
          unit: 'meter',
          price: 5.50,
          stockQuantity: 500,
          minOrderQty: 10,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
        {
          name: 'Solid Wood Door (Standard)',
          description: '813x2032mm solid wood interior door',
          category: ProductCategory.DOORS_WINDOWS,
          unit: 'piece',
          price: 85.00,
          stockQuantity: 25,
          minOrderQty: 1,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
          isFeatured: true,
        },
      ],
    },
    {
      email: 'orders@plumbingsolutions.co.zw',
      password: 'supplier123',
      companyName: 'Plumbing Solutions Zimbabwe',
      description: 'Complete range of plumbing materials, pipes, fittings, and fixtures.',
      categories: [ProductCategory.PLUMBING, ProductCategory.HARDWARE],
      yearsInBusiness: 10,
      locationCity: 'Harare',
      locationAddress: 'Graniteside, Harare',
      websiteUrl: 'https://plumbingsolutions.co.zw',
      isVerified: true,
      deliveryAvailable: true,
      deliveryRadius: 40,
      products: [
        {
          name: 'PVC Pipes 110mm (4m)',
          description: 'Heavy duty PVC sewer pipes',
          category: ProductCategory.PLUMBING,
          unit: 'piece',
          price: 15.00,
          stockQuantity: 150,
          minOrderQty: 5,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
        {
          name: 'Basin Mixer Tap',
          description: 'Chrome plated basin mixer with flexible tails',
          category: ProductCategory.PLUMBING,
          unit: 'piece',
          price: 35.00,
          stockQuantity: 50,
          minOrderQty: 1,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
      ],
    },
    {
      email: 'contact@electricalsupply.co.zw',
      password: 'supplier123',
      companyName: 'Electrical Supply Hub',
      description: 'Electrical cables, switches, circuit breakers, and lighting solutions.',
      categories: [ProductCategory.ELECTRICAL, ProductCategory.HARDWARE],
      yearsInBusiness: 7,
      locationCity: 'Harare',
      locationAddress: 'Southerton, Harare',
      websiteUrl: null,
      isVerified: true,
      deliveryAvailable: false,
      deliveryRadius: null,
      products: [
        {
          name: 'Electrical Cable 2.5mm²',
          description: 'Twin and earth electrical cable per meter',
          category: ProductCategory.ELECTRICAL,
          unit: 'meter',
          price: 1.20,
          stockQuantity: 2000,
          minOrderQty: 10,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
        {
          name: 'Circuit Breaker 20A',
          description: 'Single pole MCB circuit breaker',
          category: ProductCategory.ELECTRICAL,
          unit: 'piece',
          price: 8.50,
          stockQuantity: 100,
          minOrderQty: 1,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
          isFeatured: true,
        },
      ],
    },
    {
      email: 'sales@paintperfection.co.zw',
      password: 'supplier123',
      companyName: 'Paint Perfection',
      description: 'Interior and exterior paints, primers, and decorative finishes.',
      categories: [ProductCategory.PAINT],
      yearsInBusiness: 6,
      locationCity: 'Bulawayo',
      locationAddress: 'Kelvin Industrial, Bulawayo',
      websiteUrl: null,
      isVerified: false,
      deliveryAvailable: true,
      deliveryRadius: 25,
      products: [
        {
          name: 'Exterior Paint 20L (White)',
          description: 'Weather resistant exterior wall paint',
          category: ProductCategory.PAINT,
          unit: 'bucket',
          price: 45.00,
          stockQuantity: 80,
          minOrderQty: 2,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
        {
          name: 'Interior Emulsion 5L',
          description: 'Washable interior wall paint, various colors',
          category: ProductCategory.PAINT,
          unit: 'bucket',
          price: 15.00,
          stockQuantity: 120,
          minOrderQty: 1,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
      ],
    },
    {
      email: 'info@tileworld.co.zw',
      password: 'supplier123',
      companyName: 'Tile World Zimbabwe',
      description: 'Premium tiles for floors, walls, and outdoor applications.',
      categories: [ProductCategory.TILES],
      yearsInBusiness: 9,
      locationCity: 'Harare',
      locationAddress: 'Msasa, Harare',
      websiteUrl: 'https://tileworld.co.zw',
      isVerified: true,
      deliveryAvailable: true,
      deliveryRadius: 35,
      products: [
        {
          name: 'Ceramic Floor Tiles 600x600mm',
          description: 'Glazed porcelain floor tiles, sold per box (4 tiles)',
          category: ProductCategory.TILES,
          unit: 'box',
          price: 28.00,
          stockQuantity: 200,
          minOrderQty: 5,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
          isFeatured: true,
        },
        {
          name: 'Wall Tiles 300x600mm',
          description: 'Glossy wall tiles, sold per box (6 tiles)',
          category: ProductCategory.TILES,
          unit: 'box',
          price: 22.00,
          stockQuantity: 150,
          minOrderQty: 3,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
      ],
    },
    {
      email: 'contact@hardwarehaven.co.zw',
      password: 'supplier123',
      companyName: 'Hardware Haven',
      description: 'General hardware, tools, and construction accessories.',
      categories: [ProductCategory.HARDWARE, ProductCategory.TOOLS],
      yearsInBusiness: 11,
      locationCity: 'Gweru',
      locationAddress: 'Mkoba Industrial, Gweru',
      websiteUrl: null,
      isVerified: true,
      deliveryAvailable: true,
      deliveryRadius: 50,
      products: [
        {
          name: 'Wheelbarrow Heavy Duty',
          description: 'Steel construction wheelbarrow with pneumatic tire',
          category: ProductCategory.TOOLS,
          unit: 'piece',
          price: 55.00,
          stockQuantity: 30,
          minOrderQty: 1,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
        {
          name: 'Spade (Garden)',
          description: 'Long handle garden spade with steel blade',
          category: ProductCategory.TOOLS,
          unit: 'piece',
          price: 18.00,
          stockQuantity: 60,
          minOrderQty: 1,
          imageUrls: [],
          status: ProductStatus.AVAILABLE,
        },
      ],
    },
  ];

  for (const supplierData of suppliersData) {
    try {
      // Check if supplier already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: supplierData.email },
      });

      if (existingUser) {
        console.log(`⏭️  Skipping ${supplierData.companyName} - already exists`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(supplierData.password, 10);

      // Create user and supplier profile
      const user = await prisma.user.create({
        data: {
          email: supplierData.email,
          passwordHash: hashedPassword,
          firstName: supplierData.companyName.split(' ')[0],
          lastName: supplierData.companyName.split(' ').slice(1).join(' ') || 'Ltd',
          phone: '+263771234567',
          role: UserRole.SUPPLIER,
          isActive: true,
          emailVerified: true,
          supplier: {
            create: {
              companyName: supplierData.companyName,
              description: supplierData.description,
              categories: supplierData.categories,
              yearsInBusiness: supplierData.yearsInBusiness,
              locationCity: supplierData.locationCity,
              locationAddress: supplierData.locationAddress,
              websiteUrl: supplierData.websiteUrl,
              isVerified: supplierData.isVerified,
              verifiedAt: supplierData.isVerified ? new Date() : null,
              status: supplierData.isVerified ? SupplierStatus.VERIFIED : SupplierStatus.PENDING,
              deliveryAvailable: supplierData.deliveryAvailable,
              deliveryRadius: supplierData.deliveryRadius,
              ratingAverage: Math.random() * 2 + 3, // Random rating between 3 and 5
              ratingCount: Math.floor(Math.random() * 100) + 10, // Random count between 10 and 110
              products: {
                create: supplierData.products.map(product => ({
                  name: product.name,
                  description: product.description,
                  category: product.category,
                  unit: product.unit,
                  price: product.price,
                  stockQuantity: product.stockQuantity,
                  minOrderQty: product.minOrderQty,
                  imageUrls: product.imageUrls,
                  status: product.status,
                  isFeatured: product.isFeatured || false,
                })),
              },
            },
          },
        },
        include: {
          supplier: {
            include: {
              products: true,
            },
          },
        },
      });

      console.log(`✅ Created supplier: ${supplierData.companyName} with ${supplierData.products.length} products`);
    } catch (error) {
      console.error(`❌ Error creating ${supplierData.companyName}:`, error.message);
    }
  }

  console.log('✨ Suppliers seeding completed!');
}

seedSuppliers()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
