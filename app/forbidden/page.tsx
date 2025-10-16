"use client";
import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import Link from "next/link";



const ForbiddenPage: React.FC = () => (
    <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#f5f6fa"
    >
        <Paper
            elevation={4}
            sx={{
                p: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 3,
                maxWidth: 400,
                width: "100%",
            }}
        >
            <BlockIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
                403 Forbidden
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" mb={3}>
                You don&apos;t have permission to access this page.
            </Typography>
            <Button
                component={Link}
                href="/"
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: 2, textTransform: "none" }}
            >
                Go to Home
            </Button>
        </Paper>
    </Box>
);

export default ForbiddenPage;