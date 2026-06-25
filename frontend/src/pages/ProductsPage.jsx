import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "../api/products";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography } from "@mui/material";
import { useState } from "react";
import ProductForm from "../components/ProductForm";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  const columns = [
    { field: "reference", headerName: "Référence", flex: 1 },
    { field: "name", headerName: "Nom", flex: 2 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "category", headerName: "Catégorie", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => { setSelected(params.row); setOpen(true); }}>Modifier</Button>
          <Button size="small" color="error" onClick={() => deleteMutation.mutate(params.row.id)}>Supprimer</Button>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Produits</Typography>
      <Button variant="contained" onClick={() => { setSelected(null); setOpen(true); }} sx={{ mb: 2 }}>
        + Nouveau produit
      </Button>
      <DataGrid
        rows={data?.data ?? []}
        columns={columns}
        loading={isLoading}
        autoHeight
        getRowId={(row) => row.id}
      />
      <ProductForm open={open} onClose={() => setOpen(false)} product={selected} />
    </Box>
  );
}