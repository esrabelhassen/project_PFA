import {
  Box, Typography, Button, List, ListItem,
  ListItemText, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocuments, uploadDocument, deleteDocument } from "../api/documents";
import { useRef } from "react";

export default function DocumentList({ productId }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["documents", productId],
    queryFn: () => getDocuments(productId),
    enabled: !!productId,
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadDocument(productId, file),
    onSuccess: () => queryClient.invalidateQueries(["documents", productId]),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => queryClient.invalidateQueries(["documents", productId]),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadMutation.mutate(file);
  };

  if (!productId) return <Typography>Select a product to view documents.</Typography>;
  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h6" mb={1}>Documents</Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => fileInputRef.current.click()}
        sx={{ mb: 1 }}
      >
        + Upload fichier
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.dwg,.png,.jpg,.jpeg"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {uploadMutation.isPending && <Typography variant="body2">Uploading...</Typography>}
      <List dense>
        {data?.data?.length === 0 && (
          <Typography variant="body2">Aucun document.</Typography>
        )}
        {data?.data?.map((doc) => (
          <ListItem
            key={doc.id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(doc.id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText
              primary={doc.filename}
              secondary={`Type: ${doc.file_type} | Version: ${doc.version}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}