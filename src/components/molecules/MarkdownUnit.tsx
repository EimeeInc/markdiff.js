import React, { useEffect } from "react"
import styled from "@emotion/styled"
import MarkdownInput from "@/components/atoms/MarkdownInput"
import HtmlPreviewer from "@/components/atoms/HtmlPreviewer"
import markdown from "@/utils/markdown"

const Container = styled.div`
  display: flex;
  flex-direction: row;
  max-height: 160px;

  > * {
    flex: 1;
    margin: 4px;
  }

  @media screen and (max-width: 800px) {
    flex-direction: column;
    max-height: initial;
  }
`

type MarkdownUnitProps = Partial<{
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onRender: (html: string) => void
}>

const MarkdownUnit: React.FC<MarkdownUnitProps> = ({
  value = "",
  onChange = () => {},
  onRender = () => {},
}) => {
  const __html = markdown.render(value)
  useEffect(() => onRender(__html))

  return (
    <Container>
      <MarkdownInput
        value={value}
        onChange={onChange}
      />
  
      <HtmlPreviewer
        dangerouslySetInnerHTML={{ __html }}
      />
    </Container>
  )
}

export default MarkdownUnit
