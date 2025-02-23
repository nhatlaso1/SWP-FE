import React, { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

import { useStore } from "../../store";

import "./Notification.scss";

const Notification = () => {
  const notification = useStore((state) => state.notification.data);
  const [item, setItem] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (notification.length > 0) {
      const lastItem = notification[notification.length - 1];
      setItem(lastItem);
      setOpen(true);
    }
  }, [notification]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={5000}
      onClose={() => setOpen(false)}
    >
      {item?.status === "ERROR" ? (
        <Alert severity="error">{item?.content}</Alert>
      ) : (
        <Alert severity="success">{item?.content}</Alert>
      )}
    </Snackbar>
  );
};

export default Notification;
