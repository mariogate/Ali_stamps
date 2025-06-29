// Merchant logo mapping utility
export const getMerchantLogo = (merchantName: string) => {
  if (!merchantName) {
    // Return a default placeholder if name is invalid
    return require('../../assets/Design/Merchants logos/seecoz.png'); 
  }

  // Sanitize the name for matching
  const sanitizedName = merchantName.toLowerCase().replace(/ & /g, '_and_').replace(/ /g, '_');
    
  switch (sanitizedName) {
    case 'subway':
      return require('../../assets/Design/Merchants logos/subway.png');
    case 'hirds':
      return require('../../assets/Design/Merchants logos/hirds.png');
    case 'granita':
      return require('../../assets/Design/Merchants logos/granita.png');
    case 'mola':
    case 'molas':
      return require('../../assets/Design/Merchants logos/molas.png');
    case 'munch_and_shake':
    case 'munch_&_shake': // Handle both variants
        return require('../../assets/Design/Merchants logos/munch.png');
    case 'daily_dose':
    case 'daily_dose_by_café_younes': // Handle accented chars
      return require('../../assets/Design/Merchants logos/daily_dose.png');
      default:
      console.warn(`Logo not found for merchant: "${merchantName}" (sanitized to: "${sanitizedName}")`);
      return require('../../assets/Design/Merchants logos/seecoz.png'); // Fallback to placeholder
  }
}; 