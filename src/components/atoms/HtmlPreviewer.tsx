import styled from "@emotion/styled"

export default styled.div`
  overflow: auto;

  del.del {
    background-color: #FFEAEA;
    color: #CB4000;
  }

  ins.ins {
    background-color: #E9FFE9;
    color: green;
    text-decoration: none;
  }

  li.added {
    color: #7DCD55;
  }

  li.removed {
    color: #CB4000;
  }

  > del.del {
    padding-left: 32px;
    border-left: solid 4px #CB4000;
    color: inherit;
    display: block;
    text-decoration: none;
  }

  > ins.ins {
    padding-left: 32px;
    background-color: inherit;
    border-left: solid 4px #7DCD55;
    color: inherit;
    display: block;
  }

  > .changed {
    padding-left: 32px;
    border-left: solid 4px #FFC134;
  }

  code {
    margin: 0 3px;
    border: solid 1px rgb(232, 225, 225);
    border-radius: 2px;
    padding: 0 2px;
    color: rgb(225, 2, 2);
    background-color: rgb(245, 245, 250);
  }

  pre {
    position: relative;
    border: solid 1px rgb(201, 201, 201);
    border-radius: 2px;
    padding: 10px;
    padding-top: 0;
    font-size: 16px;
    background-color: rgb(246, 246, 246);

    code {
      display: block;
      margin: 0;
      margin-top: 10px;
      border: none;
      padding: 0;
      color: rgb(0, 0, 0);
      font-size: 14px;
      background-color: transparent;
    }
  }
`
