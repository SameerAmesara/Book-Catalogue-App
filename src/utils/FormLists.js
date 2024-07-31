export const genresOptions = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Biography',
  'History',
  'Fantasy',
  'Mystery',
  'Dystopian',
  'Adventure',
  'Classic',
  'Drama',
  'Romance',
];
export const languagesOptions = [
  'English',
  'French',
  'Spanish',
  'Chinese',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Guajarati',
  'Russian',
  'Japanese',
  'Punjabi',
];

export const getYears = () => {
  let currentYear = new Date().getFullYear();
  let years = [];
  for (let year = 1900; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
};
