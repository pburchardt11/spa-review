// lib/content.js
// Editorial content generators for SEO
// In production, you'd use AI (Claude API) to generate unique content for each page
// These templates provide a strong baseline that can be enhanced over time

const CITY_INTROS = {
  'Bangkok': 'Bangkok stands as Southeast Asia\'s undisputed wellness capital, where ancient Thai healing traditions merge seamlessly with cutting-edge medical spa technology. From riverside luxury hotels to hidden temple-district retreats, the city offers an extraordinary breadth of spa experiences at prices that make world-class treatments accessible to all.',
  'Tokyo': 'Tokyo\'s spa scene is a masterclass in precision and ritual. The city blends centuries-old onsen culture with futuristic beauty technology, creating experiences found nowhere else on Earth. From Michelin-starred ryokan baths to Ginza\'s most exclusive facial bars, every treatment reflects the Japanese philosophy of meticulous care.',
  'Bali': 'Bali has earned its reputation as the world\'s spiritual wellness destination. Ubud\'s jungle retreats, Seminyak\'s design-forward day spas, and Uluwatu\'s clifftop sanctuaries each offer distinct paths to renewal. What unites them is the island\'s deep healing energy — Balinese therapists are renowned as some of the most intuitive practitioners in the world.',
  'London': 'London\'s spa landscape is as layered as the city itself — Georgian townhouse hammams, members-only Mayfair treatment rooms, and vast Korean-style jjimjilbangs coexist within the same postcodes. The city has quietly become Europe\'s most diverse wellness destination, with practitioners drawn from every healing tradition on the planet.',
  'Paris': 'Paris approaches spa culture the way it approaches everything — with unapologetic refinement. The city\'s grand palace hotels house legendary treatment rooms by Guerlain, Dior, and Chanel, while a new generation of concept spas in the Marais and Saint-Germain is redefining French beauty rituals for the modern age.',
  'New York': 'New York\'s spa scene moves at the city\'s pace — fast, competitive, and always innovating. From Koreatown\'s 24-hour bathhouses to Fifth Avenue medical spas offering treatments that blur the line between luxury and clinical care, the city offers every conceivable wellness experience within a few subway stops.',
  'Dubai': 'Dubai has transformed itself into a global spa destination with characteristic ambition. The city\'s hotel spas are among the largest and most lavishly appointed on Earth, while a growing number of standalone wellness centers offer everything from traditional hammam rituals to cryotherapy and IV drip bars.',
};

const COUNTRY_INTROS = {
  'Thailand': 'Thailand is where the modern spa industry was born. From the traditional Thai massage parlors of Chiang Mai to the ultra-luxury wellness resorts of Koh Samui and Hua Hin, the country offers the widest range of spa experiences in Asia at every price point. Thai therapists are globally renowned for their skill, warmth, and intuitive touch.',
  'Italy': 'Italy\'s wellness tradition stretches back to the Roman thermae. Today, the country leads Europe in medical spa innovation — Merano, Lake Garda, and Fiuggi are home to world-class clinics combining thermal healing with modern diagnostics. Meanwhile, Tuscan countryside retreats and Amalfi Coast hotel spas offer pure indulgence.',
  'Japan': 'Japan\'s bathing culture is the world\'s most refined. From volcanic onsen towns like Beppu and Hakone to Tokyo\'s design-forward urban spas, the country treats bathing as both daily ritual and profound art form. The attention to detail — in water temperature, seasonal botanicals, and spatial design — is unmatched.',
  'United States': 'The American spa market is the world\'s largest and most diverse. California\'s wellness retreats pioneered the destination spa concept, while Arizona\'s desert resorts offer healing landscapes found nowhere else. New York and Miami push the boundaries of medical aesthetics, and Hawaii merges Polynesian healing traditions with resort luxury.',
  'France': 'France invented the concept of "thalassotherapy" and remains Europe\'s leading authority on water-based wellness. From the thermal towns of Évian and Vichy to the palace hotel spas of Paris and the Côte d\'Azur, the French approach wellness with the same seriousness they bring to gastronomy — as a sophisticated art form.',
  'Switzerland': 'Switzerland is home to the world\'s most exclusive medical spas and longevity clinics. Clinique La Prairie, Chenot Palace, and Bürgenstock represent the pinnacle of science-driven wellness. The Swiss Alps provide a natural complement — pure air, pristine water, and landscapes that heal simply by being present.',
  'India': 'India is the birthplace of Ayurveda, yoga, and meditation — three pillars of the global wellness movement. Kerala\'s backwater retreats offer authentic panchakarma treatments, Rishikesh provides spiritual immersion at the source, and new-generation urban spas in Mumbai and Bangalore bring ancient wisdom into contemporary settings.',
};

