export type ImageCategory = 'General' | 'Substation Condition' | 'Sticker' | 'Visual Defect' | 'Maintenance Info' | 'Test Sheet' | 'Uncategorized';

export interface ParsedImageInfo {
  category: ImageCategory;
  itemType: string;
  location: string;
  dateTaken: string;
  sequence: string;
  prefix: string;
}

// Valid prefix_shortform combinations based on naming convention
const VALID_COMBINATIONS: Record<string, ImageCategory> = {
  // General
  'gen_logo': 'General',
  
  // Substation Condition
  'sc_substationoverview': 'Substation Condition',
  'sc_signboard': 'Substation Condition',
  'sc_switchgear': 'Substation Condition',
  'sc_switchgearnameplate': 'Substation Condition',
  'sc_transformer': 'Substation Condition',
  'sc_transformernameplate': 'Substation Condition',
  'sc_lvdb': 'Substation Condition',
  'sc_lvdbnameplate': 'Substation Condition',
  'sc_battery': 'Substation Condition',
  'sc_batterynameplate': 'Substation Condition',
  'sc_fireext': 'Substation Condition',
  'sc_efi': 'Substation Condition',
  'sc_sf6': 'Substation Condition',
  
  // Sticker
  'stk_normal': 'Sticker',
  'stk_defect': 'Sticker',
  
  // Visual Defect
  'vi_switchgear': 'Visual Defect',
  'vi_cablepilc': 'Visual Defect',
  'vi_ptx': 'Visual Defect',
  'vi_ltx': 'Visual Defect',
  'vi_lvdb': 'Visual Defect',
  'vi_linkbox': 'Visual Defect',
  'vi_efi': 'Visual Defect',
  'vi_earthing': 'Visual Defect',
  'vi_signboard': 'Visual Defect',
  'vi_fireext': 'Visual Defect',
  'vi_batterycharger': 'Visual Defect',
  'vi_rubbermat': 'Visual Defect',
  'vi_trenching': 'Visual Defect',
  'vi_louver': 'Visual Defect',
  'vi_exhaustfan': 'Visual Defect',
  'vi_lighting': 'Visual Defect',
  'vi_substation': 'Visual Defect',
  'vi_aircond': 'Visual Defect',
  'vi_hpole': 'Visual Defect',
  'vi_firefighting': 'Visual Defect',
  
  // Maintenance Info
  'mi_pmsticker': 'Maintenance Info',
  'mi_rmsticker': 'Maintenance Info',
  'mi_oltt': 'Maintenance Info',
  
  // Test Sheet
  'ts_cbm': 'Test Sheet',
  'ts_vitest': 'Test Sheet',
};

// Validate if filename follows strict {prefix}_{shortform} format
export function isValidNamingFormat(filename: string): boolean {
  const filenameLower = filename.toLowerCase();
  const nameWithoutExt = filenameLower.replace(/\.(jpg|jpeg|png|tif|tiff|pdf)$/i, '');
  
  const parts = nameWithoutExt.split('_');
  
  // Must have at least prefix and shortform
  if (parts.length < 2) return false;
  
  const prefix = parts[0];
  const shortform = parts[1];
  
  // Check if prefix_shortform combination exists in valid combinations
  const prefixShortformCombo = `${prefix}_${shortform}`;
  return VALID_COMBINATIONS.hasOwnProperty(prefixShortformCombo);
}

export function parseImageFilename(filename: string): ParsedImageInfo {
  const filenameLower = filename.toLowerCase();
  const nameWithoutExt = filenameLower.replace(/\.(jpg|jpeg|png|tif|tiff|pdf)$/i, '');

  const parts = nameWithoutExt.split('_');

  const prefix = parts[0] || '';
  const itemType = parts[1] || '';

  // Check if filename follows strict naming format
  const prefixItemCombo = `${prefix}_${itemType}`;
  const isValidFormat = VALID_COMBINATIONS.hasOwnProperty(prefixItemCombo);
  
  // If not valid format, categorize as Uncategorized
  const category = isValidFormat ? VALID_COMBINATIONS[prefixItemCombo] : 'Uncategorized';

  const location = parts[2] || '';
  const dateTaken = parts[3] || '';
  const sequence = parts[4] || '';

  return {
    category,
    itemType,
    location,
    dateTaken,
    sequence,
    prefix,
  };
}

export function getCategoryColor(category: ImageCategory): string {
  const colors: Record<ImageCategory, string> = {
    'General': 'bg-blue-100 text-blue-800',
    'Substation Condition': 'bg-green-100 text-green-800',
    'Sticker': 'bg-yellow-100 text-yellow-800',
    'Visual Defect': 'bg-red-100 text-red-800',
    'Maintenance Info': 'bg-purple-100 text-purple-800',
    'Test Sheet': 'bg-orange-100 text-orange-800',
    'Uncategorized': 'bg-gray-100 text-gray-800',
  };
  return colors[category] || colors['Uncategorized'];
}

export function formatItemType(itemType: string): string {
  if (!itemType) return '';

  return itemType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export const CATEGORIES: ImageCategory[] = [
  'General',
  'Substation Condition',
  'Sticker',
  'Visual Defect',
  'Maintenance Info',
  'Test Sheet',
];

export function isValidFileType(filename: string): boolean {
  const filenameLower = filename.toLowerCase();
  const isPdf = filenameLower.endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|tif|tiff)$/i.test(filenameLower);

  // Check if filename follows strict naming format
  if (!isValidNamingFormat(filename)) {
    return false;
  }

  if (isPdf) {
    const parsed = parseImageFilename(filename);
    return parsed.category === 'Test Sheet';
  }

  if (isImage) {
    const parsed = parseImageFilename(filename);
    return parsed.category !== 'Test Sheet';
  }

  return false;
}
