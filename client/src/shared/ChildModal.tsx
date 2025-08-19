import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

type ChildModalProps = {
    open?: boolean,
    onClose: () => void,
    children: React.JSX.Element
}

export function ChildModal({open = false, onClose, children}: ChildModalProps) {

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {children}
          <Button onClick={onClose}>Закрыть</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}