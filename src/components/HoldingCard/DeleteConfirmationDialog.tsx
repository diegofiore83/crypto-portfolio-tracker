import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  name: string;
  symbol: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onCancel,
  onConfirm,
  name,
  symbol,
}) => (
  <Dialog open={open} onClose={onCancel} aria-labelledby="alert-dialog-title">
    <DialogTitle id="alert-dialog-title">
      Delete {name} ({symbol.toUpperCase()})
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this holding? This action cannot be
        undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" autoFocus>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;
