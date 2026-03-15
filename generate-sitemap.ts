import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

dotenv.config()

// zamiennik __dirname w ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const domain = (process.env.DOMAIN || '').replace(/\/$/, '') + '/'
if (!domain) throw new Error('DOMAIN must be set in .env')

const outputDir = path.resolve(__dirname, '.output/public')

function walkDir(dir: string, baseUrl = ''): string[] {
  const urls: string[] = []

  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory()) {
      urls.push(...walkDir(path.join(dir, file.name), path.join(baseUrl, file.name)))
    } else if (file.name === 'index.html') {
      urls.push(domain + baseUrl)
    }
  }

  return urls
}

function generateSitemap() {
  const urls = walkDir(outputDir)

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

  fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapXml)

  console.log('✅ Sitemap generated in .output/public/sitemap.xml')
}

generateSitemap()
