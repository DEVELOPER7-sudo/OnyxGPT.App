# Security Documentation - OnyxGPT

## 🔒 Security Overview

This document outlines the security measures implemented in OnyxGPT and guidelines for maintaining security integrity.

---

## ✅ Implemented Security Measures

### 1. Database Security (A+)
- **Row-Level Security (RLS)**: All database tables enforce strict RLS policies
- **User Isolation**: Users can only access their own chats and data (`auth.uid() = user_id`)
- **Authenticated Access**: Anonymous users are restricted from creating or modifying chats
- **Storage Privacy**: File storage bucket (`chat-files`) is private with signed URL access

### 2. API Security
- **JWT Authentication**: All edge functions require valid JWT tokens
- **User Verification**: OpenRouter function validates authenticated users
- **Rate Limiting**: Per-user rate limiting (50 requests/hour) prevents abuse
- **CORS Restrictions**: Limited to authorized origins only
  - Production: `https://onyxgpt.lovable.app`
  - Development: `http://localhost:5173`, `http://localhost:3000`

### 3. Input Validation
- **Message Validation**: All user messages validated with Zod schemas
- **Content Length**: Maximum 10,000 characters per message
- **Type Checking**: Strict role and content type validation
- **File Upload Validation**: Image uploads checked for MIME type and extension
- **Attachment Limits**: Maximum 10 attachments per message

### 4. XSS Prevention
- **React Markdown**: Safely renders markdown using ReactMarkdown
- **Safe Plugins**: Uses remark-gfm, rehype-katex for safe content rendering
- **No Dangerous HTML**: No raw HTML rendering or eval() patterns
- **Script Sanitization**: No user input is directly injected into DOM

### 5. Authentication & Authorization
- **Supabase Auth**: Leverages Supabase's battle-tested authentication system
- **Session Management**: Automatic session validation and refresh
- **Guest Mode**: Uses anonymous authentication for non-registered users
- **Token Security**: JWTs validated server-side before processing requests

### 6. API Key Management
- **Server-Side Storage**: OpenRouter API keys stored in Supabase secrets only
- **No Client Exposure**: API keys are NEVER sent to the frontend
- **Environment Variables**: Sensitive keys loaded from `.env` only
- **Secret Rotation**: Can be rotated without code changes

---

## 🚨 Critical Security Measures

### OpenRouter Edge Function Security

The OpenRouter edge function (`/supabase/functions/openrouter-chat/`) implements multiple security layers:

1. **JWT Validation**
   ```typescript
   // All requests must include valid JWT token
   const userPayload = await verifyJWT(token);
   if (!userPayload) {
     return 401; // Reject unauthenticated requests
   }
   ```

2. **Rate Limiting**
   ```typescript
   // 50 requests per hour per user
   checkRateLimit(userPayload.sub);
   ```

3. **CORS Protection**
   ```typescript
   // Only allow requests from authorized origins
   const ALLOWED_ORIGINS = [
     'https://onyxgpt.lovable.app',
     'http://localhost:5173',
   ];
   ```

4. **Logging & Monitoring**
   - All API calls logged with user ID
   - Error rates monitored for abuse detection
   - Request metrics tracked for usage analytics

---

## 🛡️ Data Protection

### Encryption
- **Transit**: HTTPS/TLS for all communication
- **Storage**: Supabase encrypts data at rest
- **API Keys**: Stored in encrypted environment variables

### Data Retention
- **Chat History**: Indefinite retention unless user explicitly deletes
- **Logs**: Server logs retained for 30 days
- **User Data**: Can be deleted via Settings > Clear All Data
- **Attachment Cleanup**: Automatic cleanup of unused files after 90 days

### Privacy
- **No Tracking**: No third-party analytics beyond Supabase
- **No Data Sharing**: User data never shared with external services
- **GDPR Compliant**: Supports data deletion and export
- **Transparent Logging**: Debug logs only in development mode

---

## 📋 Input Validation Rules

### Messages
- **Min Length**: 1 character (after trim)
- **Max Length**: 10,000 characters
- **Required Fields**: content, role
- **Valid Roles**: 'user' or 'assistant'

### Chat Titles
- **Min Length**: 1 character (after trim)
- **Max Length**: 200 characters
- **Format**: Text only, no special characters required

### File Attachments
- **Max Per Message**: 10 files
- **Accepted Formats**: PNG, JPG, GIF, WebP, HEIC, HEIF
- **Size Limit**: 5MB per file (enforced at upload)
- **Source Validation**: Only Supabase storage URLs allowed

---

## 🔑 Environment Variables (Secure)

Never commit sensitive values. Required environment variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxx...

# API Keys (Server-Side Only)
OPENROUTER_API_KEY=sk-or-xxx...
PUTER_API_KEY=xxx...
```

Configure in Supabase Project Settings:
- Dashboard > Settings > API
- Edge Functions > Secrets

---

## 🧪 Testing Security

### Testing JWT Validation
```bash
# Invalid token should return 401
curl -X POST https://.../openrouter-chat \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{"messages":[], "model":"gpt-5"}'
```

### Testing Rate Limiting
```bash
# After 50 requests in 1 hour, should return 429
curl -X POST https://.../openrouter-chat \
  -H "Authorization: Bearer valid_token" \
  --repeat 51
```

### Testing CORS
```bash
# From unauthorized origin should be blocked
curl -X POST https://.../openrouter-chat \
  -H "Origin: https://evil.com" \
  -H "Authorization: Bearer token"
```

---

## 🚀 Deployment Security

### Before Deployment
1. ✅ All API keys configured in Supabase secrets
2. ✅ Environment variables reviewed
3. ✅ CORS origins updated for production domain
4. ✅ Rate limits appropriate for expected usage
5. ✅ Logs configured for monitoring

### Monitoring
- **API Logs**: Check `supabase/functions/openrouter-chat` logs
- **Error Tracking**: Monitor 401, 429, 402 responses
- **Performance**: Watch for unusual latency spikes
- **Usage**: Track request patterns for abuse

### Incident Response
1. **Rate Limit Exceeded**: Check logs for suspicious patterns
2. **Auth Failures**: Verify JWT configuration and user sessions
3. **API Errors**: Check OpenRouter API status and credits
4. **Data Breach**: Implement immediate log rotation and investigation

---

## 📝 Security Checklist

### Development
- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Test input validation with edge cases
- [ ] Verify RLS policies in Supabase console
- [ ] Test with invalid/expired tokens

### Deployment
- [ ] Configure all required environment variables
- [ ] Update CORS origins for production domain
- [ ] Enable HTTPS for all endpoints
- [ ] Set up monitoring and alerting
- [ ] Configure automatic log rotation

### Maintenance
- [ ] Regularly review access logs
- [ ] Update dependencies monthly
- [ ] Test backup and recovery procedures
- [ ] Audit user permissions quarterly
- [ ] Review rate limits based on usage

---

## 🔗 Additional Resources

- [Supabase Security Documentation](https://supabase.com/docs/guides/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [OpenRouter API Security](https://openrouter.ai/docs)

---

## 📞 Security Issues

Found a security vulnerability? Please:

1. **Do NOT** create a public GitHub issue
2. **DO** email security details to the maintainer
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

**Last Updated**: November 15, 2025  
**Version**: 1.0  
**Status**: Active
