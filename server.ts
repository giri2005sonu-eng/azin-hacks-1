import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import { tinyFish } from './server/tinyfish.ts';
import { evaluateEligibility } from './src/lib/matching.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API Routes

// 1. Health & Integration Status
app.get('/api/health', (req, res) => {
  const tinyFishStatus = tinyFish.getStatus();
  res.json({
    status: 'ok',
    appName: 'BHAIYO KI PHADAI',
    timestamp: new Date().toISOString(),
    tinyFish: {
      configured: tinyFishStatus.hasKey,
      keyMasked: tinyFishStatus.keyMasked,
      lastTestStatus: tinyFishStatus.lastTestStatus,
      lastTestedAt: tinyFishStatus.lastTestedAt,
      lastError: tinyFishStatus.lastError,
    },
    database: {
      totalScholarships: db.getAllScholarships().length,
      verifiedOpen: db.getAllScholarships().filter(s => s.status === 'verified_open').length,
    }
  });
});

// 2. Scholarships List & Search
app.get('/api/scholarships', (req, res) => {
  const {
    q,
    status,
    category,
    educationLevel,
    providerType,
    domicile,
    minAmount,
    maxAmount,
    sort,
    openOnly,
  } = req.query as Record<string, string | undefined>;

  let list = db.getAllScholarships();

  // Search filter
  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    list = list.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.provider.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.applicableCourses.some(c => c.toLowerCase().includes(query)) ||
      (s.tags && s.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  // Open only dedicated filter
  if (openOnly === 'true' || status === 'verified_open') {
    list = list.filter(s => s.status === 'verified_open');
  } else if (status && status !== 'all') {
    list = list.filter(s => s.status === status);
  }

  // Category filter
  if (category && category !== 'All') {
    list = list.filter(s => 
      s.applicableCategories.includes('All') || 
      s.applicableCategories.includes(category as any)
    );
  }

  // Education Level filter
  if (educationLevel && educationLevel !== 'all') {
    list = list.filter(s => s.educationLevels.includes(educationLevel as any));
  }

  // Provider Type filter
  if (providerType && providerType !== 'all') {
    list = list.filter(s => s.providerType === providerType);
  }

  // Domicile filter
  if (domicile && domicile !== 'all') {
    list = list.filter(s => 
      s.domicileStates.includes('All India') ||
      s.domicileStates.some(d => d.toLowerCase() === domicile.toLowerCase())
    );
  }

  // Award amount range
  if (minAmount && !isNaN(Number(minAmount))) {
    list = list.filter(s => s.awardAmount >= Number(minAmount));
  }
  if (maxAmount && !isNaN(Number(maxAmount))) {
    list = list.filter(s => s.awardAmount <= Number(maxAmount));
  }

  // Sorting
  const profile = db.getProfile('default');
  if (sort === 'deadline') {
    list.sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime());
  } else if (sort === 'amount_desc') {
    list.sort((a, b) => b.awardAmount - a.awardAmount);
  } else if (sort === 'amount_asc') {
    list.sort((a, b) => a.awardAmount - b.awardAmount);
  } else if (sort === 'recently_verified') {
    list.sort((a, b) => new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime());
  } else {
    // Default: Best Eligibility Match
    list.sort((a, b) => {
      const scoreA = evaluateEligibility(profile, a).relevanceScore;
      const scoreB = evaluateEligibility(profile, b).relevanceScore;
      return scoreB - scoreA;
    });
  }

  res.json({
    total: list.length,
    scholarships: list,
  });
});

// 3. Scholarship Detail & Eligibility Breakdown
app.get('/api/scholarships/:id', (req, res) => {
  const item = db.getScholarshipById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }

  const profile = db.getProfile('default');
  const eligibility = evaluateEligibility(profile, item);

  res.json({
    scholarship: item,
    eligibility,
  });
});

// 4. Student Profile
app.get('/api/profile', (req, res) => {
  const profile = db.getProfile('default');
  res.json(profile);
});

app.put('/api/profile', (req, res) => {
  const updated = db.updateProfile('default', req.body);
  res.json(updated);
});

// 5. Saved Scholarships
app.get('/api/saved', (req, res) => {
  const savedIds = db.getSavedScholarshipIds('default');
  const all = db.getAllScholarships();
  const savedItems = all.filter(s => savedIds.includes(s.id));
  res.json({
    savedIds,
    scholarships: savedItems,
  });
});

app.post('/api/saved/:id', (req, res) => {
  const isSaved = db.toggleSaveScholarship('default', req.params.id);
  res.json({
    scholarshipId: req.params.id,
    saved: isSaved,
  });
});

