# Analytics & SEO Documentation

## Overview
This document describes the SEO improvements and analytics tracking implemented in the Grundkenntnistest Zürich application.

## SEO Improvements

### Meta Tags
The application includes comprehensive meta tags for better search engine optimization:

- **Primary Meta Tags**: Title, description, keywords, author, robots directives
- **Open Graph Tags**: For Facebook and other social media platforms
- **Twitter Card Tags**: For optimized Twitter sharing
- **PWA Meta Tags**: Enhanced progressive web app support
- **Canonical URL**: Set to `https://gktzh.app/`

### Structured Data (JSON-LD)
The application includes Schema.org structured data as an EducationalApplication, including:
- Application details (name, description, URL)
- Free pricing information (0 CHF)
- Educational level and learning resource type
- Supported languages (de-CH, en)
- Feature list

### SEO Files
- **robots.txt**: Located at `/robots.txt`, allows all crawlers with sitemap reference
- **sitemap.xml**: Located at `/sitemap.xml`, includes main URL with language alternates

## Analytics Tracking

### Google Analytics Setup
- **Tracking ID**: G-FMD5GKG2N2
- **IP Anonymization**: Enabled for privacy compliance
- **Page Views**: Automatically tracked

### Custom Events Tracked

#### User Journey Events

1. **quiz_start**
   - Triggered when: User starts a quiz
   - Parameters:
     - `question_count`: Number of questions in quiz
     - `categories`: JSON string of category distribution
     - `levels`: JSON string of difficulty level distribution

2. **start_quiz**
   - Triggered when: User clicks quiz start button
   - Parameters:
     - `source`: 'button_click' or 'card_click'

3. **start_flashcards**
   - Triggered when: User starts flashcard mode
   - Parameters:
     - `source`: 'button_click' or 'card_click'

4. **open_video_playlist**
   - Triggered when: User opens YouTube video playlist
   - Parameters:
     - `source`: 'button_click' or 'card_click'

#### Quiz Interaction Events

5. **quiz_answer**
   - Triggered when: User answers a question
   - Parameters:
     - `question_id`: Unique identifier of the question
     - `category`: Question category
     - `level`: Difficulty level
     - `is_correct`: Boolean indicating if answer was correct
     - `question_number`: Position in quiz (1-15)
     - `total_questions`: Total questions in quiz

6. **question_incorrect** ⭐ NEW
   - Triggered when: User answers a question incorrectly
   - Parameters:
     - `question_id`: Unique identifier
     - `category`: Question category
     - `level`: Difficulty level
     - `question_text`: First 100 characters for identification
     - `question_number`: Position in quiz
   - **Use Case**: Identify which questions are harder and need improvement

7. **quiz_complete**
   - Triggered when: User completes a quiz
   - Parameters:
     - `score`: Number of correct answers
     - `total`: Total questions
     - `percentage`: Success rate
     - `performance_level`: 'excellent' (≥90%), 'good' (≥70%), or 'needs_practice'

8. **quiz_restart**
   - Triggered when: User restarts quiz from results screen
   - Parameters:
     - `previous_score`: Score from completed quiz
     - `previous_percentage`: Success rate from completed quiz

9. **quiz_exit**
   - Triggered when: User exits quiz before completion
   - Parameters:
     - `questions_completed`: Number of questions answered
     - `total_questions`: Total questions in quiz

#### Flashcard Events

10. **flashcard_mode_change**
    - Triggered when: User switches between 'all' and 'weak' mode
    - Parameters:
      - `new_mode`: Selected mode ('all' or 'weak')
      - `previous_mode`: Previous mode

11. **flashcard_flip**
    - Triggered when: User flips a flashcard to see answer
    - Parameters:
      - `mode`: Current flashcard mode
      - `question_id`: Unique identifier

#### Feature Usage Events

12. **toggle_translation**
    - Triggered when: User switches between German and English
    - Parameters:
      - `language`: Selected language ('de' or 'en')
      - `screen`: Where toggle occurred ('quiz' or 'flashcards')

13. **view_questions_modal**
    - Triggered when: User opens questions overview modal
    - Parameters:
      - `total_answered`: Total questions user has seen
      - `mastered_count`: Questions with more correct than incorrect answers

14. **view_success_rate_modal**
    - Triggered when: User opens success rate details modal
    - Parameters:
      - `mastery_rate`: Overall success percentage
      - `correct_answers`: Total correct answers
      - `total_attempts`: Total answer attempts

