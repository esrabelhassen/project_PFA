import { useState } from "react"
import {
  Box, Typography, InputBase, Paper,
  List, ListItem, ListItemText, ListItemButton,
  Button, Chip, IconButton, Divider
} from "@mui/material"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined"
import AddIcon from "@mui/icons-material/Add"
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProducts } from "../api/products"
import { getBom, addBomItem, deleteBomItem } from "../api/bom"

export default function NomenclaturePage() {
  const queryClient = useQueryClient()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [search, setSearch] = useState("")

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const { data: bomData } = useQuery({
    queryKey: ["bom", selectedProduct?.id],
    queryFn: () => getBom(selectedProduct.id),
    enabled: !!selectedProduct,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBomItem,
    onSuccess: () => queryClient.invalidateQueries(["bom", selectedProduct?.id]),
  })

  const products = productsData?.data ?? []
  const bomItems = bomData?.data ?? []

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.reference.toLowerCase().includes(search.toLowerCase())
  )

  // Get product name by id
  const getProductName = (id) => {
    const p = products.find((p) => p.id === id)
    return p ? `${p.name}` : id
  }

  const getProductRef = (id) => {
    const p = products.find((p) => p.id === id)
    return p ? p.reference : ""
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* Left — Component catalog */}
      <Box
        sx={{
          width: 280,
          borderRight: "1px solid #e8eaed",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}
        >
          Catalogue Composants
        </Typography>

        {/* Search */}
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1,
            bgcolor: "#f5f6fa", borderRadius: 2, px: 1.5, py: 0.75,
          }}
        >
          <SearchOutlinedIcon fontSize="small" sx={{ color: "#888" }} />
          <InputBase
            placeholder="Filtrer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: "0.875rem", flex: 1 }}
          />
        </Box>

        <Typography variant="caption" sx={{ color: "#aaa" }}>
          Cliquez un composant pour le sélectionner
        </Typography>

        {/* Product list */}
        <Box sx={{ overflow: "auto", flex: 1 }}>
          <List dense disablePadding>
            {filtered.map((p) => (
              <ListItem key={p.id} disablePadding>
                <ListItemButton
                  onClick={() => setSelectedProduct(p)}
                  selected={selectedProduct?.id === p.id}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": { bgcolor: "#e8f0fe" },
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {p.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {p.reference}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Right — BOM editor */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        {!selectedProduct ? (
          <Box
            sx={{
              display: "flex", alignItems: "center",
              justifyContent: "center", height: "100%",
            }}
          >
            <Typography sx={{ color: "#aaa" }}>
              Sélectionnez un produit pour voir sa nomenclature
            </Typography>
          </Box>
        ) : (
          <>
            {/* Header */}
            <Box
              sx={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
                  Nomenclature — {selectedProduct.name}
                </Typography>
                <Chip
                  label={selectedProduct.reference}
                  size="small"
                  sx={{ bgcolor: "#f5f5f5", fontWeight: 600, fontSize: "0.75rem" }}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                sx={{
                  borderRadius: 2, textTransform: "none",
                  fontWeight: 600, bgcolor: "#1a1a2e",
                  "&:hover": { bgcolor: "#2d2d4e" },
                }}
              >
                Enregistrer
              </Button>
            </Box>

            {/* Hint */}
            <Paper
              sx={{
                p: 1.5, mb: 2, bgcolor: "#f0f4ff",
                border: "1px solid #c5d4f5", borderRadius: 2,
                boxShadow: "none",
              }}
            >
              <Typography variant="caption" sx={{ color: "#1976d2" }}>
                Sélectionnez un composant dans le catalogue à gauche pour l'ajouter à la nomenclature
              </Typography>
            </Paper>

            {/* BOM tree */}
            <Paper sx={{ borderRadius: 3, border: "1px solid #e8eaed", boxShadow: "none", p: 2 }}>
              {/* Root product */}
              <Box
                sx={{
                  display: "flex", alignItems: "center",
                  gap: 1, py: 1, borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: "50%",
                    bgcolor: "#1976d2", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>
                    ●
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    {selectedProduct.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#888" }}>
                    {selectedProduct.reference}
                  </Typography>
                </Box>
                <Chip label="×1" size="small" sx={{ ml: "auto", fontWeight: 700 }} />
              </Box>

              {/* BOM items */}
              {bomItems.length === 0 && (
                <Typography variant="body2" sx={{ color: "#aaa", mt: 2, textAlign: "center" }}>
                  Aucun composant dans la nomenclature.
                </Typography>
              )}
              {bomItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex", alignItems: "center",
                    gap: 1, py: 1, pl: 4,
                    borderBottom: "1px solid #f5f5f5",
                    "&:hover": { bgcolor: "#fafafa" },
                  }}
                >
                  <Box
                    sx={{
                      width: 22, height: 22, borderRadius: "50%",
                      bgcolor: "#e8eaed", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.6rem", color: "#666" }}>●</Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {getProductName(item.child_product_id)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {getProductRef(item.child_product_id)}
                    </Typography>
                  </Box>
                  <Chip
                    label={`×${item.quantity}`}
                    size="small"
                    sx={{ fontWeight: 700, bgcolor: "#f5f5f5" }}
                  />
                  <Typography variant="caption" sx={{ color: "#888", minWidth: 40 }}>
                    {item.unit}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => deleteMutation.mutate(item.id)}
                  >
                    <DeleteOutlineIcon fontSize="small" sx={{ color: "#e57373" }} />
                  </IconButton>
                </Box>
              ))}
            </Paper>
          </>
        )}
      </Box>
    </Box>
  )
}