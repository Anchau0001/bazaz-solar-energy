import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // Plain/SHA for demo or standard hashing
  fullName: string;
  phone: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  refNumber: string;
  name: string;
  slug: string;
  categoryId: string;
  brand: string;
  description: string;
  technicalSpecs: Record<string, string>;
  purchasePrice: number; // Admin only
  sellingPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  availabilityStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  isPublic: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'sale_deduct' | 'adjustment' | 'return';
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reason: string;
  supplierId?: string;
  performedByUserId: string;
  performedByName: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  customerType: 'retail' | 'installer' | 'corporate';
  outstandingBalance: number;
  totalPurchases: number;
  assignedStaffId?: string;
  notes?: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  productRef: string;
  unitPrice: number;
  unitCost: number;
  quantity: number;
  total: number;
}

export interface Sale {
  id: string;
  transactionRef: string;
  date: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  staffId: string;
  staffName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'POS' | 'Split Payment';
  paymentStatus: 'completed' | 'partial' | 'refunded' | 'cancelled';
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  createdAt: string;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: string;
}

export interface CustomerEnquiry {
  id: string;
  enquiryRef: string;
  customerName: string;
  phone: string;
  email?: string;
  productOrService: string;
  category?: string;
  quantity?: number;
  message: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Email';
  status: 'pending' | 'assigned' | 'in_progress' | 'converted' | 'closed';
  assignedStaffId?: string;
  assignedStaffName?: string;
  followUpNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  quoteRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  systemCapacity: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted_to_sale';
  createdByStaffId: string;
  createdByStaffName: string;
  validUntil: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  expenseRef: string;
  title: string;
  category: 'Rent & Plaza Service' | 'Transport & Logistics' | 'Utilities & Generator Fuel' | 'Staff Allowance' | 'Tools & Safety Equipment' | 'Marketing' | 'Other';
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'POS';
  paidTo: string;
  recordedByUserId: string;
  recordedByName: string;
  date: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  productsSupplied: string;
  balanceOwed: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'staff';
  actionType: string;
  description: string;
  details?: Record<string, any>;
}

export interface BusinessSettings {
  companyName: string;
  tradingName: string;
  address: string;
  phones: string[];
  whatsapp: string;
  email: string;
  website: string;
  currencySymbol: string;
  currencyCode: string;
  taxRatePercent: number;
  receiptHeaderMessage: string;
  receiptFooterMessage: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  }[];
}

