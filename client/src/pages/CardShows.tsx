/**
 * Card Shows Directory - Sports card shows across the lower 48 states
 * March 1 - December 31, 2026
 * Organized A-Z by state with date sorting
 */

import { useState, useMemo, useRef } from "react";
import { MapPin, Calendar, Clock, DollarSign, Users, Search, ChevronDown, ChevronUp, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

// ===== TYPES =====
interface CardShow {
  name: string;
  date: string;       // Display date string
  sortDate: string;   // YYYY-MM-DD for sorting
  endDate?: string;   // For multi-day shows
  venue: string;
  city: string;
  state: string;
  stateAbbr: string;
  hours?: string;
  tables?: string;
  admission?: string;
  contact?: string;
  featured?: boolean;
}

// ===== SHOW DATA =====
// Compiled from Sports Collectors Digest, TCDB, and major show promoters
// Coverage: March 1 - December 31, 2026
const CARD_SHOWS: CardShow[] = [
  // ALABAMA
  { name: "Alabama Coin Traders Card Coin & Collectibles Trade Show", date: "Mar 20-22", sortDate: "2026-03-20", venue: "Gadsden Mall", city: "Gadsden", state: "Alabama", stateAbbr: "AL", hours: "Fri-Sat 11am-8pm; Sun 12-6pm", tables: "80", admission: "Free" },
  { name: "Muscle Shoals Sportscards & Memorabilia Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Clarion Inn", city: "Sheffield", state: "Alabama", stateAbbr: "AL", hours: "8am-2pm", tables: "30", admission: "Free" },
  { name: "All Sports: Nothing But Sports Cards Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Gardendale Civic Center", city: "Gardendale", state: "Alabama", stateAbbr: "AL", hours: "10am-4pm", tables: "75+", admission: "$5" },
  { name: "The Flip Sports Card & Collectibles Trade Show", date: "Mar 28-29", sortDate: "2026-03-28", venue: "Von Braun Center", city: "Huntsville", state: "Alabama", stateAbbr: "AL", hours: "10am-5pm", tables: "300+", admission: "$7", featured: true },
  { name: "Rickwood Field Card Show", date: "Apr 18", sortDate: "2026-04-18", venue: "Rickwood Field", city: "Birmingham", state: "Alabama", stateAbbr: "AL", hours: "9am-4pm", tables: "20", admission: "Free" },
  { name: "Sheffield Muscle Shoals Sportscards Show", date: "Apr 18", sortDate: "2026-04-18", venue: "Clarion Inn", city: "Sheffield", state: "Alabama", stateAbbr: "AL", hours: "8am-2pm", tables: "30", admission: "Free" },

  // ARIZONA
  { name: "Diamond in the Ruff Sports Card Show", date: "Apr 4", sortDate: "2026-04-04", venue: "SCW Foundation Webb/Powell Rooms", city: "Sun City West", state: "Arizona", stateAbbr: "AZ", hours: "1-5pm", tables: "60", admission: "Free" },
  { name: "Diamond in the Ruff Sports Card Show", date: "Apr 12", sortDate: "2026-04-12", venue: "SCW Foundation Webb/Powell Rooms", city: "Sun City West", state: "Arizona", stateAbbr: "AZ", hours: "1-5pm", tables: "60", admission: "Free" },
  { name: "Diamond in the Ruff Sports Card Show", date: "May 24", sortDate: "2026-05-24", venue: "SCW Foundation Webb/Powell Rooms", city: "Sun City West", state: "Arizona", stateAbbr: "AZ", hours: "1-5pm", tables: "60", admission: "Free" },

  // ARKANSAS
  { name: "Vintage Sports Collectibles Show", date: "Apr 30 - May 3", sortDate: "2026-04-30", venue: "Central Mall", city: "Ft. Smith", state: "Arkansas", stateAbbr: "AR", hours: "Thu-Sat 10am-7pm; Sun 12-5pm", tables: "50", admission: "Free" },

  // CALIFORNIA
  { name: "OC Card Show", date: "Mar 21-22", sortDate: "2026-03-21", venue: "The Costa Mesa Building, OC Fair", city: "Costa Mesa", state: "California", stateAbbr: "CA", hours: "11am-5pm", tables: "350", admission: "$10-15", featured: true },
  { name: "San Jose Card Show", date: "Mar 21-22", sortDate: "2026-03-21", venue: "DoubleTree by Hilton San Jose", city: "San Jose", state: "California", stateAbbr: "CA", hours: "10am-5pm", tables: "120", admission: "$10" },
  { name: "OC Card Show", date: "Mar 27", sortDate: "2026-03-27", venue: "Ambassador Event Center", city: "Irvine", state: "California", stateAbbr: "CA", hours: "10am-4pm", tables: "100", admission: "Free" },
  { name: "Silicon Valley Cards & Collectibles Show", date: "Mar 28-29", sortDate: "2026-03-28", venue: "1600 Saratoga Ave.", city: "San Jose", state: "California", stateAbbr: "CA", hours: "11am-6pm", tables: "275", admission: "Free" },
  { name: "Shasta Sports & Trading Card Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Shasta District Fairgrounds", city: "Anderson", state: "California", stateAbbr: "CA", hours: "10am-5pm", tables: "100", admission: "$5" },
  { name: "Capital City Card Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Citrus Heights Events Center", city: "Citrus Heights", state: "California", stateAbbr: "CA", hours: "10am-5pm", tables: "100+", admission: "$5" },
  { name: "Cards & Collectibles Show", date: "Apr 11-12", sortDate: "2026-04-11", venue: "Crowne Plaza SF Airport", city: "Burlingame", state: "California", stateAbbr: "CA", hours: "10am-6pm", tables: "120", admission: "$10" },
  { name: "SD Card Show", date: "Apr 12", sortDate: "2026-04-12", venue: "DoubleTree by Hilton", city: "San Diego", state: "California", stateAbbr: "CA", hours: "10am-4pm", tables: "100", admission: "Free" },
  { name: "San Jose Card Show", date: "Apr 18-19", sortDate: "2026-04-18", venue: "DoubleTree by Hilton San Jose", city: "San Jose", state: "California", stateAbbr: "CA", hours: "10am-5pm", tables: "120", admission: "$10" },
  { name: "East Bay Card Show", date: "Apr 25-26", sortDate: "2026-04-25", venue: "Hyatt Regency SF Airport", city: "Burlingame", state: "California", stateAbbr: "CA", hours: "Sat 9:30am-5pm; Sun 10am-4pm", tables: "200", admission: "$10" },
  { name: "Front Row Card Show", date: "Apr 25-26", sortDate: "2026-04-25", venue: "Town & Country Resort", city: "San Diego", state: "California", stateAbbr: "CA", hours: "11am-5pm", tables: "425", admission: "$10", featured: true },
  { name: "SD Card Show", date: "May 2-3", sortDate: "2026-05-02", venue: "DoubleTree by Hilton", city: "San Diego", state: "California", stateAbbr: "CA", hours: "10am-4pm", tables: "140", admission: "Free" },
  { name: "Silicon Valley Cards & Collectibles Show", date: "May 16-17", sortDate: "2026-05-16", venue: "1600 Saratoga Ave.", city: "San Jose", state: "California", stateAbbr: "CA", hours: "11am-6pm", tables: "275", admission: "Free" },
  { name: "Front Row Card Show", date: "May 23-24", sortDate: "2026-05-23", venue: "Pasadena Convention Center", city: "Pasadena", state: "California", stateAbbr: "CA", hours: "11am-5pm", tables: "540", admission: "$10", featured: true },
  { name: "Elk Grove Card Show", date: "May 23-24", sortDate: "2026-05-23", venue: "Soccer World", city: "Elk Grove", state: "California", stateAbbr: "CA", hours: "Sat 9am-6pm; Sun 9am-4pm", tables: "150", admission: "$5" },
  { name: "Sports Cards & Collectibles Show", date: "May 30", sortDate: "2026-05-30", venue: "Wyndham Sacramento", city: "Sacramento", state: "California", stateAbbr: "CA", hours: "9am-4pm", tables: "120", admission: "$1" },
  { name: "Capital City Card Show", date: "Jul 11", sortDate: "2026-07-11", venue: "Win-River Casino", city: "Redding", state: "California", stateAbbr: "CA", hours: "10am-6pm", tables: "100", admission: "$5" },

  // COLORADO
  { name: "SoCo Card Show", date: "Apr 25", sortDate: "2026-04-25", venue: "Pueblo Community College Ballroom", city: "Pueblo", state: "Colorado", stateAbbr: "CO", hours: "9am-4pm", tables: "90+", admission: "Free" },

  // CONNECTICUT
  { name: "Plainville Sportscard Show", date: "Mar 21", sortDate: "2026-03-21", venue: "VFW Hall", city: "Plainville", state: "Connecticut", stateAbbr: "CT", hours: "9am-2pm", tables: "46", admission: "$2" },
  { name: "Cardboard Culture Card Shows", date: "Mar 22", sortDate: "2026-03-22", venue: "390 South Union St.", city: "Guilford", state: "Connecticut", stateAbbr: "CT", hours: "10am-3pm", tables: "36", admission: "$5" },
  { name: "Sports Card Show", date: "Mar 22", sortDate: "2026-03-22", venue: "American Legion Post 12", city: "Norwalk", state: "Connecticut", stateAbbr: "CT", hours: "9am-2pm", admission: "$3" },
  { name: "Hard Hittin' Card Shows", date: "Mar 29", sortDate: "2026-03-29", venue: "New Britain VFW", city: "New Britain", state: "Connecticut", stateAbbr: "CT", hours: "9am-2pm", tables: "70", admission: "$5" },
  { name: "Enfield Sportscard Show", date: "Apr 4", sortDate: "2026-04-04", venue: "American Legion Hall", city: "Enfield", state: "Connecticut", stateAbbr: "CT", hours: "9am-2pm", tables: "80", admission: "$2" },
  { name: "Plainville Sportscard Show", date: "Apr 18", sortDate: "2026-04-18", venue: "VFW Hall", city: "Plainville", state: "Connecticut", stateAbbr: "CT", hours: "9am-2pm", tables: "46", admission: "$2" },
  { name: "Hamden Card Show", date: "Apr 19", sortDate: "2026-04-19", venue: "Columbus Lodge", city: "Hamden", state: "Connecticut", stateAbbr: "CT", hours: "9am-2pm", tables: "30", admission: "$3" },
  { name: "Northeast Sports Card Expo", date: "May 2-3", sortDate: "2026-05-02", venue: "Chelsea Piers Athletic Club", city: "Stamford", state: "Connecticut", stateAbbr: "CT", hours: "Sat 9:30am-6pm; Sun 9:30am-4pm", tables: "350", admission: "$15", featured: true },
  { name: "Plainville Sportscard Show", date: "May 2", sortDate: "2026-05-02", venue: "VFW Hall", city: "Plainville", state: "Connecticut", stateAbbr: "CT", hours: "9am-2pm", tables: "46", admission: "$2" },
  { name: "Cardboard Culture Card Shows", date: "Jun 7", sortDate: "2026-06-07", venue: "390 South Union St.", city: "Guilford", state: "Connecticut", stateAbbr: "CT", hours: "10am-3pm", tables: "36", admission: "$5" },

  // DELAWARE
  { name: "Central Delaware Sports Cards & TCG Show", date: "Mar 28", sortDate: "2026-03-28", venue: "Hartly Fire House", city: "Hartly", state: "Delaware", stateAbbr: "DE", hours: "9am-2pm", tables: "50", admission: "Free" },
  { name: "Sports Card & Collectible Show", date: "Mar 29", sortDate: "2026-03-29", venue: "Chambers Memorial Hall", city: "Wilmington", state: "Delaware", stateAbbr: "DE", hours: "8am-2pm", tables: "70+", admission: "$3" },
  { name: "Sports Card & Collectible Show", date: "Apr 26", sortDate: "2026-04-26", venue: "Chambers Memorial Hall", city: "Wilmington", state: "Delaware", stateAbbr: "DE", hours: "8am-2pm", tables: "70+", admission: "$3" },
  { name: "Rehoboth Beach Sports Card & TCG Show", date: "May 29-31", sortDate: "2026-05-29", venue: "Convention Center", city: "Rehoboth Beach", state: "Delaware", stateAbbr: "DE", hours: "9am-3pm", tables: "124", admission: "Free" },

  // FLORIDA
  { name: "The Orlando Card Show", date: "Mar 20-21", sortDate: "2026-03-20", venue: "The Bahia Shrine", city: "Apopka", state: "Florida", stateAbbr: "FL", hours: "Fri 3pm-8pm; Sat 9am-3pm", tables: "50+", admission: "$2" },
  { name: "Clearwater Bay Area Card Show", date: "Mar 20-21", sortDate: "2026-03-20", venue: "Banquet Masters", city: "Clearwater", state: "Florida", stateAbbr: "FL", hours: "Fri 2-8pm; Sat 9am-3pm", tables: "90", admission: "Free" },
  { name: "Tampa Bay Sports Card Show", date: "Mar 27-28", sortDate: "2026-03-27", venue: "Holiday Inn Tampa Westshore", city: "Tampa", state: "Florida", stateAbbr: "FL", hours: "Fri 2-8pm; Sat 9am-3pm", tables: "80", admission: "Free" },
  { name: "Ft. Lauderdale Card Show", date: "Apr 3-4", sortDate: "2026-04-03", venue: "Rodeway Inn", city: "Ft. Lauderdale", state: "Florida", stateAbbr: "FL", hours: "Fri 4-9pm; Sat 8am-4pm", tables: "55", admission: "Free" },
  { name: "Space Coast Card Show", date: "Apr 11-12", sortDate: "2026-04-11", venue: "Radisson Resort at the Port", city: "Cape Canaveral", state: "Florida", stateAbbr: "FL", hours: "Sat 10am-5pm; Sun 10am-4pm", tables: "125+", admission: "$2" },
  { name: "Tampa Bay Sports Card Show", date: "Apr 4-5", sortDate: "2026-04-04", venue: "Embassy Suites @USF", city: "Tampa", state: "Florida", stateAbbr: "FL", hours: "Sat 10am-4pm; Sun 9am-3pm", tables: "100", admission: "Free" },
  { name: "The 850 Card Show", date: "Apr 24-25", sortDate: "2026-04-24", venue: "North Florida Fairgrounds", city: "Tallahassee", state: "Florida", stateAbbr: "FL", hours: "9am-4pm", tables: "150+", admission: "Free", featured: true },
  { name: "SWFL MEGA Card Show", date: "Apr 26", sortDate: "2026-04-26", venue: "14100 Six Mile Cypress Pkwy", city: "Fort Myers", state: "Florida", stateAbbr: "FL", hours: "9am-4pm", tables: "100+", admission: "$10" },
  { name: "The Duuuval Card Show", date: "May 29-30", sortDate: "2026-05-29", venue: "University of North Florida", city: "Jacksonville", state: "Florida", stateAbbr: "FL", hours: "Fri 2pm-8pm; Sat 9am-4pm", tables: "150", admission: "$5" },
  { name: "Coast To Coast Card Show", date: "Jun 13", sortDate: "2026-06-13", venue: "3150 E. New York Ave.", city: "Deland", state: "Florida", stateAbbr: "FL", hours: "9am-6pm", tables: "200", admission: "$2" },
  { name: "The Orlando Card Show", date: "Jun 19-20", sortDate: "2026-06-19", venue: "The Bahia Shrine", city: "Apopka", state: "Florida", stateAbbr: "FL", hours: "Fri 3pm-8pm; Sat 9am-3pm", tables: "50+", admission: "$2" },
  { name: "The 850 Card Show", date: "Jul 10-11", sortDate: "2026-07-10", venue: "North Florida Fairgrounds", city: "Tallahassee", state: "Florida", stateAbbr: "FL", hours: "9am-4pm", tables: "150+", admission: "Free" },
  { name: "The Orlando Card Show", date: "Jul 17-18", sortDate: "2026-07-17", venue: "The Bahia Shrine", city: "Apopka", state: "Florida", stateAbbr: "FL", hours: "Fri 3pm-8pm; Sat 9am-3pm", tables: "50+", admission: "$2" },
  { name: "The Orlando Card Show", date: "Aug 21-22", sortDate: "2026-08-21", venue: "The Bahia Shrine", city: "Apopka", state: "Florida", stateAbbr: "FL", hours: "Fri 3pm-8pm; Sat 9am-3pm", tables: "50+", admission: "$2" },
  { name: "The 850 Card Show", date: "Sep 11-12", sortDate: "2026-09-11", venue: "North Florida Fairgrounds", city: "Tallahassee", state: "Florida", stateAbbr: "FL", hours: "9am-4pm", tables: "150+", admission: "Free" },
  { name: "The Orlando Card Show", date: "Oct 16-17", sortDate: "2026-10-16", venue: "The Bahia Shrine", city: "Apopka", state: "Florida", stateAbbr: "FL", hours: "Fri 3pm-8pm; Sat 9am-3pm", tables: "50+", admission: "$2" },
  { name: "The Orlando Card Show", date: "Nov 13-14", sortDate: "2026-11-13", venue: "The Bahia Shrine", city: "Apopka", state: "Florida", stateAbbr: "FL", hours: "Fri 3pm-8pm; Sat 9am-3pm", tables: "50+", admission: "$2" },
  { name: "The 850 Card Show", date: "Dec 20", sortDate: "2026-12-20", venue: "North Florida Fairgrounds", city: "Tallahassee", state: "Florida", stateAbbr: "FL", hours: "9am-4pm", tables: "150+", admission: "Free" },
  { name: "The Orlando Card Show", date: "Dec 18-19", sortDate: "2026-12-18", venue: "The Bahia Shrine", city: "Apopka", state: "Florida", stateAbbr: "FL", hours: "Fri 3pm-8pm; Sat 9am-3pm", tables: "50+", admission: "$2" },

  // GEORGIA
  { name: "North GA Collectables Show", date: "Mar 21", sortDate: "2026-03-21", venue: "830 Green St. NE", city: "Gainesville", state: "Georgia", stateAbbr: "GA", hours: "9am-3pm", tables: "120", admission: "Free" },
  { name: "Front Row Card Show", date: "Mar 28-29", sortDate: "2026-03-28", venue: "Cobb Convention Center", city: "Atlanta", state: "Georgia", stateAbbr: "GA", hours: "11am-5pm", tables: "350", admission: "$10", featured: true },
  { name: "Card Fest Promotions", date: "Mar 28", sortDate: "2026-03-28", venue: "Pine View Baptist Church", city: "Augusta", state: "Georgia", stateAbbr: "GA", hours: "8:30am-3pm", tables: "80", admission: "Free" },
  { name: "ATL Card Show", date: "Apr 18", sortDate: "2026-04-18", venue: "DoubleTree Hilton Roswell", city: "Roswell", state: "Georgia", stateAbbr: "GA", hours: "9am-4pm", tables: "75", admission: "Free" },
  { name: "Georgia Collectables Show", date: "Apr 19", sortDate: "2026-04-19", venue: "Double Tree Hotel", city: "Chamblee", state: "Georgia", stateAbbr: "GA", hours: "9am-3pm", tables: "80", admission: "Free" },
  { name: "North GA Collectables Show", date: "May 23", sortDate: "2026-05-23", venue: "830 Green St. NE", city: "Gainesville", state: "Georgia", stateAbbr: "GA", hours: "9am-3pm", tables: "50", admission: "Free" },

  // ILLINOIS
  { name: "March Mania Sports Cards Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Jack Schmitt Ford", city: "Collinsville", state: "Illinois", stateAbbr: "IL", hours: "10am-3pm", tables: "40+", admission: "Free" },
  { name: "Break Time Card Show", date: "Mar 27-29", sortDate: "2026-03-27", venue: "Concorde Banquets", city: "Kildeer", state: "Illinois", stateAbbr: "IL", hours: "Fri 4-9pm; Sat-Sun 9am-5pm", tables: "150+", admission: "$5" },
  { name: "Break Time Card Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Naperville Yard Indoor Sports", city: "Naperville", state: "Illinois", stateAbbr: "IL", hours: "9am-5pm", tables: "250+", admission: "$3" },
  { name: "Heart of Illinois Sportscard Expo", date: "Apr 10-11", sortDate: "2026-04-10", venue: "Interstate Center", city: "Bloomington", state: "Illinois", stateAbbr: "IL", hours: "Fri 3-7pm; Sat 9am-5pm", tables: "200", admission: "$3" },
  { name: "Fox Valley SportsCard Convention", date: "May 9", sortDate: "2026-05-09", venue: "TOCA Soccer Center", city: "Naperville", state: "Illinois", stateAbbr: "IL", hours: "9am-3pm", tables: "150", admission: "Free" },
  { name: "Dallas Card Show Chicago", date: "May 29-31", sortDate: "2026-05-29", venue: "Schaumburg Convention Center", city: "Schaumburg", state: "Illinois", stateAbbr: "IL", hours: "Fri 5-9pm; Sat 10am-8pm; Sun 10am-4pm", tables: "300+", admission: "$5-10", featured: true },
  { name: "46th National Sports Collectors Convention", date: "Jul 29 - Aug 2", sortDate: "2026-07-29", venue: "Donald E. Stephens Convention Center", city: "Rosemont", state: "Illinois", stateAbbr: "IL", hours: "Wed 2-8pm; Thu-Sat 10am-6pm; Sun 10am-4pm", tables: "2000+", admission: "$25-30", featured: true },

  // INDIANA
  { name: "Michigan City Card and Pokemon Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Michigan City F.O.P.", city: "Michigan City", state: "Indiana", stateAbbr: "IN", hours: "9am-3pm", tables: "100+", admission: "Free" },
  { name: "J&J Allstar Sports Card Show", date: "Mar 21", sortDate: "2026-03-21", venue: "American Legion Post 470", city: "Fishers", state: "Indiana", stateAbbr: "IN", hours: "8am-2pm", tables: "60", admission: "Free" },
  { name: "I-69 Bronco Bash", date: "Mar 27-28", sortDate: "2026-03-27", venue: "Daleville High School", city: "Daleville", state: "Indiana", stateAbbr: "IN", hours: "Fri 4-8pm; Sat 9am-3pm", tables: "250+", admission: "Free", featured: true },
  { name: "Hoosier Hobby Show", date: "Mar 28", sortDate: "2026-03-28", venue: "Villa Cesare", city: "Schererville", state: "Indiana", stateAbbr: "IN", hours: "9am-4pm", tables: "100", admission: "Free" },
  { name: "American Legion Card Show", date: "Apr 3-4", sortDate: "2026-04-03", venue: "Post 44", city: "Newburgh", state: "Indiana", stateAbbr: "IN", hours: "Fri 3-7pm; Sat 10am-4pm", tables: "55", admission: "Free" },
  { name: "Southwest Indiana Card Show", date: "May 1-2", sortDate: "2026-05-01", venue: "National Guard Armory", city: "Evansville", state: "Indiana", stateAbbr: "IN", hours: "Fri 3-7pm; Sat 10am-4pm", tables: "160", admission: "$3" },
  { name: "Lafayette Card Show", date: "May 3", sortDate: "2026-05-03", venue: "Tippecanoe County Fairgrounds", city: "Lafayette", state: "Indiana", stateAbbr: "IN", hours: "10am-4pm", tables: "70", admission: "Free" },

  // IOWA
  { name: "Midamerican Card Show", date: "Jul 19", sortDate: "2026-07-19", venue: "Midamerican Recplex", city: "West Des Moines", state: "Iowa", stateAbbr: "IA", hours: "10am-3pm", tables: "125", admission: "Free" },

  // KANSAS
  { name: "Vintage Sports Collectibles Show", date: "Mar 19-22", sortDate: "2026-03-19", venue: "West Ridge Mall", city: "Topeka", state: "Kansas", stateAbbr: "KS", hours: "Thu-Sat 10am-7pm; Sun 12-5pm", tables: "50", admission: "Free" },
  { name: "The Johnson County Card Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Homefield Olathe", city: "Olathe", state: "Kansas", stateAbbr: "KS", hours: "10am-4pm", tables: "80+", admission: "Free" },
  { name: "Semi Annual Sports Card Show", date: "May 2", sortDate: "2026-05-02", venue: "Ottawa Memorial Auditorium", city: "Ottawa", state: "Kansas", stateAbbr: "KS", hours: "10am-4pm", tables: "30", admission: "Free" },

  // KENTUCKY
  { name: "J&J Allstar Sports Card Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Our Mother of Sorrows Lyons Hall", city: "Louisville", state: "Kentucky", stateAbbr: "KY", hours: "9am-2pm", tables: "130", admission: "Free" },
  { name: "Lexington Sports Cards & Collectibles Show", date: "Mar 28", sortDate: "2026-03-28", venue: "Quality Inn Hotel", city: "Lexington", state: "Kentucky", stateAbbr: "KY", hours: "9am-3pm", tables: "115", admission: "Free" },
  { name: "J&J Allstar Sports Card Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Our Mother of Sorrows Lyons Hall", city: "Louisville", state: "Kentucky", stateAbbr: "KY", hours: "9am-2pm", tables: "130", admission: "Free" },
  { name: "Lexington Sports Cards & Collectibles Show", date: "Apr 25", sortDate: "2026-04-25", venue: "Quality Inn Hotel", city: "Lexington", state: "Kentucky", stateAbbr: "KY", hours: "9am-3pm", tables: "115", admission: "Free" },
  { name: "J&J Allstar Sports Card Show", date: "May 2", sortDate: "2026-05-02", venue: "Our Mother of Sorrows Lyons Hall", city: "Louisville", state: "Kentucky", stateAbbr: "KY", hours: "9am-2pm", tables: "130", admission: "Free" },
  { name: "Lexington Sports Cards & Collectibles Show", date: "May 30", sortDate: "2026-05-30", venue: "Quality Inn Hotel", city: "Lexington", state: "Kentucky", stateAbbr: "KY", hours: "9am-3pm", tables: "115", admission: "Free" },

  // LOUISIANA
  { name: "Shreveport Card Show", date: "Apr 11-12", sortDate: "2026-04-11", venue: "AcroSports and The Fieldhouse", city: "Shreveport", state: "Louisiana", stateAbbr: "LA", hours: "Sat 9am-5pm; Sun 10am-4pm", tables: "115", admission: "$5" },

  // MAINE
  { name: "Cool and Collectible Card Show", date: "Apr 11", sortDate: "2026-04-11", venue: "Crystal Athletic Training Facility", city: "Sanford", state: "Maine", stateAbbr: "ME", hours: "9am-2pm", tables: "200", admission: "$3" },

  // MARYLAND
  { name: "Frederick Sports Card Show", date: "Apr 11", sortDate: "2026-04-11", venue: "5400 Holiday Dr", city: "Frederick", state: "Maryland", stateAbbr: "MD", hours: "9am-3pm", tables: "100", admission: "Free" },
  { name: "The Best Flippin' TCG Card Show", date: "Apr 11-12", sortDate: "2026-04-11", venue: "Baltimore Convention Center", city: "Baltimore", state: "Maryland", stateAbbr: "MD", hours: "10am-5pm", tables: "275", admission: "$15-20", featured: true },
  { name: "Hagerstown Sports Card & TCG Show", date: "Apr 18-19", sortDate: "2026-04-18", venue: "Valley Mall", city: "Hagerstown", state: "Maryland", stateAbbr: "MD", hours: "Sat 10am-7pm; Sun 11am-4pm", tables: "200", admission: "Free" },
  { name: "The TCG Jamboree Card Show", date: "Apr 25", sortDate: "2026-04-25", venue: "TownMall", city: "Westminster", state: "Maryland", stateAbbr: "MD", hours: "10am-4pm", tables: "400", admission: "$10" },
  { name: "Mid-Atlantic Sports Card Show", date: "May 3", sortDate: "2026-05-03", venue: "Silver Spring Civic Center", city: "Silver Spring", state: "Maryland", stateAbbr: "MD", hours: "10am-3pm", tables: "170", admission: "$5" },
  { name: "The Baltimore Card Show", date: "May 16-17", sortDate: "2026-05-16", venue: "Chesapeake Employers Insurance Arena", city: "Baltimore", state: "Maryland", stateAbbr: "MD", hours: "Sat 9am-5pm; Sun 10am-3pm", tables: "250+", admission: "$10-30", featured: true },

  // MASSACHUSETTS
  { name: "The Best Flippin' Card Show Monthly Mixer", date: "Mar 21", sortDate: "2026-03-21", venue: "Crowne Plaza Woburn", city: "Woburn", state: "Massachusetts", stateAbbr: "MA", hours: "8:30am-2pm", tables: "120", admission: "$5" },
  { name: "Cardboard Promotions Boston-Dedham Show", date: "Mar 22", sortDate: "2026-03-22", venue: "Holiday Inn", city: "Dedham", state: "Massachusetts", stateAbbr: "MA", hours: "8:30am-2:15pm", tables: "85", admission: "$3" },
  { name: "Northeast Sports Card Expo", date: "Mar 28-29", sortDate: "2026-03-28", venue: "Marriott Boston Quincy", city: "Quincy", state: "Massachusetts", stateAbbr: "MA", hours: "Sat 9:30am-6pm; Sun 9:30am-4pm", tables: "180", admission: "$15", featured: true },
  { name: "The Collector Expo", date: "Apr 4", sortDate: "2026-04-04", venue: "Boxboro Regency Conference Center", city: "Boxborough", state: "Massachusetts", stateAbbr: "MA", hours: "9:30am-4:30pm", tables: "225", admission: "$10" },
  { name: "New England's Biggest Card Show", date: "Apr 11-12", sortDate: "2026-04-11", venue: "Emerald Square Mall", city: "North Attleboro", state: "Massachusetts", stateAbbr: "MA", hours: "10am-5pm", tables: "175", admission: "Free" },
  { name: "The Best Flippin' TCG Card Show", date: "May 2-3", sortDate: "2026-05-02", venue: "Hynes Convention Center", city: "Boston", state: "Massachusetts", stateAbbr: "MA", hours: "10am-5pm", tables: "375", admission: "$20-25", featured: true },
  { name: "New England's Biggest Card Show", date: "May 16-17", sortDate: "2026-05-16", venue: "Emerald Square Mall", city: "North Attleboro", state: "Massachusetts", stateAbbr: "MA", hours: "10am-5pm", tables: "175", admission: "Free" },

  // MICHIGAN
  { name: "Hometown Cards and Collectibles Showcase", date: "Apr 18", sortDate: "2026-04-18", venue: "FBC Hall", city: "DeWitt", state: "Michigan", stateAbbr: "MI", hours: "10am-4pm", tables: "20+", admission: "Free" },

  // MINNESOTA
  { name: "Sports Card Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Bloomington Armory", city: "Bloomington", state: "Minnesota", stateAbbr: "MN", hours: "9am-4pm", tables: "50", admission: "Free" },
  { name: "Twin Ports Sports & TCG Card Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Radisson Hotel-Duluth", city: "Duluth", state: "Minnesota", stateAbbr: "MN", hours: "9am-3pm", tables: "50", admission: "Free" },
  { name: "Sports Card Show", date: "Apr 25", sortDate: "2026-04-25", venue: "Bloomington Armory", city: "Bloomington", state: "Minnesota", stateAbbr: "MN", hours: "9am-4pm", tables: "50", admission: "Free" },
  { name: "Up North Card Show", date: "May 23", sortDate: "2026-05-23", venue: "Hibbing National Guard Armory", city: "Hibbing", state: "Minnesota", stateAbbr: "MN", hours: "9am-3pm", tables: "40+", admission: "Free" },
  { name: "Sports Card Show", date: "May 30", sortDate: "2026-05-30", venue: "Bloomington Armory", city: "Bloomington", state: "Minnesota", stateAbbr: "MN", hours: "9am-4pm", tables: "50", admission: "Free" },
  { name: "Sports Card Show", date: "Jun 20", sortDate: "2026-06-20", venue: "Bloomington Armory", city: "Bloomington", state: "Minnesota", stateAbbr: "MN", hours: "9am-4pm", tables: "50", admission: "Free" },
  { name: "Sports Card & Collectibles Show", date: "Oct 16-18", sortDate: "2026-10-16", venue: "Maplewood Mall", city: "Maplewood", state: "Minnesota", stateAbbr: "MN", hours: "Fri-Sat 10am-8pm; Sun 11am-4pm", tables: "125", admission: "Free" },
  { name: "Sports Card Show", date: "Nov 8", sortDate: "2026-11-08", venue: "Bloomington Armory", city: "Bloomington", state: "Minnesota", stateAbbr: "MN", hours: "9am-4pm", tables: "50", admission: "Free" },

  // MISSISSIPPI
  { name: "Central Mississippi Card Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Holiday Inn", city: "Pearl", state: "Mississippi", stateAbbr: "MS", hours: "9am-3pm", tables: "50", admission: "Free" },
  { name: "Tupelo Card Show", date: "May 2", sortDate: "2026-05-02", venue: "Tupelo Furniture Market Building 4", city: "Tupelo", state: "Mississippi", stateAbbr: "MS", hours: "9am-3pm", tables: "40+", admission: "Free" },
  { name: "Central Mississippi Card Show", date: "May 30", sortDate: "2026-05-30", venue: "Holiday Inn", city: "Pearl", state: "Mississippi", stateAbbr: "MS", hours: "9am-3pm", tables: "50", admission: "Free" },

  // MISSOURI
  { name: "Show Me Cardboard Card Show", date: "Apr 17-18", sortDate: "2026-04-17", venue: "Mozingo Event Center", city: "Maryville", state: "Missouri", stateAbbr: "MO", hours: "Sat 8am-5pm; Sun 10am-4pm", admission: "Free" },

  // NEVADA
  { name: "Front Row Card Show", date: "May 2-3", sortDate: "2026-05-02", venue: "Rio Hotel & Casino", city: "Las Vegas", state: "Nevada", stateAbbr: "NV", hours: "11am-5pm", tables: "600", admission: "$10", featured: true },

  // NEW JERSEY
  { name: "Cherry Hill Card Expo", date: "Mar 21-22", sortDate: "2026-03-21", venue: "Doubletree by Hilton", city: "Cherry Hill", state: "New Jersey", stateAbbr: "NJ", hours: "Sat 10am-5pm; Sun 10am-4pm", tables: "225+", admission: "$10" },
  { name: "The Mega Sports & TCG Card Expo", date: "Mar 28", sortDate: "2026-03-28", venue: "430 Western Ave.", city: "Morristown", state: "New Jersey", stateAbbr: "NJ", hours: "10am-5pm", admission: "$5" },
  { name: "Morris County Card Show", date: "Mar 28-29", sortDate: "2026-03-28", venue: "Parsippany PAL", city: "Parsippany", state: "New Jersey", stateAbbr: "NJ", hours: "9am-3pm", admission: "$5-10" },
  { name: "The Exit 117 Show", date: "Apr 12", sortDate: "2026-04-12", venue: "Raritan High School", city: "Hazlet", state: "New Jersey", stateAbbr: "NJ", hours: "9am-4pm", tables: "100+", admission: "$5" },
  { name: "South Jersey Card Show", date: "Apr 25", sortDate: "2026-04-25", venue: "Total Turf Experience", city: "Sewell", state: "New Jersey", stateAbbr: "NJ", hours: "9am-4pm", tables: "100+", admission: "$5-10" },
  { name: "TWP Card Show", date: "May 16", sortDate: "2026-05-16", venue: "Washington Township High School", city: "Sewell", state: "New Jersey", stateAbbr: "NJ", hours: "10am-3pm", tables: "100+", admission: "$10" },
  { name: "Bergen County Collectibles Show", date: "May 9", sortDate: "2026-05-09", venue: "Midland Park High School", city: "Midland Park", state: "New Jersey", stateAbbr: "NJ", hours: "9am-3pm", tables: "95+", admission: "$5" },

  // NEW YORK
  { name: "Brooklyn Sports Card Show", date: "Mar 21", sortDate: "2026-03-21", venue: "St Patrick Catholic Academy", city: "Brooklyn", state: "New York", stateAbbr: "NY", hours: "10am-4pm", admission: "$5" },
  { name: "Albany Sports Card & TCG Show", date: "Mar 22", sortDate: "2026-03-22", venue: "Polish Community Center", city: "Albany", state: "New York", stateAbbr: "NY", hours: "9am-3pm", tables: "110", admission: "$5" },
  { name: "The City Show", date: "Mar 28-29", sortDate: "2026-03-28", venue: "Elks Lodge", city: "Queens", state: "New York", stateAbbr: "NY", hours: "10am-5pm", tables: "100-120", admission: "$5-10" },
  { name: "Albany Sports Card & TCG Two-Day EXPO", date: "Apr 18-19", sortDate: "2026-04-18", venue: "Polish Community Center", city: "Albany", state: "New York", stateAbbr: "NY", hours: "Sat 10am-4pm; Sun 10am-3pm", tables: "110", admission: "$5" },
  { name: "SUPERCON: Queens", date: "May 3", sortDate: "2026-05-03", venue: "Queens College", city: "Flushing", state: "New York", stateAbbr: "NY", hours: "10am-3pm", tables: "100+", admission: "Free" },
  { name: "Albany Sports Card & TCG Show", date: "May 17", sortDate: "2026-05-17", venue: "Polish Community Center", city: "Albany", state: "New York", stateAbbr: "NY", hours: "9am-3pm", tables: "110", admission: "$5" },

  // NORTH CAROLINA
  { name: "Sports Wax Promotions Card Show", date: "Mar 20-21", sortDate: "2026-03-20", venue: "Blume Studios", city: "Charlotte", state: "North Carolina", stateAbbr: "NC", hours: "Fri 3-10pm; Sat 10am-5pm", tables: "300", admission: "$10", featured: true },
  { name: "Pow Productions Card Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Cards at The Cages", city: "Greensboro", state: "North Carolina", stateAbbr: "NC", hours: "9am-4pm", tables: "80+", admission: "Free" },
  { name: "Pow Productions Card Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Truist Stadium", city: "Winston-Salem", state: "North Carolina", stateAbbr: "NC", hours: "9am-4pm", tables: "180+", admission: "$5" },
  { name: "Pow Productions Card Show", date: "Apr 11-12", sortDate: "2026-04-11", venue: "Asheville Mall", city: "Asheville", state: "North Carolina", stateAbbr: "NC", hours: "10am-5pm", tables: "120+", admission: "Free" },
  { name: "Grail Card Promotions Show", date: "Apr 25", sortDate: "2026-04-25", venue: "Boone Mall", city: "Boone", state: "North Carolina", stateAbbr: "NC", hours: "9am-4pm", tables: "65+", admission: "Free" },
  { name: "HobbyMan Events Card Show", date: "May 30", sortDate: "2026-05-30", venue: "Charles Mack Citizen Center", city: "Mooresville", state: "North Carolina", stateAbbr: "NC", hours: "9am-3pm", tables: "125", admission: "$5" },
  { name: "Havelock Card Show", date: "Jun 20", sortDate: "2026-06-20", venue: "Havelock Tourist & Event Center", city: "Havelock", state: "North Carolina", stateAbbr: "NC", hours: "10am-4pm", tables: "76", admission: "Free" },

  // OHIO
  { name: "Plain City Card Collectors Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Plain City Elementary School", city: "Plain City", state: "Ohio", stateAbbr: "OH", hours: "10am-2pm", tables: "85+", admission: "Free" },
  { name: "Sports Card and Pokemon Card Show", date: "Mar 21-22", sortDate: "2026-03-21", venue: "Emidio and Sons Expo Center", city: "Cuyahoga Falls", state: "Ohio", stateAbbr: "OH", hours: "9am-4pm", tables: "220+", admission: "Free" },
  { name: "Cincinnati Baseball Memorabilia Show", date: "Mar 27-28", sortDate: "2026-03-27", venue: "Cincinnati Marriott North", city: "West Chester", state: "Ohio", stateAbbr: "OH", hours: "Fri 3-8pm; Sat 9am-3pm", tables: "100+", admission: "$3" },
  { name: "Great American Sports Memorabilia Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Greene County Fairgrounds", city: "Xenia", state: "Ohio", stateAbbr: "OH", hours: "All day", tables: "375+", admission: "TBD", featured: true },
  { name: "Great Lakes Collectors Convention", date: "Apr 10-12", sortDate: "2026-04-10", venue: "The FieldHouse at City Campus", city: "Independence", state: "Ohio", stateAbbr: "OH", hours: "Fri 2-8pm; Sat 10am-6pm; Sun 9am-3pm", tables: "250+", admission: "$10", featured: true },
  { name: "Columbus Sports Card Show", date: "May 2-3", sortDate: "2026-05-02", venue: "Franklin County Fairgrounds", city: "Hilliard", state: "Ohio", stateAbbr: "OH", hours: "Sat 10am-4pm; Sun 10am-3pm", tables: "150", admission: "Free" },
  { name: "Medina Fairgrounds Show", date: "May 29-30", sortDate: "2026-05-29", venue: "Medina Fairgrounds", city: "Medina", state: "Ohio", stateAbbr: "OH", hours: "Fri 4-8pm; Sat 9am-4pm", tables: "200", admission: "$5" },
  { name: "Kirtland Community Center Show", date: "Sep 26", sortDate: "2026-09-26", venue: "Kirtland Community Center", city: "Kirtland", state: "Ohio", stateAbbr: "OH", hours: "9am-2pm", tables: "40", admission: "Free" },
  { name: "Kirtland Community Center Show", date: "Oct 31", sortDate: "2026-10-31", venue: "Kirtland Community Center", city: "Kirtland", state: "Ohio", stateAbbr: "OH", hours: "9am-2pm", tables: "40", admission: "Free" },
  { name: "Kirtland Community Center Show", date: "Nov 21", sortDate: "2026-11-21", venue: "Kirtland Community Center", city: "Kirtland", state: "Ohio", stateAbbr: "OH", hours: "9am-2pm", tables: "40", admission: "Free" },
  { name: "Kirtland Community Center Show", date: "Dec 12", sortDate: "2026-12-12", venue: "Kirtland Community Center", city: "Kirtland", state: "Ohio", stateAbbr: "OH", hours: "9am-2pm", tables: "40", admission: "Free" },

  // OKLAHOMA
  { name: "GG2 Sports Cards Show", date: "Apr 3-5", sortDate: "2026-04-03", venue: "Stoney Creek Hotel", city: "Broken Arrow", state: "Oklahoma", stateAbbr: "OK", hours: "Fri 11am-6pm; Sat 9am-5pm; Sun 10am-4pm", tables: "200", admission: "Free" },
  { name: "Texoma Trading Card Expo", date: "Apr 24-26", sortDate: "2026-04-24", venue: "Choctaw Casino & Resort", city: "Durant", state: "Oklahoma", stateAbbr: "OK", hours: "Fri 12-6pm; Sat-Sun 9am-6pm", tables: "250", admission: "$10" },

  // OREGON
  { name: "FlipnBacon Cards & Collectibles Show", date: "Apr 18-19", sortDate: "2026-04-18", venue: "DoubleTree by Hilton Portland", city: "Portland", state: "Oregon", stateAbbr: "OR", hours: "10am-5pm", tables: "150+", admission: "Free" },
  { name: "Salem's Trading Card Showcase", date: "Apr 19", sortDate: "2026-04-19", venue: "Salem Scottish Rite Center", city: "Salem", state: "Oregon", stateAbbr: "OR", hours: "10am-4pm", tables: "65", admission: "Free" },
  { name: "Front Row Card Show", date: "Jun 13-14", sortDate: "2026-06-13", venue: "Oregon Convention Center", city: "Portland", state: "Oregon", stateAbbr: "OR", hours: "11am-5pm", tables: "450", admission: "$10", featured: true },
  { name: "Salem's Trading Card Showcase", date: "May 17", sortDate: "2026-05-17", venue: "Salem Scottish Rite Center", city: "Salem", state: "Oregon", stateAbbr: "OR", hours: "10am-4pm", tables: "65", admission: "Free" },

  // PENNSYLVANIA
  { name: "Sports Card Showcase The Pittsburgh 500", date: "Mar 27-29", sortDate: "2026-03-27", venue: "Monroeville Convention Center", city: "Monroeville", state: "Pennsylvania", stateAbbr: "PA", hours: "Fri 1-7pm; Sat 10am-5pm; Sun 9am-3pm", tables: "525+", admission: "Free", featured: true },
  { name: "Brotherly Love Card Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Live Casino & Hotel Philadelphia", city: "Philadelphia", state: "Pennsylvania", stateAbbr: "PA", hours: "10am-4pm", tables: "200", admission: "$10" },
  { name: "Harrisburg Sports Card & TCG Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Central Penn College", city: "Summerdale", state: "Pennsylvania", stateAbbr: "PA", hours: "9am-2pm", tables: "145", admission: "Free" },
  { name: "Bucks County Card Show", date: "Apr 12", sortDate: "2026-04-12", venue: "The Fuge", city: "Warminster", state: "Pennsylvania", stateAbbr: "PA", hours: "9am-3pm", tables: "100+", admission: "$10" },
  { name: "Gettysburg Sports Card Show", date: "Apr 18", sortDate: "2026-04-18", venue: "Aspire Hotel", city: "Gettysburg", state: "Pennsylvania", stateAbbr: "PA", hours: "9am-3pm", tables: "125", admission: "Free" },
  { name: "Hollywood Casino Sports Card & TCG Show", date: "Apr 25", sortDate: "2026-04-25", venue: "777 Hollywood Blvd.", city: "Grantville", state: "Pennsylvania", stateAbbr: "PA", hours: "9am-3pm", tables: "200", admission: "Free" },
  { name: "Fishtown Card Show", date: "May 2-3", sortDate: "2026-05-02", venue: "Rivers Casino", city: "Philadelphia", state: "Pennsylvania", stateAbbr: "PA", hours: "Sat 10am-5pm; Sun 10am-4pm", tables: "150+", admission: "$10" },
  { name: "National Battlefield Card Classic", date: "May 23-24", sortDate: "2026-05-23", venue: "All-Star Sports Complex", city: "Gettysburg", state: "Pennsylvania", stateAbbr: "PA", hours: "10am-5pm", tables: "450", admission: "$10", featured: true },
  { name: "The Pennsylvania State Card Show", date: "Jul 25", sortDate: "2026-07-25", venue: "Redner's Event Center", city: "Reading", state: "Pennsylvania", stateAbbr: "PA", hours: "9am-3pm", tables: "95+", admission: "$5" },

  // RHODE ISLAND
  { name: "NE For The Hobby Card Show", date: "Mar 22", sortDate: "2026-03-22", venue: "Elks Lodge", city: "Smithfield", state: "Rhode Island", stateAbbr: "RI", hours: "10am-3pm", admission: "$3" },
  { name: "NE For The Hobby Card Show", date: "Apr 26", sortDate: "2026-04-26", venue: "Elks Lodge", city: "Smithfield", state: "Rhode Island", stateAbbr: "RI", hours: "10am-3pm", admission: "$3" },
  { name: "On The Level Card Show Supersized", date: "May 16", sortDate: "2026-05-16", venue: "West Warwick Civic Center", city: "West Warwick", state: "Rhode Island", stateAbbr: "RI", hours: "9am-4pm", tables: "100+", admission: "$10" },

  // SOUTH CAROLINA
  { name: "Hilton Head-Beaufort Sports Card Show", date: "Mar 21", sortDate: "2026-03-21", venue: "2225 Boundary St.", city: "Beaufort", state: "South Carolina", stateAbbr: "SC", hours: "9am-3pm", tables: "75", admission: "Free" },
  { name: "Simpsonville Cards & Collectibles Show", date: "May 2", sortDate: "2026-05-02", venue: "Simpsonville Senior Activity Center", city: "Simpsonville", state: "South Carolina", stateAbbr: "SC", hours: "9am-3pm", tables: "200", admission: "$3" },
  { name: "Greenville Sports Cards & Pokemon Show", date: "May 9", sortDate: "2026-05-09", venue: "Haywood Mall", city: "Greenville", state: "South Carolina", stateAbbr: "SC", hours: "10am-4pm", tables: "150", admission: "Free" },
  { name: "Myrtle Beach Sports Cards & Pokemon Expo", date: "May 22-23", sortDate: "2026-05-22", venue: "Myrtle Beach Sports Center", city: "Myrtle Beach", state: "South Carolina", stateAbbr: "SC", hours: "Fri 3-8pm; Sat 10am-4pm", tables: "300", admission: "$10", featured: true },

  // TENNESSEE
  { name: "Murfreesboro Card Show", date: "Mar 21", sortDate: "2026-03-21", venue: "Ramada Inn", city: "Murfreesboro", state: "Tennessee", stateAbbr: "TN", hours: "7am-1pm", tables: "40", admission: "Free" },
  { name: "Murfreesboro Card Show", date: "Apr 4", sortDate: "2026-04-04", venue: "Ramada Inn", city: "Murfreesboro", state: "Tennessee", stateAbbr: "TN", hours: "7am-1pm", tables: "40", admission: "Free" },
  { name: "Murfreesboro Card Show", date: "Apr 18", sortDate: "2026-04-18", venue: "Ramada Inn", city: "Murfreesboro", state: "Tennessee", stateAbbr: "TN", hours: "7am-1pm", tables: "40", admission: "Free" },
  { name: "Murfreesboro Card Show", date: "May 2", sortDate: "2026-05-02", venue: "Ramada Inn", city: "Murfreesboro", state: "Tennessee", stateAbbr: "TN", hours: "7am-1pm", tables: "40", admission: "Free" },
  { name: "Murfreesboro Card Show", date: "May 16", sortDate: "2026-05-16", venue: "Ramada Inn", city: "Murfreesboro", state: "Tennessee", stateAbbr: "TN", hours: "7am-1pm", tables: "40", admission: "Free" },

  // TEXAS
  { name: "Conroe Sports Cards & Collectibles Show", date: "Mar 21-22", sortDate: "2026-03-21", venue: "Hyatt Regency Conroe", city: "Conroe", state: "Texas", stateAbbr: "TX", hours: "Sat 9am-5pm; Sun 10am-4pm", tables: "220", admission: "Free" },
  { name: "HTX Card Show", date: "Mar 21-22", sortDate: "2026-03-21", venue: "Margaritaville Lake Conroe", city: "Montgomery", state: "Texas", stateAbbr: "TX", hours: "9am-5pm", tables: "250+", admission: "$1" },
  { name: "NTX Sports Card Show Weekend", date: "Apr 11-12", sortDate: "2026-04-11", venue: "NTX Arena", city: "Lewisville", state: "Texas", stateAbbr: "TX", hours: "9am-5pm", tables: "300+", admission: "$5" },
  { name: "NTX Fort Worth Card Show", date: "Apr 18-19", sortDate: "2026-04-18", venue: "Amon G. Carter Jr. Exhibits Hall", city: "Fort Worth", state: "Texas", stateAbbr: "TX", hours: "9am-5pm", tables: "400+", admission: "$5", featured: true },
  { name: "Katy Sports Card Show", date: "Apr 18-19", sortDate: "2026-04-18", venue: "Merrell Center", city: "Katy", state: "Texas", stateAbbr: "TX", hours: "10am-5pm", tables: "276", admission: "Free" },
  { name: "ATX Card Show", date: "Apr 25", sortDate: "2026-04-25", venue: "Hilton Austin", city: "Austin", state: "Texas", stateAbbr: "TX", hours: "9am-5pm", tables: "250+", admission: "$5" },
  { name: "Dallas Card Show", date: "May 14-17", sortDate: "2026-05-14", venue: "777 Watters Creek Blvd.", city: "Allen", state: "Texas", stateAbbr: "TX", hours: "Thu 6-9pm; Fri 2-8pm; Sat 9:30am-6pm; Sun 9:30am-4pm", tables: "700+", admission: "$15-35", featured: true },
  { name: "ATX North Card Show", date: "May 9-10", sortDate: "2026-05-09", venue: "Cadence Bank Center", city: "Belton", state: "Texas", stateAbbr: "TX", hours: "9am-5pm", tables: "350+", admission: "$5" },
  { name: "Dallas Card Show", date: "Jul 16-19", sortDate: "2026-07-16", venue: "777 Watters Creek Blvd.", city: "Allen", state: "Texas", stateAbbr: "TX", hours: "Thu 6-9pm; Fri 2-8pm; Sat 9:30am-6pm; Sun 9:30am-4pm", tables: "700+", admission: "$15-35", featured: true },

  // VERMONT
  { name: "Rutland Moose Club Card Show", date: "Apr 18", sortDate: "2026-04-18", venue: "Rutland Moose Club Chapter 1122", city: "Rutland", state: "Vermont", stateAbbr: "VT", hours: "10am-4pm", tables: "15-20", admission: "$3" },

  // VIRGINIA
  { name: "Shoff Promotions Sports Card Shows", date: "Mar 22", sortDate: "2026-03-22", venue: "Annandale Fire House Expo Hall", city: "Annandale", state: "Virginia", stateAbbr: "VA", hours: "9am-3pm", tables: "30", admission: "$3" },
  { name: "540 Card Show", date: "Mar 28", sortDate: "2026-03-28", venue: "Salem Civic Center", city: "Salem", state: "Virginia", stateAbbr: "VA", hours: "9am-4pm", tables: "125+", admission: "Free" },
  { name: "P-Town Collectibles Expo", date: "Mar 28", sortDate: "2026-03-28", venue: "Rivers Portsmouth Casino", city: "Portsmouth", state: "Virginia", stateAbbr: "VA", hours: "9am-3pm", tables: "180", admission: "Free" },
  { name: "Tri Cities Card Show", date: "Apr 18", sortDate: "2026-04-18", venue: "Hard Rock Hotel and Casino", city: "Bristol", state: "Virginia", stateAbbr: "VA", hours: "9am-4pm", tables: "225", admission: "$5" },
  { name: "NoVA Sports Card Show", date: "Apr 26", sortDate: "2026-04-26", venue: "Falls Church Marriott", city: "Falls Church", state: "Virginia", stateAbbr: "VA", hours: "9am-4pm", tables: "200", admission: "$5" },
  { name: "Virginia Beach Sports Card Expo", date: "May 2-3", sortDate: "2026-05-02", venue: "Virginia Beach Fieldhouse", city: "Virginia Beach", state: "Virginia", stateAbbr: "VA", hours: "Sat 9am-5pm; Sun 9am-3pm", tables: "250", admission: "Free", featured: true },
  { name: "RVA Expo Regional Card Show", date: "May 30-31", sortDate: "2026-05-30", venue: "Richmond Raceway Complex", city: "Richmond", state: "Virginia", stateAbbr: "VA", hours: "10am-5pm", tables: "210", admission: "Free" },

  // WASHINGTON
  { name: "Front Row Card Show", date: "Apr 11-12", sortDate: "2026-04-11", venue: "Greater Tacoma Convention Center", city: "Tacoma", state: "Washington", stateAbbr: "WA", hours: "11am-5pm", tables: "440", admission: "$10", featured: true },

  // WEST VIRGINIA
  { name: "Shepherdstown Sports & TCG Expo", date: "Mar 21", sortDate: "2026-03-21", venue: "Rumsey Tavern", city: "Shepherdstown", state: "West Virginia", stateAbbr: "WV", hours: "9am-4pm", tables: "80+", admission: "$5" },
  { name: "Sports Cards & TCG Show", date: "Apr 10-12", sortDate: "2026-04-10", venue: "Huntington Mall", city: "Barboursville", state: "West Virginia", stateAbbr: "WV", hours: "Fri 11am-7pm; Sat 10am-7pm; Sun 11am-3pm", tables: "150", admission: "Free" },
  { name: "Martinsburg Sports Card & TCG Show", date: "May 9", sortDate: "2026-05-09", venue: "201 N Queen St.", city: "Martinsburg", state: "West Virginia", stateAbbr: "WV", hours: "9am-3pm", tables: "50", admission: "Free" },
  { name: "The Bridgeport Card Fest", date: "May 23-24", sortDate: "2026-05-23", venue: "The Bridge Sports Complex", city: "Bridgeport", state: "West Virginia", stateAbbr: "WV", hours: "Sat 10am-5pm; Sun 10am-5pm", tables: "200+", admission: "$5" },

  // WISCONSIN
  { name: "The GOAT Card Show", date: "Mar 29", sortDate: "2026-03-29", venue: "Riverside Ballroom", city: "Green Bay", state: "Wisconsin", stateAbbr: "WI", hours: "9am-2pm", admission: "Free" },
  { name: "The Waukesha Card Show", date: "Apr 11", sortDate: "2026-04-11", venue: "The Waukesha Expo Center", city: "Waukesha", state: "Wisconsin", stateAbbr: "WI", hours: "10am-3pm", tables: "100+", admission: "$2" },
  { name: "Stevens Point Card Show", date: "Apr 18", sortDate: "2026-04-18", venue: "Elks Lodge 641", city: "Stevens Point", state: "Wisconsin", stateAbbr: "WI", hours: "9am-3pm", tables: "70", admission: "Free" },
  { name: "The Green Bay Card Show", date: "Apr 19", sortDate: "2026-04-19", venue: "Oneida Hotel & Casino", city: "Green Bay", state: "Wisconsin", stateAbbr: "WI", hours: "9am-3pm", tables: "200", admission: "Free" },
  { name: "Sports Card Extravaganza Show", date: "Apr 24-26", sortDate: "2026-04-24", venue: "Best Western Plus Conference Center", city: "Eau Claire", state: "Wisconsin", stateAbbr: "WI", hours: "Fri 11am-8pm; Sat 9am-6pm; Sun 11am-3pm", tables: "125", admission: "Free" },
  { name: "Madison Card Show", date: "Apr 26", sortDate: "2026-04-26", venue: "Madison Marriott South", city: "Madison", state: "Wisconsin", stateAbbr: "WI", hours: "9am-3pm", tables: "120", admission: "Free" },
  { name: "The Waukesha Card Show", date: "May 9", sortDate: "2026-05-09", venue: "The Waukesha Expo Center", city: "Waukesha", state: "Wisconsin", stateAbbr: "WI", hours: "10am-3pm", tables: "100+", admission: "$2" },
  { name: "The Green Bay Card Show", date: "May 23", sortDate: "2026-05-23", venue: "KI Convention Center", city: "Green Bay", state: "Wisconsin", stateAbbr: "WI", hours: "9am-4pm", tables: "170", admission: "Free" },
  { name: "Madison Card Show", date: "May 30", sortDate: "2026-05-30", venue: "Madison Marriott South", city: "Madison", state: "Wisconsin", stateAbbr: "WI", hours: "9am-3pm", tables: "120", admission: "Free" },
  { name: "The Green Bay Card Show", date: "Jul 5", sortDate: "2026-07-05", venue: "KI Convention Center", city: "Green Bay", state: "Wisconsin", stateAbbr: "WI", hours: "9am-4pm", tables: "180", admission: "Free" },
  { name: "Sports Card Extravaganza Show", date: "Aug 28-30", sortDate: "2026-08-28", venue: "Best Western Plus Conference Center", city: "Eau Claire", state: "Wisconsin", stateAbbr: "WI", hours: "Fri 11am-8pm; Sat 9am-6pm; Sun 11am-3pm", tables: "125", admission: "Free" },
  { name: "Sports Card Extravaganza Show", date: "Oct 23-25", sortDate: "2026-10-23", venue: "Best Western Plus Conference Center", city: "Eau Claire", state: "Wisconsin", stateAbbr: "WI", hours: "Fri 11am-8pm; Sat 9am-6pm; Sun 11am-3pm", tables: "125", admission: "Free" },
];

// Get unique states sorted A-Z
const ALL_STATES = [...new Set(CARD_SHOWS.map(s => s.state))].sort();

// Month filter options
const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function CardShows() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const stateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter and sort shows
  const filteredShows = useMemo(() => {
    let shows = [...CARD_SHOWS];
    
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      shows = shows.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.venue.toLowerCase().includes(q)
      );
    }
    
    // Month filter
    if (selectedMonth !== "all") {
      shows = shows.filter(s => s.sortDate.substring(5, 7) === selectedMonth);
    }
    
    return shows;
  }, [searchQuery, selectedMonth]);

  // Group by state
  const showsByState = useMemo(() => {
    const grouped: Record<string, CardShow[]> = {};
    for (const show of filteredShows) {
      if (!grouped[show.state]) grouped[show.state] = [];
      grouped[show.state].push(show);
    }
    // Sort shows within each state
    for (const state of Object.keys(grouped)) {
      grouped[state].sort((a, b) => {
        if (sortBy === "date") return a.sortDate.localeCompare(b.sortDate);
        return a.name.localeCompare(b.name);
      });
    }
    return grouped;
  }, [filteredShows, sortBy]);

  const sortedStates = Object.keys(showsByState).sort();
  const totalShows = filteredShows.length;
  const totalStates = sortedStates.length;

  const toggleState = (state: string) => {
    setExpandedStates(prev => {
      const next = new Set(prev);
      if (next.has(state)) next.delete(state);
      else next.add(state);
      return next;
    });
  };

  const expandAll = () => setExpandedStates(new Set(ALL_STATES));
  const collapseAll = () => setExpandedStates(new Set());

  const scrollToState = (state: string) => {
    stateRefs.current[state]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setExpandedStates(prev => new Set([...prev, state]));
  };

  // Check if a show date has passed
  const isPast = (sortDate: string) => {
    const today = new Date().toISOString().split("T")[0];
    return sortDate < today;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Card Shows Directory 2026"
        description="Find sports card shows across all 48 contiguous US states from March through December 2026. Organized A-Z by state with dates, venues, and details."
        path="/card-shows"
      />

      {/* ===== HERO HEADER ===== */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(249,115,22,0.15) 0%, transparent 50%)"
        }} />
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/15 border border-primary/30 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-bold tracking-wide">2026 SHOW DIRECTORY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-primary to-green-400" style={{ WebkitTextStroke: "1px rgba(249,115,22,0.3)" }}>
              CARD SHOWS
            </span>
            <br />
            <span className="text-foreground">ACROSS AMERICA</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Your complete directory of sports card shows in the lower 48 states.
            March through December 2026 — organized A-Z by state.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-bold">{totalStates} States</div>
                <div className="text-muted-foreground text-xs">Covered</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-bold">{totalShows} Shows</div>
                <div className="text-muted-foreground text-xs">Listed</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-bold">Mar - Dec</div>
                <div className="text-muted-foreground text-xs">2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTERS & SEARCH ===== */}
      <section className="sticky top-[72px] z-40 bg-background/95 backdrop-blur-md border-b border-border py-4">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search shows, cities, states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "name")}
              className="px-4 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
            {/* Expand/Collapse */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll} className="text-xs">
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs">
                Collapse
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATE QUICK NAV ===== */}
      <section className="py-4 border-b border-border/50">
        <div className="container">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {sortedStates.map(state => {
              const abbr = showsByState[state]?.[0]?.stateAbbr || state.substring(0, 2).toUpperCase();
              return (
                <button
                  key={state}
                  onClick={() => scrollToState(state)}
                  className="px-2.5 py-1 text-xs font-bold rounded bg-card border border-border hover:border-primary hover:text-primary transition-colors"
                  title={state}
                >
                  {abbr}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SHOW LISTINGS ===== */}
      <section className="py-8">
        <div className="container max-w-5xl">
          {sortedStates.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No Shows Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            sortedStates.map(state => {
              const shows = showsByState[state];
              const isExpanded = expandedStates.has(state);
              const featuredCount = shows.filter(s => s.featured).length;
              
              return (
                <div
                  key={state}
                  ref={el => { stateRefs.current[state] = el; }}
                  className="mb-6 scroll-mt-40"
                >
                  {/* State Header */}
                  <button
                    onClick={() => toggleState(state)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-card via-card to-card/80 border border-border rounded-lg hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center font-black text-primary text-sm">
                        {shows[0]?.stateAbbr}
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {state}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {shows.length} show{shows.length !== 1 ? "s" : ""}
                          {featuredCount > 0 && (
                            <span className="ml-2 text-orange-500">
                              <Star className="w-3 h-3 inline -mt-0.5" /> {featuredCount} featured
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {/* Shows List */}
                  {isExpanded && (
                    <div className="mt-2 space-y-2 pl-2 sm:pl-4">
                      {shows.map((show, idx) => {
                        const past = isPast(show.sortDate);
                        return (
                          <div
                            key={`${show.name}-${show.sortDate}-${idx}`}
                            className={`relative p-4 rounded-lg border transition-colors ${
                              show.featured
                                ? "bg-gradient-to-r from-orange-500/10 via-card to-primary/5 border-orange-500/40 hover:border-orange-500/60"
                                : past
                                ? "bg-card/50 border-border/50 opacity-60"
                                : "bg-card border-border hover:border-primary/30"
                            }`}
                          >
                            {show.featured && (
                              <div className="absolute top-2 right-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 rounded-full text-[10px] font-bold text-orange-500 uppercase">
                                  <Star className="w-3 h-3" /> Featured
                                </span>
                              </div>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                              {/* Date Badge */}
                              <div className={`shrink-0 w-20 text-center py-2 rounded-lg border ${
                                show.featured
                                  ? "bg-orange-500/15 border-orange-500/30"
                                  : "bg-primary/10 border-primary/20"
                              }`}>
                                <div className={`text-xs font-bold uppercase ${show.featured ? "text-orange-500" : "text-primary"}`}>
                                  {show.date.split(" ")[0]}
                                </div>
                                <div className="text-lg font-black text-foreground leading-tight">
                                  {show.date.split(" ").slice(1).join(" ").replace(",", "")}
                                </div>
                              </div>
                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-bold text-sm sm:text-base ${show.featured ? "text-orange-400" : "text-foreground"}`}>
                                  {show.name}
                                </h3>
                                <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                                  <div className="flex items-start gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" />
                                    <span>{show.venue}, {show.city}, {show.stateAbbr}</span>
                                  </div>
                                  {show.hours && (
                                    <div className="flex items-start gap-1.5">
                                      <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/70" />
                                      <span>{show.hours}</span>
                                    </div>
                                  )}
                                  <div className="flex flex-wrap gap-3 mt-2">
                                    {show.tables && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-[11px]">
                                        <Users className="w-3 h-3" /> {show.tables} tables
                                      </span>
                                    )}
                                    {show.admission && (
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                                        show.admission === "Free"
                                          ? "bg-primary/15 text-primary font-bold"
                                          : "bg-muted"
                                      }`}>
                                        <DollarSign className="w-3 h-3" /> {show.admission === "Free" ? "FREE" : show.admission}
                                      </span>
                                    )}
                                    {past && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-destructive/15 text-destructive rounded text-[11px] font-bold">
                                        Past Event
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ===== DISCLAIMER ===== */}
      <section className="py-8 border-t border-border">
        <div className="container max-w-3xl text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Show information compiled from Sports Collectors Digest, TCDB.com, and major show promoters.
            Dates, times, and details are subject to change — always verify with the show organizer before attending.
            Have a show to add? <a href="/contact" className="text-primary hover:underline">Contact us</a>.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: March 2026 &middot; Covers March 1 - December 31, 2026
          </p>
        </div>
      </section>
    </div>
  );
}
