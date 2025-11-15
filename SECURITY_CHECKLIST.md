# Security Checklist - OnyxGPT

Quick reference for security configuration and deployment.

---

## 🔐 Pre-Deployment Checklist

### Environment Configuration
- [ ] `OPENROUTER_API_KEY` set in Supabase Function Secrets
- [ ] `SUPABASE_URL` configured correctly
- [ ] `SUPABASE_ANON_KEY` configured correctly
- [ ] All secrets use strong, unique values
- [ ] No `.env` files committed to git

### CORS Security
- [ ] Review `ALLOWED_ORIGINS` in edge function
- [ ] Update to match production domain(s)
- [ ] Remove localhost entries for production
- [ ] Test CORS from actual domain:
  ```bash
  curl -X POST https://your-api/openrouter-chat \
    -H "Origin: https://your-domain.com"
  ```

### Rate Limiting
- [ ] Review rate limits (50 req/hour default)
- [ ] Adjust if needed for expected traffic
- [ ] Test 51st request returns 429:
  ```bash
  for i in {1..51}; do
    curl -X POST https://your-api/openrouter-chat
  done
  ```

### Input Validation
- [ ] Test 10,000 character message limit
- [ ] Verify error message displays
- [ ] Check validation works for all input types

### Monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure 401 Unauthorized alerts
- [ ] Configure 429 Rate Limited alerts
- [ ] Configure 402 Payment Required alerts
- [ ] Set up response time monitoring

---

## 🧪 Testing Checklist

### Security Tests
```bash
# 1. Test Invalid Token (should 401)
curl -X POST https://your-api/openrouter-chat \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{"messages":[], "model":"gpt-5"}'

# 2. Test Unauthorized CORS (should have empty Access-Control-Allow-Origin)
curl -X POST https://your-api/openrouter-chat \
  -H "Origin: https://evil.com" \
  -H "Authorization: Bearer valid_token"

# 3. Test Rate Limit (should 429 on 51st request)
for i in {1..51}; do
  curl -X POST https://your-api/openrouter-chat \
    -H "Authorization: Bearer valid_token"
done

# 4. Test Input Validation (should show error)
# In UI: Try sending 10,001 character message
```

### Functionality Tests
- [ ] Can send valid messages (<10,000 chars)
- [ ] Error displays for too-long messages
- [ ] Images upload and analyze correctly
- [ ] Model switching works
- [ ] Settings persist

### Edge Cases
- [ ] Very short messages (1 char)
- [ ] Exactly 10,000 char messages
- [ ] Special characters in messages
- [ ] Rapid message sending
- [ ] Network disconnection handling

---

## 📊 Monitoring Dashboard Setup

### Key Metrics to Track
1. **Error Rates**
   - 401 Unauthorized (JWT failures)
   - 402 Payment Required (OpenRouter credits)
   - 429 Rate Limited (too many requests)
   - 500 Internal Server Errors

2. **Performance**
   - Response time P50, P95, P99
   - API call latency
   - Message validation time

3. **Usage**
   - Requests per user
   - Total requests per hour
   - Peak hours
   - Model popularity

4. **Security**
   - CORS failures by origin
   - Invalid token attempts
   - Rate limit hits
   - Input validation failures

### Suggested Tools
- **Error Tracking**: Sentry, Rollbar
- **Logs**: Supabase Logs, CloudWatch
- **Metrics**: DataDog, New Relic
- **Uptime**: StatusPage, Uptime Robot

---

## 🔄 Maintenance Schedule

### Daily
- [ ] Review error rate trends
- [ ] Check for unusual patterns
- [ ] Monitor rate limit hits

### Weekly
- [ ] Review security logs
- [ ] Check validation failure reasons
- [ ] Analyze API usage patterns

### Monthly
- [ ] Security audit
- [ ] Update dependencies (npm audit)
- [ ] Review CORS origins
- [ ] Adjust rate limits if needed
- [ ] Backup configuration

### Quarterly
- [ ] Full security review
- [ ] Penetration testing
- [ ] Update documentation
- [ ] Review access logs

---

## 🚨 Incident Response