15. **progress_reset**
    - Triggered when: User resets their progress
    - Parameters:
      - `questions_seen`: Number of questions before reset
      - `mastery_rate`: Success rate before reset

16. **return_home**
    - Triggered when: User returns to home screen
    - Parameters:
      - `source`: Where the action originated (e.g., 'result_screen')

## Analyzing Question Difficulty

### How to Identify Hard Questions in Google Analytics

1. **Go to Events in GA4**
   - Navigate to Reports > Events
   - Look for `question_incorrect` event

2. **Create Custom Report**
   - Event name: `question_incorrect`
   - Dimensions: `question_id`, `category`, `level`, `question_text`
   - Metric: Event count

3. **Sort by Frequency**
   - Questions with highest `question_incorrect` count are the hardest
   - Compare against `quiz_answer` events to get error rates

4. **Analyze by Category/Level**
   - Group by `category` to find difficult topics
   - Group by `level` to validate difficulty ratings

### Sample Queries

**Most Frequently Incorrect Questions:**
```
Event: question_incorrect
Group by: question_id
Order by: Count DESC
```

**Error Rate by Category:**
```
Events: quiz_answer
Segment by: category
Metric: is_correct = false percentage
```

**Difficulty vs. Actual Performance:**
```
Events: quiz_answer
Group by: level
Metric: Average(is_correct)
```

## Privacy & Compliance

### Switzerland & GDPR Compliance

This application is compliant with Swiss Data Protection Act (FADP/DSG) and GDPR requirements:

- **Google Consent Mode V2**: Implemented with default consent set to 'denied'
- **Cookie Consent Banner**: Users must explicitly consent before analytics tracking begins
- **IP Anonymization**: All IP addresses are anonymized (`anonymize_ip: true`)
- **Cookie Consent Storage**: User preferences are stored in localStorage
- **No PII Tracking**: No personally identifiable information is tracked
- **Question text truncation**: Limited to 100 characters for privacy
- **Client-side only**: All tracking is done client-side with user's browser

### Consent Mode Implementation

The app implements Google Consent Mode V2 with the following default settings:

```javascript
gtag('consent', 'default', {
  'analytics_storage': 'denied',       // Analytics cookies denied by default
  'ad_storage': 'denied',             // Ad cookies denied (not used)
  'ad_user_data': 'denied',           // Ad user data denied (not used)
  'ad_personalization': 'denied',     // Ad personalization denied (not used)
  'functionality_storage': 'granted', // Required for app functionality
  'personalization_storage': 'denied',// Personalization denied by default
  'security_storage': 'granted',      // Required for security
  'wait_for_update': 500             // Wait 500ms for consent update
});
```

When users accept analytics cookies:
- `analytics_storage` is updated to `'granted'`
- `personalization_storage` is updated to `'granted'`
- Google Analytics begins tracking as configured

### Cookie Consent Banner

The consent banner provides:
1. **Quick Accept/Reject**: Users can quickly accept all or reject non-essential cookies
2. **Detailed Settings**: Users can view details about each cookie category
3. **Persistent Storage**: Consent choices are saved in localStorage
4. **Multilingual**: Banner text in German (primary audience in Switzerland)

### Data Processed

When analytics consent is granted:
- Page views (automatically)
- Custom events (quiz interactions, flashcard usage, etc.)
- Session duration
- Device type and browser information
- Geographic location (country/city level only, with anonymized IP)

No data is collected until explicit consent is given.

## Privacy & Compliance (Legacy)

- IP addresses are anonymized
- No personally identifiable information (PII) is tracked
- Question text is truncated to 100 characters for privacy
- All tracking is done client-side with user's browser

## Testing Analytics

To verify analytics are working:

1. Open browser DevTools
2. Go to Network tab
3. Filter by "google-analytics" or "gtag"
4. Perform actions in the app
5. Verify events are being sent

Or use Google Analytics DebugView:
1. Install Google Analytics Debugger Chrome extension
2. Enable debug mode
3. View real-time events in GA4 DebugView

## Next Steps

Consider implementing:
- User cohort analysis (by performance level)
- Learning path optimization based on error patterns
- A/B testing for question difficulty
- Time-to-answer tracking for each question
- Retry patterns for difficult questions
