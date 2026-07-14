import { Box, Typography, Grid } from "@mui/material"
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined"
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined"
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined"

const cards = [
  {
    label: "Total produits",
    icon: <Inventory2OutlinedIcon />,
    iconBg: "#e8f0fe",
    iconColor: "#1976d2",
  },
  {
    label: "Produits finis",
    icon: <CheckCircleOutlinedIcon />,
    iconBg: "#e8f5e9",
    iconColor: "#2e7d32",
  },
  {
    label: "Semi-finis",
    icon: <LayersOutlinedIcon />,
    iconBg: "#fff8e1",
    iconColor: "#f9a825",
  },
  {
    label: "Alertes stock",
    icon: <WarningAmberOutlinedIcon />,
    iconBg: "#fce4ec",
    iconColor: "#c62828",
  },
]

export default function StatsCards({ products }) {
  const total = products?.length ?? 0
  const finis = products?.filter((p) => p.type === "finished").length ?? 0
  const semiFinis = products?.filter((p) => p.type === "semi_finished").length ?? 0
  const alertes = 0

  const values = [total, finis, semiFinis, alertes]
  const subs = [
    "Tous types confondus",
    `${total ? Math.round((finis / total) * 100) : 0}% du catalogue`,
    `${total ? Math.round((semiFinis / total) * 100) : 0}% du catalogue`,
    "Seuil minimum atteint",
  ]

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 3,
              p: 2.5,
              border: "1px solid #e8eaed",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {card.label}
              </Typography>
              <Box
                sx={{
                  bgcolor: card.iconBg,
                  color: card.iconColor,
                  borderRadius: 2,
                  p: 0.75,
                  display: "flex",
                }}
              >
                {card.icon}
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
              {values[i]}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subs[i]}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}