### If 401 Unauthorized Rate Increases
1. Check JWT configuration in Supabase
2. Verify auth tokens are valid
3. Check client code for auth issues
4. Review user feedback

### If 429 Rate Limited Increases
1. Check expected usage vs. limits
2. Identify problematic users
3. Increase limits if legitimate
4. Check for bot/abuse patterns

### If 402 Payment Required (OpenRouter)
1. Check OpenRouter account credits
2. Review usage trends
3. Add credits to account
4. Notify users if needed

### If Security Anomaly Detected
1. Check logs immediately
2. Contact security team
3. Implement mitigation
4. Document incident
5. Post-mortem analysis

---

## 📝 Logs to Monitor

### Location: Supabase Dashboard > Functions > Logs

**Watch for:**
- `JWT verification error` - Auth issues
- `Rate limit exceeded` - Usage spikes
- `OpenRouter API error` - Provider issues
- `Invalid message` - Input validation failures
- `Payment required` - Account credit issues

**Log Levels:**
- ERROR: Critical issues requiring immediate attention
- WARN: Potential issues to monitor
- INFO: Normal operations
- DEBUG: Detailed troubleshooting (dev only)

---

## 🔑 Secret Management

### Supabase Secrets (Server-Side Only)

Go to: Supabase Dashboard > Settings > Functions > Secrets

**Required Secrets:**
```
OPENROUTER_API_KEY=sk-or-xxx...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
```

**Rotation Schedule:**
- [ ] Rotate API keys every 90 days
- [ ] Immediately if leaked/compromised
- [ ] After staff changes

**Never:**
- ❌ Commit secrets to git
- ❌ Share in Slack/email
- ❌ Expose in client-side code
- ❌ Log in plaintext

---

## 🏥 Health Check Commands

### Check API Availability
```bash
curl -X OPTIONS https://your-api/openrouter-chat \
  -H "Origin: https://your-domain.com"
```

Expected: 204 No Content with CORS headers

### Check Edge Function Logs
```bash
# In Supabase dashboard:
1. Go to Functions
2. Select openrouter-chat
3. Click Logs tab
4. Check recent entries
```

### Check OpenRouter Status
```bash
curl https://openrouter.ai/api/v1/auth/key
```

---

## 📞 Support Contacts

### Security Issues
- **Do NOT**: Create public GitHub issues
- **DO**: Email security details privately
- **Include**: Vulnerability description, reproduction steps, impact

### Debugging
- Check `/supabase/functions/openrouter-chat/` logs
- Review browser console for client errors
- Check network tab for request/response details

### Performance Issues
- Monitor edge function execution time
- Check Supabase usage metrics
- Review API quotas

---

## ✅ Final Verification

Before marking as production-ready:

```
Security
  [ ] All secrets in environment (not code)
  [ ] CORS whitelist configured
  [ ] Rate limits appropriate
  [ ] Input validation working
  [ ] Error handling complete
  [ ] Logging enabled

Functionality
  [ ] Messages send/receive correctly
  [ ] Image upload works
  [ ] Model switching works
  [ ] Settings persist
  [ ] History saves

Monitoring
  [ ] Error tracking enabled
  [ ] Metrics dashboard set up
  [ ] Alerts configured
  [ ] Logs accessible
  [ ] Backup plan documented

Documentation
  [ ] SECURITY.md reviewed
  [ ] Team trained on procedures
  [ ] Runbooks updated
  [ ] Contact info documented
```

---

## 📋 Quick Command Reference

### Test Input Validation
```javascript
// In browser console:
onSendMessage('a'.repeat(10001)); // Should show error
```

### View Edge Function Logs
```bash
# Supabase CLI
supabase functions logs openrouter-chat
```

### Check Rate Limits
```bash
# Make request and check headers
curl -v https://your-api/openrouter-chat
# Look for: X-RateLimit-Remaining, X-RateLimit-Reset
```

### Verify CORS
```bash
# Test with different origins
curl -X OPTIONS https://your-api/openrouter-chat \
  -H "Origin: https://your-domain.com" \
  -v
# Should show: Access-Control-Allow-Origin: https://your-domain.com
```

---

**Last Updated**: November 15, 2025  
**Version**: 2.0.1  
**Status**: Active
