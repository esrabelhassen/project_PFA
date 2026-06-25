import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "../api/products";
import { useState, useEffect } from "react";

const TYPES = ["raw_material", "semi_finished", "finished"];

export default function ProductForm({ open, onClose, product }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ reference: "", name: "", description: "", type: "", category: "" });

  useEffect(() => {
    setForm(product ?? { reference: "", name: "", description: "", type: "", category: "" });
  }, [product]);

  const mutation = useMutation({
    mutationFn: (data) => product ? updateProduct(product.id, data) : createProduct(data),
    onSuccess: () => { queryClient.invalidateQueries(["products"]); onClose(); },
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{product ? "Modifier" : "Nouveau produit"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField label="Référence" name="reference" value={form.reference} onChange={handle} />
        <TextField label="Nom" name="name" value={form.name} onChange={handle} />
        <TextField label="Description" name="description" value={form.description} onChange={handle} multiline rows={3} />
        <TextField select label="Type" name="type" value={form.type} onChange={handle}>
          {TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField label="Catégorie" name="category" value={form.category} onChange={handle} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={() => mutation.mutate(form)}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
}