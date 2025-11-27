-- Create enum for difficulty levels
CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create enum for word categories
CREATE TYPE public.word_category AS ENUM ('greetings', 'numbers', 'colors', 'food', 'animals', 'travel', 'business', 'daily');

-- Create vocabulary table
CREATE TABLE public.vocabulary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  pronunciation TEXT,
  example_sentence TEXT,
  example_translation TEXT,
  category word_category NOT NULL DEFAULT 'daily',
  difficulty difficulty_level NOT NULL DEFAULT 'beginner',
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  streak_days INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table (tracks which words user has learned)
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocabulary_id UUID NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  mastery_level INTEGER NOT NULL DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
  times_practiced INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, vocabulary_id)
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocabulary_id UUID NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, vocabulary_id)
);

-- Create quiz results table
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category word_category,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Vocabulary is publicly readable
CREATE POLICY "Vocabulary is publicly readable"
  ON public.vocabulary FOR SELECT
  USING (true);

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Quiz results policies
CREATE POLICY "Users can view their own quiz results"
  ON public.quiz_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results"
  ON public.quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_vocabulary_updated_at
  BEFORE UPDATE ON public.vocabulary
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample vocabulary data
INSERT INTO public.vocabulary (word, translation, pronunciation, example_sentence, example_translation, category, difficulty) VALUES
-- Greetings
('Hello', 'Halo', 'heh-loh', 'Hello, how are you?', 'Halo, apa kabar?', 'greetings', 'beginner'),
('Good morning', 'Selamat pagi', 'seh-lah-maht pah-gee', 'Good morning, teacher!', 'Selamat pagi, guru!', 'greetings', 'beginner'),
('Good night', 'Selamat malam', 'seh-lah-maht mah-lahm', 'Good night, sleep well', 'Selamat malam, tidur nyenyak', 'greetings', 'beginner'),
('Thank you', 'Terima kasih', 'teh-ree-mah kah-see', 'Thank you very much', 'Terima kasih banyak', 'greetings', 'beginner'),
('Goodbye', 'Selamat tinggal', 'seh-lah-maht ting-gahl', 'Goodbye, see you tomorrow', 'Selamat tinggal, sampai jumpa besok', 'greetings', 'beginner'),
-- Numbers
('One', 'Satu', 'sah-too', 'I have one apple', 'Saya punya satu apel', 'numbers', 'beginner'),
('Two', 'Dua', 'doo-ah', 'Two cups of coffee', 'Dua cangkir kopi', 'numbers', 'beginner'),
('Three', 'Tiga', 'tee-gah', 'Three brothers', 'Tiga saudara laki-laki', 'numbers', 'beginner'),
('Ten', 'Sepuluh', 'seh-poo-looh', 'Ten fingers', 'Sepuluh jari', 'numbers', 'beginner'),
('Hundred', 'Seratus', 'seh-rah-toos', 'One hundred percent', 'Seratus persen', 'numbers', 'intermediate'),
-- Colors
('Red', 'Merah', 'meh-rah', 'The red apple', 'Apel merah', 'colors', 'beginner'),
('Blue', 'Biru', 'bee-roo', 'Blue sky', 'Langit biru', 'colors', 'beginner'),
('Green', 'Hijau', 'hee-jow', 'Green leaves', 'Daun hijau', 'colors', 'beginner'),
('Yellow', 'Kuning', 'koo-ning', 'Yellow sun', 'Matahari kuning', 'colors', 'beginner'),
('Black', 'Hitam', 'hee-tahm', 'Black cat', 'Kucing hitam', 'colors', 'beginner'),
-- Food
('Rice', 'Nasi', 'nah-see', 'I eat rice every day', 'Saya makan nasi setiap hari', 'food', 'beginner'),
('Water', 'Air', 'ah-eer', 'Drink water', 'Minum air', 'food', 'beginner'),
('Bread', 'Roti', 'roh-tee', 'Fresh bread', 'Roti segar', 'food', 'beginner'),
('Chicken', 'Ayam', 'ah-yahm', 'Fried chicken', 'Ayam goreng', 'food', 'beginner'),
('Fruit', 'Buah', 'boo-ah', 'Fresh fruit', 'Buah segar', 'food', 'beginner'),
-- Animals
('Cat', 'Kucing', 'koo-ching', 'The cat is sleeping', 'Kucing sedang tidur', 'animals', 'beginner'),
('Dog', 'Anjing', 'ahn-jing', 'The dog is barking', 'Anjing sedang menggonggong', 'animals', 'beginner'),
('Bird', 'Burung', 'boo-roong', 'Birds can fly', 'Burung bisa terbang', 'animals', 'beginner'),
('Fish', 'Ikan', 'ee-kahn', 'Fish in the sea', 'Ikan di laut', 'animals', 'beginner'),
('Elephant', 'Gajah', 'gah-jah', 'The elephant is big', 'Gajah itu besar', 'animals', 'intermediate'),
-- Travel
('Airport', 'Bandara', 'bahn-dah-rah', 'Go to the airport', 'Pergi ke bandara', 'travel', 'intermediate'),
('Hotel', 'Hotel', 'hoh-tel', 'Book a hotel', 'Pesan hotel', 'travel', 'beginner'),
('Ticket', 'Tiket', 'tee-ket', 'Buy a ticket', 'Beli tiket', 'travel', 'beginner'),
('Train', 'Kereta', 'keh-reh-tah', 'Take the train', 'Naik kereta', 'travel', 'beginner'),
('Beach', 'Pantai', 'pahn-tai', 'Beautiful beach', 'Pantai yang indah', 'travel', 'beginner'),
-- Daily
('House', 'Rumah', 'roo-mah', 'My house is big', 'Rumah saya besar', 'daily', 'beginner'),
('Family', 'Keluarga', 'keh-loo-ar-gah', 'My family', 'Keluarga saya', 'daily', 'beginner'),
('Friend', 'Teman', 'teh-mahn', 'My best friend', 'Teman terbaik saya', 'daily', 'beginner'),
('Work', 'Kerja', 'ker-jah', 'Go to work', 'Pergi kerja', 'daily', 'beginner'),
('School', 'Sekolah', 'seh-koh-lah', 'Go to school', 'Pergi ke sekolah', 'daily', 'beginner'),
-- Business
('Meeting', 'Rapat', 'rah-paht', 'Business meeting', 'Rapat bisnis', 'business', 'intermediate'),
('Office', 'Kantor', 'kahn-tor', 'Go to the office', 'Pergi ke kantor', 'business', 'beginner'),
('Manager', 'Manajer', 'mah-nah-jer', 'The manager is busy', 'Manajer sedang sibuk', 'business', 'intermediate'),
('Company', 'Perusahaan', 'peh-roo-sah-hahn', 'Big company', 'Perusahaan besar', 'business', 'intermediate'),
('Email', 'Email', 'ee-meyl', 'Send an email', 'Kirim email', 'business', 'beginner');