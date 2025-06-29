// Utility function to get promotional images (offers and rewards) from local assets
export const getPromotionalImage = (imageUrl: string) => {
  if (!imageUrl) {
    // Return a default placeholder image
    return require('../../assets/Design/Website icons/Group 485.png');
  }

  // Handle local:// URLs
  if (imageUrl.startsWith('local://')) {
    const imageName = imageUrl.replace('local://', '');
    
    // Map promotional image names to local assets
    const promotionalImageMap: { [key: string]: any } = {
      // Offer images
      'subway_offer.png': require('../../assets/Design/Merchants logos/subway.png'),
      'mola_offer.png': require('../../assets/Design/Merchants logos/molas.png'),
      'hirds_offer.png': require('../../assets/Design/Merchants logos/hirds.png'),
      'granita_offer.png': require('../../assets/Design/Merchants logos/granita.png'),
      'munch_offer.png': require('../../assets/Design/Merchants logos/munch.png'),
      'daily_dose_offer.png': require('../../assets/Design/Merchants logos/daily_dose.png'),
      // Reward images
      'subway_reward.png': require('../../assets/Design/Merchants logos/subway.png'),
      'mola_reward.png': require('../../assets/Design/Merchants logos/molas.png'),
      'hirds_reward.png': require('../../assets/Design/Merchants logos/hirds.png'),
      'granita_reward.png': require('../../assets/Design/Merchants logos/granita.png'),
      'munch_reward.png': require('../../assets/Design/Merchants logos/munch.png'),
      'daily_dose_reward.png': require('../../assets/Design/Merchants logos/daily_dose.png'),
    };

    return promotionalImageMap[imageName] || require('../../assets/Design/Website icons/Group 485.png');
  }

  // For external URLs, return the URL as is
  return { uri: imageUrl };
};

// Alias for backward compatibility
export const getOfferImage = getPromotionalImage; 