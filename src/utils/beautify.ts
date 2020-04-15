import beautify from "js-beautify"

export default (html: string) => beautify.html(html, {
  indent_size: 2,
  end_with_newline: true,
  preserve_newlines: false,
  max_preserve_newlines: 0,
  wrap_line_length: 0,
  wrap_attributes_indent_size: 0,
  unformatted: ["b", "em"],
})