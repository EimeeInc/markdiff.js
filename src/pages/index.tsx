import React from "react"
import render from "@/index"
import Helmet from "@/components/Helmet"

const IndexPage: React.FC = () => (
  <div>
    <Helmet />
    {render("<p>a</p>", "<p>b</p>")}
  </div>
)

export default IndexPage
