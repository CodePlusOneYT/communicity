export type City = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type Neighborhood = {
  id: string;
  city_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type Apartment = {
  id: string;
  neighborhood_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type Floor = {
  id: string;
  apartment_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};
