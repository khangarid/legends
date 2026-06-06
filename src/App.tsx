import records from './data/records.json'
import staticAssets from './data/static.json'
import type { SheetRecord } from './types/record'
import type { StaticAssets } from './types/static'
import './App.css'

const items = records as SheetRecord[]
const staticData = staticAssets as StaticAssets

function App() {
  const columns = items.length > 0 ? Object.keys(items[0]) : []
  const title = staticData.site_title || 'Products'
  const tagline =
    staticData.tagline ||
    `${items.length} item${items.length === 1 ? '' : 's'} loaded at build time.`

  return (
    <main className="landing">
      <header className="header">
        {staticData.logo ? (
          <img src={staticData.logo} alt="" className="logo" />
        ) : null}
        <h1>{title}</h1>
        <p className="subtitle">{tagline}</p>
      </header>

      {items.length === 0 ? (
        <p className="empty">
          No items yet. Add rows to the items sheet, then rebuild.
        </p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((record, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column}>{record[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default App
