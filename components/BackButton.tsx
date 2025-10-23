"use client";

import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={() => router.back()}
      sx={{ mb: 2 }}
    ></Button>
  );
}
