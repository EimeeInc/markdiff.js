import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import Helmet from "@/components/Helmet"
import MarkdownUnit from "@/components/molecules/MarkdownUnit"

import beautify from "@/utils/beautify"
import markdown from "@/utils/markdown"
import render from "@/index"

const Container = styled.div``

const IndexPage: React.FC = () => (
  <Container>
    <Helmet />

    <code css={css`white-space: pre-wrap;`}>
      {beautify(render("<p>a</p><p>a</p>", "<p>b</p><p>a</a>"))}
    </code>
    <code>{markdown.render("++hoge++:+1:")}</code>

    <MarkdownUnit />
  </Container>
)

export default IndexPage
