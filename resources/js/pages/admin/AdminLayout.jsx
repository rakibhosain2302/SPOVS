import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Button,
} from "@mui/material";

import {
  Dashboard,
  Inventory,
  Category,
  Settings,
  Logout,
  ExpandLess,
  ExpandMore,
  ShoppingCart,
  Forum,
  DonutSmall
} from "@mui/icons-material";

import api from "../../api/axios";
import { toast } from "react-toastify";

const drawerWidth = 240;

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [openProduct, setOpenProduct] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return navigate("/login");

    api
      .get("/user", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("auth_token");
        navigate("/login");
      });
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      await api.post(
        "/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {}

    localStorage.removeItem("auth_token");
    toast.success("Logout Successful");
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight="bold">
            Admin Panel
          </Typography>
        </Toolbar>

        <Divider />

        <List>
          <ListItemButton component={Link} to="/admin">
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItemButton>

          <ListItemButton onClick={() => setOpenProduct(!openProduct)}>
            <ListItemIcon>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Products" />
            {openProduct ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openProduct} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/admin/product-base"
              >
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Base" />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/admin/category"
              >
                <ListItemIcon>
                  <Category />
                </ListItemIcon>
                <ListItemText primary="Category" />
              </ListItemButton>

              <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/admin/specification"
              >
                <ListItemIcon>
                  <Forum />
                </ListItemIcon>
                <ListItemText primary="Specification" />
              </ListItemButton>

               <ListItemButton
                sx={{ pl: 4 }}
                component={Link}
                to="/admin/master"
              >
                <ListItemIcon>
                  <DonutSmall />
                </ListItemIcon>
                <ListItemText primary="Master" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          elevation={1}
          sx={{ bgcolor: "white", color: "black" }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Welcome, {user ? user.name : "User"}
            </Typography>

            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}