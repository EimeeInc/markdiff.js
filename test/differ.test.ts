import render from "../src"

describe("markdiff test", () => {
  test("with same node", () => {
    const html = "<p>a</p>"
    expect(render(html, html)).toBe(html)
  })

  test("with different text node", () => {
    expect(render("<p>a</p>", "<p>b</p>"))
      .toBe(`<div class="changed"><p><del class="del">a</del><ins class="ins">b</ins></p></div>`)
  })

  test("with partial difference in text node", () => {
    expect(render("<p>aaa aaa aaa</p>", "<p>aaa bbb aaa</p>"))
      .toBe(`<div class="changed"><p>aaa <del class="del">aaa</del><ins class="ins">bbb</ins> aaa</p></div>`)
  })

  test("with adding a new sibling", () => {
    expect(render("<p>b</p>\n", "<p>a</p>\n\n<p>b</p>\n"))
      .toBe(`<ins class="ins"><p>a</p></ins><ins class="ins">\n\n</ins><p>b</p>\n`)
  })

  test("with different tag name", () => {
    expect(render("<p>a</p>", "<h1>a</h1>"))
      .toBe(`<del class="del"><p>a</p></del><ins class="ins"><h1>a</h1></ins>`)
  })

  test("with difference in nested node", () => {
    expect(render("<p>a</p>", "<p><strong>a</strong></p>"))
      .toBe(`<div class="changed"><p><del class="del">a</del><ins class="ins"><strong>a</strong></ins></p></div>`)
  })

  test("with difference in sibling", () => {
    expect(render("<p>b</p>", "<p>a</p><p>b</p>"))
      .toBe(`<ins class="ins"><p>a</p></ins><p>b</p>`)
  })

  test("with removing", () => {
    expect(render("<p>a</p><p>b</p>", "<p>a</p>"))
      .toBe(`<p>a</p><del class="del"><p>b</p></del>`)
  })

  test("with difference in table tag", () => {
    const to = "<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>c</td><td>e</td></tr></tbody></table>"
    const from = "<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>c</td><td>d</td></tr></tbody></table>"

    expect(render(from, to).replace(/\n/g, ""))
      .toBe(`<div class="changed"><table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr class="changed"><td>c</td><td><del class="del">d</del><ins class="ins">e</ins></td></tr></tbody></table></div>`)
  })

  test("with ul and li", () => {
    const to = "<ul><li>a</li><li>b</li><li>a</li></ul>"
    const from = "<ul><li>a</li><li>a</li><li>a</li></ul>"

    expect(render(from, to).replace(/\n/g, ""))
      .toBe(`<div class="changed"><ul><li>a</li><li class="changed"><del class="del">a</del><ins class="ins">b</ins></li><li>a</li></ul></div>`)
  })

  test("with removed li", () => {
    const to = "<ul><li>a</li></ul>"
    const from = "<ul><li>a</li><li>b</li></ul>"

    expect(render(from, to).replace(/\n/g, ""))
      .toBe(`<div class="changed"><ul><li>a</li><li class="removed"><del class="del">b</del></li></ul></div>`)
  })

  test("with added child li", () => {
    const to = "<ul><li>a</li><li>b</li></ul>"
    const from = "<ul><li>a</li></ul>"

    expect(render(from, to).replace(/\n/g, ""))
      .toBe(`<div class="changed"><ul><li>a</li><li class="added"><ins class="ins">b</ins></li></ul></div>`)
  })

  test("with removed and added li", () => {
    const to = "<ul><li>c</li><li>d</li></ul>"
    const from = "<ul><li>a</li><li>b</li></ul>"

    expect(render(from, to).replace(/\n/g, ""))
      .toBe(`<div class="changed"><ul><li class="changed"><del class="del">a</del><ins class="ins">c</ins></li><li class="changed"><del class="del">b</del><ins class="ins">d</ins></li></ul></div>`)
  })

  test("with added sibling li", () => {
    const to = "<ul><li>a</li><li>b</li></ul>"
    const from = "<ul><li>b</li></ul>"

    expect(render(from, to).replace(/\n/g, ""))
      .toBe(`<div class="changed"><ul><li class="added"><ins class="ins">a</ins></li><li>b</li></ul></div>`)
  })

  test("with different href in a node", () => {
    const to = `<p><a href="http://example.com/2">a</a></p>`
    const from = `<p><a href="http://example.com/1">a</a></p>`

    expect(render(from, to))
      .toBe(`<div class="changed"><p><a href="http://example.com/2" data-before-href="http://example.com/1">a</a></p></div>`)
  })

  test("with different level heading nodes", () => {
    const to = "<h2>a</h2>"
    const from = "<h1>a</h1>"

    expect(render(from, to))
      .toBe(`<div class="changed"><h2 data-before-tag-name="h1">a</h2></div>`)
  })

  test("with replaced operation target node", () => {
    const to = "<h1>c</h1>d"
    const from = "a<p>b</p>"

    expect(render(from, to))
      .toBe(`<ins class="ins"><h1>c</h1></ins><del class="del">a</del><ins class="ins">d</ins><del class="del"><p>b</p></del>`)
  })

  test("with tasklist", () => {
    const to = `<ul><li><input type="checkbox" checked> a</li></ul>`
    const from = `<ul><li><input type="checkbox"> a</li></ul>`

    expect(render(from, to).replace(/\n/g, ""))
      .toBe(`<div class="changed"><ul><li class="changed"><del class="del"><input type="checkbox"></del><ins class="ins"><input type="checkbox" checked></ins> a</li></ul></div>`)
  })

  test("with prepending node", () => {
    const to = "<h2>added</h2>\n\n<h2>a</h2>\n\n<p>b</p>\n"
    const from = "<h2>a</h2>\n\n<p>b</p>\n"

    expect(render(from, to).replace(/\n/g, ""))
      .toBe(`<ins class="ins"><h2>added</h2></ins><ins class="ins"></ins><h2>a</h2><p>b</p>`)
  })

  test("with classed li node", () => {
    const to = `<ul><li class="a">b</li></ul>`
    const from = `<ul></ul>`

    expect(render(from, to).replace(/\n/g, ""))
      .toBe(`<div class="changed"><ul><li class="a added"><ins class="ins">b</ins></li></ul></div>`)
  })

  test("with a sequence of AddChild operations", () => {
    const to = "<p>b</p><p>c</p><p>d</p>"
    const from = "<p>a</p>"

    expect(render(from, to))
      .toBe(`<div class="changed"><p><del class="del">a</del><ins class="ins">b</ins></p></div><ins class="ins"><p>c</p></ins><ins class="ins"><p>d</p></ins>`)
  })
})
