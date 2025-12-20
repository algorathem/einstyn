import OpenAI from 'openai'

export class OpenAIService {
  private client: OpenAI
  private model: string

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    })
    this.model = process.env.OPENAI_MODEL || 'gpt-4o'
  }

  async generateSearchQueries(topic: string, count: number): Promise<string[]> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: `Generate ${count} search queries as JSON { "queries": [] }` },
        { role: 'user', content: topic },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    return JSON.parse(response.choices[0].message.content || '{}').queries || []
  }

  async analyzeContent(
    originalQuery: string,
    extractedContents: any[],
    depth: number,
    maxDepth: number
  ): Promise<any> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: `Analyze content for "${originalQuery}" and return JSON.` },
        { role: 'user', content: JSON.stringify(extractedContents) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    })

    return JSON.parse(response.choices[0].message.content || '{}')
  }

  async generateResearchReport(originalQuery: string, analyses: any[]): Promise<any> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: `Compile a research report as JSON.` },
        { role: 'user', content: JSON.stringify(analyses) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    })

    return JSON.parse(response.choices[0].message.content || '{}')
  }
}
