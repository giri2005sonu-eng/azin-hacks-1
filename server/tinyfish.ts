import type { IngestionRun, Scholarship } from '../src/types/scholarship.ts';
import {
  normalizeTinyFishSearchResult,
  normalizeFetchedScholarship,
  type TinyFishSearchResultItem
} from '../src/lib/tinyfish-normalizer.ts';
import { db } from './db.ts';

const TINYFISH_SEARCH_HOST = process.env.TINYFISH_SEARCH_HOST || 'https://api.search.tinyfish.ai';
const TINYFISH_FETCH_HOST = process.env.TINYFISH_FETCH_HOST || 'https://api.fetch.tinyfish.ai';

export interface TinyFishStatus {
  hasKey: boolean;
  keyMasked: string;
  searchHost: string;
  fetchHost: string;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'failed' | 'not_tested';
  lastError?: string;
}

export class TinyFishService {
  private lastStatus: TinyFishStatus = {
    hasKey: Boolean(process.env.TINYFISH_API_KEY),
    keyMasked: process.env.TINYFISH_API_KEY
      ? `${process.env.TINYFISH_API_KEY.slice(0, 10)}...${process.env.TINYFISH_API_KEY.slice(-4)}`
      : 'Not configured',
    searchHost: TINYFISH_SEARCH_HOST,
    fetchHost: TINYFISH_FETCH_HOST,
    lastTestStatus: 'not_tested',
  };

  getStatus(): TinyFishStatus {
    const key = process.env.TINYFISH_API_KEY;
    return {
      ...this.lastStatus,
      hasKey: Boolean(key),
      keyMasked: key ? `${key.slice(0, 10)}...${key.slice(-4)}` : 'Not configured',
    };
  }

