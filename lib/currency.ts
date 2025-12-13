/**
 * Currency conversion utilities
 * Uses live exchange rates from exchangerate-api.com (free tier)
 */

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/EUR';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface ExchangeRates {
  rates: {
    [key: string]: number;
  };
  base: string;
  date: string;
}

let cachedRates: ExchangeRates | null = null;
let cacheTimestamp: number = 0;

/**
 * Fetch exchange rates from API
 */
async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const response = await fetch(EXCHANGE_RATE_API, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data = await response.json();
    return {
      rates: data.rates,
      base: data.base,
      date: data.date,
    };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fallback to approximate rate if API fails
    return {
      rates: {
        USD: 1.08, // Approximate EUR to USD rate
      },
      base: 'EUR',
      date: new Date().toISOString(),
    };
  }
}

/**
 * Get exchange rates (with caching)
 */
async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (cachedRates && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedRates;
  }
  
  // Fetch new rates
  cachedRates = await fetchExchangeRates();
  cacheTimestamp = now;
  
  return cachedRates;
}

/**
 * Convert EUR amount to USD using live exchange rates
 */
export async function convertEURtoUSD(eurAmount: number): Promise<number> {
  const rates = await getExchangeRates();
  const usdRate = rates.rates.USD || 1.08; // Fallback rate
  return eurAmount * usdRate;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, currency: string): string {
  const formatted = amount.toFixed(2);
  
  switch (currency) {
    case 'EUR':
      return `€${formatted}`;
    case 'USD':
      return `$${formatted}`;
    default:
      return `${currency} ${formatted}`;
  }
}

/**
 * Get price display with both EUR and USD (if needed)
 */
export async function getPriceDisplay(
  eurPrice: number,
  showUSD: boolean = true
): Promise<{ eur: string; usd?: string }> {
  const eurDisplay = formatPrice(eurPrice, 'EUR');
  
  if (!showUSD) {
    return { eur: eurDisplay };
  }
  
  const usdPrice = await convertEURtoUSD(eurPrice);
  const usdDisplay = formatPrice(usdPrice, 'USD');
  
  return {
    eur: eurDisplay,
    usd: usdDisplay,
  };
}

