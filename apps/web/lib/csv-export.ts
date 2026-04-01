export function downloadCSV(data: any[], filename: string) {
    const headers = Object.keys(data[0] || {}).join(",")
    const rows = data.map(row =>
        Object.values(row).map(val => `"${val}"`).join(",")
    ).join("\n")

    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", filename)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
