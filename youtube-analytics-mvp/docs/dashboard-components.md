# Dashboard Components Documentation

## EngagementDonut Component

### Overview

The EngagementDonut component displays engagement metrics (likes, comments, shares, saves) in an interactive donut chart format with color-coded segments and a detailed legend.

### Features

- **SVG Donut Chart**: Animated circular progress visualization
- **Color-coded Segments**: Each engagement type has a distinct color
  - Likes: Red (#EF4444)
  - Comments: Blue (#3B82F6)
  - Shares: Green (#10B981)
  - Saves: Yellow (#F59E0B)
- **Interactive Legend**: Shows icons, percentages, and absolute values
- **Center Statistics**: Total engagement count with smart formatting (K for thousands)
- **Additional Metrics**: Positive engagement rate and engagement multiplier

### Props

```typescript
interface EngagementDonutProps {
  likes: number; // Total likes count
  comments: number; // Total comments count
  shares: number; // Total shares count
  saves: number; // Total saves count
}
```

### Usage Example

```tsx
<EngagementDonut likes={8500} comments={1200} shares={650} saves={480} />
```

---

## GeographyMap Component

### Overview

The GeographyMap component shows the geographic distribution of viewers with country flags, percentages, view counts, and growth indicators in a visually appealing layout.

### Features

- **Visual Country Representation**: Flag emojis for each country
- **Ranking System**: Top 3 countries get special badges (gold, silver, bronze)
- **Growth Indicators**: Shows percentage growth with trending icons
- **Interactive Hover States**: Smooth transitions and hover effects
- **Scrollable List**: Complete country breakdown with progress bars
- **Summary Statistics**: Total countries, top location, and top 3 percentage

### Props

```typescript
interface GeographyData {
  country: string; // Country name (e.g., "United States")
  code: string; // Country code for flag lookup (e.g., "US")
  views: number; // Total views from this country
  percentage: number; // Percentage of total views
  growth?: string; // Growth indicator (e.g., "+12.5%")
}

interface GeographyMapProps {
  data: GeographyData[];
}
```

### Usage Example

```tsx
<GeographyMap
  data={[
    {
      country: "United States",
      code: "US",
      views: 209600,
      percentage: 40.0,
      growth: "+12.5%",
    },
    {
      country: "United Kingdom",
      code: "GB",
      views: 78600,
      percentage: 15.0,
      growth: "+8.3%",
    },
    // ... more countries
  ]}
/>
```

### Supported Country Codes

The component includes flag emojis for major countries:

- US 🇺🇸, GB 🇬🇧, CA 🇨🇦, AU 🇦🇺, DE 🇩🇪, FR 🇫🇷
- JP 🇯🇵, IN 🇮🇳, BR 🇧🇷, IT 🇮🇹, ES 🇪🇸, MX 🇲🇽
- NL 🇳🇱, SE 🇸🇪, NO 🇳🇴
- Default: 🌍 for unrecognized codes

---

## Dashboard Integration

### Layout

Both components are integrated into the dashboard in a responsive grid:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
  <EngagementDonut {...engagementProps} />
  <GeographyMap {...geographyProps} />
</div>
```

### Responsive Design

- **Mobile (< 1024px)**: Single column layout
- **Desktop (≥ 1024px)**: Two column side-by-side layout
- Both components adapt their internal layouts for smaller screens

### Data Source

Currently uses sample data but designed to accept real data from:

- YouTube Analytics API
- Database metrics
- Real-time analytics services

### Styling

- Consistent with application design system
- Sandy yellow (#F4D03F) primary color
- Ebony clay (#2C3E50) text color
- Smooth animations and transitions
- Proper spacing and typography hierarchy

### Performance

- Optimized SVG rendering for the donut chart
- Efficient country flag lookup system
- Scroll optimization for large country lists
- Smooth CSS transitions without JavaScript animation overhead
