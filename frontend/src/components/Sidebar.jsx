import {
  Box, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider
} from "@mui/material"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined"
import LinearScaleOutlinedIcon from "@mui/icons-material/LinearScaleOutlined"
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined"

const SECTIONS = [
  {
    label: "CATALOGUE",
    items: [
      { key: "produits", label: "Produits", icon: <Inventory2OutlinedIcon fontSize="small" /> },
      { key: "nomenclature", label: "Nomenclature", icon: <AccountTreeOutlinedIcon fontSize="small" /> },
      { key: "gammes", label: "Gammes", icon: <LinearScaleOutlinedIcon fontSize="small" /> },
    ],
  },
  {
    label: "DOCUMENTS",
    items: [
      { key: "documents", label: "Plans & fichiers", icon: <FolderOutlinedIcon fontSize="small" /> },
    ],
  },
  {
    label: "ACHATS",
    items: [
      { key: "bons-de-commande", label: "Bons de commande", icon: <ShoppingCartOutlinedIcon fontSize="small" /> },
    ],
  },
  {
    label: "IA",
    items: [
      { key: "recherche-ia", label: "Recherche IA", icon: <AutoAwesomeOutlinedIcon fontSize="small" /> },
    ],
  },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <Box
      sx={{
        width: 240,
        minHeight: "100vh",
        bgcolor: "#ffffff",
        borderRight: "1px solid #e8eaed",
        display: "flex",
        flexDirection: "column",
        py: 2,
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.5, mb: 3 }}>
        <PrecisionManufacturingOutlinedIcon sx={{ color: "#1976d2" }} />
        <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1a1a2e" }}>
          ManufactERP
        </Typography>
      </Box>

      {/* Nav sections */}
      <Box sx={{ flex: 1 }}>
        {SECTIONS.map((section) => (
          <Box key={section.label} sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{ px: 2.5, color: "#9e9e9e", fontWeight: 600, letterSpacing: 1, display: "block" }}
            >
              {section.label}
            </Typography>
            <List dense disablePadding>
              {section.items.map((item) => (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    onClick={() => onNavigate(item.key)}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      bgcolor: activePage === item.key ? "#e8f0fe" : "transparent",
                      color: activePage === item.key ? "#1976d2" : "#444",
                      "&:hover": { bgcolor: "#f5f5f5" },
                      py: 0.75,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: activePage === item.key ? "#1976d2" : "#888",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          style: {
                            fontSize: "0.875rem",
                            fontWeight: activePage === item.key ? 600 : 400,
                          }
                        }
                      }}
                    />
                    {item.key === "recherche-ia" && (
                      <Box
                        sx={{
                          bgcolor: "#e8f0fe",
                          color: "#1976d2",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 1,
                        }}
                      >
                        IA
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* Bottom settings */}
      <Divider />
      <ListItemButton
        onClick={() => onNavigate("parametres")}
        sx={{ mx: 1, mt: 1, borderRadius: 2, color: "#888" }}
      >
        <ListItemIcon sx={{ minWidth: 32, color: "#888" }}>
          <SettingsOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Paramètres"
          slotProps={{
            primary: { style: { fontSize: "0.875rem" } }
          }}
        />
      </ListItemButton>
    </Box>
  )
}