// 6. Application Tracker
app.get('/api/applications', (req, res) => {
  const apps = db.getApplications('default');
  res.json(apps);
});

app.post('/api/applications', (req, res) => {
  const { scholarshipId, status, notes, applicationReference, reminderDate } = req.body;
  const scholarship = db.getScholarshipById(scholarshipId);
  if (!scholarship) {
    return res.status(404).json({ error: 'Scholarship does not exist' });
  }

  const appItem = db.addApplication({
    userId: 'default',
    scholarshipId: scholarship.id,
    scholarshipName: scholarship.name,
    provider: scholarship.provider,
    deadline: scholarship.applicationDeadline,
    awardFormatted: scholarship.awardFormatted,
    officialUrl: scholarship.officialApplicationUrl,
    status: status || 'interested',
    notes: notes || '',
    applicationReference: applicationReference || undefined,
    startedAt: new Date().toISOString().split('T')[0],
    reminderDate: reminderDate || undefined,
  });

  res.status(201).json(appItem);
});

app.put('/api/applications/:id', (req, res) => {
  const updated = db.updateApplication(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Application record not found' });
  }
  res.json(updated);
});

app.delete('/api/applications/:id', (req, res) => {
  const deleted = db.deleteApplication(req.params.id);
  res.json({ success: deleted });
});

// 7. Documents Vault
app.get('/api/documents', (req, res) => {
  const docs = db.getDocuments('default');
  res.json(docs);
});

app.post('/api/documents', (req, res) => {
  const { title, docType, fileName, fileSize, mimeType, consentGiven, metadata } = req.body;
  if (!title || !docType || !consentGiven) {
    return res.status(400).json({ error: 'Title, document type, and explicit consent are required.' });
  }

  const newDoc = db.addDocument('default', {
    userId: 'default',
    title,
    docType,
    fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    fileSize: fileSize || 245000,
    mimeType: mimeType || 'application/pdf',
    consentGiven: Boolean(consentGiven),
    verifiedMetadata: metadata || {
      issueYear: 2026,
      issuerAuthority: 'Designated Government / Academic Authority',
      notes: 'Stored securely in private user vault. Never exposed in search queries.',
    },
  });

  res.status(201).json(newDoc);
});

app.delete('/api/documents/:id', (req, res) => {
  const success = db.deleteDocument('default', req.params.id);
  res.json({ success });
});

// 8. Notifications
app.get('/api/notifications', (req, res) => {
  const notifs = db.getNotifications('default');
  res.json(notifs);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const success = db.markNotificationAsRead('default', req.params.id);
  res.json({ success });
});

// 9. User Reports for Incorrect Information
app.post('/api/reports', (req, res) => {
  const { scholarshipId, issueType, description, userEmail } = req.body;
  if (!scholarshipId || !description) {
    return res.status(400).json({ error: 'Scholarship ID and issue description required.' });
  }

  const scholarship = db.getScholarshipById(scholarshipId);
  const report = db.addReport({
    scholarshipId,
    scholarshipName: scholarship ? scholarship.name : 'Unknown Listing',
    issueType: issueType || 'other',
    description,
    userEmail,
  });

  res.status(201).json(report);
});

// 10. Admin Endpoints
app.get('/api/admin/stats', (req, res) => {
  const all = db.getAllScholarships();
  const runs = db.getIngestionRuns();
  const reports = db.getReports();
  const tinyStatus = tinyFish.getStatus();

  res.json({
    totalScholarships: all.length,
    verifiedOpen: all.filter(s => s.status === 'verified_open').length,
    upcoming: all.filter(s => s.status === 'upcoming').length,
    closed: all.filter(s => s.status === 'closed').length,
    verificationRequired: all.filter(s => s.status === 'verification_required').length,
    demoCount: all.filter(s => s.isDemo).length,
    liveCount: all.filter(s => !s.isDemo).length,
    tinyFish: tinyStatus,
    recentIngestions: runs.slice(0, 5),
    reportsCount: reports.length,
    unresolvedReports: reports.filter(r => !r.resolved).length,
    reportsList: reports.slice(0, 10),
  });
});

app.post('/api/admin/test-tinyfish', async (req, res) => {
  const result = await tinyFish.testConnection();
  res.json(result);
});

app.post('/api/admin/sync', async (req, res) => {
  const { query } = req.body;
  const run = await tinyFish.runSyncJob(query, 'manual_admin');
  res.json(run);
});

// Vite / Static file serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BHAIYO KI PHADAI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Start Error]', err);
  process.exit(1);
});
