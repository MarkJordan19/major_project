export interface StockGalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  spaceType: "Residential" | "Commercial" | "Office";
  roomType: string;
  location: string;
}

export const stockGallery: StockGalleryImage[] = [
  {
    id: "stock-1",
    title: "Warm Minimal Living Room",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    alt: "Warm neutral living room with layered textures and modern furniture",
    spaceType: "Residential",
    roomType: "Living Room",
    location: "Urban Apartment",
  },
  {
    id: "stock-2",
    title: "Soft Contemporary Bedroom",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1100&q=80&sat=-10",
    alt: "Contemporary bedroom with soft colors and natural light",
    spaceType: "Residential",
    roomType: "Bedroom",
    location: "Private Residence",
  },
  {
    id: "stock-3",
    title: "Modern Open Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    alt: "Modern kitchen with wood finishes, pendant lights, and open shelving",
    spaceType: "Residential",
    roomType: "Kitchen",
    location: "Family Home",
  },
  {
    id: "stock-4",
    title: "Boutique Dining Experience",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
    alt: "Boutique commercial dining interior with elegant seating and ambient lighting",
    spaceType: "Commercial",
    roomType: "Dining Area",
    location: "Hospitality Space",
  },
  {
    id: "stock-5",
    title: "Collaborative Office Lounge",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    alt: "Contemporary office lounge with collaborative seating and bright workspace",
    spaceType: "Office",
    roomType: "Work Lounge",
    location: "Creative Office",
  },
  {
    id: "stock-6",
    title: "Executive Workspace",
    imageUrl: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1400&q=80",
    alt: "Executive office interior with clean lines and premium finishes",
    spaceType: "Office",
    roomType: "Office",
    location: "Corporate Suite",
  },
  {
    id: "stock-7",
    title: "Luxury Bathroom Mood",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&hue=20",
    alt: "Luxury bathroom inspiration with calming tones and refined materials",
    spaceType: "Residential",
    roomType: "Bathroom",
    location: "Penthouse Residence",
  },
  {
    id: "stock-8",
    title: "Retail Display Interior",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
    alt: "Retail interior with curated display lighting and warm wood detailing",
    spaceType: "Commercial",
    roomType: "Retail Floor",
    location: "Lifestyle Store",
  },
];
