export const CATEGORIES = [
  { id: 'all', name: 'Todos los Productos' },
  { id: 'toys', name: 'Figuras & Pop Personalizados' },
  { id: 'home', name: 'Hogar, Salud & Oficina' },
  { id: 'custom', name: 'Prototipos & Consultorios' },
  { id: 'apparel', name: 'Apparel & Accesorios' }
];

export const PRODUCTS = [
  {
    id: 'prod-funko-grandma',
    name: 'Figura Pop Custom "El Amor Nunca Muere"',
    category: 'toys',
    price: 54.00,
    rating: 5.0,
    reviewsCount: 64,
    image: '/images/prod_funko_grandma.png',
    badge: 'Destacado Personalizado',
    description: 'Figura 3D personalizada tipo Pop de abuelita sentada con ramo de flores azules y base negra grabada "El amor nunca muere". Pintada minuciosamente a mano.',
    materials: ['Resina SLA Alta Definición', 'PLA Fino 0.08mm'],
    colors: ['#0055FF', '#111827', '#FFFFFF'],
    dimensions: '16cm x 12cm x 12cm',
    inStock: true
  },
  {
    id: 'prod-dental-teeth',
    name: 'Organizador Dental Molar "Clínica Dental"',
    category: 'custom',
    price: 28.50,
    rating: 4.9,
    reviewsCount: 38,
    image: '/images/prod_dental_teeth.png',
    badge: 'Salud & Odontología',
    description: 'Porta-lápices 3D en forma de molar/diente blanco con personalización de logo corporativo y grabado de doctor para consultorios odontológicos.',
    materials: ['PETG Higiénico', 'PLA White Premium'],
    colors: ['#FFFFFF', '#0055FF', '#111827'],
    dimensions: '14cm x 10cm x 10cm',
    inStock: true
  },
  {
    id: 'prod-heart-penholder',
    name: 'Lapicero Corazón Anatómico Rojo',
    category: 'home',
    price: 35.00,
    rating: 5.0,
    reviewsCount: 51,
    image: '/images/prod_heart_penholder.png',
    badge: 'Más Vendido',
    description: 'Escultura de escritorio funcional en forma de corazón anatómico en rojo carmesí brillante, diseñado para sostener bolígrafos y lápices en la aorta y arterias.',
    materials: ['PLA Silk Red', 'Resina Tough SLA'],
    colors: ['#EF4444', '#0055FF', '#17181C'],
    dimensions: '15cm x 12cm x 10cm',
    inStock: true
  },
  {
    id: 'prod-suit-torso',
    name: 'Escultura / Organizador Traje Ejecutivo',
    category: 'home',
    price: 39.00,
    rating: 4.8,
    reviewsCount: 29,
    image: '/images/prod_suit_torso.png',
    badge: 'Edición Ejecutiva',
    description: 'Busto decorativo de escritorio con forma de traje de vestir masculino, saco en gris satinado, corbata negra y detalles dorados. Elegante organizador.',
    materials: ['PLA Matte', 'PETG Premium'],
    colors: ['#4B5563', '#111827', '#FFFFFF'],
    dimensions: '18cm x 13cm x 10cm',
    inStock: true
  },
  {
    id: 'prod-funko-father-son',
    name: 'Set Figuras Pop Padre e Hijo "Gabriel y Edgar"',
    category: 'toys',
    price: 85.00,
    rating: 5.0,
    reviewsCount: 73,
    image: '/images/prod_funko_father_son.png',
    badge: 'Día del Padre Custom',
    description: 'Set duplo de figuras 3D estilo Pop personalizadas de Padre e Hijo sobre peana con grabado láser "Gabriel y Edgar". Regalo emotivo hecho a medida.',
    materials: ['Resina SLA Micro', 'PLA Ultra Detail'],
    colors: ['#0055FF', '#111827', '#F59E0B'],
    dimensions: '18cm x 16cm x 12cm',
    inStock: true
  },
  {
    id: 'prod-1',
    name: 'Criollo Watch 3D Minimal',
    category: 'apparel',
    price: 45.00,
    rating: 4.9,
    reviewsCount: 28,
    image: '/images/cat_watch.png',
    badge: 'Popular',
    description: 'Reloj ergonómico con correa y caja impresa en 3D en resina de alta precisión de color azul vibrante. Resistente al agua y ultra ligero.',
    materials: ['PLA Ultra', 'Resina Tough', 'PETG Premium'],
    colors: ['#0055FF', '#111827', '#FFFFFF'],
    dimensions: '42mm x 42mm x 10mm',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Escultura Infinity Rings',
    category: 'home',
    price: 65.00,
    rating: 5.0,
    reviewsCount: 42,
    image: '/images/cat_rings.png',
    badge: 'Best Seller',
    description: 'Escultura geométrica de anillos entrelazados en acabado negro mate carbonatado. Pieza de diseño vanguardista para salas y oficinas.',
    materials: ['PLA Carbon Fiber', 'PETG Matte', 'Resina SLA'],
    colors: ['#111827', '#0055FF', '#9CA3AF'],
    dimensions: '18cm x 15cm x 15cm',
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'Robot Cubo Articulado 3D',
    category: 'toys',
    price: 29.99,
    rating: 4.8,
    reviewsCount: 35,
    image: '/images/cat_robot.png',
    badge: 'Nuevo',
    description: 'Figura articulada de robot retro futurista impreso en 3D en una sola pieza (Print-in-place) en color azul brillante con articulaciones móviles.',
    materials: ['PLA Silk', 'PETG High Speed'],
    colors: ['#0055FF', '#F59E0B', '#10B981'],
    dimensions: '12cm x 8cm x 6cm',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'Busto Clásico David 3D White',
    category: 'toys',
    price: 89.00,
    rating: 5.0,
    reviewsCount: 56,
    image: '/images/hero_david_white.png',
    badge: 'Icono Criollo3D',
    description: 'Réplica de alta fidelidad del busto clásico de Miguel Ángel, impreso en 3D con altura de capa super fina de 0.08mm para un acabado continuo como mármol.',
    materials: ['Resina Mármol White', 'PLA Fino 0.08mm'],
    colors: ['#FFFFFF', '#111827', '#0055FF'],
    dimensions: '28cm x 18cm x 16cm',
    inStock: true
  }
];

export const FEATURED_COLLECTIONS = [
  {
    id: 'toys',
    title: 'Pop & Figuras Custom',
    subtitle: 'Piezas personalizadas emotivas',
    image: '/images/prod_funko_grandma.png',
    buttonText: 'SHOP NOW'
  },
  {
    id: 'home',
    title: 'Hogar & Salud',
    subtitle: 'Organizadores únicos y funcionales',
    image: '/images/prod_heart_penholder.png',
    buttonText: 'SHOP NOW'
  },
  {
    id: 'custom',
    title: 'Consultorios & Prototipos',
    subtitle: 'Piezas corporativas a medida',
    image: '/images/prod_dental_teeth.png',
    buttonText: 'SHOP NOW'
  }
];
