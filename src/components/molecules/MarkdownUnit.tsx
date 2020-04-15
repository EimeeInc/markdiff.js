import React from "react"
import styled from "@emotion/styled"
import MarkdownInput from "@/components/atoms/MarkdownInput"
import MarkdownPreviewer from "@/components/atoms/MarkdownPreviewer"

const Container = styled.div``

const MarkdownUnit: React.FC = () => (
  <Container>
    <MarkdownInput />
    <MarkdownPreviewer />
  </Container>
)

export default MarkdownUnit
