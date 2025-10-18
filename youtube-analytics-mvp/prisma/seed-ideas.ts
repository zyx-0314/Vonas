/**
 * Script: prisma/seed-ideas.ts
 * Purpose: Seed the database with sample ideas for development and testing.
 * Usage: npx tsx prisma/seed-ideas.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleIdeas = [
  {
    title: "YouTube Shorts Strategy",
    content: `# YouTube Shorts Strategy

## Current Performance
- Average views: 2.5K per short
- Best performing time: 7-9 PM EST
- Top topics: Tech tips, Quick tutorials

## Ideas to Implement
1. **Series Format**: Create connected shorts that encourage binge-watching
2. **Trending Audio**: Use popular sounds and music
3. **Hook in First 3 Seconds**: Strong opening to prevent scrolling
4. **Call-to-Action**: Clear next steps for viewers

## Content Calendar
- Monday: Tech Tips
- Wednesday: Behind the Scenes  
- Friday: Quick Tutorials
- Sunday: Community Q&A

## Metrics to Track
- Watch time retention
- Comments engagement
- Shares and saves
- Subscriber conversion rate`,
    tags: ["strategy", "shorts", "content-planning"],
    priority: "HIGH" as const,
    status: "ACTIVE" as const,
    position: 1
  },
  {
    title: "Collaboration Ideas",
    content: `# Potential Collaborations

## Tech YouTubers
- **TechReview Channel** (450K subs)
  - Mutual benefit: Product reviews exchange
  - Contact: tech@example.com
  - Status: Initial outreach sent

- **CodeWithSarah** (120K subs)
  - Collaboration type: Tutorial series
  - Topic: Web development for beginners
  - Timeline: Q2 2024

## Cross-Platform Opportunities
- Podcast appearances
- Instagram takeovers
- Twitter Spaces hosting
- LinkedIn article features

## Partnership Benefits
- Audience cross-pollination
- Shared production costs
- Content diversity
- Network expansion`,
    tags: ["collaboration", "networking", "growth"],
    priority: "MEDIUM" as const,
    status: "ACTIVE" as const,
    position: 2
  },
  {
    title: "Channel Branding Update",
    content: `# Channel Branding Refresh

## Current Issues
- Logo feels outdated
- Inconsistent thumbnail style
- Banner doesn't reflect content focus

## New Brand Direction
- **Colors**: Modern tech palette (blues, grays, accent orange)
- **Typography**: Clean, readable fonts
- **Style**: Minimalist with tech elements

## Action Items
- [ ] Design new logo variations
- [ ] Create thumbnail templates (3-4 styles)
- [ ] Update channel banner
- [ ] Refresh video intro/outro
- [ ] Update social media profiles

## Budget Allocation
- Logo design: $200-400
- Template creation: $150-300
- Professional photos: $100-200

## Timeline
- Week 1: Logo concepts
- Week 2: Thumbnail templates
- Week 3: Implementation
- Week 4: Full rollout`,
    tags: ["branding", "design", "channel-update"],
    priority: "MEDIUM" as const,
    status: "ACTIVE" as const,
    position: 3
  },
  {
    title: "Monetization Optimization",
    content: `# Revenue Stream Analysis

## Current Revenue (Monthly)
- Ad Revenue: $2,850
- Sponsorships: $1,200
- Affiliate: $450
- **Total**: $4,500

## Optimization Opportunities
1. **Channel Memberships**
   - Exclusive content for members
   - Behind-the-scenes access
   - Monthly Q&A sessions
   - Estimated additional: $300-500/month

2. **Digital Products**
   - Course creation: "YouTube Success Blueprint"
   - Templates and resources
   - One-on-one consulting
   - Potential: $1,000-2,000/month

3. **Sponsored Content Strategy**
   - Raise rates based on engagement
   - Long-term partnerships
   - Product integration vs standalone ads
   - Target: 50% rate increase

## Implementation Plan
- Month 1: Set up memberships
- Month 2: Create first digital product
- Month 3: Renegotiate sponsor rates`,
    tags: ["monetization", "revenue", "business"],
    priority: "HIGH" as const,
    status: "ACTIVE" as const,
    position: 4
  },
  {
    title: "Content Series: \"Tech for Beginners\"",
    content: `# Tech for Beginners Series

## Series Overview
8-part educational series targeting newcomers to technology

## Episode Structure
1. **"What is Cloud Computing?"** - 12 min
2. **"Understanding APIs"** - 10 min  
3. **"Databases Explained"** - 15 min
4. **"Web vs Mobile Development"** - 13 min
5. **"Cybersecurity Basics"** - 11 min
6. **"AI and Machine Learning 101"** - 14 min
7. **"Blockchain Simplified"** - 12 min
8. **"Future of Technology"** - 16 min

## Production Notes
- Simple animations and graphics
- Real-world examples
- No jargon or technical terms
- Include practical applications

## Success Metrics
- Target: 15K+ views per episode
- 8% subscriber conversion rate
- 70%+ watch time retention
- High engagement (comments/likes)

## Publishing Schedule
- Release: Every Tuesday at 2 PM EST
- Duration: 8 weeks
- Promotion: 1 week pre-launch`,
    tags: ["series", "education", "beginners", "content-planning"],
    priority: "HIGH" as const,
    status: "ACTIVE" as const,
    position: 5
  },
  {
    title: "Analytics Review - Q3 Performance",
    content: `# Q3 2024 Performance Review

## Key Metrics
- **Subscribers**: +2,847 (15.2% growth)
- **Total Views**: 487K (23% increase)
- **Watch Time**: 1.2M minutes
- **Revenue**: $13,650 (18% up from Q2)

## Top Performing Content
1. "5 VS Code Extensions" - 45K views
2. "React vs Vue comparison" - 38K views  
3. "Deploy app in 5 minutes" - 31K views

## Areas for Improvement
- **Shorts Performance**: Below average engagement
- **Community Posts**: Low interaction rates
- **Live Streaming**: Technical issues need resolving

## Q4 Goals
- [ ] 20K subscriber milestone
- [ ] 600K quarterly views
- [ ] $16K revenue target
- [ ] Launch membership program
- [ ] Improve shorts strategy

## Action Items
- Analyze top video patterns
- A/B test thumbnail styles
- Experiment with posting times
- Survey audience for content requests`,
    tags: ["analytics", "performance", "review", "goals"],
    priority: "MEDIUM" as const,
    status: "COMPLETED" as const,
    position: 6
  },
  {
    title: "Equipment Upgrade Planning",
    content: `# Studio Equipment Upgrades

## Current Setup Issues
- Audio quality inconsistent
- Lighting creates shadows
- Camera resolution outdated

## Priority Upgrades
1. **Audio** ($300-500)
   - Rode PodMic ($199)
   - Audio interface ($150)
   - Boom arm ($50)

2. **Lighting** ($200-350)
   - Key light with softbox ($120)
   - Fill light ($80)
   - Background RGB light ($100)

3. **Camera** ($800-1200)
   - Sony A7 III or Canon R6
   - 50mm lens for talking head shots

## Budget Allocation
- Q4 2024: Audio upgrade
- Q1 2025: Lighting setup
- Q2 2025: Camera upgrade

## ROI Expectations
- Better audio: 15% retention improvement
- Professional lighting: Higher sponsor rates
- 4K capability: Future-proofing content`,
    tags: ["equipment", "studio", "upgrades", "budget"],
    priority: "LOW" as const,
    status: "ACTIVE" as const,
    position: 7
  },
  {
    title: "Community Building Strategy",
    content: `# Community Engagement Plan

## Current Community Size
- YouTube: 18.5K subscribers
- Discord: 450 members
- Twitter: 2.1K followers
- Newsletter: 890 subscribers

## Engagement Initiatives
1. **Weekly Community Posts**
   - Behind-the-scenes content
   - Polls for video topics
   - Milestone celebrations

2. **Discord Activities**
   - Weekly "Code Review" sessions
   - Monthly AMAs
   - Project showcases
   - Study groups

3. **Cross-Platform Integration**
   - Twitter threads for video summaries
   - Instagram stories for quick tips
   - LinkedIn articles for deeper dives

## Content Types for Community
- Live coding sessions
- Q&A compilations
- Subscriber project features
- Community challenges

## Metrics to Track
- Discord active users
- Community post engagement
- Cross-platform mentions
- User-generated content`,
    tags: ["community", "engagement", "social-media"],
    priority: "MEDIUM" as const,
    status: "ACTIVE" as const,
    position: 8
  },
  {
    title: "Archived: Old Channel Ideas",
    content: `# Archived Ideas from 2023

## Gaming Content Pivot
- Initially considered gaming tutorials
- Market research showed saturation
- Decided to focus on web development instead

## Podcast Experiment
- Launched "Code Coffee Chat" podcast
- 12 episodes produced
- Low download numbers (avg 150/episode)
- Discontinued in favor of YouTube focus

## Course Platform Ideas
- Considered building own platform
- High development costs
- Partnered with existing platforms instead

## Lessons Learned
- Focus is better than diversification
- Validate ideas before full commitment
- Leverage existing platforms when possible`,
    tags: ["archived", "lessons-learned", "pivot"],
    priority: "LOW" as const,
    status: "ARCHIVED" as const,
    position: 9
  }
];

async function seedIdeas() {
  try {
    console.log('🌱 Starting ideas seeding...');

    // Find the first admin user to assign ideas to
    const adminUser = await prisma.user.findFirst({
      where: { isAdmin: true }
    });

    if (!adminUser) {
      console.log('❌ No admin user found. Creating a default admin user...');
      
      const defaultAdmin = await prisma.user.create({
        data: {
          email: 'admin@youtube-analytics.com',
          name: 'Admin User',
          password: '$2b$10$defaulthashedpassword', // This should be properly hashed in production
          isAdmin: true
        }
      });

      console.log('✅ Created default admin user');

      // Use the newly created admin user
      await createIdeasForUser(defaultAdmin.id);
    } else {
      console.log(`📋 Found admin user: ${adminUser.email}`);
      await createIdeasForUser(adminUser.id);
    }

  } catch (error) {
    console.error('❌ Error seeding ideas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createIdeasForUser(userId: string) {
  // Check if ideas already exist for this user
  const existingIdeas = await prisma.idea.count({
    where: { userId }
  });

  if (existingIdeas > 0) {
    console.log(`📝 User already has ${existingIdeas} ideas. Skipping seed...`);
    return;
  }

  console.log('💡 Creating sample ideas...');

  // Create ideas
  for (const ideaData of sampleIdeas) {
    await prisma.idea.create({
      data: {
        ...ideaData,
        userId
      }
    });
  }

  console.log(`✅ Created ${sampleIdeas.length} sample ideas`);

  // Display summary
  const ideaCounts = await prisma.idea.groupBy({
    by: ['status'],
    where: { userId },
    _count: { id: true }
  });

  console.log('\n📊 Ideas Summary:');
  ideaCounts.forEach((count: any) => {
    console.log(`  ${count.status}: ${count._count.id} ideas`);
  });
}

// Run the seed function
if (require.main === module) {
  seedIdeas()
    .then(() => {
      console.log('\n🎉 Ideas seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Ideas seeding failed:', error);
      process.exit(1);
    });
}

export { seedIdeas };