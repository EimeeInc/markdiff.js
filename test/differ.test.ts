import render from "../src"

describe("diff Markdown HTML", () => {
  test("diff words", () => {
    expect(render("hoge", "fuga")).toBe(`<del class="del">ho</del><ins class="ins">fu</ins>g<del class="del">e</del><ins class="ins">a</ins>`)
  })

  test("markdiff example", () => {
    expect(render("<h2>title</h2><ul><li>foo</li><li>bar</li></ul>", "<h2>Title</h2><ul><li>foba</li></ul>"))
      .toBe(`<h2><del class="del">t</del><ins class="ins">T</ins>itle</h2><ul><li>fo<del class="del">o</del><ins class="ins">ba</ins></li><li class="removed"><del class="del"><li class="removed">bar</li></del></li></ul>`)
  })
})