  /**
   * Performs real test connection against TinyFish API
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) {
      this.lastStatus.lastTestStatus = 'failed';
      this.lastStatus.lastError = 'TINYFISH_API_KEY is not set in server environment.';
      return {
        success: false,
        message: 'TINYFISH_API_KEY is not configured in server environment variables.',
      };
    }

    try {
      // Execute health or test search request to TinyFish Search API
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${TINYFISH_SEARCH_HOST}/search?q=scholarships+india&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-API-Key': apiKey,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      }).catch(async () => {
        // Fallback check on POST /v1/search if GET is not allowed
        return await fetch(`${TINYFISH_SEARCH_HOST}/v1/search`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: 'scholarships india', limit: 1 }),
          signal: controller.signal,
        });
      });

      clearTimeout(timeout);

      this.lastStatus.lastTestedAt = new Date().toISOString();

      if (response && (response.ok || response.status === 200 || response.status === 201)) {
        this.lastStatus.lastTestStatus = 'success';
        this.lastStatus.lastError = undefined;
        return {
          success: true,
          message: `Connected successfully to TinyFish Search API (${response.status} OK).`,
        };
      } else {
        const errorText = response ? await response.text().catch(() => '') : 'Network timeout or unreachable host';
        const sanitized = errorText.replace(apiKey, '[REDACTED_API_KEY]').slice(0, 300);
        this.lastStatus.lastTestStatus = 'failed';
        this.lastStatus.lastError = `Status ${response?.status || 'network_error'}: ${sanitized}`;
        return {
          success: false,
          message: `TinyFish API responded with status ${response?.status || 500}: ${sanitized || 'Verify key and host.'}`,
        };
      }
    } catch (err: any) {
      const sanitized = (err?.message || String(err)).replace(apiKey || '', '[REDACTED_API_KEY]');
      this.lastStatus.lastTestedAt = new Date().toISOString();
      this.lastStatus.lastTestStatus = 'failed';
      this.lastStatus.lastError = sanitized;
      return {
        success: false,
        message: `Connection attempt to TinyFish failed: ${sanitized}`,
      };
    }
  }

  /**
   * Search for public Indian scholarship opportunities via TinyFish Search API
   */
  async searchOpportunities(query: string, maxResults: number = 8): Promise<TinyFishSearchResultItem[]> {
    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) {
      throw new Error('TINYFISH_API_KEY not found in server environment variables.');
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      // Attempt standard TinyFish Search API request
      const url = `${TINYFISH_SEARCH_HOST}/search?q=${encodeURIComponent(query)}&limit=${maxResults}`;
      let res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-API-Key': apiKey,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      }).catch(async () => null);

      if (!res || !res.ok) {
        // Try POST endpoint variant
        res = await fetch(`${TINYFISH_SEARCH_HOST}/v1/search`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, limit: maxResults }),
          signal: controller.signal,
        }).catch(async () => null);
      }

      clearTimeout(timeout);

      if (res && res.ok) {
        const data = await res.json();
        const rawItems = Array.isArray(data) ? data : (data.results || data.items || data.data || []);
        return rawItems.map((item: any) => ({
          title: item.title || item.name || 'Scholarship Opportunity',
          url: item.url || item.link,
          snippet: item.snippet || item.description || item.content || '',
          source: item.source || item.domain || '',
          publishedDate: item.publishedDate || item.date,
        }));
      }

      // If external API request failed, throw transparent error with status
      const statusText = res ? `HTTP ${res.status}` : 'Request timed out or domain unreachable';
      throw new Error(`TinyFish Search API responded with ${statusText}`);
    } catch (err: any) {
      console.error('[TinyFish Search Error]', (err?.message || err).replace(apiKey, '[REDACTED]'));
      throw err;
    }
  }

  /**
   * Fetch and extract structured scholarship content from a candidate URL via TinyFish Fetch API
   */
  async fetchScholarshipPage(targetUrl: string): Promise<any> {
    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) {
      throw new Error('TINYFISH_API_KEY not configured.');
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      let res = await fetch(`${TINYFISH_FETCH_HOST}/fetch?url=${encodeURIComponent(targetUrl)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-API-Key': apiKey,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      }).catch(async () => null);

      if (!res || !res.ok) {
        res = await fetch(`${TINYFISH_FETCH_HOST}/v1/fetch`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: targetUrl, extractStructuredData: true }),
          signal: controller.signal,
        }).catch(async () => null);
      }

      clearTimeout(timeout);

      if (res && res.ok) {
        return await res.json();
      }

      throw new Error(`TinyFish Fetch API responded with status ${res?.status || 'network_error'}`);
    } catch (err: any) {
      console.error('[TinyFish Fetch Error]', (err?.message || err).replace(apiKey, '[REDACTED]'));
      throw err;
    }
  }

  /**
   * Full Discovery & Ingestion Workflow:
   * 1. Generates privacy-preserving search queries for central/state schemes
   * 2. Calls TinyFish Search API
   * 3. Normalizes candidate URLs and filters out unsafe domains
   * 4. Extracts structured data via TinyFish Fetch API
   * 5. Validates and inserts/updates records in database
   * 6. Records full Ingestion Run log with honest counts
   */
  async runSyncJob(
    queryOverride?: string,
    trigger: 'manual_admin' | 'scheduled_job' | 'user_query' = 'manual_admin'
  ): Promise<IngestionRun> {
    const query = queryOverride || 'site:scholarships.gov.in OR site:aicte-india.org OR site:ugc.ac.in scholarship 2026';
    const startedAt = new Date().toISOString();
    const runId = `run-${Date.now()}`;
    const errors: string[] = [];

    let candidatesFound = 0;
    let successfullyFetched = 0;
    let recordsAdded = 0;
    let recordsUpdated = 0;
    let recordsSkipped = 0;
    let failedExtractions = 0;

    try {
      let rawResults: TinyFishSearchResultItem[] = [];
      try {
        rawResults = await this.searchOpportunities(query, 6);
      } catch (searchErr: any) {
        errors.push(`TinyFish Search: ${searchErr.message || String(searchErr)}`);
      }

      candidatesFound = rawResults.length;

      // Ingest each candidate
      for (const item of rawResults) {
        const candidate = normalizeTinyFishSearchResult(item);
        if (!candidate) {
          recordsSkipped++;
          continue;
        }

        try {
          let extractedData: any = {};
          try {
            extractedData = await this.fetchScholarshipPage(candidate.officialUrl);
            successfullyFetched++;
          } catch {
            // If fetch endpoint was not reachable for this specific candidate, use parsed search snippet
            extractedData = {
              evidenceSnippet: candidate.summary,
            };
            failedExtractions++;
          }

          const newScholarship: Scholarship = normalizeFetchedScholarship(candidate, extractedData);

          const existing = db.getScholarshipById(newScholarship.id);
          if (existing) {
            db.upsertScholarship({
              ...existing,
              ...newScholarship,
              lastCheckedAt: new Date().toISOString(),
            });
            recordsUpdated++;
          } else {
            db.upsertScholarship(newScholarship);
            recordsAdded++;
          }
        } catch (itemErr: any) {
          failedExtractions++;
          errors.push(`Extraction failed for ${candidate.officialUrl}: ${itemErr.message}`);
        }
      }

      // If candidates were 0 due to API connectivity, report honestly
      const status: IngestionRun['status'] = errors.length === 0 ? 'success' : (recordsAdded + recordsUpdated > 0 ? 'partial' : 'failed');

      const run: IngestionRun = {
        id: runId,
        query,
        startedAt,
        completedAt: new Date().toISOString(),
        candidatesFound,
        successfullyFetched,
        recordsAdded,
        recordsUpdated,
        recordsSkipped,
        failedExtractions,
        status,
        errors,
        trigger,
      };

      db.addIngestionRun(run);
      return run;
    } catch (fatalErr: any) {
      const run: IngestionRun = {
        id: runId,
        query,
        startedAt,
        completedAt: new Date().toISOString(),
        candidatesFound,
        successfullyFetched,
        recordsAdded,
        recordsUpdated,
        recordsSkipped,
        failedExtractions: 1,
        status: 'failed',
        errors: [fatalErr.message || String(fatalErr)],
        trigger,
      };
      db.addIngestionRun(run);
      return run;
    }
  }
}

export const tinyFish = new TinyFishService();
