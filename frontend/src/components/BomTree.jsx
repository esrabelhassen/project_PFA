import {
  Box, Typography, Button, List, ListItem,
  ListItemText, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBom, addBomItem, deleteBomItem } from "../api/bom";
import { useState } from "react";

export default function BomTree({ productId }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ child_product_id: "", quantity: "", unit: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["bom", productId],
    queryFn: () => getBom(productId),
    enabled: !!productId,
  });

  const addMutation = useMutation({
    mutationFn: (data) => addBomItem(productId, data),
    onSuccess: () => { queryClient.invalidateQueries(["bom", productId]); setOpen(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBomItem,
    onSuccess: () => queryClient.invalidateQueries(["bom", productId]),
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (!productId) return <Typography>Select a product to view its BOM.</Typography>;
  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h6" mb={1}>Nomenclature (BOM)</Typography>
      <Button variant="outlined" size="small" onClick={() => setOpen(true)} sx={{ mb: 1 }}>
        + Ajouter composant
      </Button>
      <List dense>
        {data?.data?.length === 0 && <Typography variant="body2">Aucun composant.</Typography>}
        {data?.data?.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton edge="end" onClick={(e) => { 
                e.stopPropagation();
                 console.log("Deleting BOM item:", item.id);
                deleteMutation.mutate(item.id);
                }}>

                <DeleteIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText
              primary={`ID: ${item.child_product_id}`}
              secondary={`${item.quantity} ${item.unit}`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un composant</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="ID Composant (UUID)" name="child_product_id" value={form.child_product_id} onChange={handle} />
          <TextField label="Quantité" name="quantity" type="number" value={form.quantity} onChange={handle} />
          <TextField label="Unité (kg, L, pièce...)" name="unit" value={form.unit} onChange={handle} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => addMutation.mutate(form)}>Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}