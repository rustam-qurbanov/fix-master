export interface Category {
  id: number;
  name: string;
}

export interface PortfolioItem {
  id: number;
  image_url: string;
  description: string | null;
}

export interface MasterProfileCard {
  user_id: string;
  full_name: string;
  city: string;
  price_from: number;
  price_to: number;
  avatar_url: string | null;
  categories: Category[];
}

export interface MasterProfileOut extends MasterProfileCard {
  bio: string | null;
  experience_years: number | null;
  whatsapp: string | null;
  telegram: string | null;
  portfolio_items: PortfolioItem[];
}

export interface MasterProfileUpsert {
  full_name: string;
  bio?: string;
  city: string;
  price_from: number;
  price_to: number;
  experience_years?: number;
  avatar_url?: string;
  whatsapp?: string;
  telegram?: string;
  category_ids: number[];
}

export interface MasterSearchFilters {
  category?: number;
  city?: string;
  price_min?: number;
  price_max?: number;
}
