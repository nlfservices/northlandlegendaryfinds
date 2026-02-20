// Facebook Pixel tracking utilities
// Use these functions throughout your app to track user behavior

declare global {
  interface Window {
    fbq: any;
  }
}

// Check if Facebook Pixel is loaded
const isFBPixelLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};

// Track page views (automatically tracked, but can be called manually for SPA navigation)
export const trackPageView = () => {
  if (isFBPixelLoaded()) {
    window.fbq('track', 'PageView');
  }
};

// Track when user views a product
export const trackViewContent = (productName: string, productId: string, value: number, currency: string = 'USD') => {
  if (isFBPixelLoaded()) {
    window.fbq('track', 'ViewContent', {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value: value,
      currency: currency
    });
  }
};

// Track when user adds item to cart
export const trackAddToCart = (productName: string, productId: string, value: number, quantity: number = 1, currency: string = 'USD') => {
  if (isFBPixelLoaded()) {
    window.fbq('track', 'AddToCart', {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value: value,
      currency: currency,
      num_items: quantity
    });
  }
};

// Track when user initiates checkout
export const trackInitiateCheckout = (value: number, numItems: number, currency: string = 'USD') => {
  if (isFBPixelLoaded()) {
    window.fbq('track', 'InitiateCheckout', {
      value: value,
      currency: currency,
      num_items: numItems
    });
  }
};

// Track when user adds payment info
export const trackAddPaymentInfo = (value: number, currency: string = 'USD') => {
  if (isFBPixelLoaded()) {
    window.fbq('track', 'AddPaymentInfo', {
      value: value,
      currency: currency
    });
  }
};

// Track completed purchase
export const trackPurchase = (value: number, orderId: string, numItems: number, currency: string = 'USD') => {
  if (isFBPixelLoaded()) {
    window.fbq('track', 'Purchase', {
      value: value,
      currency: currency,
      content_type: 'product',
      num_items: numItems,
      transaction_id: orderId
    });
  }
};

// Track lead generation (form submissions)
export const trackLead = (contentName: string, contentCategory: string = 'General') => {
  if (isFBPixelLoaded()) {
    window.fbq('track', 'Lead', {
      content_name: contentName,
      content_category: contentCategory
    });
  }
};

// Track search queries
export const trackSearch = (searchQuery: string) => {
  if (isFBPixelLoaded()) {
    window.fbq('track', 'Search', {
      search_string: searchQuery
    });
  }
};

// Track button clicks and engagement
export const trackContact = (method: string = 'button') => {
  if (isFBPixelLoaded()) {
    window.fbq('track', 'Contact', {
      contact_method: method
    });
  }
};

// Track custom events (for specific actions unique to your business)
export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (isFBPixelLoaded()) {
    window.fbq('trackCustom', eventName, parameters);
  }
};

// Track when user views category/collection page
export const trackViewCategory = (categoryName: string) => {
  if (isFBPixelLoaded()) {
    window.fbq('trackCustom', 'ViewCategory', {
      category_name: categoryName
    });
  }
};

// Track when user spends significant time on page (engaged visitor)
export const trackEngagement = (pageName: string, timeSpent: number) => {
  if (isFBPixelLoaded()) {
    window.fbq('trackCustom', 'Engagement', {
      page_name: pageName,
      time_spent_seconds: timeSpent
    });
  }
};

// Track cart abandonment (call this when user leaves checkout)
export const trackAbandonCart = (value: number, numItems: number, currency: string = 'USD') => {
  if (isFBPixelLoaded()) {
    window.fbq('trackCustom', 'AbandonCart', {
      value: value,
      currency: currency,
      num_items: numItems
    });
  }
};
