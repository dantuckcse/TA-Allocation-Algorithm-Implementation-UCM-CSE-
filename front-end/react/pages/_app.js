import '@/styles/globals.css'
import Header from "./Header"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </>
  )
}
