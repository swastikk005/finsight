import Papa from "papaparse"

export type RawTransaction = {
  date: string
  description: string
  amount: number
}

function normalizeHeader(h: string) {
  return h.toLowerCase().trim()
}

export function parseCSV(file: string): Promise<RawTransaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as Record<string, string>[]

          const rows: RawTransaction[] = data.map((row) => {
            const normalized: Record<string, string> = {}
            for (const key in row) {
              normalized[normalizeHeader(key)] = row[key]
            }

            const date =
              normalized["date"] ||
              normalized["transaction date"] ||
              normalized["value date"]

            const description =
              normalized["description"] ||
              normalized["narration"] ||
              normalized["details"] ||
              ""

            let amount = 0

            if (normalized["amount"]) {
              amount = parseFloat(normalized["amount"])
            } else {
              const debit = parseFloat(normalized["debit"] || "0")
              const credit = parseFloat(normalized["credit"] || "0")
              amount = credit - debit
            }

            return {
              date,
              description,
              amount,
            }
          })

          resolve(rows.filter((r) => r.date && r.description))
        } catch (err: any) {
          reject(err)
        }
      },
      error: (err: any) => reject(err),
    })
  })
}
