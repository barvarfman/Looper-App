import React, { useEffect } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const [open, setOpen] = React.useState(false);
//Madia screen breakpoints.
  const theme = createTheme({
    breakpoints: {
      values: {
        sm: 300,
        md: 500,
        lg: 750
      },
    },
  })

  // Listening to prop isModalOpen, to determine whether to close the modal or to open it.
  useEffect(() => {
    if (props.isModalOpen) {
      handleClickOpen();
    } else {
      handleClose();
    }
  }, [props.isModalOpen])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.setIsModalOpenToFalse();
    setOpen(false);
  };

  function saveSound(){
    props.saveSound()
    handleClose();
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
   
        <DialogContent>
          <DialogContentText>
            <Button onClick={()=>props.playRecord()} color="primary">
            Play <PlayArrowIcon/>
          </Button>
          </DialogContentText>
          <DialogContentText>
            <Button onClick={()=>saveSound()} color="primary">
           <span style={{marginRight: "4px"}}>Save</span> 
            <ThemeProvider theme={theme}>
                    <Box
                      clone
                      fontSize={{ sm: 20, md: 20, lg: 20 }}
                    >
                     <SaveOutlinedIcon/>
                    </Box>
                  </ThemeProvider>
          </Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
