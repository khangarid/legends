import records from './data/records.json'
import type { SheetRecord } from './types/record'
import './App.css'

const data = records as SheetRecord[]

function App() {
  const columns =
    data.length > 0 ? Object.keys(data[0]) : []

  return (
    <main className="landing">
      <header className="header">
        <h1>Products</h1>
        <p className="subtitle">
          {data.length} record{data.length === 1 ? '' : 's'} from your Google
          Sheet, loaded at build time.
        </p>
      </header>

      {data.length === 0 ? (
        <p className="empty">
          No records yet. Add a header row and data to your sheet, then rebuild.
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
              {data.map((record, index) => (
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
