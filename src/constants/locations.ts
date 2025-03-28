export const LOCATIONS = [
  "Country",
  "City",
  "Street",
  "Building",
  "Room",
  "Time",
] as const;

export type Location = typeof LOCATIONS[number]; 