import { test, expect, run, fetchHtml, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

runTest()

const fetchedText = 'A New Hope'
const url = '/'

function runTest() {
  run('pnpm run dev')

  test('HTML', async () => {
    const html = await fetchHtml(url)
    expect(html).toContain(fetchedText)
  })

  test('Hydration', async () => {
    await page.goto(getServerUrl() + url)
    await testCounter()
    const body = await page.textContent('body')
    expect(body).toContain(fetchedText)
  })
}

async function testCounter() {
  // autoRetry() for awaiting client-side code loading & executing
  await autoRetry(
    async () => {
      expect(await page.textContent('button')).toBe('Counter 0')
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    },
    { timeout: 5 * 1000 },
  )
}
