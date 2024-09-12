import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

runTest()

const counter1 = 'button#counter-1'
const counter2 = 'button#counter-2'
const counter3 = 'button#counter-3'

function runTest() {
  run('pnpm run dev')

  test('initial state', async () => {
    const url = '/'
    const html = await fetchHtml(url)
    expect(html).toContain('<button type="button" id="counter-1">Counter 1</button>')
    expect(html).toContain('<button type="button" id="counter-2">Counter 1</button>')
    await page.goto(getServerUrl() + url)
    expect(await page.textContent(counter1)).toBe('Counter 1')
    expect(await page.textContent(counter2)).toBe('Counter 1')
  })

  test('synced state', async () => {
    // autoRetry() for awaiting client-side code loading & executing
    await autoRetry(
      async () => {
        expect(await page.textContent(counter1)).toBe('Counter 1')
        await page.click(counter1)
        expect(await page.textContent(counter1)).toContain('Counter 2')
      },
      { timeout: 5 * 1000 },
    )
    expect(await page.textContent(counter1)).toBe('Counter 2')
    expect(await page.textContent(counter2)).toBe('Counter 2')
  })

  test('preserved state upon client-side navigation', async () => {
    await page.click('a[href="/about"]')
    expect(await page.textContent(counter3)).toBe('Counter 2')
    await page.click(counter3)
    expect(await page.textContent(counter3)).toContain('Counter 3')
    await page.click('a[href="/"]')
    expect(await page.textContent(counter1)).toBe('Counter 3')
    expect(await page.textContent(counter2)).toBe('Counter 3')
  })
}
