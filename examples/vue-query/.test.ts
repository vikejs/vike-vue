import { test, expect, run, fetchHtml, page, getServerUrl } from '@brillout/test-e2e'

runTest()

function runTest() {
  run('pnpm run dev')

  const textLandingPage = 'A New Hope'
  const title = 'Star Wars Movies'
  testUrl({
    url: '/',
    title,
    text: textLandingPage,
  })
}

function testUrl({ url, title, text }: { url: string; title: string; text: string }) {
  test(url + ' (HTML)', async () => {
    const html = await fetchHtml(url)
    expect(html).toContain(text)
    expect(getTitle(html)).toBe(title)
  })
  test(url + ' (Hydration)', async () => {
    await page.goto(getServerUrl() + url)
    const body = await page.textContent('body')
    expect(body).toContain(text)
  })
}

function getTitle(html: string) {
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]
  return title
}
