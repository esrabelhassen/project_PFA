import {
  Box, Typography, Button, List, ListItem,
  ListItemText, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouting, addRoutingStep, deleteRoutingStep } from "../api/routing";
import { useState } from "react";

export default function RoutingList({ productId }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    step_order: "",
    name: "",
    machine: "",
    standard_time_minutes: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["routing", productId],
    queryFn: () => getRouting(productId),
    enabled: !!productId,
  });

  const addMutation = useMutation({
    mutationFn: (data) => addRoutingStep(productId, data),
    onSuccess: () => { queryClient.invalidateQueries(["routing", productId]); setOpen(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoutingStep,
    onSuccess: () => queryClient.invalidateQueries(["routing", productId]),
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (!productId) return <Typography>Select a product to view its routing.</Typography>;
  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h6" mb={1}>Gamme de fabrication</Typography>
      <Button variant="outlined" size="small" onClick={() => setOpen(true)} sx={{ mb: 1 }}>
        + Ajouter étape
      </Button>
      <List dense>
        {data?.data?.length === 0 && <Typography variant="body2">Aucune étape.</Typography>}
        {data?.data?.map((step) => (
          <ListItem
            key={step.id}
            secondaryAction={
              <IconButton edge="end" onClick={(e) => {
                e.stopPropagation();
                console.log("Deleting routing step:", step.id);
                deleteMutation.mutate(step.id);
                }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${step.step_order}. ${step.name}`}
              secondary={`Machine: ${step.machine ?? "—"} | Durée: ${step.standard_time_minutes ?? "—"} min`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter une étape</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Ordre" name="step_order" type="number" value={form.step_order} onChange={handle} />
          <TextField label="Nom de l'étape" name="name" value={form.name} onChange={handle} />
          <TextField label="Machine" name="machine" value={form.machine} onChange={handle} />
          <TextField label="Durée (minutes)" name="standard_time_minutes" type="number" value={form.standard_time_minutes} onChange={handle} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => addMutation.mutate(form)}>Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}