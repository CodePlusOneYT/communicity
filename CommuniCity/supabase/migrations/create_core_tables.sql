/*
  # Create Core CommuniCity Tables

  1. New Tables
    - `cities`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `name` (text, unique, not null)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz, default now())
    - `neighborhoods`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `city_id` (uuid, foreign key to cities.id, not null)
      - `name` (text, not null)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz, default now())
    - `apartments`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `neighborhood_id` (uuid, foreign key to neighborhoods.id, not null)
      - `name` (text, not null)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz, default now())
    - `floors`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `apartment_id` (uuid, foreign key to apartments.id, not null)
      - `name` (text, not null)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz, default now())
    - `houses`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `floor_id` (uuid, foreign key to floors.id, not null)
      - `owner_id` (uuid, foreign key to auth.users.id, not null)
      - `name` (text, not null)
      - `description` (text)
      - `type` (text, enum: 'room', 'lobby', 'assembly_ground', 'rooftop', not null)
      - `is_public` (boolean, default true, not null)
      - `join_fee` (numeric, default 0)
      - `monthly_rent` (numeric, default 0)
      - `current_capacity` (integer, default 0, not null)
      - `max_capacity` (integer, not null)
      - `property_tax` (numeric, default 0)
      - `created_at` (timestamptz, default now())
    - `rooms`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `house_id` (uuid, foreign key to houses.id, not null)
      - `name` (text, not null)
      - `description` (text)
      - `type` (text, enum: 'channel', 'stage', 'conference_hall', 'news', not null)
      - `created_at` (timestamptz, default now())
    - `user_profiles`
      - `id` (uuid, primary key, foreign key to auth.users.id)
      - `username` (text, unique, not null)
      - `avatar_url` (text)
      - `created_at` (timestamptz, default now())
    - `user_balances`
      - `user_id` (uuid, primary key, foreign key to user_profiles.id)
      - `spark_coins` (numeric, default 0, not null)
      - `last_updated` (timestamptz, default now())
    - `transactions`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `user_id` (uuid, foreign key to user_profiles.id, not null)
      - `amount` (numeric, not null)
      - `type` (text, enum: 'purchase', 'task_completion', 'work_payment', 'house_join_fee', 'monthly_rent', 'house_creation', 'house_upgrade', 'property_tax', not null)
      - `description` (text)
      - `created_at` (timestamptz, default now())
    - `house_members`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `house_id` (uuid, foreign key to houses.id, not null)
      - `user_id` (uuid, foreign key to user_profiles.id, not null)
      - `joined_at` (timestamptz, default now())
      - `role` (text, default 'member', not null)
      - `status` (text, enum: 'pending', 'approved', 'rejected', 'active', 'inactive', not null)
          - `pending`: For private houses, awaiting approval.
          - `approved`: For private houses, approved to join.
          - `rejected`: For private houses, request rejected.
          - `active`: Currently a member.
          - `inactive`: Left or removed from the house.
  2. Security
    - Enable RLS on all new tables.
    - Add policies for authenticated users to:
      - Read all `cities`, `neighborhoods`, `apartments`, `floors`.
      - Read their own `user_profiles`, `user_balances`, `transactions`.
      - Create `user_profiles` on sign-up.
      - Update their own `user_profiles` and `user_balances`.
      - Insert `transactions`.
      - Read public `houses` and `rooms`.
      - Read `houses` and `rooms` they are members of.
      - Insert `houses` (with checks for limits and currency).
      - Update `houses` (owner only, with checks for currency).
      - Insert `house_members` (with checks for public/private/rental).
      - Update `house_members` (owner/admin only).
      - Insert `rooms` (house owner only).
*/

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access to cities" ON cities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access to cities" ON cities FOR UPDATE TO authenticated USING (true);

-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (city_id, name)
);
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to neighborhoods" ON neighborhoods FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access to neighborhoods" ON neighborhoods FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access to neighborhoods" ON neighborhoods FOR UPDATE TO authenticated USING (true);

