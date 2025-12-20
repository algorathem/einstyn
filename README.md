# ReSearchlyAI

![GitHub Workflow Status](https://img.shields.io/badge/build-passing-brightgreen)
![GitHub Repo Size](https://img.shields.io/github/repo-size/yourusername/researchly_ai)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python Version](https://img.shields.io/badge/python-3.11-blue)
![Node Version](https://img.shields.io/badge/node-20-brightgreen)

---

## About
ResearchlyAI is an AI-powered research assistant that streamlines the entire research workflow. Ask a question and it fetches trusted sources, scores their reliability, and explains why so you get ideas you can trust.

The center pane allows you to interact with each source, digesting complex papers without reading every word. Curious about replicating experiments? Our explainer agent provides step-by-step instructions including pseudocode.

Finally, draft your conclusions in the report editor with dark and light modes for comfort. Powered by the Motia framework, ResearchlyAI unifies APIs, workflows, and AI agents into a seamless backend solution for smarter research.

---

## Features

| Feature | Description |
|---------|-------------|
| Source Retrieval | Finds relevant research sources for a query |
| Summarization | Provides digestible summaries in a chat-like interface |
| Experiment Replication | Explains implementation steps including pseudocode |
| Quick Actions | Supports drag, click, and request implementation |
| Modular Pipeline | Uses Motia flows and steps for extensibility |

---

## Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Motia](https://img.shields.io/badge/Motia-000000?style=for-the-badge&logo=apache&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Architecture:** Modular pipeline: Query → Validation → Summarization → Action

---

## Workflow

```mermaid
flowchart LR
    Q[Query] --> S[Sources]
    S --> C[Center Pane Interaction]
    C --> E[Explainer Agent]
    E --> R[Report Editor]
````

---

## Demo



---

## Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/researchly_ai.git
cd researchly_ai
```

2. Install dependencies:

```bash
npm install
# or
pip install -r requirements.txt
```

3. Start the Motia dev server:

```bash
npx motia dev -p 3000 -d
```

---

## Usage

1. Open your browser at `http://localhost:3000`.
2. Enter a research query in the left panel.
3. Click sources to interact in the center pane:

   * Get a summary
   * Request explanations
   * Request implementation guidance
4. Draft conclusions in the report editor with light or dark mode.

---

## How We Used Motia

* Registered custom flows for research tasks
* Created steps for querying, validating, and summarizing sources
* Leveraged Motia’s plugin system for modular and reusable components

---
