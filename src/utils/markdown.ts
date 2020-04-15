import MarkdownIt from "markdown-it"
import emoji from "markdown-it-emoji"
import footnote from "markdown-it-footnote"
import highlight from "highlight.js"
import ins from "markdown-it-ins"
import katex from "markdown-it-katex"
import mark from "markdown-it-mark"

export default MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  highlight(str, lang) {
    if (lang && highlight.getLanguage(lang)) {
      try {
        return highlight.highlight(lang, str).value
      } catch {}
    }

    return ""
  },
}).use(emoji)
  .use(footnote)
  .use(ins)
  .use(katex)
  .use(mark)