export interface DatabaseSchema {
  users: User[];
  categories: Category[];
  products: Product[];
  inventory_movements: StockMovement[];
  customers: Customer[];
  sales: Sale[];
  enquiries: CustomerEnquiry[];
  quotations: Quotation[];
  expenses: Expense[];
  suppliers: Supplier[];
  activity_logs: ActivityLog[];
  settings: BusinessSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class RelationalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private getInitialData(): DatabaseSchema {
    return {
      settings: {
        companyName: "Bazaz Solar Energy and Electricity Material",
        tradingName: "Bazaz Solar Energy",
        address: "Shop No. 7, Bazaz Plaza, Nagoyi, Zaria, Kaduna State, Nigeria",
        phones: ["09168655473", "08130675552"],
        whatsapp: "2349168655473",
        email: "bazazsolarenergy@gmail.com",
        website: "www.bazazsolar.ng",
        currencySymbol: "₦",
        currencyCode: "NGN",
        taxRatePercent: 0, // Solar and renewables VAT exemption in Nigeria
        receiptHeaderMessage: "Thank you for choosing Bazaz Solar Energy. Clean, constant power guaranteed.",
        receiptFooterMessage: "Goods sold in good condition are covered under manufacturer warranty. Technical support: 09168655473.",
        bankDetails: [
          {
            bankName: "First Bank of Nigeria",
            accountName: "Bazaz Solar Energy & Materials",
            accountNumber: "2039485721"
          },
          {
            bankName: "Stanbic IBTC Bank",
            accountName: "Bazaz Solar Energy Ent",
            accountNumber: "0048192847"
          }
        ]
      },
      users: [
        {
          id: "usr_admin_1",
          username: "admin@bazazsolar.ng",
          email: "lawalumaranc@gmail.com",
          passwordHash: "Admin123",
          fullName: "Comrd. Lawal Anchau",
          phone: "09168655473",
          role: "admin",
          status: "active",
          createdAt: "2026-01-10T08:00:00.000Z",
          lastLogin: "2026-11-03T08:30:00.000Z"
        },
        {
          id: "usr_staff_1",
          username: "staff@bazazsolar.ng",
          email: "staff@bazazsolar.ng",
          passwordHash: "staff123",
          fullName: "Ahmed Musa",
          phone: "08130675552",
          role: "staff",
          status: "active",
          createdAt: "2026-02-15T09:00:00.000Z",
          lastLogin: "2026-11-03T09:15:00.000Z"
        },
        {
          id: "usr_staff_2",
          username: "fatima@bazazsolar.ng",
          email: "fatima@bazazsolar.ng",
          passwordHash: "staff123",
          fullName: "Fatima Sani",
          phone: "08034567890",
          role: "staff",
          status: "active",
          createdAt: "2026-03-01T10:00:00.000Z",
          lastLogin: "2026-11-02T16:20:00.000Z"
        }
      ],
      categories: [
        {
          id: "cat_batteries",
          name: "Solar Batteries",
          slug: "solar-batteries",
          description: "High performance Lithium LiFePO4, Deep Cycle Tubular and Gel Solar Batteries.",
          iconName: "BatteryCharging",
          displayOrder: 1
        },
        {
          id: "cat_inverters",
          name: "Solar Inverters",
          slug: "solar-inverters",
          description: "Pure Sine Wave, Hybrid MPPT and Off-Grid Inverters for residential and industrial loads.",
          iconName: "Zap",
          displayOrder: 2
        },
        {
          id: "cat_panels",
          name: "Solar Panels",
          slug: "solar-panels",
          description: "Grade A Monocrystalline PERC and Bifacial Photovoltaic Solar Modules.",
          iconName: "Sun",
          displayOrder: 3
        },
        {
          id: "cat_controllers",
          name: "Solar Charge Controllers",
          slug: "charge-controllers",
          description: "Intelligent MPPT & PWM charge controllers with LCD status monitors.",
          iconName: "Cpu",
          displayOrder: 4
        },
        {
          id: "cat_cables",
          name: "Electrical Cables",
          slug: "electrical-cables",
          description: "Certified pure copper DC solar cables, battery interconnection links and armored cables.",
          iconName: "Cable",
          displayOrder: 5
        },
        {
          id: "cat_breakers",
          name: "Circuit Breakers",
          slug: "circuit-breakers",
          description: "DC and AC miniature circuit breakers, surge protection devices (SPD) and isolators.",
          iconName: "ShieldAlert",
          displayOrder: 6
        },
        {
          id: "cat_distribution",
          name: "Distribution Boards",
          slug: "distribution-boards",
          description: "Pre-wired solar distribution boxes, changeover switches and DB panels.",
          iconName: "Layers",
          displayOrder: 7
        },
        {
          id: "cat_accessories",
          name: "Solar Accessories",
          slug: "solar-accessories",
          description: "MC4 connectors, heavy-duty battery terminals, roof rails, lugs and mounting brackets.",
          iconName: "Tool",
          displayOrder: 8
        },
        {
          id: "cat_other",
          name: "Other Electrical Materials",
          slug: "other-electrical-materials",
          description: "Earth rods, copper tapes, industrial plugs, LED floodlights and installation accessories.",
          iconName: "Plug",
          displayOrder: 9
        }
      ],
      products: [
        {
          id: "prd_felicity_bat_5kwh",
          refNumber: "BSE-BAT-001",
          name: "Felicity Solar 48V 100Ah (5.12kWh) Lithium LiFePO4 Battery",
          slug: "felicity-48v-100ah-lithium-battery",
          categoryId: "cat_batteries",
          brand: "Felicity Solar",
          description: "High-grade wall-mounted lithium iron phosphate battery with integrated intelligent BMS, 6000+ cycle life, and LCD voltage screen. Ideal for 3.5kVA and 5kVA solar setups.",
          technicalSpecs: {
            "Nominal Voltage": "48V / 51.2V",
            "Capacity": "100Ah (5.12 kWh)",
            "Battery Type": "Lithium Iron Phosphate (LiFePO4)",
            "Cycle Life": "6,000+ cycles @ 80% DOD",
            "Maximum Discharge Current": "100A",
            "Warranty": "5 Years Manufacturer Warranty",
            "BMS Protection": "Overcharge, Over-discharge, Short circuit, Thermal"
          },
          purchasePrice: 1650000,
          sellingPrice: 1980000,
          stockQuantity: 12,
          minStockLevel: 3,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-01-15T10:00:00.000Z",
          updatedAt: "2026-11-01T12:00:00.000Z"
        },
        {
          id: "prd_felicity_bat_10kwh",
          refNumber: "BSE-BAT-002",
          name: "Felicity Solar 48V 200Ah (10kWh) Floor-Standing Lithium Battery",
          slug: "felicity-48v-200ah-10kwh-lithium",
          categoryId: "cat_batteries",
          brand: "Felicity Solar",
          description: "Heavy-duty server rack floor-standing lithium energy storage system for villas, hospitals, and heavy commercial inverters.",
          technicalSpecs: {
            "Nominal Voltage": "48V / 51.2V",
            "Capacity": "200Ah (10.24 kWh)",
            "Battery Chemistry": "LiFePO4 Grade-A Cells",
            "Cycle Life": "6,500+ cycles",
            "Communication": "RS485, CAN bus for hybrid inverters",
            "Warranty": "5 Years Warranty"
          },
          purchasePrice: 3200000,
          sellingPrice: 3850000,
          stockQuantity: 5,
          minStockLevel: 2,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-01-18T11:00:00.000Z",
          updatedAt: "2026-10-25T14:30:00.000Z"
        },
        {
          id: "prd_tubular_220ah",
          refNumber: "BSE-BAT-003",
          name: "Luminous 220Ah 12V Tall Tubular Deep Cycle Solar Battery",
          slug: "luminous-220ah-tubular-battery",
          categoryId: "cat_batteries",
          brand: "Luminous",
          description: "Rugged high-heat resistant tall tubular lead-acid battery engineered specifically for harsh Nigerian operating conditions and extended power cuts.",
          technicalSpecs: {
            "Nominal Voltage": "12V",
            "Capacity": "220Ah @ C20",
            "Plate Technology": "Hadi High Pressure Casting Tubular",
            "Electrolyte Level Indicators": "6 Ceramic Float Indicators",
            "Warranty": "24 Months Warranty"
          },
          purchasePrice: 285000,
          sellingPrice: 345000,
          stockQuantity: 18,
          minStockLevel: 4,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-02-01T08:00:00.000Z",
          updatedAt: "2026-11-02T10:00:00.000Z"
        },
        {
          id: "prd_felicity_inv_5kva",
          refNumber: "BSE-INV-001",
          name: "Felicity Solar 5kVA 48V Hybrid Solar Inverter (Built-in 120A MPPT)",
          slug: "felicity-5kva-48v-hybrid-inverter",
          categoryId: "cat_inverters",
          brand: "Felicity Solar",
          description: "Pure sine wave hybrid inverter with ultra-wide PV input range (120V - 450V DC), integrated 120A MPPT solar charger, and smart WiFi monitoring module.",
          technicalSpecs: {
            "Rated Power": "5000VA / 5000W Pure Sine Wave",
            "System DC Voltage": "48V DC",
            "Max PV Array Power": "6000W",
            "MPPT Voltage Range": "120V - 450V DC",
            "Max Solar Charging Current": "120A",
            "Parallel Capability": "Up to 6 units parallel",
            "Warranty": "2 Years Official Warranty"
          },
          purchasePrice: 620000,
          sellingPrice: 750000,
          stockQuantity: 9,
          minStockLevel: 2,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1548611716-ad957e87ce6a?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-01-20T09:00:00.000Z",
          updatedAt: "2026-11-01T15:00:00.000Z"
        },
        {
          id: "prd_must_inv_3kva",
          refNumber: "BSE-INV-002",
          name: "Must 3kVA 24V Pure Sine Wave Hybrid Solar Inverter (80A MPPT)",
          slug: "must-3kva-24v-hybrid-inverter",
          categoryId: "cat_inverters",
          brand: "Must Power",
          description: "Compact, dependable 24V hybrid inverter perfect for flats, 2-3 bedroom homes, powering lighting, TVs, fans, laptops, and energy-saving refrigerators.",
          technicalSpecs: {
            "Rated Power": "3000VA / 3000W",
            "DC Input": "24V DC",
            "Max PV Voltage": "145V DC",
            "Solar Charger": "80A MPPT built-in",
            "Waveform": "Pure Sine Wave",
            "Display": "Comprehensive LCD Panel",
            "Warranty": "18 Months Warranty"
          },
          purchasePrice: 380000,
          sellingPrice: 460000,
          stockQuantity: 8,
          minStockLevel: 3,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1558441719-74e50882e987?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-02-10T10:30:00.000Z",
          updatedAt: "2026-10-28T16:00:00.000Z"
        },
        {
          id: "prd_jinko_550w",
          refNumber: "BSE-PNL-001",
          name: "Jinko Solar 550W Tiger Pro Monocrystalline Solar Panel",
          slug: "jinko-solar-550w-mono-panel",
          categoryId: "cat_panels",
          brand: "Jinko Solar",
          description: "Tier 1 high-efficiency MBB Half-Cell Monocrystalline module offering outstanding low-light performance and PID resistance. Certified for high ambient temperatures.",
          technicalSpecs: {
            "Maximum Power (Pmax)": "550 Watts",
            "Cell Type": "Monocrystalline Half-cut cells",
            "Module Efficiency": "21.33%",
            "Open Circuit Voltage (Voc)": "49.62V",
            "Short Circuit Current (Isc)": "14.03A",
            "Frame": "Anodized Aluminium Alloy",
            "Warranty": "12-Year Product, 25-Year Linear Power Output"
          },
          purchasePrice: 110000,
          sellingPrice: 135000,
          stockQuantity: 42,
          minStockLevel: 10,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1508873696983-2df570464756?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-01-12T08:00:00.000Z",
          updatedAt: "2026-11-02T11:45:00.000Z"
        },
        {
          id: "prd_canadian_600w",
          refNumber: "BSE-PNL-002",
          name: "Canadian Solar 600W HiKu7 Mono PERC High Power Solar Panel",
          slug: "canadian-solar-600w-mono-panel",
          categoryId: "cat_panels",
          brand: "Canadian Solar",
          description: "Ultra-high power module designed for maximum yield on rooftop and ground installations. Minimizes micro-crack impacts and reduces BOS cost.",
          technicalSpecs: {
            "Maximum Power (Pmax)": "600 Watts",
            "Efficiency": "21.2%",
            "Voc": "41.7V",
            "Isc": "18.35A",
            "Glass": "3.2mm anti-reflective toughened glass",
            "Junction Box": "IP68 rated with bypass diodes"
          },
          purchasePrice: 125000,
          sellingPrice: 155000,
          stockQuantity: 28,
          minStockLevel: 8,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-02-20T09:15:00.000Z",
          updatedAt: "2026-10-30T13:00:00.000Z"
        },
        {
          id: "prd_srne_60a_mppt",
          refNumber: "BSE-SCC-001",
          name: "SRNE 60A 12V/24V/36V/48V Auto MPPT Solar Charge Controller",
          slug: "srne-60a-auto-mppt-charge-controller",
          categoryId: "cat_controllers",
          brand: "SRNE",
          description: "Advanced MPPT tracking algorithm with tracking efficiency up to 99.9%. Supports sealed, GEL, flooded, and lithium battery presets with backlit LCD.",
          technicalSpecs: {
            "Rated Charge Current": "60A",
            "System Voltage": "12V / 24V / 36V / 48V Auto Detect",
            "Max PV Open Circuit Voltage": "150V DC",
            "Peak Conversion Efficiency": "98%",
            "Cooling": "Cast aluminium heat sink",
            "Warranty": "2 Years"
          },
          purchasePrice: 95000,
          sellingPrice: 120000,
          stockQuantity: 15,
          minStockLevel: 4,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-02-05T12:00:00.000Z",
          updatedAt: "2026-11-01T09:30:00.000Z"
        },
        {
          id: "prd_coleman_16mm",
          refNumber: "BSE-CBL-001",
          name: "Coleman Pure Copper 16mm² Single Core Flexible Cable (100m Coil)",
          slug: "coleman-16mm-pure-copper-cable",
          categoryId: "cat_cables",
          brand: "Coleman",
          description: "High conductivity 100% pure annealed copper flexible cable. Flame retardant PVC sheath, certified by SON for Nigerian electrical installations.",
          technicalSpecs: {
            "Conductor Size": "16mm²",
            "Conductor Material": "100% Pure Electrolytic Copper",
            "Length": "100 Metres Full Coil",
            "Voltage Rating": "450 / 750V",
            "Standard": "NIS / IEC Certified"
          },
          purchasePrice: 190000,
          sellingPrice: 235000,
          stockQuantity: 14,
          minStockLevel: 3,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-01-25T14:00:00.000Z",
          updatedAt: "2026-10-29T10:00:00.000Z"
        },
        {
          id: "prd_solar_pv_4mm",
          refNumber: "BSE-CBL-002",
          name: "TUV Certified 4mm² Double Insulated DC Solar Cable (100m Roll)",
          slug: "tuv-4mm-dc-solar-cable",
          categoryId: "cat_cables",
          brand: "KBE Solar",
          description: "UV and ozone resistant tinned copper PV cable designed for long-term outdoor exposure on solar arrays. Halogen-free and flame retardant.",
          technicalSpecs: {
            "Cross Section": "4mm² (12 AWG)",
            "Conductor": "Tinned Copper Strands",
            "Nominal Voltage": "1500V DC",
            "Temperature Range": "-40°C to +90°C",
            "Certification": "TUV Rheinland EN 50618"
          },
          purchasePrice: 65000,
          sellingPrice: 85000,
          stockQuantity: 20,
          minStockLevel: 5,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-02-14T11:00:00.000Z",
          updatedAt: "2026-11-02T16:00:00.000Z"
        },
        {
          id: "prd_schneider_dc_mcb",
          refNumber: "BSE-BRK-001",
          name: "Schneider Electric 63A 2-Pole 600V DC Miniature Circuit Breaker",
          slug: "schneider-63a-2p-dc-mcb",
          categoryId: "cat_breakers",
          brand: "Schneider Electric",
          description: "Dedicated DC breaker for solar photovoltaic string isolation and battery bank overload protection with magnetic arc extinguishing.",
          technicalSpecs: {
            "Rated Current": "63 Amperes",
            "Poles": "2-Pole (2P)",
            "Rated Voltage": "Up to 600V DC",
            "Breaking Capacity": "10kA",
            "Mounting": "Standard 35mm DIN Rail"
          },
          purchasePrice: 18000,
          sellingPrice: 25000,
          stockQuantity: 35,
          minStockLevel: 10,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-02-08T15:00:00.000Z",
          updatedAt: "2026-11-02T14:00:00.000Z"
        },
        {
          id: "prd_chint_changeover",
          refNumber: "BSE-DB-001",
          name: "Chint 63A 4-Pole Manual Dual Power Changeover Switch",
          slug: "chint-63a-4p-changeover-switch",
          categoryId: "cat_distribution",
          brand: "Chint",
          description: "Heavy-duty 1-0-2 position changeover switch for seamless switching between Solar Inverter, National Grid (NEPA/KEDCO), and Generator backup.",
          technicalSpecs: {
            "Current Rating": "63A",
            "Number of Poles": "4-Pole (3 Phase + Neutral or Dual Single Phase)",
            "Rated Insulation Voltage": "690V AC",
            "Positions": "I - 0 - II (Center Off)"
          },
          purchasePrice: 32000,
          sellingPrice: 42000,
          stockQuantity: 16,
          minStockLevel: 4,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-01-30T10:00:00.000Z",
          updatedAt: "2026-10-31T12:00:00.000Z"
        },
        {
          id: "prd_mc4_connectors",
          refNumber: "BSE-ACC-001",
          name: "Original MC4 Male & Female Solar Connectors (10 Pairs Pack)",
          slug: "mc4-connectors-pack-10-pairs",
          categoryId: "cat_accessories",
          brand: "Staubli",
          description: "IP67 waterproof UV-resistant solar panel branch connection terminals. Heavy-duty tinned copper contacts ensure minimum resistance.",
          technicalSpecs: {
            "Rated Current": "30A",
            "Rated Voltage": "1000V DC / 1500V DC",
            "Waterproof Grade": "IP67",
            "Locking Mechanism": "Snap-in safety lock"
          },
          purchasePrice: 12000,
          sellingPrice: 18000,
          stockQuantity: 45,
          minStockLevel: 10,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-01-22T13:00:00.000Z",
          updatedAt: "2026-11-01T17:00:00.000Z"
        },
        {
          id: "prd_earth_rod_kit",
          refNumber: "BSE-OTH-001",
          name: "Heavy-Duty Pure Copper Bonded Earth Rod (5/8 inch x 5ft) with Clamp",
          slug: "copper-earth-rod-kit",
          categoryId: "cat_other",
          brand: "Walsall",
          description: "Critical lightning and surge earthing protection kit for solar arrays and inverter frames. Includes brass clamp and copper link.",
          technicalSpecs: {
            "Diameter": "5/8 inch (16mm)",
            "Length": "5 Feet (1.5m)",
            "Coating": "Electrolytically Bonded High Purity Copper",
            "Clamp Material": "High tensile phosphor bronze / brass"
          },
          purchasePrice: 22000,
          sellingPrice: 30000,
          stockQuantity: 24,
          minStockLevel: 5,
          availabilityStatus: "in_stock",
          isPublic: true,
          imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
          createdAt: "2026-02-12T16:00:00.000Z",
          updatedAt: "2026-11-02T13:00:00.000Z"
        }
      ],
      inventory_movements: [
        {
          id: "mov_init_1",
          productId: "prd_felicity_bat_5kwh",
          productName: "Felicity Solar 48V 100Ah Lithium Battery",
          type: "stock_in",
          quantityChange: 15,
          previousStock: 0,
          newStock: 15,
          reason: "Initial warehouse consignment stock intake",
          performedByUserId: "usr_admin_1",
          performedByName: "Engr. Aliyu Bazaz",
          timestamp: "2026-10-01T08:00:00.000Z"
        },
        {
          id: "mov_init_2",
          productId: "prd_felicity_bat_5kwh",
          productName: "Felicity Solar 48V 100Ah Lithium Battery",
          type: "sale_deduct",
          quantityChange: -3,
          previousStock: 15,
          newStock: 12,
          reason: "Direct customer installation sales ref BSE-TX-20261028-1092",
          performedByUserId: "usr_staff_1",
          performedByName: "Ahmed Musa",
          timestamp: "2026-10-28T14:30:00.000Z"
        }
      ],
      customers: [
        {
          id: "cust_1",
          fullName: "Dr. Ibrahim Danladi",
          phone: "08037194820",
          email: "idanladi@abu.edu.ng",
          address: "No. 14, Ahmadu Bello University Senior Staff Quarters, Samaru",
          city: "Zaria",
          state: "Kaduna State",
          customerType: "retail",
          outstandingBalance: 0,
          totalPurchases: 2730000,
          assignedStaffId: "usr_staff_1",
          notes: "Installed 5kVA hybrid with 5.12kWh Felicity lithium battery. Very satisfied customer.",
          createdAt: "2026-09-12T10:00:00.000Z"
        },
        {
          id: "cust_2",
          fullName: "Mallam Usman Garba",
          phone: "08149204918",
          email: "usman.garba.farms@gmail.com",
          address: "Garba Agro Estate, Shika Road",
          city: "Zaria",
          state: "Kaduna State",
          customerType: "corporate",
          outstandingBalance: 150000,
          totalPurchases: 5400000,
          assignedStaffId: "usr_staff_1",
          notes: "Solar water pumping and cold room backup for agro products.",
          createdAt: "2026-08-20T11:30:00.000Z"
        },
        {
          id: "cust_3",
          fullName: "Kabiru Electrical Services",
          phone: "08028471923",
          email: "kabiru.installer@yahoo.com",
          address: "Shop 12, Main Market, Sabon Gari",
          city: "Zaria",
          state: "Kaduna State",
          customerType: "installer",
          outstandingBalance: 0,
          totalPurchases: 1850000,
          assignedStaffId: "usr_staff_2",
          notes: "Registered installer who regularly buys panels, cables, and circuit breakers.",
          createdAt: "2026-10-05T09:00:00.000Z"
        }
      ],
      sales: [
        {
          id: "sale_101",
          transactionRef: "BSE-TX-20261101-4912",
          date: "2026-11-01T11:20:00.000Z",
          customerId: "cust_1",
          customerName: "Dr. Ibrahim Danladi",
          customerPhone: "08037194820",
          staffId: "usr_staff_1",
          staffName: "Ahmed Musa",
          items: [
            {
              productId: "prd_felicity_bat_5kwh",
              productName: "Felicity Solar 48V 100Ah Lithium Battery",
              productRef: "BSE-BAT-001",
              unitPrice: 1980000,
              unitCost: 1650000,
              quantity: 1,
              total: 1980000
            },
            {
              productId: "prd_schneider_dc_mcb",
              productName: "Schneider Electric 63A 2-Pole DC MCB",
              productRef: "BSE-BRK-001",
              unitPrice: 25000,
              unitCost: 18000,
              quantity: 2,
              total: 50000
            }
          ],
          subtotal: 2030000,
          discount: 30000,
          tax: 0,
          totalAmount: 2000000,
          paymentMethod: "Bank Transfer",
          paymentStatus: "completed",
          amountPaid: 2000000,
          balanceDue: 0,
          notes: "Paid in full via Stanbic IBTC transfer. Receipt generated.",
          createdAt: "2026-11-01T11:25:00.000Z"
        },
        {
          id: "sale_102",
          transactionRef: "BSE-TX-20261102-8314",
          date: "2026-11-02T14:15:00.000Z",
          customerId: "cust_3",
          customerName: "Kabiru Electrical Services",
          customerPhone: "08028471923",
          staffId: "usr_staff_2",
          staffName: "Fatima Sani",
          items: [
            {
              productId: "prd_jinko_550w",
              productName: "Jinko Solar 550W Tiger Pro Solar Panel",
              productRef: "BSE-PNL-001",
              unitPrice: 135000,
              unitCost: 110000,
              quantity: 4,
              total: 540000
            },
            {
              productId: "prd_solar_pv_4mm",
              productName: "TUV Certified 4mm² DC Solar Cable (100m Roll)",
              productRef: "BSE-CBL-002",
              unitPrice: 85000,
              unitCost: 65000,
              quantity: 1,
              total: 85000
            }
          ],
          subtotal: 625000,
          discount: 15000,
          tax: 0,
          totalAmount: 610000,
          paymentMethod: "POS",
          paymentStatus: "completed",
          amountPaid: 610000,
          balanceDue: 0,
          notes: "POS terminal transaction reference #00938472. Picked up from shop.",
          createdAt: "2026-11-02T14:20:00.000Z"
        }
      ],
      enquiries: [
        {
          id: "enq_1",
          enquiryRef: "ENQ-9182",
          customerName: "Alhaji Bello Sambo",
          phone: "08033112233",
          email: "bsambo_zaria@gmail.com",
          productOrService: "Solar System Design and Complete Installation (Villa in Nagoyi)",
          category: "Solar Installation",
          quantity: 1,
          message: "I need a complete 10kVA solar setup to run 3 inverter air conditioners, water pump, and lights for my family compound in Nagoyi. Please call me for site inspection.",
          preferredContact: "WhatsApp",
          status: "assigned",
          assignedStaffId: "usr_staff_1",
          assignedStaffName: "Ahmed Musa",
          followUpNotes: "Spoke with Alhaji. Scheduled site inspection visit for Thursday 10:00 AM.",
          createdAt: "2026-11-02T09:00:00.000Z",
          updatedAt: "2026-11-02T11:00:00.000Z"
        },
        {
          id: "enq_2",
          enquiryRef: "ENQ-9183",
          customerName: "Grace Oche",
          phone: "08169988776",
          email: "grace.oche@yahoo.com",
          productOrService: "Felicity Solar 5kVA Hybrid Inverter with 48V Lithium Battery",
          category: "Sales of solar inverters",
          quantity: 1,
          message: "Please send me your current best price for 5kVA Felicity inverter with 5.12kWh lithium battery. Can your team install it in Kongo Campus area?",
          preferredContact: "Phone Call",
          status: "pending",
          createdAt: "2026-11-03T02:15:00.000Z",
          updatedAt: "2026-11-03T02:15:00.000Z"
        }
      ],
      quotations: [
        {
          id: "quo_1",
          quoteRef: "QUO-2026-042",
          customerName: "Dr. Ibrahim Danladi",
          customerPhone: "08037194820",
          customerEmail: "idanladi@abu.edu.ng",
          systemCapacity: "5kVA Solar Hybrid Backup System",
          items: [
            {
              description: "Felicity Solar 5kVA 48V Hybrid Solar Inverter (120A MPPT)",
              quantity: 1,
              unitPrice: 750000,
              total: 750000
            },
            {
              description: "Felicity Solar 48V 100Ah (5.12kWh) Lithium LiFePO4 Battery",
              quantity: 1,
              unitPrice: 1980000,
              total: 1980000
            },
            {
              description: "Jinko 550W Mono PERC Solar Panels (6 Units)",
              quantity: 6,
              unitPrice: 135000,
              total: 810000
            },
            {
              description: "Roof Mounting Aluminium Rails & Stainless Brackets Kit",
              quantity: 1,
              unitPrice: 120000,
              total: 120000
            },
            {
              description: "Protection DB Box (DC/AC Breakers, Surge SPD, Changeover)",
              quantity: 1,
              unitPrice: 115000,
              total: 115000
            },
            {
              description: "Coleman 16mm & KBE 4mm Solar Cables with MC4s",
              quantity: 1,
              unitPrice: 95000,
              total: 95000
            },
            {
              description: "Professional Engineering Installation, Testing & Earthing",
              quantity: 1,
              unitPrice: 150000,
              total: 150000
            }
          ],
          subtotal: 4020000,
          discount: 100000,
          totalAmount: 3920000,
          status: "accepted",
          createdByStaffId: "usr_staff_1",
          createdByStaffName: "Ahmed Musa",
          validUntil: "2026-11-30",
          createdAt: "2026-10-25T14:00:00.000Z"
        }
      ],
      expenses: [
        {
          id: "exp_1",
          expenseRef: "EXP-202611-001",
          title: "Plaza Security & Cleaning Levy - November 2026",
          category: "Rent & Plaza Service",
          amount: 35000,
          paymentMethod: "Bank Transfer",
          paidTo: "Bazaz Plaza Management Committee",
          recordedByUserId: "usr_admin_1",
          recordedByName: "Engr. Aliyu Bazaz",
          date: "2026-11-01",
          notes: "Monthly shop maintenance fee for Shop No. 7"
        },
        {
          id: "exp_2",
          expenseRef: "EXP-202611-002",
          title: "Generator Diesel Fuel for Shop Testing Bench",
          category: "Utilities & Generator Fuel",
          amount: 28000,
          paymentMethod: "Cash",
          paidTo: "TotalEnergies Nagoyi Filling Station",
          recordedByUserId: "usr_staff_1",
          recordedByName: "Ahmed Musa",
          date: "2026-11-02",
          notes: "Fuel for load-testing newly unboxed inverters and batteries"
        }
      ],
      suppliers: [
        {
          id: "sup_1",
          name: "Felicity Solar Nigeria Ltd (Lagos Branch)",
          contactPerson: "Mr. Lin Zhang / Adekunle",
          phone: "08099881122",
          email: "sales.ng@felicitysolar.com",
          address: "No. 42 Alaba International Market Way, Ojo, Lagos",
          productsSupplied: "Lithium batteries, hybrid inverters, solar street lights",
          balanceOwed: 0
        },
        {
          id: "sup_2",
          name: "Kano Solar & Electrical Wholesale Hub",
          contactPerson: "Alhaji Aminu Dangote",
          phone: "08034567891",
          email: "kanosolarhub@yahoo.com",
          address: "Shop 18, Fagge Electrical Market, Kano State",
          productsSupplied: "Jinko panels, Canadian Solar, Coleman cables, Chint switches",
          balanceOwed: 250000
        }
      ],
      activity_logs: [
        {
          id: "log_1",
          timestamp: "2026-11-01T11:25:00.000Z",
          userId: "usr_staff_1",
          userName: "Ahmed Musa",
          userRole: "staff",
          actionType: "SALE_RECORDED",
          description: "Recorded sale BSE-TX-20261101-4912 for Dr. Ibrahim Danladi (₦2,000,000)",
          details: { saleRef: "BSE-TX-20261101-4912", amount: 2000000 }
        },
        {
          id: "log_2",
          timestamp: "2026-11-02T14:20:00.000Z",
          userId: "usr_staff_2",
          userName: "Fatima Sani",
          userRole: "staff",
          actionType: "SALE_RECORDED",
          description: "Recorded POS sale BSE-TX-20261102-8314 for Kabiru Electrical Services (₦610,000)",
          details: { saleRef: "BSE-TX-20261102-8314", amount: 610000 }
        },
        {
          id: "log_3",
          timestamp: "2026-11-02T11:00:00.000Z",
          userId: "usr_staff_1",
          userName: "Ahmed Musa",
          userRole: "staff",
          actionType: "ENQUIRY_STATUS",
          description: "Assigned customer inquiry ENQ-9182 (Alhaji Bello Sambo) to self for site inspection",
          details: { enquiryId: "enq_1" }
        }
      ]
    };
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Verify key tables exist
        if (parsed.products && parsed.users && parsed.sales) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading database file, initializing fresh database:', err);
    }

