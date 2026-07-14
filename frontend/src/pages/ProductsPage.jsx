import { useState } from "react"
import {
  Box, Typography, Button, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, ToggleButton,
  ToggleButtonGroup, InputBase
} from "@mui/material"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProducts, deleteProduct } from "../api/products"
import StatsCards from "../components/StatsCards"
import BomTree from "../components/BomTree"
import RoutingList from "../components/RoutingList"
import DocumentList from "../components/DocumentList"
import ProductForm from "../components/ProductForm"

const TYPE_LABELS = {
  finished: { label: "Produit fini", color: "success" },
  semi_finished: { label: "Semi-fini", color: "warning" },
  raw_material: { label: "Matière première", color: "default" },
}

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState("tous")
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  })

  const products = data?.data ?? []

  const filtered = products.filter((p) => {
    const matchFilter =
      filter === "tous" ||
      (filter === "finis" && p.type === "finished") ||
      (filter === "semi-finis" && p.type === "semi_finished") ||
      (filter === "matieres" && p.type === "raw_material")
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Main content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>

        {/* Top bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
            Module Produit
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box
              sx={{
                display: "flex", alignItems: "center", gap: 1,
                bgcolor: "#fff", border: "1px solid #e8eaed",
                borderRadius: 2, px: 2, py: 0.75,
              }}
            >
              <SearchOutlinedIcon fontSize="small" sx={{ color: "#888" }} />
              <InputBase
                placeholder="Rechercher un produit, référence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ fontSize: "0.875rem", width: 260 }}
              />
            </Box>
            <Button
              variant="outlined"
              startIcon={<AutoAwesomeOutlinedIcon />}
              sx={{
                borderRadius: 2,
                borderColor: "#c5b4f0",
                color: "#7c4dff",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              IA
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => { setEditProduct(null); setFormOpen(true) }}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#1a1a2e",
                "&:hover": { bgcolor: "#2d2d4e" },
              }}
            >
              Nouveau
            </Button>
          </Box>
        </Box>

        {/* Stats cards */}
        <StatsCards products={products} />

        {/* Table header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: 1 }}
            >
              Catalogue Produits
            </Typography>
            <Chip
              label={filtered.length}
              size="small"
              sx={{ bgcolor: "#e8f0fe", color: "#1976d2", fontWeight: 700 }}
            />
          </Box>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, v) => v && setFilter(v)}
            size="small"
          >
            {[
              { value: "tous", label: "Tous" },
              { value: "finis", label: "Finis" },
              { value: "semi-finis", label: "Semi-finis" },
              { value: "matieres", label: "Matières" },
            ].map((f) => (
              <ToggleButton
                key={f.value}
                value={f.value}
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  px: 2,
                  border: "1px solid #e8eaed",
                  "&.Mui-selected": { bgcolor: "#fff", fontWeight: 600 },
                }}
              >
                {f.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Product table */}
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid #e8eaed", borderRadius: 3, boxShadow: "none" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                {["Référence", "Nom", "Type", "Catégorie", "BOM", ""].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6}>Chargement...</TableCell>
                </TableRow>
              )}
              {filtered.map((product) => (
                <TableRow
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: selectedProduct?.id === product.id ? "#f0f4ff" : "transparent",
                    "&:hover": { bgcolor: "#f9fafb" },
                    borderLeft: selectedProduct?.id === product.id
                      ? "3px solid #1976d2"
                      : "3px solid transparent",
                  }}
                >
                  <TableCell>
                    <Chip
                      label={product.reference}
                      size="small"
                      sx={{ bgcolor: "#f5f5f5", fontWeight: 600, fontSize: "0.75rem", borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={TYPE_LABELS[product.type]?.label ?? product.type}
                      color={TYPE_LABELS[product.type]?.color ?? "default"}
                      size="small"
                      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#666" }}>{product.category}</TableCell>
                  <TableCell>
                    <Chip
                      label="BOM"
                      size="small"
                      sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600, fontSize: "0.7rem" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product) }}
                      >
                        <VisibilityOutlinedIcon fontSize="small" sx={{ color: "#888" }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setEditProduct(product); setFormOpen(true) }}
                      >
                        <EditOutlinedIcon fontSize="small" sx={{ color: "#888" }} />
                      </IconButton>
                      <IconButton size="small">
                        <MoreHorizOutlinedIcon fontSize="small" sx={{ color: "#888" }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Right panel */}
      {selectedProduct && (
        <Box
          sx={{
            width: 320,
            borderLeft: "1px solid #e8eaed",
            bgcolor: "#fff",
            overflow: "auto",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1a1a2e" }}>
                {selectedProduct.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#888" }}>
                {selectedProduct.reference}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setSelectedProduct(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <BomTree productId={selectedProduct.id} />
          <RoutingList productId={selectedProduct.id} />
          <DocumentList productId={selectedProduct.id} />
        </Box>
      )}

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editProduct}
      />
    </Box>
  )
}