import { Box, Typography } from "@mui/material";
import Image from "next/image";
import logo from "@/public/logo.png"; // use your SVG/PNG logo

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90%",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Rotating Logo */}
      <Box
        sx={{
          animation: "spin 2s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      >
        <Image src={logo} alt="S Store Logo" width={80} height={80} priority />
      </Box>

      {/* Pulsing Text */}
      <Typography
        variant="h6"
        sx={{
          animation: "pulse 1.5s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.3 },
            "50%": { opacity: 1 },
          },
        }}
      >
        Loading
      </Typography>
    </Box>
  );
}