    const initial = this.getInitialData();
    this.saveDatabase(initial);
    return initial;
  }

  public saveDatabase(dataToSave?: DatabaseSchema): void {
    const data = dataToSave || this.data;
    try {
      // Atomic write pattern: write to tmp then rename
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to save database file atomically:', err);
    }
  }

  // --- USERS & AUTH ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByUsername(identifier: string): User | undefined {
    const idLower = identifier.toLowerCase().trim();
    return this.data.users.find(
      u => u.username.toLowerCase() === idLower || (u.email && u.email.toLowerCase() === idLower)
    );
  }

  public findUserByEmail(email: string): User | undefined {
    const emailLower = email.toLowerCase().trim();
    return this.data.users.find(
      u => (u.email && u.email.toLowerCase() === emailLower) || u.username.toLowerCase() === emailLower
    );
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.saveDatabase();
    return this.data.users[index];
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.data.categories.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getCategoryById(id: string): Category | undefined {
    return this.data.categories.find(c => c.id === id);
  }

  // --- PRODUCTS ---
  public getProducts(options?: {
    categoryId?: string;
    brand?: string;
    search?: string;
    isPublicOnly?: boolean;
  }): Product[] {
    let prods = [...this.data.products];

    if (options?.isPublicOnly) {
      prods = prods.filter(p => p.isPublic);
    }
    if (options?.categoryId && options.categoryId !== 'all') {
      prods = prods.filter(p => p.categoryId === options.categoryId);
    }
    if (options?.brand && options.brand !== 'all') {
      prods = prods.filter(p => p.brand.toLowerCase() === options.brand!.toLowerCase());
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.refNumber.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        Object.values(p.technicalSpecs).some(spec => spec.toLowerCase().includes(q))
      );
    }

    return prods;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'availabilityStatus'>, actor: { userId: string; userName: string }): Product {
    const now = new Date().toISOString();
    const status: 'in_stock' | 'low_stock' | 'out_of_stock' =
      product.stockQuantity <= 0 ? 'out_of_stock' : product.stockQuantity <= product.minStockLevel ? 'low_stock' : 'in_stock';

    const newProduct: Product = {
      ...product,
      id: `prd_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      availabilityStatus: status,
      createdAt: now,
      updatedAt: now
    };

    this.data.products.push(newProduct);

    // Record initial inventory movement if quantity > 0
    if (product.stockQuantity > 0) {
      this.recordInventoryMovement({
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'stock_in',
        quantityChange: product.stockQuantity,
        previousStock: 0,
        newStock: product.stockQuantity,
        reason: 'Initial product creation stock intake',
        performedByUserId: actor.userId,
        performedByName: actor.userName
      });
    }

    this.recordActivity({
      userId: actor.userId,
      userName: actor.userName,
      userRole: 'admin',
      actionType: 'PRODUCT_CREATED',
      description: `Added new product ${newProduct.name} (${newProduct.refNumber}) with initial stock of ${newProduct.stockQuantity}`
    });

    this.saveDatabase();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>, actor: { userId: string; userName: string; userRole: 'admin' | 'staff' }): Product | undefined {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return undefined;

    const oldProduct = this.data.products[idx];
    const prevStock = oldProduct.stockQuantity;

    // Recalculate availability if stockQuantity changed
    let updatedStock = updates.stockQuantity !== undefined ? updates.stockQuantity : oldProduct.stockQuantity;
    let minStock = updates.minStockLevel !== undefined ? updates.minStockLevel : oldProduct.minStockLevel;

    const newStatus: 'in_stock' | 'low_stock' | 'out_of_stock' =
      updatedStock <= 0 ? 'out_of_stock' : updatedStock <= minStock ? 'low_stock' : 'in_stock';

    const updated: Product = {
      ...oldProduct,
      ...updates,
      stockQuantity: updatedStock,
      availabilityStatus: newStatus,
      updatedAt: new Date().toISOString()
    };

    this.data.products[idx] = updated;

    // If stock was adjusted directly via update
    if (updates.stockQuantity !== undefined && updates.stockQuantity !== prevStock) {
      const diff = updates.stockQuantity - prevStock;
      this.recordInventoryMovement({
        productId: updated.id,
        productName: updated.name,
        type: diff > 0 ? 'stock_in' : 'adjustment',
        quantityChange: diff,
        previousStock: prevStock,
        newStock: updated.stockQuantity,
        reason: 'Direct product inventory adjustment',
        performedByUserId: actor.userId,
        performedByName: actor.userName
      });
    }

    this.recordActivity({
      userId: actor.userId,
      userName: actor.userName,
      userRole: actor.userRole,
      actionType: 'PRODUCT_UPDATED',
      description: `Updated product ${updated.name} (${updated.refNumber})`
    });

    this.saveDatabase();
    return updated;
  }

  public deleteProduct(id: string, actor: { userId: string; userName: string }): boolean {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const removed = this.data.products.splice(idx, 1)[0];

    this.recordActivity({
      userId: actor.userId,
      userName: actor.userName,
      userRole: 'admin',
      actionType: 'PRODUCT_DELETED',
      description: `Deleted product ${removed.name} (${removed.refNumber})`
    });

    this.saveDatabase();
    return true;
  }

  // --- INVENTORY MOVEMENTS ---
  public getInventoryMovements(productId?: string): StockMovement[] {
    if (productId) {
      return this.data.inventory_movements.filter(m => m.productId === productId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return [...this.data.inventory_movements].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public recordInventoryMovement(movement: Omit<StockMovement, 'id' | 'timestamp'>): StockMovement {
    const newMovement: StockMovement = {
      ...movement,
      id: `mov_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.data.inventory_movements.push(newMovement);
    this.saveDatabase();
    return newMovement;
  }

  public adjustStock(params: {
    productId: string;
    quantityChange: number;
    reason: string;
    type: 'stock_in' | 'adjustment' | 'return';
    supplierId?: string;
    actor: { userId: string; userName: string; userRole: 'admin' | 'staff' };
  }): { product: Product; movement: StockMovement } | { error: string } {
    const product = this.getProductById(params.productId);
    if (!product) return { error: 'Product not found' };

    const previousStock = product.stockQuantity;
    const newStock = previousStock + params.quantityChange;

    if (newStock < 0) {
      return { error: 'Cannot reduce stock below zero. Current stock is ' + previousStock };
    }

    const updated = this.updateProduct(product.id, { stockQuantity: newStock }, params.actor);
    if (!updated) return { error: 'Failed to update stock' };

    const movement = this.recordInventoryMovement({
      productId: product.id,
      productName: product.name,
      type: params.type,
      quantityChange: params.quantityChange,
      previousStock,
      newStock,
      reason: params.reason,
      supplierId: params.supplierId,
      performedByUserId: params.actor.userId,
      performedByName: params.actor.userName
    });

    return { product: updated, movement };
  }

  // --- SALES MANAGEMENT (ATOMIC INVENTORY DEDUCTION) ---
  public getSales(filter?: {
    staffId?: string;
    startDate?: string;
    endDate?: string;
    paymentMethod?: string;
    paymentStatus?: string;
  }): Sale[] {
    let list = [...this.data.sales];

    if (filter?.staffId) {
      list = list.filter(s => s.staffId === filter.staffId);
    }
    if (filter?.paymentMethod && filter.paymentMethod !== 'all') {
      list = list.filter(s => s.paymentMethod === filter.paymentMethod);
    }
    if (filter?.paymentStatus && filter.paymentStatus !== 'all') {
      list = list.filter(s => s.paymentStatus === filter.paymentStatus);
    }
    if (filter?.startDate) {
      list = list.filter(s => s.date >= filter.startDate!);
    }
    if (filter?.endDate) {
      list = list.filter(s => s.date <= filter.endDate!);
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getSaleById(id: string): Sale | undefined {
    return this.data.sales.find(s => s.id === id || s.transactionRef === id);
  }

  public recordSale(saleInput: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    items: { productId: string; quantity: number; unitPrice?: number }[];
    discount: number;
    paymentMethod: 'Cash' | 'Bank Transfer' | 'POS' | 'Split Payment';
    notes?: string;
    actor: { userId: string; userName: string; userRole: 'admin' | 'staff' };
  }): { sale: Sale } | { error: string } {
    if (!saleInput.items || saleInput.items.length === 0) {
      return { error: 'Sale must contain at least one product item.' };
    }

    // Step 1: Pre-validate stock for every item to guarantee atomic sale
    const enrichedItems: SaleItem[] = [];
    let subtotal = 0;

    for (const item of saleInput.items) {
      const prod = this.getProductById(item.productId);
      if (!prod) {
        return { error: `Product ID ${item.productId} not found.` };
      }
      if (prod.stockQuantity < item.quantity) {
        return {
          error: `Insufficient stock for "${prod.name}". Available: ${prod.stockQuantity}, Requested: ${item.quantity}.`
        };
      }
      const unitPrice = item.unitPrice !== undefined ? item.unitPrice : prod.sellingPrice;
      const total = unitPrice * item.quantity;
      subtotal += total;

      enrichedItems.push({
        productId: prod.id,
        productName: prod.name,
        productRef: prod.refNumber,
        unitPrice,
        unitCost: prod.purchasePrice,
        quantity: item.quantity,
        total
      });
    }

    const discount = Math.max(0, saleInput.discount || 0);
    const tax = 0; // Tax rate 0% for solar in Nigeria
    const totalAmount = Math.max(0, subtotal - discount + tax);

    // Step 2: Generate unique transaction reference (e.g. BSE-TX-20261103-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const transactionRef = `BSE-TX-${dateStr}-${randomHex}`;

    const newSale: Sale = {
      id: `sale_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      transactionRef,
      date: new Date().toISOString(),
      customerId: saleInput.customerId,
      customerName: saleInput.customerName.trim() || 'Walk-in Customer',
      customerPhone: saleInput.customerPhone.trim() || 'N/A',
      staffId: saleInput.actor.userId,
      staffName: saleInput.actor.userName,
      items: enrichedItems,
      subtotal,
      discount,
      tax,
      totalAmount,
      paymentMethod: saleInput.paymentMethod,
      paymentStatus: 'completed',
      amountPaid: totalAmount,
      balanceDue: 0,
      notes: saleInput.notes,
      createdAt: new Date().toISOString()
    };

    // Step 3: Deduct stock automatically and record stock movement for each item
    for (const item of enrichedItems) {
      const prod = this.getProductById(item.productId)!;
      const prevStock = prod.stockQuantity;
      const newStock = prevStock - item.quantity;

      this.updateProduct(prod.id, { stockQuantity: newStock }, saleInput.actor);

      this.recordInventoryMovement({
        productId: prod.id,
        productName: prod.name,
        type: 'sale_deduct',
        quantityChange: -item.quantity,
        previousStock: prevStock,
        newStock,
        reason: `Sold in transaction ${transactionRef} to ${newSale.customerName}`,
        performedByUserId: saleInput.actor.userId,
        performedByName: saleInput.actor.userName
      });
    }

    // Step 4: Update customer total purchases or auto-create customer if phone is given
    if (saleInput.customerId) {
      const customer = this.getCustomerById(saleInput.customerId);
      if (customer) {
        this.updateCustomer(customer.id, {
          totalPurchases: (customer.totalPurchases || 0) + totalAmount
        });
      }
    } else if (saleInput.customerPhone && saleInput.customerPhone !== 'N/A') {
      const existingCust = this.data.customers.find(c => c.phone === saleInput.customerPhone);
      if (existingCust) {
        this.updateCustomer(existingCust.id, {
          totalPurchases: (existingCust.totalPurchases || 0) + totalAmount
        });
      } else if (saleInput.customerName && saleInput.customerName !== 'Walk-in Customer') {
        this.createCustomer({
          fullName: saleInput.customerName,
          phone: saleInput.customerPhone,
          address: 'Zaria',
          city: 'Zaria',
          state: 'Kaduna State',
          customerType: 'retail',
          outstandingBalance: 0,
          totalPurchases: totalAmount,
          assignedStaffId: saleInput.actor.userId
        });
      }
    }

    this.data.sales.push(newSale);

    this.recordActivity({
      userId: saleInput.actor.userId,
      userName: saleInput.actor.userName,
      userRole: saleInput.actor.userRole,
      actionType: 'SALE_RECORDED',
      description: `Recorded sale ${transactionRef} for ₦${totalAmount.toLocaleString()} (${newSale.customerName})`,
      details: { transactionRef, totalAmount, itemCount: enrichedItems.length }
    });

    this.saveDatabase();
    return { sale: newSale };
  }

  public voidSale(saleId: string, reason: string, actor: { userId: string; userName: string; userRole: 'admin' }): { success: boolean; sale?: Sale; error?: string } {
    const sale = this.getSaleById(saleId);
    if (!sale) return { success: false, error: 'Sale record not found' };

    if (sale.paymentStatus === 'cancelled' || sale.paymentStatus === 'refunded') {
      return { success: false, error: 'Sale is already voided or refunded' };
    }

    // Restore inventory
    for (const item of sale.items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        const prevStock = prod.stockQuantity;
        const newStock = prevStock + item.quantity;
        this.updateProduct(prod.id, { stockQuantity: newStock }, actor);

        this.recordInventoryMovement({
          productId: prod.id,
          productName: prod.name,
          type: 'return',
          quantityChange: item.quantity,
          previousStock: prevStock,
          newStock,
          reason: `Stock restored from voided sale ${sale.transactionRef}. Reason: ${reason}`,
          performedByUserId: actor.userId,
          performedByName: actor.userName
        });
      }
    }

    sale.paymentStatus = 'cancelled';
    sale.voidReason = reason;
    sale.voidedBy = actor.userName;
    sale.voidedAt = new Date().toISOString();

    this.recordActivity({
      userId: actor.userId,
      userName: actor.userName,
      userRole: 'admin',
      actionType: 'SALE_VOIDED',
      description: `Voided transaction ${sale.transactionRef} (₦${sale.totalAmount.toLocaleString()}). Reason: ${reason}`,
      details: { transactionRef: sale.transactionRef, reason }
    });

    this.saveDatabase();
    return { success: true, sale };
  }

  // --- CUSTOMERS ---
  public getCustomers(search?: string): Customer[] {
    if (!search) return [...this.data.customers].sort((a, b) => b.totalPurchases - a.totalPurchases);
    const q = search.toLowerCase();
    return this.data.customers.filter(c =>
      c.fullName.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      c.address.toLowerCase().includes(q)
    );
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.data.customers.find(c => c.id === id);
  }

  public createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const newCust: Customer = {
      ...customer,
      id: `cust_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    this.data.customers.push(newCust);
    this.saveDatabase();
    return newCust;
  }

  public updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined {
    const idx = this.data.customers.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.data.customers[idx] = { ...this.data.customers[idx], ...updates };
    this.saveDatabase();
    return this.data.customers[idx];
  }

  // --- ENQUIRIES ---
  public getEnquiries(filter?: { status?: string; staffId?: string }): CustomerEnquiry[] {
    let list = [...this.data.enquiries];
    if (filter?.status && filter.status !== 'all') {
      list = list.filter(e => e.status === filter.status);
    }
    if (filter?.staffId) {
      list = list.filter(e => e.assignedStaffId === filter.staffId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createEnquiry(enquiry: {
    customerName: string;
    phone: string;
    email?: string;
    productOrService: string;
    category?: string;
    quantity?: number;
    message: string;
    preferredContact?: 'WhatsApp' | 'Phone Call' | 'Email';
  }): CustomerEnquiry {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newEnquiry: CustomerEnquiry = {
      id: `enq_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      enquiryRef: `ENQ-${randomNum}`,
      customerName: enquiry.customerName.trim(),
      phone: enquiry.phone.trim(),
      email: enquiry.email?.trim(),
      productOrService: enquiry.productOrService,
      category: enquiry.category,
      quantity: enquiry.quantity || 1,
      message: enquiry.message.trim(),
      preferredContact: enquiry.preferredContact || 'WhatsApp',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.enquiries.push(newEnquiry);
    this.saveDatabase();
    return newEnquiry;
  }

  public updateEnquiry(id: string, updates: Partial<CustomerEnquiry>, actor?: { userId: string; userName: string; userRole: 'admin' | 'staff' }): CustomerEnquiry | undefined {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return undefined;

    this.data.enquiries[idx] = {
      ...this.data.enquiries[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (actor) {
      this.recordActivity({
        userId: actor.userId,
        userName: actor.userName,
        userRole: actor.userRole,
        actionType: 'ENQUIRY_STATUS',
        description: `Updated enquiry ${this.data.enquiries[idx].enquiryRef} status to ${this.data.enquiries[idx].status}`,
        details: { enquiryId: id, status: this.data.enquiries[idx].status }
      });
    }

    this.saveDatabase();
    return this.data.enquiries[idx];
  }

  // --- QUOTATIONS ---
  public getQuotations(): Quotation[] {
    return [...this.data.quotations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createQuotation(input: Omit<Quotation, 'id' | 'quoteRef' | 'createdAt'>): Quotation {
    const quoteRef = `QUO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newQuo: Quotation = {
      ...input,
      id: `quo_${Date.now()}`,
      quoteRef,
      createdAt: new Date().toISOString()
    };
    this.data.quotations.push(newQuo);
    this.saveDatabase();
    return newQuo;
  }

  public updateQuotation(id: string, updates: Partial<Quotation>): Quotation | undefined {
    const idx = this.data.quotations.findIndex(q => q.id === id);
    if (idx === -1) return undefined;
    this.data.quotations[idx] = { ...this.data.quotations[idx], ...updates };
    this.saveDatabase();
    return this.data.quotations[idx];
  }

  // --- EXPENSES ---
  public getExpenses(): Expense[] {
    return [...this.data.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public createExpense(expense: Omit<Expense, 'id' | 'expenseRef'>, actor: { userId: string; userName: string }): Expense {
    const expenseRef = `EXP-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(100 + Math.random() * 900)}`;
    const newExp: Expense = {
      ...expense,
      id: `exp_${Date.now()}`,
      expenseRef
    };
    this.data.expenses.push(newExp);

    this.recordActivity({
      userId: actor.userId,
      userName: actor.userName,
      userRole: 'admin',
      actionType: 'EXPENSE_RECORDED',
      description: `Recorded expense "${newExp.title}" (₦${newExp.amount.toLocaleString()}) for ${newExp.category}`
    });

    this.saveDatabase();
    return newExp;
  }

  // --- SUPPLIERS ---
  public getSuppliers(): Supplier[] {
    return [...this.data.suppliers];
  }

  public createSupplier(supplier: Omit<Supplier, 'id'>): Supplier {
    const newSup: Supplier = {
      ...supplier,
      id: `sup_${Date.now()}`
    };
    this.data.suppliers.push(newSup);
    this.saveDatabase();
    return newSup;
  }

  // --- ACTIVITY LOGS ---
  public getActivityLogs(limit = 100): ActivityLog[] {
    return [...this.data.activity_logs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  public recordActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
    const newLog: ActivityLog = {
      ...log,
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.data.activity_logs.push(newLog);
    // Keep max 2000 log entries
    if (this.data.activity_logs.length > 2000) {
      this.data.activity_logs = this.data.activity_logs.slice(-2000);
    }
    this.saveDatabase();
    return newLog;
  }

  // --- SETTINGS ---
  public getSettings(): BusinessSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<BusinessSettings>, actor: { userId: string; userName: string }): BusinessSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.recordActivity({
      userId: actor.userId,
      userName: actor.userName,
      userRole: 'admin',
      actionType: 'SETTINGS_UPDATED',
      description: `Updated business settings and company profile`
    });
    this.saveDatabase();
    return this.data.settings;
  }

  // --- COMPREHENSIVE ANALYTICS & REPORTS ---
  public getFinancialReport(range: { startDate?: string; endDate?: string } = {}) {
    const sales = this.getSales(range).filter(s => s.paymentStatus !== 'cancelled');
    const expenses = this.getExpenses();

    let totalRevenue = 0;
    let totalCogs = 0; // Cost of goods sold
    let totalUnitsSold = 0;

    const paymentMethods: Record<string, number> = {
      Cash: 0,
      'Bank Transfer': 0,
      POS: 0,
      'Split Payment': 0
    };

    const staffSalesPerformance: Record<string, { staffName: string; totalRevenue: number; transactionCount: number }> = {};

    for (const sale of sales) {
      totalRevenue += sale.totalAmount;
      paymentMethods[sale.paymentMethod] = (paymentMethods[sale.paymentMethod] || 0) + sale.totalAmount;

      if (!staffSalesPerformance[sale.staffId]) {
        staffSalesPerformance[sale.staffId] = {
          staffName: sale.staffName,
          totalRevenue: 0,
          transactionCount: 0
        };
      }
      staffSalesPerformance[sale.staffId].totalRevenue += sale.totalAmount;
      staffSalesPerformance[sale.staffId].transactionCount += 1;

      for (const item of sale.items) {
        totalCogs += (item.unitCost || 0) * item.quantity;
        totalUnitsSold += item.quantity;
      }
    }

    const grossProfit = totalRevenue - totalCogs;
    const totalOperatingExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = grossProfit - totalOperatingExpenses;

    // Stock asset valuation
    const stockValuation = this.data.products.reduce((acc, p) => acc + (p.purchasePrice * p.stockQuantity), 0);
    const retailStockValuation = this.data.products.reduce((acc, p) => acc + (p.sellingPrice * p.stockQuantity), 0);

    return {
      totalRevenue,
      totalCogs,
      grossProfit,
      totalOperatingExpenses,
      netProfit,
      totalTransactions: sales.length,
      totalUnitsSold,
      stockValuation,
      retailStockValuation,
      paymentMethods,
      staffPerformance: Object.values(staffSalesPerformance),
      lowStockProductsCount: this.data.products.filter(p => p.availabilityStatus === 'low_stock').length,
      outOfStockProductsCount: this.data.products.filter(p => p.availabilityStatus === 'out_of_stock').length,
      totalProductsCount: this.data.products.length,
      totalCustomersCount: this.data.customers.length,
      pendingEnquiriesCount: this.data.enquiries.filter(e => e.status === 'pending').length
    };
  }
}

export const db = new RelationalDatabase();
