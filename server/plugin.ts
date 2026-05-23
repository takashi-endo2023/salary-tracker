import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

export function salaryApiPlugin(): Plugin {
  return {
    name: 'salary-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req: IncomingMessage, res: ServerResponse, next) => {
        const { db } = await import('./db.js')

        const url = new URL(req.url ?? '/', 'http://localhost')
        // pathname: '' | '/:year' | '/:year/:month'
        const parts = url.pathname.replace(/^\//, '').split('/').filter(Boolean)

        res.setHeader('Content-Type', 'application/json')

        const send = (data: unknown, status = 200) => {
          res.statusCode = status
          res.end(JSON.stringify(data))
        }

        const body = (): Promise<string> =>
          new Promise(resolve => {
            let data = ''
            req.on('data', (chunk: Buffer) => (data += chunk.toString()))
            req.on('end', () => resolve(data))
          })

        const toRecord = (r: unknown) => {
          const rec = r as Record<string, unknown>
          return {
            year:           rec.year as number,
            month:          rec.month as number,
            salaryGross:    rec.salary_gross as number,
            salaryTakehome: rec.salary_takehome as number,
            bonusGross:     rec.bonus_gross as number,
            bonusTakehome:  rec.bonus_takehome as number,
            memo:           rec.memo as string,
          }
        }

        try {
          // GET /api          → all months
          // GET /api/:year    → months of a year
          if (req.method === 'GET') {
            const rows = parts[0]
              ? db.prepare('SELECT * FROM monthly_records WHERE year = ? ORDER BY month').all(Number(parts[0]))
              : db.prepare('SELECT * FROM monthly_records ORDER BY year, month').all()
            return send(rows.map(toRecord))
          }

          // PUT /api  body: MonthlyRecord → upsert
          if (req.method === 'PUT') {
            const rec = JSON.parse(await body())
            db.prepare(`
              INSERT INTO monthly_records (year, month, salary_gross, salary_takehome, bonus_gross, bonus_takehome, memo)
              VALUES (@year, @month, @salaryGross, @salaryTakehome, @bonusGross, @bonusTakehome, @memo)
              ON CONFLICT(year, month) DO UPDATE SET
                salary_gross    = @salaryGross,
                salary_takehome = @salaryTakehome,
                bonus_gross     = @bonusGross,
                bonus_takehome  = @bonusTakehome,
                memo            = @memo
            `).run(rec)
            return send({ ok: true })
          }

          // DELETE /api/:year/:month
          if (req.method === 'DELETE' && parts.length === 2) {
            db.prepare('DELETE FROM monthly_records WHERE year = ? AND month = ?')
              .run(Number(parts[0]), Number(parts[1]))
            return send({ ok: true })
          }

          next()
        } catch (err) {
          send({ error: String(err) }, 500)
        }
      })
    },
  }
}
