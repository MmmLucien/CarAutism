import type { SoundQuestion } from '@/hooks/useAudio'

const A = (f: string) =>
  `https://archive.org/download/car-engines/${encodeURIComponent(f)}`

// ─────────────────────────────────────────────────────
// 26 sons vérifiés — archive.org/details/car-engines
// Licence : "Car engine sounds - free use"
// Freesound CC0 pour les sons sport
// ─────────────────────────────────────────────────────

export const SOUND_QUESTIONS: SoundQuestion[] = [

  // ── VOITURES DE ROUTE ────────────────────────────

  {
    id: 'son-001', sujet: 'sons_route',
    soundUrl: A('14 Ferrari Enzo.ogg'),
    car: 'Ferrari Enzo', xp: 320,
    context1: 'Voiture de route · Supercar italienne · V12 atmosphérique 6.0L · 660 ch · 2002–2004',
    context2: 'Supercar italienne · V12 atmosphérique · Début 2000s',
    context3: 'Voiture de route · Italie',
    context4: '?',
    hint: 'Porte le prénom du fondateur, 400 exemplaires produits, moteur dérivé de la F1',
    choices4: ['Ferrari Enzo', 'Ferrari F50', 'Ferrari 599 GTO', 'Lamborghini Murciélago'],
    choices6: ['Ferrari Enzo', 'Ferrari F50', 'Ferrari 599 GTO', 'Lamborghini Murciélago', 'Pagani Zonda', 'McLaren F1'],
    choices8: ['Ferrari Enzo', 'Ferrari F50', 'Ferrari 599 GTO', 'Lamborghini Murciélago', 'Pagani Zonda', 'McLaren F1', 'Bugatti Veyron', 'Maserati MC12'],
  },

  {
    id: 'son-002', sujet: 'sons_route',
    soundUrl: A('3 Ferrari 458.ogg'),
    car: 'Ferrari 458 Italia', xp: 250,
    context1: 'Voiture de route · Ferrari · V8 atmosphérique 4.5L · 570 ch · 2009–2015',
    context2: 'Supercar italienne · V8 atmosphérique · Années 2010',
    context3: 'Voiture de route · Italie',
    context4: '?',
    hint: 'Son V8 atmopshérique hurlant à 9000 tr/min, remplacée par la 488 turbo',
    choices4: ['Ferrari 458 Italia', 'Ferrari 488 GTB', 'Lamborghini Gallardo', 'McLaren 12C'],
    choices6: ['Ferrari 458 Italia', 'Ferrari 488 GTB', 'Lamborghini Gallardo', 'McLaren 12C', 'Ferrari F430', 'Porsche 911 GT3'],
    choices8: ['Ferrari 458 Italia', 'Ferrari 488 GTB', 'Lamborghini Gallardo', 'McLaren 12C', 'Ferrari F430', 'Porsche 911 GT3', 'Audi R8 V10', 'BMW M6'],
  },

  {
    id: 'son-003', sujet: 'sons_route',
    soundUrl: A('15 Lamborghini Countach.ogg'),
    car: 'Lamborghini Countach', xp: 330,
    context1: 'Voiture de route · Supercar italienne · V12 · 1974–1990 · Icône des années 80',
    context2: 'Supercar italienne · V12 · Années 70–90',
    context3: 'Voiture de route · Italie',
    context4: '?',
    hint: 'Portes en ciseaux, poster dans toutes les chambres d\'ados des années 80',
    choices4: ['Lamborghini Countach', 'Lamborghini Diablo', 'Ferrari Testarossa', 'Ferrari F40'],
    choices6: ['Lamborghini Countach', 'Lamborghini Diablo', 'Ferrari Testarossa', 'Ferrari F40', 'Lamborghini Miura', 'Ferrari 512 BB'],
    choices8: ['Lamborghini Countach', 'Lamborghini Diablo', 'Ferrari Testarossa', 'Ferrari F40', 'Lamborghini Miura', 'Ferrari 512 BB', 'De Tomaso Pantera', 'Maserati Bora'],
  },

  {
    id: 'son-004', sujet: 'sons_route',
    soundUrl: A('16 Lamborghini Gallardo.ogg'),
    car: 'Lamborghini Gallardo', xp: 240,
    context1: 'Voiture de route · Supercar italienne · V10 5.0L · 2003–2013 · Le plus vendu Lamborghini',
    context2: 'Supercar italienne · V10 atmosphérique · Années 2000–2010',
    context3: 'Voiture de route · Italie',
    context4: '?',
    hint: 'Le Lamborghini le plus vendu de l\'histoire, précurseur du Huracán',
    choices4: ['Lamborghini Gallardo', 'Lamborghini Huracán', 'Audi R8 V10', 'Ferrari 458'],
    choices6: ['Lamborghini Gallardo', 'Lamborghini Huracán', 'Audi R8 V10', 'Ferrari 458', 'Ferrari 430', 'Porsche 911 GT3'],
    choices8: ['Lamborghini Gallardo', 'Lamborghini Huracán', 'Audi R8 V10', 'Ferrari 458', 'Ferrari 430', 'Porsche 911 GT3', 'McLaren 12C', 'Dodge Viper'],
  },

  {
    id: 'son-005', sujet: 'sons_route',
    soundUrl: A('18 Porsche 911 GT3.ogg'),
    car: 'Porsche 911 GT3', xp: 280,
    context1: 'Voiture de route · Allemagne · Boxer 6 atmosphérique · ~500 ch · Homologuée route et piste',
    context2: 'Voiture de route allemande · Boxer 6 atmosphérique · Version GT',
    context3: 'Voiture de route · Allemagne',
    context4: '?',
    hint: 'Moteur à plat 6 cylindres, 9000 tr/min, aucun turbo, chant mécanique pur',
    choices4: ['Porsche 911 GT3', 'Porsche 911 Turbo', 'Porsche Cayman GT4', 'BMW M4 GTS'],
    choices6: ['Porsche 911 GT3', 'Porsche 911 Turbo', 'Porsche Cayman GT4', 'BMW M4 GTS', 'Ferrari 458', 'Lamborghini Huracán'],
    choices8: ['Porsche 911 GT3', 'Porsche 911 Turbo', 'Porsche Cayman GT4', 'BMW M4 GTS', 'Ferrari 458', 'Lamborghini Huracán', 'McLaren 570S', 'Nissan GT-R Nismo'],
  },

  {
    id: 'son-006', sujet: 'sons_route',
    soundUrl: A('26 Porsche Cayman S.ogg'),
    car: 'Porsche Cayman S', xp: 220,
    context1: 'Voiture de route · Allemagne · Boxer 6 atmosphérique · Coupé mid-engine · Porsche',
    context2: 'Voiture de route allemande · Boxer 6 · Mid-engine',
    context3: 'Voiture de route · Allemagne',
    context4: '?',
    hint: 'Moteur central, frère moins puissant de la 911, souvent considéré mieux équilibré',
    choices4: ['Porsche Cayman S', 'Porsche 911 GT3', 'Porsche Boxster', 'BMW Z4 M'],
    choices6: ['Porsche Cayman S', 'Porsche 911 GT3', 'Porsche Boxster', 'BMW Z4 M', 'Lotus Evora', 'Alfa Romeo 4C'],
    choices8: ['Porsche Cayman S', 'Porsche 911 GT3', 'Porsche Boxster', 'BMW Z4 M', 'Lotus Evora', 'Alfa Romeo 4C', 'Toyota GT86', 'Mazda MX-5'],
  },

  {
    id: 'son-007', sujet: 'sons_route',
    soundUrl: A('23 McLaren MP4-12C.ogg'),
    car: 'McLaren MP4-12C', xp: 300,
    context1: 'Voiture de route · Grande-Bretagne · V8 biturbo 3.8L · 600 ch · 2011–2014 · 1er McLaren moderne',
    context2: 'Supercar britannique · V8 biturbo · Années 2010',
    context3: 'Voiture de route · Grande-Bretagne',
    context4: '?',
    hint: 'Premier McLaren de route depuis la F1, siège à Woking, précurseur du 720S',
    choices4: ['McLaren MP4-12C', 'McLaren 720S', 'Ferrari 458', 'Lamborghini Gallardo'],
    choices6: ['McLaren MP4-12C', 'McLaren 720S', 'Ferrari 458', 'Lamborghini Gallardo', 'Porsche 911 Turbo', 'Audi R8'],
    choices8: ['McLaren MP4-12C', 'McLaren 720S', 'Ferrari 458', 'Lamborghini Gallardo', 'Porsche 911 Turbo', 'Audi R8', 'Mercedes SLS', 'BMW M6'],
  },

  {
    id: 'son-008', sujet: 'sons_route',
    soundUrl: A('5 Pagani Zonda R.ogg'),
    car: 'Pagani Zonda R', xp: 380,
    context1: 'Voiture de piste/route · Italie · V12 Mercedes-AMG 6.0L · ~750 ch · Hypercar artisanale',
    context2: 'Hypercar italienne artisanale · V12 Mercedes-AMG',
    context3: 'Hypercar · Italie',
    context4: '?',
    hint: 'Créée par Horacio Pagani ex-Lamborghini, châssis carbone-titane, moteur AMG',
    choices4: ['Pagani Zonda R', 'Pagani Huayra', 'Koenigsegg CCX', 'McLaren F1'],
    choices6: ['Pagani Zonda R', 'Pagani Huayra', 'Koenigsegg CCX', 'McLaren F1', 'Ferrari Enzo', 'Bugatti Veyron'],
    choices8: ['Pagani Zonda R', 'Pagani Huayra', 'Koenigsegg CCX', 'McLaren F1', 'Ferrari Enzo', 'Bugatti Veyron', 'SSC Ultimate Aero', 'Saleen S7'],
  },

  {
    id: 'son-009', sujet: 'sons_route',
    soundUrl: A('6 Bugatti Veyron.ogg'),
    car: 'Bugatti Veyron', xp: 300,
    context1: 'Voiture de route · France (Molsheim) · W16 quad-turbo 8.0L · 1001 ch · 2005–2015',
    context2: 'Hypercar française · W16 quad-turbo · 1000+ ch',
    context3: 'Hypercar · France',
    context4: '?',
    hint: '1001 ch, 10 radiateurs, première voiture de série à atteindre 400 km/h',
    choices4: ['Bugatti Veyron', 'Bugatti Chiron', 'Koenigsegg Agera', 'Pagani Huayra'],
    choices6: ['Bugatti Veyron', 'Bugatti Chiron', 'Koenigsegg Agera', 'Pagani Huayra', 'SSC Ultimate Aero', 'McLaren F1'],
    choices8: ['Bugatti Veyron', 'Bugatti Chiron', 'Koenigsegg Agera', 'Pagani Huayra', 'SSC Ultimate Aero', 'McLaren F1', 'Ferrari Enzo', 'Lamborghini Murciélago LP 670'],
  },

  {
    id: 'son-010', sujet: 'sons_route',
    soundUrl: A('24 Nissan GT-R R35.ogg'),
    car: 'Nissan GT-R R35', xp: 240,
    context1: 'Voiture de route · Japon · V6 biturbo 3.8L · AWD · 2007–présent · Surnommée Godzilla',
    context2: 'Supercar japonaise · V6 biturbo · AWD · Depuis 2007',
    context3: 'Voiture de route · Japon',
    context4: '?',
    hint: 'Surnommée Godzilla, transmission intégrale ATTESA, humiliait des exotiques 3× plus chères',
    choices4: ['Nissan GT-R R35', 'Honda NSX', 'Toyota Supra', 'Mitsubishi 3000GT'],
    choices6: ['Nissan GT-R R35', 'Honda NSX', 'Toyota Supra', 'Mitsubishi 3000GT', 'Subaru WRX STI', 'Mazda RX-7'],
    choices8: ['Nissan GT-R R35', 'Honda NSX', 'Toyota Supra', 'Mitsubishi 3000GT', 'Subaru WRX STI', 'Mazda RX-7', 'Nissan Skyline R34', 'Toyota GR86'],
  },

  {
    id: 'son-011', sujet: 'sons_route',
    soundUrl: A('22 Mazda RX-8.ogg'),
    car: 'Mazda RX-8', xp: 350,
    context1: 'Voiture de route · Japon · Moteur rotatif Wankel 1.3L birotor · Son très aigu caractéristique · 2003–2012',
    context2: 'Voiture japonaise · Moteur rotatif Wankel · Son aigu',
    context3: 'Voiture de route · Japon',
    context4: '?',
    hint: 'Seul constructeur ayant commercialisé le Wankel rotatif à grande échelle, son unique',
    choices4: ['Mazda RX-8', 'Honda S2000', 'Toyota GT86', 'Nissan 350Z'],
    choices6: ['Mazda RX-8', 'Honda S2000', 'Toyota GT86', 'Nissan 350Z', 'Mazda MX-5', 'Subaru BRZ'],
    choices8: ['Mazda RX-8', 'Honda S2000', 'Toyota GT86', 'Nissan 350Z', 'Mazda MX-5', 'Subaru BRZ', 'Mitsubishi Eclipse', 'Honda Civic Type R'],
  },

  {
    id: 'son-012', sujet: 'sons_route',
    soundUrl: A('1 Aston Martin DBS.ogg'),
    car: 'Aston Martin DBS', xp: 260,
    context1: 'Voiture de route · Grande-Bretagne · V12 atmosphérique 6.0L · GT ultra-luxe · James Bond Casino Royale',
    context2: 'GT britannique · V12 atmosphérique · Ultra-luxe',
    context3: 'Voiture de route · Grande-Bretagne',
    context4: '?',
    hint: 'V12 grondant, voiture de James Bond dans Casino Royale et Quantum of Solace',
    choices4: ['Aston Martin DBS', 'Aston Martin DB9', 'Bentley Continental GT', 'Ferrari 612'],
    choices6: ['Aston Martin DBS', 'Aston Martin DB9', 'Bentley Continental GT', 'Ferrari 612', 'Maserati GranTurismo', 'Jaguar XKR'],
    choices8: ['Aston Martin DBS', 'Aston Martin DB9', 'Bentley Continental GT', 'Ferrari 612', 'Maserati GranTurismo', 'Jaguar XKR', 'Mercedes SL65 AMG', 'BMW 6 Series'],
  },

  {
    id: 'son-013', sujet: 'sons_route',
    soundUrl: A('porsche 918 spyder.ogg'),
    car: 'Porsche 918 Spyder', xp: 360,
    context1: 'Voiture de route · Allemagne · V8 hybride rechargeable · 887 ch total · Hypercar · 2013–2015',
    context2: 'Hypercar allemande · V8 hybride · Moins de 1000 exemplaires',
    context3: 'Hypercar · Allemagne',
    context4: '?',
    hint: 'Trinité des hypercars avec la LaFerrari et la McLaren P1, hybride rechargeable Porsche',
    choices4: ['Porsche 918 Spyder', 'Ferrari LaFerrari', 'McLaren P1', 'Bugatti Veyron SS'],
    choices6: ['Porsche 918 Spyder', 'Ferrari LaFerrari', 'McLaren P1', 'Bugatti Veyron SS', 'Koenigsegg One:1', 'Pagani Huayra BC'],
    choices8: ['Porsche 918 Spyder', 'Ferrari LaFerrari', 'McLaren P1', 'Bugatti Veyron SS', 'Koenigsegg One:1', 'Pagani Huayra BC', 'Lamborghini Sesto Elemento', 'Bugatti Chiron'],
  },

  {
    id: 'son-014', sujet: 'sons_route',
    soundUrl: A('7 Chevrolet Corvette C6.ogg'),
    car: 'Chevrolet Corvette C6', xp: 200,
    context1: 'Voiture de route · USA · V8 6.2L atmosphérique · Muscle car iconique américaine · 2005–2013',
    context2: 'Muscle car américaine · V8 atmosphérique · Années 2000–2010',
    context3: 'Voiture de route · USA',
    context4: '?',
    hint: 'Muscle car américaine emblématique, V8 grondant, toujours propulsion arrière',
    choices4: ['Chevrolet Corvette C6', 'Dodge Viper', 'Ford Mustang GT500', 'Chevrolet Camaro SS'],
    choices6: ['Chevrolet Corvette C6', 'Dodge Viper', 'Ford Mustang GT500', 'Chevrolet Camaro SS', 'Pontiac GTO', 'Dodge Challenger SRT'],
    choices8: ['Chevrolet Corvette C6', 'Dodge Viper', 'Ford Mustang GT500', 'Chevrolet Camaro SS', 'Pontiac GTO', 'Dodge Challenger SRT', 'Chrysler 300 SRT', 'Cadillac CTS-V'],
  },

  {
    id: 'son-015', sujet: 'sons_route',
    soundUrl: A('13 Dodge Viper.ogg'),
    car: 'Dodge Viper', xp: 220,
    context1: 'Voiture de route · USA · V10 8.4L atmosphérique · ~640 ch · Brutale, sans ESP · 1992–2017',
    context2: 'Supercar américaine · V10 atmosphérique · Brutale',
    context3: 'Voiture de route · USA',
    context4: '?',
    hint: 'V10 de camion adapté en supercar, réputation de voiture tueuse de pilotes inexpérimentés',
    choices4: ['Dodge Viper', 'Chevrolet Corvette Z06', 'Ford GT', 'Shelby GT500'],
    choices6: ['Dodge Viper', 'Chevrolet Corvette Z06', 'Ford GT', 'Shelby GT500', 'Dodge Challenger Hellcat', 'Pontiac GTO'],
    choices8: ['Dodge Viper', 'Chevrolet Corvette Z06', 'Ford GT', 'Shelby GT500', 'Dodge Challenger Hellcat', 'Pontiac GTO', 'Chevrolet Camaro Z/28', 'Cadillac CTS-V Coupe'],
  },

  {
    id: 'son-016', sujet: 'sons_route',
    soundUrl: A('4 BMW v10.ogg'),
    car: 'BMW M5 V10 (E60)', xp: 300,
    context1: 'Voiture de route · Allemagne · V10 5.0L atmosphérique · 507 ch · BMW M5 E60 · 2005–2010',
    context2: 'Berline sportive allemande · V10 atmosphérique · Rare',
    context3: 'Voiture de route · Allemagne',
    context4: '?',
    hint: 'Unique berline de série avec V10 atmosphérique, montant jusqu\'à 8250 tr/min',
    choices4: ['BMW M5 V10 (E60)', 'BMW M3 V8', 'Audi RS6 V10', 'Mercedes E63 AMG'],
    choices6: ['BMW M5 V10 (E60)', 'BMW M3 V8', 'Audi RS6 V10', 'Mercedes E63 AMG', 'Porsche Panamera Turbo', 'Cadillac CTS-V'],
    choices8: ['BMW M5 V10 (E60)', 'BMW M3 V8', 'Audi RS6 V10', 'Mercedes E63 AMG', 'Porsche Panamera Turbo', 'Cadillac CTS-V', 'Jaguar XFR', 'Maserati Quattroporte'],
  },

  {
    id: 'son-017', sujet: 'sons_route',
    soundUrl: A('12 Mercedes Benz C63 AMG.ogg'),
    car: 'Mercedes C63 AMG', xp: 200,
    context1: 'Voiture de route · Allemagne · V8 6.2L atmosphérique · 457 ch · Berline sport compacte · 2007–2014',
    context2: 'Berline sportive allemande · V8 atmosphérique',
    context3: 'Voiture de route · Allemagne',
    context4: '?',
    hint: 'V8 AMG 6.2L naturellement aspiré, son rauque caractéristique, rival BMW M3',
    choices4: ['Mercedes C63 AMG', 'BMW M3', 'Audi RS4', 'Cadillac ATS-V'],
    choices6: ['Mercedes C63 AMG', 'BMW M3', 'Audi RS4', 'Cadillac ATS-V', 'Alfa Romeo Giulia QV', 'Jaguar XE SV Project 8'],
    choices8: ['Mercedes C63 AMG', 'BMW M3', 'Audi RS4', 'Cadillac ATS-V', 'Alfa Romeo Giulia QV', 'Jaguar XE SV Project 8', 'Lexus IS-F', 'Volvo S60 Polestar'],
  },

  {
    id: 'son-018', sujet: 'sons_route',
    soundUrl: A('2 Toyota Supra 950.ogg'),
    car: 'Toyota Supra', xp: 220,
    context1: 'Voiture de route · Japon · 6 cyl. en ligne biturbo · Légende JDM · Tuning icon',
    context2: 'Sport japonaise · 6 cyl. en ligne biturbo · Légende JDM',
    context3: 'Voiture de route · Japon',
    context4: '?',
    hint: 'JDM icon des années 90, moteur 2JZ capable de 1000 ch en tuning, Fast & Furious',
    choices4: ['Toyota Supra', 'Nissan Skyline GT-R', 'Mazda RX-7', 'Honda NSX'],
    choices6: ['Toyota Supra', 'Nissan Skyline GT-R', 'Mazda RX-7', 'Honda NSX', 'Mitsubishi 3000GT', 'Lexus SC400'],
    choices8: ['Toyota Supra', 'Nissan Skyline GT-R', 'Mazda RX-7', 'Honda NSX', 'Mitsubishi 3000GT', 'Lexus SC400', 'Subaru SVX', 'Toyota MR2 Turbo'],
  },

  // ── SPORT AUTO ───────────────────────────────────

  {
    id: 'son-019', sujet: 'sons_sport',
    soundUrl: A('19 Porsche 997 GT3 RS.ogg'),
    car: 'Porsche 997 GT3 RS (endurance GT3)', xp: 300,
    context1: 'Sport Auto · Endurance · Catégorie GT3 · Porsche 997 GT3 RS · Boxer 6 atmosphérique',
    context2: 'Endurance · Catégorie GT3 · Constructeur allemand',
    context3: 'Sport Auto · Endurance',
    context4: '?',
    hint: 'GT3 = catégorie endurance accessible, Porsche y domine depuis des décennies',
    choices4: ['Porsche 997 GT3 RS (GT3)', 'Ferrari 488 GT3', 'BMW M6 GT3', 'Lamborghini Huracán GT3'],
    choices6: ['Porsche 997 GT3 RS (GT3)', 'Ferrari 488 GT3', 'BMW M6 GT3', 'Lamborghini Huracán GT3', 'Mercedes AMG GT3', 'Aston Martin V8 GT3'],
    choices8: ['Porsche 997 GT3 RS (GT3)', 'Ferrari 488 GT3', 'BMW M6 GT3', 'Lamborghini Huracán GT3', 'Mercedes AMG GT3', 'Aston Martin V8 GT3', 'McLaren 720S GT3', 'Bentley Continental GT3'],
  },

  {
    id: 'son-020', sujet: 'sons_sport',
    soundUrl: A('21 Subaru Impreza WRX.ogg'),
    car: 'Subaru Impreza WRX STI (WRC)', xp: 280,
    context1: 'Sport Auto · Rallye WRC · Subaru · Boxer 4 biturbo AWD · Champion McRae 1995 · Solberg 2003',
    context2: 'Rallye WRC · Boxer 4 biturbo AWD · Équipe bleue et or',
    context3: 'Sport Auto · Rallye WRC',
    context4: '?',
    hint: 'Son de bulle "ploploploplopplop" du Boxer 4 Subaru, bleu et or, Colin McRae',
    choices4: ['Subaru Impreza WRX STI', 'Mitsubishi Lancer Evo WRC', 'Citroën Xsara WRC', 'Ford Focus WRC'],
    choices6: ['Subaru Impreza WRX STI', 'Mitsubishi Lancer Evo WRC', 'Citroën Xsara WRC', 'Ford Focus WRC', 'Peugeot 206 WRC', 'Toyota Corolla WRC'],
    choices8: ['Subaru Impreza WRX STI', 'Mitsubishi Lancer Evo WRC', 'Citroën Xsara WRC', 'Ford Focus WRC', 'Peugeot 206 WRC', 'Toyota Corolla WRC', 'SEAT Cordoba WRC', 'Hyundai Accent WRC'],
  },

  {
    id: 'son-021', sujet: 'sons_sport',
    soundUrl: A('17 Mitsubishi Lancer EVO RS Turbo.ogg'),
    car: 'Mitsubishi Lancer Evolution (WRC)', xp: 270,
    context1: 'Sport Auto · Rallye WRC · Mitsubishi · 4 cyl. en ligne turbo AWD · Rival direct du Subaru WRX',
    context2: 'Rallye WRC · 4 cyl. turbo AWD · Rival japonais du Subaru',
    context3: 'Sport Auto · Rallye WRC',
    context4: '?',
    hint: 'Rival historique du Subaru WRX STI en WRC, champion avec Tommi Mäkinen',
    choices4: ['Mitsubishi Lancer Evolution', 'Subaru Impreza WRX', 'Toyota Celica GT-Four', 'Ford Focus WRC'],
    choices6: ['Mitsubishi Lancer Evolution', 'Subaru Impreza WRX', 'Toyota Celica GT-Four', 'Ford Focus WRC', 'Citroën Xsara WRC', 'Peugeot 206 WRC'],
    choices8: ['Mitsubishi Lancer Evolution', 'Subaru Impreza WRX', 'Toyota Celica GT-Four', 'Ford Focus WRC', 'Citroën Xsara WRC', 'Peugeot 206 WRC', 'SEAT Cordoba WRC', 'Skoda Fabia WRC'],
  },

  {
    id: 'son-022', sujet: 'sons_sport',
    soundUrl: A('20 Shelby GT500.ogg'),
    car: 'Shelby GT500 (NASCAR / Muscle)', xp: 200,
    context1: 'Sport Auto · USA · NASCAR / Muscle · V8 compressé · Son américain pur',
    context2: 'Sport Auto américain · V8 · Muscle racing',
    context3: 'Sport Auto · USA',
    context4: '?',
    hint: 'V8 américain suralimenté, bruit de tonnerre, icône du muscle car racing',
    choices4: ['Shelby GT500', 'Dodge Viper ACR', 'Chevrolet Corvette Z06', 'Ford GT (2005)'],
    choices6: ['Shelby GT500', 'Dodge Viper ACR', 'Chevrolet Corvette Z06', 'Ford GT (2005)', 'Chevrolet Camaro Z/28', 'Pontiac GTO Judge'],
    choices8: ['Shelby GT500', 'Dodge Viper ACR', 'Chevrolet Corvette Z06', 'Ford GT (2005)', 'Chevrolet Camaro Z/28', 'Pontiac GTO Judge', 'Dodge Challenger Hellcat', 'Cadillac CTS-V Race'],
  },

  {
    id: 'son-023', sujet: 'sons_sport',
    soundUrl: A('27 Toyota GT86.ogg'),
    car: 'Toyota GT86 / Subaru BRZ', xp: 180,
    context1: 'Voiture de sport · Japon · Boxer 4 atmosphérique · Conçue pour le drift et le circuit · 2012–présent',
    context2: 'Sport japonaise légère · Boxer 4 atmosphérique · Drift / Circuit',
    context3: 'Voiture de sport · Japon',
    context4: '?',
    hint: 'Co-développée par Toyota et Subaru, moteur à plat, légère et équilibrée, culte en drift',
    choices4: ['Toyota GT86 / Subaru BRZ', 'Mazda MX-5', 'Honda S2000', 'Lotus Elise'],
    choices6: ['Toyota GT86 / Subaru BRZ', 'Mazda MX-5', 'Honda S2000', 'Lotus Elise', 'Mini Cooper JCW', 'Renault Mégane RS'],
    choices8: ['Toyota GT86 / Subaru BRZ', 'Mazda MX-5', 'Honda S2000', 'Lotus Elise', 'Mini Cooper JCW', 'Renault Mégane RS', 'VW Golf GTI', 'Ford Focus RS'],
  },

  // Freesound CC0 — F1
  {
    id: 'son-024', sujet: 'sons_sport',
    soundUrl: 'https://freesound.org/data/previews/540/540672_5674468-lq.mp3',
    car: 'Formule 1 V10 (2000–2005)', xp: 380,
    context1: 'Sport Auto · Formule 1 · Moteur V10 naturellement aspiré · ~900 ch · 19 000 tr/min · Saisons 2000–2005',
    context2: 'Formule 1 · V10 naturellement aspiré · Ère Schumacher / Alonso',
    context3: 'Sport Auto · Formule 1',
    context4: '?',
    hint: 'Son le plus emblématique de la F1, V10 hurlant à 19 000 tr/min, interdit après 2005',
    choices4: ['F1 V10 (2000–2005)', 'F1 V8 (2006–2013)', 'F1 V6 hybride (2014+)', 'IndyCar V6'],
    choices6: ['F1 V10 (2000–2005)', 'F1 V8 (2006–2013)', 'F1 V6 hybride (2014+)', 'IndyCar V6', 'Formule 2', 'Formula E'],
    choices8: ['F1 V10 (2000–2005)', 'F1 V8 (2006–2013)', 'F1 V6 hybride (2014+)', 'IndyCar V6', 'Formule 2', 'Formula E', 'Formule 3', 'Formule Renault'],
  },
]

// Helpers
export function getSoundContext(q: SoundQuestion, level: 1 | 2 | 3 | 4): string {
  const map = { 1: q.context1, 2: q.context2, 3: q.context3, 4: q.context4 }
  return map[level]
}

export const SOUND_QUESTIONS_ROUTE = SOUND_QUESTIONS.filter(q => q.sujet === 'sons_route')
export const SOUND_QUESTIONS_SPORT = SOUND_QUESTIONS.filter(q => q.sujet === 'sons_sport')
