import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box, Tabs, Tab } from "@mui/material"
import ProductsPage from "./pages/ProductsPage"
import PurchaseOrdersPage from "./pages/PurchaseOrdersPage"

const queryClient = new QueryClient()

export default function App() {
  const [tab, setTab] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      <Box>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          <Tab label="Produits" />
          <Tab label="Bons de commande" />
        </Tabs>
        <Box>
          {tab === 0 && <ProductsPage />}
          {tab === 1 && <PurchaseOrdersPage />}
        </Box>
      </Box>
    </QueryClientProvider>
  )
}