import FirecrawlApp from '@mendable/firecrawl-js'
import { Logger } from 'motia'

export interface SearchResult {
  url: string
  title: string
  snippet: string
}

export interface ExtractedContent {
  url: string
  title: string
  content: string
  query: string
}

export class FirecrawlService {
  private client: FirecrawlApp

  constructor(apiKey?: string) {
    const key = apiKey || process.env.FIRECRAWL_API_KEY
    const apiUrl = process.env.FIRECRAWL_API_URL

    if (!key) throw new Error('Firecrawl API key not set')

    this.client = new FirecrawlApp({ apiKey: key, apiUrl })
  }

  async search(query: string, logger?: Logger): Promise<SearchResult[]> {
    const response = await this.client.search(query)

    if (!response.success) {
      throw new Error(response.error || 'Search failed')
    }

    return (response.data || []).map(doc => ({
      url: doc.url ?? '',
      title: doc.title ?? '',
      snippet: doc.description ?? '',
    }))
  }

  async extractContent(url: string, logger?: Logger): Promise<string> {
    const response = await this.client.scrapeUrl(url, { formats: ['markdown'] })

    if (!response.success) {
      throw new Error(response.error || 'Scrape failed')
    }

    return response.markdown || ''
  }

  async batchExtractContent(
    urls: Array<{ url: string; title: string; query: string }>,
    logger?: Logger
  ): Promise<ExtractedContent[]> {
    const limit = parseInt(process.env.FIRECRAWL_CONCURRENCY_LIMIT || '2')
    const results: ExtractedContent[] = []

    for (let i = 0; i < urls.length; i += limit) {
      const batch = urls.slice(i, i + limit)

      await Promise.all(
        batch.map(async item => {
          try {
            const content = await this.extractContent(item.url, logger)
            results.push({ ...item, content })
          } catch {}
        })
      )
    }

    return results
  }
}