/**
 * Get editorial intro for a city (or generate one)
 */
export function getCityIntro(city, country, spaCount) {
  if (CITY_INTROS[city]) return CITY_INTROS[city];
  
  // Generate a template-based intro for cities without custom content
  const templates = [
    `${city} offers a vibrant and growing spa scene that reflects the best of ${country}'s wellness traditions. With ${spaCount}+ spas and wellness centers to choose from, visitors can find everything from intimate day spas to full-service resort experiences. The city's unique character — its climate, culture, and natural surroundings — shapes treatments you won't find anywhere else.`,
    `Discover ${city}'s finest spas and wellness retreats, where ${country}'s healing heritage meets contemporary luxury. The city's ${spaCount}+ spa venues range from boutique treatment rooms to expansive wellness complexes, each offering a distinctive approach to relaxation and renewal. Whether you're seeking a quick escape or a transformative multi-day program, ${city} delivers.`,
    `${city}, ${country} has emerged as a compelling wellness destination with ${spaCount}+ spas catering to every preference and budget. Local traditions inform many of the signature treatments available here, while international brands bring global standards of luxury and innovation. The result is a spa scene that's both authentically local and world-class.`,
  ];
  
  // Deterministic selection based on city name
  const hash = [...city].reduce((a, c) => a + c.charCodeAt(0), 0);
  return templates[hash % templates.length];
}

/**
 * Get editorial intro for a country (or generate one)
 */
export function getCountryIntro(country, cityCount, spaCount) {
  if (COUNTRY_INTROS[country]) return COUNTRY_INTROS[country];
  
  const templates = [
    `${country} boasts a diverse and expanding spa landscape, with ${spaCount}+ wellness venues spread across ${cityCount} cities and regions. From urban day spas to countryside retreats, the country offers travelers a compelling range of treatment styles rooted in local traditions and enhanced by global wellness trends.`,
    `With ${spaCount}+ spas across ${cityCount} destinations, ${country} has established itself as a noteworthy player in the global wellness tourism market. The country's natural resources — from mineral-rich waters to native botanicals — inform many signature treatments, while international hospitality brands ensure consistently high standards.`,
    `${country}'s spa scene reflects the country's broader character: a blend of deep-rooted traditions and forward-looking innovation. Across ${cityCount} cities, ${spaCount}+ spas offer everything from traditional healing rituals to cutting-edge longevity programs, making the country a versatile destination for wellness travelers at every level.`,
  ];
  
  const hash = [...country].reduce((a, c) => a + c.charCodeAt(0), 0);
  return templates[hash % templates.length];
}

/**
 * Generate a spa description
 */
