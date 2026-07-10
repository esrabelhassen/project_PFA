import {
  Box, Typography, Button, Paper,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  MenuItem, Select
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPurchaseOrders, updatePurchaseOrderStatus } from "../api/purchaseOrders";
import { getProducts } from "../api/products";
import { useState } from "react";
import { generatePurchaseOrder } from "../api/purchaseOrders";

const STATUSES = ["draft", "sent", "received"];

export default function PurchaseOrdersPage() {
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: getPurchaseOrders,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const generateMutation = useMutation({
    mutationFn: generatePurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries(["purchase-orders"]),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updatePurchaseOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(["purchase-orders"]),
  });

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Bons de commande</Typography>

      <Box display="flex" gap={2} mb={3}>
        <Select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 250 }}
        >
          <MenuItem value="" disabled>Sélectionner un produit</MenuItem>
          {products?.data?.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          disabled={!selectedProductId}
          onClick={() => generateMutation.mutate(selectedProductId)}
        >
          Générer bon de commande
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Produit ID</TableCell>
              <TableCell>Lignes</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Créé le</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>Aucun bon de commande.</TableCell>
              </TableRow>
            )}
            {orders?.data?.map((order) => (
              <TableRow key={order.id}>
                <TableCell sx={{ fontSize: "0.7rem" }}>{order.id}</TableCell>
                <TableCell sx={{ fontSize: "0.7rem" }}>{order.product_id}</TableCell>
                <TableCell>{order.total_lines}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    size="small"
                    onChange={(e) =>
                      statusMutation.mutate({ id: order.id, status: e.target.value })
                    }
                  >
                    {STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}