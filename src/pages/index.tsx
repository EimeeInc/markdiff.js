import React, { useState } from "react"
import styled from "@emotion/styled"
import Helmet from "@/components/Helmet"
import MarkdownUnit from "@/components/molecules/MarkdownUnit"
import render from "@/index"
import MarkDiffUnit from "@/components/molecules/MarkDiffUnit"

const Container = styled.div`
  padding: 8px;

  section > h2 {
    margin-top: 8px;
  }
`

const defaultFromMarkdown = `## title
- foo
- bar
`

const defaultToMarkdown = `## Title
- fuba
`

const IndexPage: React.FC = () => {
  const [fromMarkdown, setFromMarkdown] = useState(defaultFromMarkdown)
  const [toMarkdown, setToMarkdown] = useState(defaultToMarkdown)
  const [fromHtml, setFromHtml] = useState("")
  const [toHtml, setToHtml] = useState("")

  return (
    <Container>
      <Helmet>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js/styles/vs.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css" />
      </Helmet>
  
      <main>
        <h1>markdiff.js Demo</h1>

        <section>
          <h2>before</h2>

          <MarkdownUnit
            value={fromMarkdown}
            onChange={(e) => setFromMarkdown(e.currentTarget.value)}
            onRender={(html) => setFromHtml(html)}
          />
        </section>

        <section>
          <h2>after</h2>

          <MarkdownUnit
            value={toMarkdown}
            onChange={(e) => setToMarkdown(e.currentTarget.value)}
            onRender={(html) => setToHtml(html)}
          />
        </section>

        <section>
          <h2>diff</h2>

          <MarkDiffUnit html={render(fromHtml, toHtml)} />
        </section>
      </main>
    </Container>
  )
}

export default IndexPage