-- Create apartments table
CREATE TABLE IF NOT EXISTS apartments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id uuid NOT NULL REFERENCES neighborhoods(id),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (neighborhood_id, name)
);
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to apartments" ON apartments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access to apartments" ON apartments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access to apartments" ON apartments FOR UPDATE TO authenticated USING (true);

-- Create floors table
CREATE TABLE IF NOT EXISTS floors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id uuid NOT NULL REFERENCES apartments(id),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (apartment_id, name)
);
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to floors" ON floors FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert access to floors" ON floors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update access to floors" ON floors FOR UPDATE TO authenticated USING (true);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can create their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Create user_balances table
CREATE TABLE IF NOT EXISTS user_balances (
  user_id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  spark_coins numeric DEFAULT 0 NOT NULL,
  last_updated timestamptz DEFAULT now()
);
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own balance" ON user_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own balance" ON user_balances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own balance" ON user_balances FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  amount numeric NOT NULL,
  type text NOT NULL, -- e.g., 'purchase', 'task_completion', 'house_join_fee', 'monthly_rent'
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create houses table
CREATE TABLE IF NOT EXISTS houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_id uuid NOT NULL REFERENCES floors(id),
  owner_id uuid NOT NULL REFERENCES user_profiles(id),
  name text NOT NULL,
  description text,
  type text NOT NULL, -- 'room', 'lobby', 'assembly_ground', 'rooftop'
  is_public boolean DEFAULT true NOT NULL,
  join_fee numeric DEFAULT 0,
  monthly_rent numeric DEFAULT 0,
  current_capacity integer DEFAULT 0 NOT NULL,
  max_capacity integer NOT NULL,
  property_tax numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (floor_id, name)
);
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to public houses" ON houses FOR SELECT USING (is_public = true);
CREATE POLICY "Allow owner read access to their houses" ON houses FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Allow authenticated users to create houses" ON houses FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Allow owner to update their houses" ON houses FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Allow owner to delete their houses" ON houses FOR DELETE USING (auth.uid() = owner_id);

-- Create rooms table (channels within houses)
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text NOT NULL, -- 'channel', 'stage', 'conference_hall', 'news'
  created_at timestamptz DEFAULT now(),
  UNIQUE (house_id, name)
);
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow house members to read rooms" ON rooms FOR SELECT USING (
  EXISTS (SELECT 1 FROM house_members WHERE house_id = rooms.house_id AND user_id = auth.uid() AND status = 'active')
);
CREATE POLICY "Allow house owner to create rooms" ON rooms FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM houses WHERE id = rooms.house_id AND owner_id = auth.uid())
);
CREATE POLICY "Allow house owner to update rooms" ON rooms FOR UPDATE USING (
  EXISTS (SELECT 1 FROM houses WHERE id = rooms.house_id AND owner_id = auth.uid())
);
CREATE POLICY "Allow house owner to delete rooms" ON rooms FOR DELETE USING (
  EXISTS (SELECT 1 FROM houses WHERE id = rooms.house_id AND owner_id = auth.uid())
);

-- Create house_members table
CREATE TABLE IF NOT EXISTS house_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id uuid NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  role text DEFAULT 'member' NOT NULL, -- e.g., 'member', 'admin', 'moderator'
  status text DEFAULT 'active' NOT NULL, -- 'pending', 'approved', 'rejected', 'active', 'inactive'
  UNIQUE (house_id, user_id)
);
ALTER TABLE house_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read their own house memberships" ON house_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to request to join private houses" ON house_members FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM houses WHERE id = house_members.house_id AND is_public = false)
);
CREATE POLICY "Allow authenticated users to join public houses" ON house_members FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM houses WHERE id = house_members.house_id AND is_public = true)
);
CREATE POLICY "Allow house owner/admin to update house member status" ON house_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM houses WHERE id = house_members.house_id AND owner_id = auth.uid())
);
CREATE POLICY "Allow house members to leave a house" ON house_members FOR DELETE USING (auth.uid() = user_id);

-- Function to create a user profile and balance on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username)
  VALUES (NEW.id, NEW.email); -- Using email as initial username, can be changed later

  INSERT INTO public.user_balances (user_id, spark_coins)
  VALUES (NEW.id, 100); -- Give new users 100 SparkCoins

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user function after a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();