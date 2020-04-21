import React from "react"
import styled from "@emotion/styled"
import HtmlCode from "@/components/atoms/HtmlCode"
import HtmlPreviewer from "@/components/atoms/HtmlPreviewer"
import beautify from "@/utils/beautify"

const Container = styled.div`
  display: flex;
  flex-direction: row;

  > * {
    flex: 1;
    margin: 4px;
  }

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`

type MarkDiffUnitProps = {
  html?: string;
}

const MarkDiffUnit: React.FC<MarkDiffUnitProps> = ({ html = "" }) => (
  <Container>
    <HtmlCode>{ beautify(html) }</HtmlCode>
    <HtmlPreviewer dangerouslySetInnerHTML={{ __html: html }} />
  </Container>
)

export default MarkDiffUnit
