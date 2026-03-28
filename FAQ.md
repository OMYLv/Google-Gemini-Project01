# Frequently Asked Questions (FAQ)

## General Questions

### What is Universal Bridge AI?
Universal Bridge AI is a Gemini-powered application that converts unstructured, real-world inputs (text, images, voice) into structured, actionable information for societal benefit. It focuses on life-saving and high-impact use cases like medical triage, emergency response, and critical information processing.

### Who is this for?
- Emergency responders and medical professionals
- Traffic management and public safety officials
- Weather service and disaster response teams
- News organizations and fact-checkers
- Anyone needing to quickly process complex, unstructured information

### Is it free to use?
The application is open-source and free. However, you need your own Google Gemini API key, which has its own usage limits and pricing. Google offers free tier usage for Gemini.

### How accurate is the AI?
- The AI provides confidence scores with each analysis
- Results should always be verified by qualified professionals
- Accuracy depends on input quality and specificity
- Not a replacement for professional judgment

---

## Setup & Installation

### What are the system requirements?
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- 1GB+ RAM
- Modern web browser
- Google Gemini API key

### How do I get a Gemini API key?
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and save the key securely
5. Add to your .env file

### Installation fails with errors. What should I do?
```powershell
# Try clean install:
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install
```

### Ports 5000 or 5173 are already in use
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Or change ports in .env and vite.config.js
```

---

## Usage

### How do I process text input?
1. Select appropriate use case (Medical, Traffic, etc.)
2. Type or paste your text in the input field
3. Add context if helpful
4. Select priority level
5. Click "Process Input"

### Can I upload images?
Yes! Click the image icon and select a photo. The AI can analyze:
- Medical images (rashes, injuries, etc.)
- Traffic accident photos
- Weather damage images
- Documents and records
- Any relevant visual information

### What about voice input?
Voice input is on the roadmap but not yet implemented. Currently, you can:
- Use speech-to-text on your device
- Paste the transcribed text
- Process through the text input

### How long does processing take?
- Simple text: 2-5 seconds
- With images: 5-10 seconds
- Batch processing: 10-30 seconds
- Depends on input complexity and API response time

### What's the maximum input size?
- Text: 10,000 characters
- Images: 10MB per file
- Batch: 10 inputs maximum
- API timeout: 30 seconds

---

## Features

### What use cases are supported?
1. **Medical:** Triage, symptom analysis, history review
2. **Traffic:** Incident reporting, accident analysis
3. **Weather:** Alert processing, damage assessment
4. **News:** Article analysis, fact-checking
5. **General:** Any unstructured input processing

### How does priority level work?
- **Low:** Routine information, no urgency
- **Medium:** Normal processing, standard attention
- **High:** Important, needs prompt attention
- **Critical:** Emergency, immediate action required

Priority affects AI's response urgency and recommendation timing.

### What is the confidence score?
A 0-1 (0-100%) measure of how confident the AI is in its analysis:
- 0.9+ (90%+): Very confident
- 0.7-0.9 (70-90%): Confident
- 0.5-0.7 (50-70%): Moderate confidence
- <0.5 (<50%): Low confidence - verify carefully

### Can I process multiple inputs at once?
Yes! Use the batch processing API:
```javascript
await aiService.processBatch([
  { id: '1', text: 'First input', priority: 'high' },
  { id: '2', text: 'Second input', priority: 'medium' }
]);
```

---

## Security & Privacy

### Is my data secure?
- All communication uses HTTPS (in production)
- Input validation and sanitization
- Rate limiting prevents abuse
- Security headers (Helmet.js)
- No data persistence (inputs not stored)

### What happens to my inputs?
- Sent to Google Gemini API for processing
- Not stored in application database
- Subject to Google's privacy policy
- Logs may contain request metadata (not content)

### Should I use this with sensitive data?
- Medical: Follow HIPAA guidelines, de-identify if possible
- Personal: Remove PII when not necessary
- Confidential: Evaluate your organization's policies
- Production: Add authentication and authorization

### Is there authentication?
Not in v1.0. Future versions will include:
- JWT authentication
- Role-based access control
- API key management
- Audit logging

---

## Troubleshooting

### "GEMINI_API_KEY is not configured" error
1. Check .env file exists
2. Verify key is added: `GEMINI_API_KEY=your_key_here`
3. No quotes needed around the key
4. Restart the server after changing .env

### CORS errors in browser
- Ensure frontend runs on http://localhost:5173
- Check ALLOWED_ORIGINS in .env includes your frontend URL
- Restart both servers after changes

### "Rate limit exceeded" error
You've hit the rate limit (100 requests per 15 minutes). Either:
- Wait for the time window to reset
- Increase limits in .env (RATE_LIMIT_MAX_REQUESTS)
- Consider authentication for per-user limits

### API returns low confidence scores
- Provide more specific input
- Add context information
- Include relevant details
- Use clearer descriptions
- Try uploading an image if applicable

### Results seem inaccurate
1. Review your input for clarity
2. Check if right use case is selected
3. Provide more context
4. Note the confidence score
5. Always verify AI suggestions

---

## Development

### How do I add a new use case?
1. Add to `UseCaseSelector` component
2. Update validation schema in `middleware/validation.js`
3. Add specific prompt in `geminiService.js`
4. Update API documentation
5. Add examples to `EXAMPLES.md`

### Can I customize the UI?
Yes! The UI uses:
- Tailwind CSS for styling
- React components in `client/src/components/`
- Easy color customization in `tailwind.config.js`

### How do I contribute?
See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code standards
- Development setup
- Pull request process
- Areas needing help

### How do I run tests?
```powershell
# All tests
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm run test:watch

