import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box } from "@mui/material"
import Sidebar from "./components/Sidebar"
import ProductsPage from "./pages/ProductsPage"
import PurchaseOrdersPage from "./pages/PurchaseOrdersPage"
import NomenclaturePage from "./pages/NomenclaturePage"
import GammesPage from "./pages/GammesPage"

const queryClient = new QueryClient()

export default function App() {
  const [activePage, setActivePage] = useState("produits")

  const renderPage = () => {
    switch (activePage) {
      case "produits": return <ProductsPage />
      case "nomenclature": return <NomenclaturePage />
      case "gammes": return <GammesPage />
      case "bons-de-commande": return <PurchaseOrdersPage />
      default: return <ProductsPage />
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f6fa" }}>
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {renderPage()}
        </Box>
      </Box>
    </QueryClientProvider>
  )
}