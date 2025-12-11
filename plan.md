# Flash Card App Backend - Project Plan

## Overview

An AI-powered spaced repetition flashcard application that optimizes learning through smart scheduling and automated card generation from documents.

**Tech Stack:** MongoDB, Express.js, Node.js, TypeScript, Better Auth, Google Gemini AI

---

## Data Models & Relationships

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │    Deck     │       │    Card     │
│  (Better    │ 1───M │             │ 1───M │             │
│   Auth)     │       │  userId     │       │  deckId     │
└─────────────┘       └─────────────┘       └─────────────┘
       │
       │ 1
       │
       M
┌─────────────┐       ┌─────────────┐
│ UserProfile │       │StudySession │
│  (app data) │       │  userId     │
│  userId     │       │  deckId     │
└─────────────┘       │  reviews[]  │
                      └─────────────┘
```

### Relationships

| Relationship | Type | Description |
|-------------|------|-------------|
| User → UserProfile | 1:1 | App-specific data (streaks, stats) |
| User → Deck | 1:M | User owns many decks |
| User → StudySession | 1:M | User has many study sessions |
| Deck → Card | 1:M | Deck contains many cards |

### Model Schemas

#### UserProfile
```typescript
{
  userId: string,        // Better Auth user ID
  totalDeck: number,
  studyStreak: number,
  averageMastery: number,
  lastStudyDate: Date
}
```

#### Deck
```typescript
{
  userId: string,
  deckName: string,
  totalCards: number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Card (with SRS fields)
```typescript
{
  deckId: ObjectId,
  question: string,
  answer: string,
  easeFactor: number,    // Default: 2.5
  interval: number,      // Days until next review
  repetition: number,    // Times reviewed
  nextReviewDate: Date   // When card is due
}
```

#### StudySession
```typescript
{
  userId: string,
  deckId: ObjectId,
  startTime: Date,
  endTime: Date,
  reviewedCards: [{
    cardId: ObjectId,
    userGrade: "easy" | "good" | "hard" | "again",
    timeSpent: number,
    timeStamp: Date
  }]
}
```

---

## API Specifications

### Authentication (Better Auth)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sign-up/email` | POST | Create account |
| `/api/auth/sign-in/email` | POST | Login with email/password |
| `/api/auth/sign-in/social` | POST | Google OAuth |
| `/api/auth/sign-out` | POST | Logout |
| `/api/auth/get-session` | GET | Get current session |
| `/api/auth/forgot-password` | POST | Request password reset |

### User Profile

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/users/profile` | GET | ✓ | Get user profile + stats |
| `/api/v1/users/profile` | PATCH | ✓ | Update profile |
| `/api/v1/users/dashboard-stats` | GET | ✓ | Aggregated learning stats |

### Decks

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/decks` | GET | ✓ | Get all user's decks |
| `/api/v1/decks` | POST | ✓ | Create empty deck |
| `/api/v1/decks/:id` | GET | ✓ | Get deck by ID |
| `/api/v1/decks/:id` | PATCH | ✓ | Update deck |
| `/api/v1/decks/:id` | DELETE | ✓ | Delete deck (cascades to cards) |
| `/api/v1/decks/generate-ai` | POST | ✓ | Upload PDF → Generate deck with cards |

### Cards

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/cards` | POST | ✓ | Create card in deck |
| `/api/v1/cards/:id` | PATCH | ✓ | Edit card |
| `/api/v1/cards/:id` | DELETE | ✓ | Delete card |
| `/api/v1/decks/:deckId/cards` | GET | ✓ | Get all cards in deck |

### Study Sessions

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/study/:deckId` | GET | ✓ | Get due cards for study |
| `/api/v1/study/sync` | POST | ✓ | Save session + update SRS |
| `/api/v1/study/sessions` | GET | ✓ | Get session history |
| `/api/v1/study/sessions/:id/report` | GET | ✓ | Get AI-analyzed session report |

---

## Spaced Repetition Algorithm (SM-2 Based)

### Grade Scale
- **Again (0):** Complete failure, reset card
- **Hard (1):** Struggled, shorter interval
- **Good (2):** Recalled with effort
- **Easy (3):** Instant recall, longer interval

### Algorithm Logic

```typescript
function calculateNextReview(card, grade) {
  let { easeFactor, interval, repetition } = card;
  
  if (grade < 2) {
    // Failed - reset
    repetition = 0;
    interval = 1;
  } else {
    // Success - increase interval
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition++;
  }
  
  // Adjust ease factor
  easeFactor = easeFactor + (0.1 - (3 - grade) * (0.08 + (3 - grade) * 0.02));
  easeFactor = Math.max(1.3, easeFactor); // Minimum 1.3
  
  const nextReviewDate = addDays(new Date(), interval);
  
  return { easeFactor, interval, repetition, nextReviewDate };
}
```

---

## AI Integration

### PDF-to-Cards Flow

1. User uploads PDF via `/api/v1/decks/generate-ai`
2. Backend extracts text using `pdf-parse`
3. Text sent to Gemini with structured prompt
4. Gemini returns JSON array of Q&A pairs
5. Backend creates Deck + Cards in transaction
6. Returns created deck with cards

### Smart Analytics Flow

1. After study session sync
2. Backend analyzes review patterns
3. Gemini generates qualitative feedback
4. Identifies weak topics/concepts
5. Returns personalized recommendations

### Gemini Prompt Templates

**Card Generation:**
```
You are a flashcard generator for educational content.
Given the following text, create flashcards that test understanding.

Rules:
- Generate 5-15 cards based on content density
- Questions should require understanding, not just memorization
- Answers should be concise but complete
- Focus on key concepts, definitions, and relationships

Return ONLY a valid JSON array:
[{"question": "...", "answer": "..."}]

Text to process:
{extracted_text}
```

**Session Analysis:**
```
Analyze this study session and provide feedback:

Session Data:
- Total cards reviewed: {count}
- Cards marked "again": {again_count}
- Cards marked "hard": {hard_count}
- Average time per card: {avg_time}s

Card topics struggled with:
{struggled_cards}

Provide:
1. Overall performance summary (1-2 sentences)
2. Specific areas needing improvement
3. Study recommendations
```

---

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL_ONLINE=mongodb+srv://...
DB_PASSWORD=...
LOCAL_MONGO_URL=mongodb://localhost:27017/flashcard-app

# Better Auth
BETTER_AUTH_SECRET=your_secret_min_32_chars
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Gemini AI
GEMINI_API_KEY=...
```

---

## File Structure

```
src/
├── config/
│   ├── app.config.ts      # Environment variables
│   ├── constants.config.ts # Magic numbers, messages
│   ├── db.config.ts       # MongoDB connection
│   └── index.ts
├── controllers/
│   ├── user.controller.ts
│   ├── deck.controller.ts
│   ├── card.controller.ts
│   └── studySession.controller.ts
├── interfaces/
│   ├── userProfile.interface.ts
│   ├── deck.interface.ts
│   ├── card.interface.ts
│   └── studySession.interface.ts
├── lib/
│   ├── auth.ts            # Better Auth setup
│   └── gemini.ts          # Gemini AI client
├── middleware/
│   ├── auth.middleware.ts  # requireAuth
│   ├── upload.middleware.ts # Multer PDF upload
│   └── error.middleware.ts
├── models/
│   ├── userProfile.model.ts
│   ├── deck.model.ts
│   ├── card.model.ts
│   └── studySession.model.ts
├── routes/
│   ├── user.routes.ts
│   ├── deck.routes.ts
│   ├── card.routes.ts
│   └── studySession.routes.ts
├── services/
│   ├── userProfile.service.ts
│   ├── deck.service.ts
│   ├── card.service.ts
│   ├── studySession.service.ts
│   ├── ai.service.ts      # Gemini integration
│   └── srs.service.ts     # Spaced repetition logic
├── utils/
│   └── _id.utils.ts
├── validators/
│   └── (Joi schemas)
└── app.ts
```

---

## Implementation Phases

### Phase 1: Core CRUD ✓
- [x] Better Auth setup with Google OAuth
- [x] User profile management
- [x] Service layer architecture

### Phase 2: Deck & Card Management
- [ ] Full deck CRUD with cascading deletes
- [ ] Card CRUD operations
- [ ] PDF upload and AI card generation

### Phase 3: Study Engine
- [ ] SRS algorithm implementation
- [ ] Study session management
- [ ] Due card fetching

### Phase 4: Analytics & AI
- [ ] Session report generation
- [ ] AI-powered feedback
- [ ] Dashboard statistics

### Phase 5: Polish
- [ ] Input validation (Joi)
- [ ] Error handling refinement
- [ ] Rate limiting
- [ ] Testing

