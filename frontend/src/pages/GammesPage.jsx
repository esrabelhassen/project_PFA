import { useState } from "react"
import {
  Box, Typography, Paper, Button, Chip,
  IconButton, MenuItem, Select, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, Divider
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import LinearScaleOutlinedIcon from "@mui/icons-material/LinearScaleOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProducts } from "../api/products"
import { getRouting, addRoutingStep, deleteRoutingStep } from "../api/routing"

export default function GammesPage() {
  const queryClient = useQueryClient()
  const [selectedProductId, setSelectedProductId] = useState("")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    step_order: "",
    name: "",
    machine: "",
    standard_time_minutes: "",
  })

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const { data: routingData } = useQuery({
    queryKey: ["routing", selectedProductId],
    queryFn: () => getRouting(selectedProductId),
    enabled: !!selectedProductId,
  })

  const addMutation = useMutation({
    mutationFn: (data) => addRoutingStep(selectedProductId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["routing", selectedProductId])
      setOpen(false)
      setForm({ step_order: "", name: "", machine: "", standard_time_minutes: "" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRoutingStep,
    onSuccess: () => queryClient.invalidateQueries(["routing", selectedProductId]),
  })

  const products = productsData?.data ?? []
  const steps = routingData?.data ?? []
  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <LinearScaleOutlinedIcon sx={{ color: "#1976d2" }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
            Gammes de fabrication
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!selectedProductId}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 2, textTransform: "none",
            fontWeight: 600, bgcolor: "#1a1a2e",
            "&:hover": { bgcolor: "#2d2d4e" },
          }}
        >
          Ajouter étape
        </Button>
      </Box>

      {/* Product selector */}
      <Paper
        sx={{
          p: 2, mb: 3, border: "1px solid #e8eaed",
          borderRadius: 3, boxShadow: "none",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#444" }}>
          Sélectionner un produit
        </Typography>
        <Select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          displayEmpty
          fullWidth
          size="small"
          sx={{ borderRadius: 2 }}
        >
          <MenuItem value="" disabled>Choisir un produit...</MenuItem>
          {products.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={p.reference}
                  size="small"
                  sx={{ bgcolor: "#f5f5f5", fontWeight: 600, fontSize: "0.7rem" }}
                />
                {p.name}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </Paper>

      {/* Steps list */}
      {!selectedProductId && (
        <Box
          sx={{
            display: "flex", alignItems: "center",
            justifyContent: "center", height: 200,
          }}
        >
          <Typography sx={{ color: "#aaa" }}>
            Sélectionnez un produit pour voir sa gamme
          </Typography>
        </Box>
      )}

      {selectedProductId && steps.length === 0 && (
        <Box
          sx={{
            display: "flex", alignItems: "center",
            justifyContent: "center", height: 200,
          }}
        >
          <Typography sx={{ color: "#aaa" }}>
            Aucune étape définie pour ce produit.
          </Typography>
        </Box>
      )}

      {steps.length > 0 && (
        <Paper sx={{ border: "1px solid #e8eaed", borderRadius: 3, boxShadow: "none", overflow: "hidden" }}>
          {steps.map((step, index) => (
            <Box key={step.id}>
              <Box
                sx={{
                  display: "flex", alignItems: "center",
                  gap: 2, p: 2,
                  "&:hover": { bgcolor: "#fafafa" },
                }}
              >
                {/* Step number */}
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: "50%",
                    bgcolor: "#1976d2", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>
                    {step.step_order}
                  </Typography>
                </Box>

                {/* Step info */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1a1a2e" }}>
                    {step.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                    {step.machine && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 14, color: "#888" }} />
                        <Typography variant="caption" sx={{ color: "#888" }}>
                          {step.machine}
                        </Typography>
                      </Box>
                    )}
                    {step.standard_time_minutes && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: "#888" }} />
                        <Typography variant="caption" sx={{ color: "#888" }}>
                          {step.standard_time_minutes} min
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMutation.mutate(step.id)
                    }}
                  >
                    <DeleteOutlinedIcon fontSize="small" sx={{ color: "#e57373" }} />
                  </IconButton>
                </Box>
              </Box>
              {index < steps.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>
      )}

      {/* Add step dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Ajouter une étape</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Ordre"
            name="step_order"
            type="number"
            value={form.step_order}
            onChange={handle}
            size="small"
          />
          <TextField
            label="Nom de l'étape"
            name="name"
            value={form.name}
            onChange={handle}
            size="small"
          />
          <TextField
            label="Machine"
            name="machine"
            value={form.machine}
            onChange={handle}
            size="small"
          />
          <TextField
            label="Durée (minutes)"
            name="standard_time_minutes"
            type="number"
            value={form.standard_time_minutes}
            onChange={handle}
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={() => addMutation.mutate(form)}
            sx={{
              borderRadius: 2, textTransform: "none",
              fontWeight: 600, bgcolor: "#1a1a2e",
              "&:hover": { bgcolor: "#2d2d4e" },
            }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}