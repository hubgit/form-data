import test from "ava"

import sinon from "sinon"

import FormData from "../../lib/FormData"

test(
  "Callback should not be called when FormData doesn't have any fields",
  t => {
    const fulfill = sinon.spy()

    const fd = new FormData()

    fd.forEach(fulfill)

    t.false(fulfill.called)
  }
)

test("Callback should be called with the nullish context by default", t => {
  const fulfill = sinon.spy()

  const fd = new FormData()

  fd.set("name", "John Doe")

  fd.forEach(fulfill)

  t.is(fulfill.firstCall.thisValue, null)
})

test("Callback should be called with the specified context", t => {
  const fulfill = sinon.spy()

  const ctx = new Map()

  const fd = new FormData()

  fd.set("name", "John Doe")

  fd.forEach(fulfill, ctx)

  t.true(fulfill.firstCall.thisValue instanceof Map)
  t.is(fulfill.firstCall.thisValue, ctx)
})

test("Callback should be called with value, name and FormData itself", t => {
  const fulfill = sinon.spy()

  const fd = new FormData()

  fd.set("name", "John Doe")

  fd.forEach(fulfill)

  t.deepEqual(fulfill.firstCall.args, ["John Doe", "name", fd])
})

test("Callback should be called once on each filed", t => {
  const fulfill = sinon.spy()

  const fd = new FormData()

  fd.set("first", "value")
  fd.set("second", 42)
  fd.set("third", [1, 2, 3])

  fd.forEach(fulfill)

  t.true(fulfill.calledThrice)
  t.deepEqual(fulfill.firstCall.args, ["value", "first", fd])
  t.deepEqual(fulfill.secondCall.args, ["42", "second", fd])
  t.deepEqual(fulfill.thirdCall.args, ["1,2,3", "third", fd])
})