# Lint code
npm run lint
```

---

## API

### Is there an API I can use?
Yes! See [API_DOCS.md](API_DOCS.md) for complete documentation.

### Can I integrate this into my app?
Absolutely! Use the REST API:
```javascript
const response = await fetch('http://localhost:5000/api/ai/process/text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: 'Your input here',
    priority: 'medium'
  })
});
const result = await response.json();
```

### Rate limits for the API?
- Default: 100 requests per 15 minutes per IP
- Configurable in .env
- Headers show remaining requests
- Future: Per-user/API key limits

---

## Deployment

### Can I deploy this to production?
Yes! See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Traditional server deployment
- Docker deployment
- Cloud platform options (Heroku, Vercel, Railway)
- Production checklist

### What about scaling?
- Use PM2 cluster mode for Node.js
- Add load balancer (Nginx)
- Implement caching (Redis)
- CDN for frontend assets
- Database for persistence

### Cost of running in production?
- Server: $5-20/month (basic VPS)
- Gemini API: Free tier available, then pay-per-use
- Domain: ~$10/year
- SSL: Free (Let's Encrypt)
- Total: ~$5-30/month depending on usage

---

## Support

### Where can I get help?
1. Read documentation (README, SETUP, API_DOCS)
2. Check this FAQ
3. Review [EXAMPLES.md](EXAMPLES.md)
4. Search GitHub issues
5. Open a new issue
6. Contact maintainers

### How do I report bugs?
1. Check if already reported
2. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots
   - Environment details
3. Open GitHub issue

### Can I request features?
Yes! Open a GitHub issue with:
- Feature description
- Use case
- Expected benefit
- Implementation ideas (optional)

---

## Roadmap

### What's planned for future versions?
- Voice input with speech-to-text
- User authentication and authorization
- Database for historical data
- Advanced analytics dashboard
- Mobile app
- Multi-language support
- Custom use case builder
- Webhook integrations
- Team collaboration features

### When is the next release?
Check [CHANGELOG.md](CHANGELOG.md) for version history and upcoming features.

---

## Legal

### What's the license?
MIT License - free to use, modify, and distribute. See [LICENSE](LICENSE).

### Can I use this commercially?
Yes, the MIT license permits commercial use.

### What about Gemini API terms?
You must comply with Google's Gemini API terms of service. Review at: https://ai.google.dev/terms

---

## More Questions?

Don't see your question here?
- Read the full documentation
- Check GitHub Issues
- Open a discussion
- Contact support

---

**Last Updated:** March 28, 2026  
**Version:** 1.0.0
