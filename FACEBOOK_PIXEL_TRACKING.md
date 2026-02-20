# 📊 Facebook Pixel Tracking Guide

## Pixel ID: 839598775754379

---

## ✅ What's Already Tracking

### Automatic Events
- **PageView** - Every page visit across your entire site
- **Lead** - Email form submissions on countdown page

---

## 🛠️ How to Use Tracking in Your Code

Import the tracking functions from `/client/src/lib/fbPixel.ts`:

```typescript
import { 
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  // ... etc
} from '@/lib/fbPixel';
```

---

## 📈 Tracking Events to Add

### When Building Product Pages:
```typescript
// When user views a product
trackViewContent(
  'Marvel Premium Pack',  // product name
  'prod_123',             // product ID
  29.99,                  // price
  'USD'                   // currency
);
```

### When User Adds to Cart:
```typescript
trackAddToCart(
  'Marvel Premium Pack',
  'prod_123',
  29.99,
  1,      // quantity
  'USD'
);
```

### When User Starts Checkout:
```typescript
trackInitiateCheckout(
  89.97,  // total cart value
  3,      // number of items
  'USD'
);
```

### When User Completes Purchase:
```typescript
trackPurchase(
  89.97,           // total
  'order_456',     // order ID
  3,               // items
  'USD'
);
```

### When User Searches:
```typescript
trackSearch('iron man cards');
```

### Track Category Views:
```typescript
trackViewCategory('Marvel Cards');
```

### Track Engagement (time on page):
```typescript
// After user spends 30+ seconds on page
useEffect(() => {
  const timer = setTimeout(() => {
    trackEngagement('Product Page', 30);
  }, 30000);
  return () => clearTimeout(timer);
}, []);
```

### Track Cart Abandonment:
```typescript
// When user leaves checkout without purchasing
trackAbandonCart(89.97, 3, 'USD');
```

---

## 🎯 Custom Audiences You Can Build

With this tracking, you can create these audiences in Facebook Ads Manager:

### Warm Audiences:
- **All Website Visitors** (last 30/60/90 days)
- **Countdown Page Visitors** (interested but didn't sign up)
- **Email Signups** (Lead event)
- **Product Page Viewers** (ViewContent event)
- **Engaged Visitors** (30+ seconds on site)

### Hot Audiences:
- **Add to Cart** (high intent, didn't buy)
- **Initiated Checkout** (very high intent)
- **Cart Abandoners** (need retargeting)

### Conversion Audiences:
- **Purchasers** (for cross-sell/upsell)
- **High-Value Customers** (Purchase value > $100)

### Lookalike Audiences:
- **1% Lookalike of Purchasers** (find similar buyers)
- **1% Lookalike of Email Signups** (find similar leads)

---

## 📊 Key Metrics to Monitor

### Conversion Funnel:
1. **PageView** → How many visitors
2. **ViewContent** → How many view products
3. **AddToCart** → How many add to cart
4. **InitiateCheckout** → How many start checkout
5. **Purchase** → How many complete purchase

### Drop-off Analysis:
- **ViewContent → AddToCart** = Product interest rate
- **AddToCart → InitiateCheckout** = Cart abandonment rate
- **InitiateCheckout → Purchase** = Checkout abandonment rate

### ROI Calculation:
- **Cost Per Lead** = Ad spend ÷ Lead events
- **Cost Per Purchase** = Ad spend ÷ Purchase events
- **ROAS** (Return on Ad Spend) = Purchase value ÷ Ad spend

---

## 🧪 Testing Your Pixel

1. Go to **Facebook Events Manager**
2. Click **Test Events**
3. Enter your website URL
4. Click around your site
5. Watch events appear in real-time

---

## 🚀 Next Steps

When you build your e-commerce store, add tracking to:
- [ ] Product pages (`trackViewContent`)
- [ ] Add to cart buttons (`trackAddToCart`)
- [ ] Checkout page load (`trackInitiateCheckout`)
- [ ] Payment form (`trackAddPaymentInfo`)
- [ ] Order confirmation (`trackPurchase`)
- [ ] Search bar (`trackSearch`)
- [ ] Category pages (`trackViewCategory`)

---

**Last Updated:** February 19, 2026