export function getSpaDescription(spa) {
  const offerings = spa.offerings || [];
  const topServices = offerings.slice(0, 5).join(', ');
  
  const templates = [
    `${spa.name} is a ${spa.type.toLowerCase()} located in the heart of ${spa.city}, ${spa.country}. With a Google rating of ${spa.rating}/5 from ${spa.reviews.toLocaleString()} verified reviews, it ranks among the top-rated wellness venues in the region. Guests can enjoy ${topServices}, and more in a setting designed for complete relaxation and renewal.`,
    `Set in ${spa.city}, ${spa.country}, ${spa.name} offers a curated ${spa.type.toLowerCase()} experience that has earned praise from ${spa.reviews.toLocaleString()} reviewers on Google, maintaining an impressive ${spa.rating}/5 rating. The spa's menu of services includes ${topServices}, delivered by skilled practitioners in an atmosphere of refined tranquility.`,
    `${spa.name} brings world-class ${spa.type.toLowerCase()} treatments to ${spa.city}, ${spa.country}. Rated ${spa.rating}/5 across ${spa.reviews.toLocaleString()} Google reviews, this venue has built a reputation for excellence through its commitment to quality, featuring ${topServices} among its signature offerings.`,
  ];
  
  const hash = [...spa.name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return templates[hash % templates.length];
}

/**
 * Generate FAQ content for a city page
 */
export function getCityFAQs(city, country, topSpas) {
  const topName = topSpas[0]?.name || `the top-rated spa in ${city}`;
  return [
    {
      question: `What is the best spa in ${city}, ${country}?`,
      answer: `Based on verified Google reviews and our expert analysis, ${topName} is currently the highest-rated spa in ${city}. It maintains a ${topSpas[0]?.rating || 4.5}/5 rating from ${(topSpas[0]?.reviews || 500).toLocaleString()} reviews.`,
    },
    {
      question: `How much does a spa treatment cost in ${city}?`,
      answer: `Spa treatment prices in ${city} vary widely depending on the type of venue. Day spas typically start from $30-80 for basic treatments, while luxury hotel spas and medical spas can range from $100-500+ per session. Multi-day wellness retreat packages may cost $200-2,000+ per night.`,
    },
    {
      question: `Do I need to book spa treatments in advance in ${city}?`,
      answer: `For popular spas in ${city}, especially during peak tourist season, advance booking is strongly recommended — ideally 1-2 weeks ahead. Many top spas offer online booking. Walk-in availability is more common at day spas and during off-peak hours.`,
    },
    {
      question: `What types of spas are available in ${city}?`,
      answer: `${city} offers a diverse range of spa types including day spas for quick treatments, hotel spas within luxury properties, resort spas with full amenities, medical spas offering clinical treatments, wellness retreats for multi-day programs, and specialized thermal spas where geothermal resources are available.`,
    },
  ];
}

/**
 * Blog post ideas generator for content calendar
 */
export function generateBlogIdeas(countries, cities) {
  const ideas = [];
  
  // City guides
  for (const city of cities.slice(0, 30)) {
    ideas.push({
      title: `The Complete Guide to Spas in ${city} (${new Date().getFullYear()})`,
      slug: `best-spas-${city.toLowerCase().replace(/\s+/g, '-')}`,
      category: 'City Guide',
      targetKeyword: `best spas ${city}`,
    });
  }
  
  // Type comparisons
  const types = ['Medical Spa', 'Day Spa', 'Wellness Retreat', 'Thermal Spa'];
  for (const type of types) {
    ideas.push({
      title: `What Is a ${type}? Everything You Need to Know`,
      slug: `what-is-a-${type.toLowerCase().replace(/\s+/g, '-')}`,
      category: 'Education',
      targetKeyword: `what is a ${type.toLowerCase()}`,
    });
  }
  
  // Seasonal content
  ideas.push(
    { title: 'Best Winter Spa Destinations for 2026', slug: 'best-winter-spa-destinations', category: 'Seasonal', targetKeyword: 'winter spa destinations' },
    { title: 'Top Luxury Spa Resorts for a Summer Escape', slug: 'luxury-spa-resorts-summer', category: 'Seasonal', targetKeyword: 'luxury spa resorts summer' },
    { title: 'Best Couples Spa Retreats Around the World', slug: 'best-couples-spa-retreats', category: 'Lifestyle', targetKeyword: 'couples spa retreat' },
    { title: 'The Ultimate Guide to Spa Etiquette', slug: 'spa-etiquette-guide', category: 'Education', targetKeyword: 'spa etiquette' },
    { title: 'Medical Spa vs Day Spa: Which Is Right for You?', slug: 'medical-spa-vs-day-spa', category: 'Education', targetKeyword: 'medical spa vs day spa' },
    { title: 'The 10 Best Thermal Spas in Europe', slug: 'best-thermal-spas-europe', category: 'Regional', targetKeyword: 'best thermal spas europe' },
    { title: 'Wellness Retreats That Will Change Your Life', slug: 'best-wellness-retreats', category: 'Lifestyle', targetKeyword: 'best wellness retreats' },
  );
  
  return ideas;
}
