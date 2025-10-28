# Substation Gallery

A professional image management system designed specifically for substation documentation with strict filename validation and automatic categorization.

## 🎯 Overview

Substation Gallery is a modern web application built with React, TypeScript, and Tailwind CSS that enforces a strict naming convention for uploaded images. It automatically categorizes images based on their filename prefix and provides an organized gallery view for easy management.

## ✨ Features

### 🔐 Authentication
- **Professional login page** with glassmorphism design
- **Modern UI/UX** with smooth animations and transitions
- **Responsive design** that works on all devices

### 📁 File Management
- **Strict filename validation** based on `{prefix}_{shortform}` convention
- **Drag & drop upload** with real-time validation
- **Multiple file selection** with batch processing
- **File type validation** (Images: jpg, png, tif | PDFs for test sheets)

### 🏷️ Automatic Categorization
Images are automatically categorized based on filename prefix:

| Prefix | Category | Color | Examples |
|--------|----------|-------|----------|
| `gen_` | General | 🔵 Blue | `gen_logo_image.jpg` |
| `sc_` | Substation Condition | 🟢 Green | `sc_transformer_location.jpg` |
| `vi_` | Visual Defect | 🔴 Red | `vi_switchgear_image.jpg` |
| `stk_` | Sticker | 🟡 Yellow | `stk_normal_sticker.jpg` |
| `mi_` | Maintenance Info | 🟣 Purple | `mi_pmsticker_info.jpg` |
| `ts_` | Test Sheet | 🟠 Orange | `ts_cbm_test.pdf` |

### 🖼️ Gallery Features
- **Category-based organization** with sectioned views
- **Image previews** with metadata display
- **Individual and bulk deletion** options
- **File size and type information**
- **Responsive grid layout**

### 💾 Data Storage
- **Local storage** for offline functionality
- **No external database required** for basic operation
- **Persistent data** between browser sessions
- **Supabase integration ready** for cloud storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kuci-ai/substation-gallery.git
   cd substation-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📝 Filename Convention

### Required Format
```
{prefix}_{shortform}_[location]_[date]_[sequence].ext
```

### Valid Combinations

#### General
- `gen_logo` - Logo images

#### Substation Condition
- `sc_substationoverview` - Substation overview
- `sc_signboard` - Signboard images
- `sc_switchgear` - Switchgear equipment
- `sc_switchgearnameplate` - Switchgear nameplates
- `sc_transformer` - Transformer equipment
- `sc_transformernameplate` - Transformer nameplates
- `sc_lvdb` - Low voltage distribution board
- `sc_lvdbnameplate` - LVDB nameplates
- `sc_battery` - Battery systems
- `sc_batterynameplate` - Battery nameplates
- `sc_fireext` - Fire extinguisher
- `sc_efi` - EFI systems
- `sc_sf6` - SF6 equipment

#### Visual Defect
- `vi_switchgear` - Switchgear defects
- `vi_cablepilc` - Cable PILC issues
- `vi_ptx` - PTX equipment
- `vi_ltx` - LTX equipment
- `vi_lvdb` - LVDB defects
- `vi_linkbox` - Link box issues
- `vi_efi` - EFI defects
- `vi_earthing` - Earthing problems
- `vi_signboard` - Signboard defects
- `vi_fireext` - Fire extinguisher issues
- `vi_batterycharger` - Battery charger defects
- `vi_rubbermat` - Rubber mat issues
- `vi_trenching` - Trenching problems
- `vi_louver` - Louver defects
- `vi_exhaustfan` - Exhaust fan issues
- `vi_lighting` - Lighting problems
- `vi_substation` - General substation defects
- `vi_aircond` - Air conditioning issues
- `vi_hpole` - H-pole defects
- `vi_firefighting` - Firefighting equipment

#### Sticker
- `stk_normal` - Normal condition stickers
- `stk_defect` - Defect stickers

#### Maintenance Info
- `mi_pmsticker` - Preventive maintenance stickers
- `mi_rmsticker` - Reactive maintenance stickers
- `mi_oltt` - OLTT maintenance

#### Test Sheet
- `ts_cbm` - Condition-based maintenance tests
- `ts_vitest` - Visual inspection tests

### Examples
```
✅ Valid filenames:
- vi_switchgear_image.jpg
- sc_transformer_location_date.jpg
- stk_defect sticker.jpg (spaces allowed)
- ts_cbm_test.pdf

❌ Invalid filenames:
- vi_PTswitchgear_image.jpg (PTswitchgear not in valid combinations)
- vi_KLptx_masalah.jpg (KLptx not in valid combinations)
- random_filename.jpg (no valid prefix_shortform)
```

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Storage**: Local Storage (with Supabase integration ready)

## 📁 Project Structure

```
substation-gallery/
├── src/
│   ├── components/
│   │   ├── AuthForm.tsx          # Login component
│   │   ├── ImageGallery.tsx      # Gallery display
│   │   └── ImageUpload.tsx       # Upload component
│   ├── lib/
│   │   ├── imageParser.ts        # Filename validation logic
│   │   └── supabase.ts          # Database configuration
│   ├── App.tsx                   # Main application
│   └── main.tsx                  # Application entry point
├── supabase/
│   └── migrations/               # Database migrations
├── package.json
└── README.md
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Environment Variables

Create a `.env` file for Supabase integration (optional):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
The application is ready for deployment on modern hosting platforms:

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## 🔮 Future Enhancements

- [ ] Supabase cloud storage integration
- [ ] User authentication and role management
- [ ] Advanced search and filtering
- [ ] Image annotation and markup tools
- [ ] Export functionality
- [ ] Mobile app development
- [ ] API integration for external systems

---

**Built with ❤️ for professional substation management**
