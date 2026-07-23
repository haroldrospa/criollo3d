export const INITIAL_INVENTORY = [
  {
    id: 'inv-1',
    sku: 'FIL-PLA-BLK-1KG',
    name: 'Filamento PLA Pro Negro 1.75mm (1kg)',
    category: 'Filamentos',
    stock: 14,
    minStock: 5,
    unitCost: 18.50,
    unitPrice: 28.00,
    supplier: 'eSUN / Criollo3D',
    status: 'ok'
  },
  {
    id: 'inv-2',
    sku: 'FIL-PLA-WHT-1KG',
    name: 'Filamento PLA Pro Blanco 1.75mm (1kg)',
    category: 'Filamentos',
    stock: 3,
    minStock: 5,
    unitCost: 18.50,
    unitPrice: 28.00,
    supplier: 'eSUN / Criollo3D',
    status: 'low'
  },
  {
    id: 'inv-3',
    sku: 'FIL-PETG-BLU-1KG',
    name: 'Filamento PETG Azul Translucido (1kg)',
    category: 'Filamentos',
    stock: 8,
    minStock: 4,
    unitCost: 21.00,
    unitPrice: 32.00,
    supplier: 'Sunlu',
    status: 'ok'
  },
  {
    id: 'inv-4',
    sku: 'RES-STD-GRY-1KG',
    name: 'Resina Standard Gris 405nm 8K (1kg)',
    category: 'Resinas',
    stock: 2,
    minStock: 4,
    unitCost: 32.00,
    unitPrice: 48.00,
    supplier: 'Anycubic',
    status: 'low'
  },
  {
    id: 'inv-5',
    sku: 'PRD-WATCH-01',
    name: 'Reloj Criollo Minimalist 3D',
    category: 'Productos Terminado',
    stock: 12,
    minStock: 3,
    unitCost: 14.20,
    unitPrice: 45.00,
    supplier: 'Producción Interna',
    status: 'ok'
  },
  {
    id: 'inv-6',
    sku: 'PRD-LAMP-CYL',
    name: 'Lámpara Voronoi LED RGB',
    category: 'Productos Terminado',
    stock: 5,
    minStock: 2,
    unitCost: 24.80,
    unitPrice: 65.00,
    supplier: 'Producción Interna',
    status: 'ok'
  },
  {
    id: 'inv-7',
    sku: 'ACC-NOZZLE-04',
    name: 'Boquillas de Latón Hardened 0.4mm V6 (Pack 5)',
    category: 'Repuestos',
    stock: 0,
    minStock: 3,
    unitCost: 4.50,
    unitPrice: 12.00,
    supplier: 'Trianglelab',
    status: 'out'
  }
];

export const INITIAL_INVOICES = [
  {
    id: 'COT-2026-001',
    type: 'Cotización',
    clientName: 'Nobel Rafael Minaya',
    clientEmail: 'nobelminaya@gmail.com',
    clientPhone: '849 851 4655',
    date: '7/21/2026',
    dueDate: '8/20/2026',
    deliveryTime: '3 a 5 Días Hábiles',
    shippingAddress: 'Plaza Hache, Segundo Nivel, Av. Estrella Sadhalá, Santiago, RD',
    referenceImage: '/images/cat_robot.png',
    items: [
      { description: 'DJI OSMO Pocket', qty: 5, unitPrice: 200.00, itb: '0%', total: 1000.00 }
    ],
    subtotal: 1000.00,
    tax: 0.00,
    paidAmount: 0.00,
    total: 1000.00,
    status: 'Pendiente'
  },
  {
    id: 'FAC-2026-042',
    type: 'Factura',
    clientName: 'María Rodríguez',
    clientEmail: 'mrodriguez@gmail.com',
    clientPhone: '809 555 1234',
    date: '2026-07-20',
    dueDate: '2026-08-04',
    deliveryTime: 'Inmediata en Taller',
    shippingAddress: 'Santiago de los Caballeros, Rep. Dom.',
    referenceImage: '/images/cat_watch.png',
    items: [
      { description: 'Impresión 3D Engranaje Industrial Nylon', qty: 4, unitPrice: 35.00, itb: '18%', total: 140.00 },
      { description: 'Servicio Post-procesado y pulido', qty: 1, unitPrice: 25.00, itb: '18%', total: 25.00 }
    ],
    subtotal: 165.00,
    tax: 29.70,
    paidAmount: 194.70,
    total: 194.70,
    status: 'Pagada'
  },
  {
    id: 'COT-2026-043',
    type: 'Cotización',
    clientName: 'Arq. Carlos Mendoza',
    clientEmail: 'carlos.mendoza@estudio.com',
    clientPhone: '829 444 9876',
    date: '2026-07-21',
    dueDate: '2026-08-05',
    deliveryTime: '7 Días Hábiles',
    shippingAddress: 'Estudio de Arquitectura, Av. 27 de Febrero, Santiago',
    referenceImage: '/images/prod_suit_torso.png',
    items: [
      { description: 'Maqueta Arquitectónica Completa (Escala 1:100)', qty: 1, unitPrice: 380.00, itb: '18%', total: 380.00 },
      { description: 'Detalles de Edificio en Resina 8K', qty: 3, unitPrice: 45.00, itb: '18%', total: 135.00 }
    ],
    subtotal: 515.00,
    tax: 92.70,
    paidAmount: 250.00,
    total: 607.70,
    status: 'Pendiente'
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'EXP-101',
    date: '2026-07-02',
    category: 'Materia Prima',
    description: 'Compra de 10 Bobinas PLA y 4 Resinas 8K',
    amount: 310.00,
    paymentMethod: 'Transferencia'
  },
  {
    id: 'EXP-102',
    date: '2026-07-10',
    category: 'Energía y Servicios',
    description: 'Servicio Eléctrico Taller de Impresión (Consumo continuo)',
    amount: 145.50,
    paymentMethod: 'Débito Automático'
  },
  {
    id: 'EXP-103',
    date: '2026-07-15',
    category: 'Mantenimiento',
    description: 'Reemplazo de correas GT2 y lámina PEI BambuLab X1C',
    amount: 68.00,
    paymentMethod: 'Tarjeta de Crédito'
  },
  {
    id: 'EXP-104',
    date: '2026-07-18',
    category: 'Software y Licencias',
    description: 'Suscripción mensual CAD & Slicer Pro Cloud',
    amount: 35.00,
    paymentMethod: 'Tarjeta de Crédito'
  }
];

export const PRINT_CALCULATOR_DEFAULTS = {
  filamentCostPerKg: 25.00, // USD / EUR / DOP por kg
  filamentGrams: 180, // gramos por pieza
  printTimeHours: 6.5, // horas de impresión
  powerKwPerHour: 0.35, // 350W potencia consumo
  kwhElectricityCost: 0.18, // costo por kWh
  machineHourlyDepreciation: 0.75, // costo por hora de desgaste de máquina
  laborHours: 0.5, // 30 minutos de calibración/remover soportes
  laborHourlyRate: 15.00, // costo hora hombre
  failureRiskRatePercent: 10, // 10% margen para fallas de impresión
  desiredMarginPercent: 55 // 55% margen de beneficio
};
