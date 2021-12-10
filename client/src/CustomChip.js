import React from "react";
import Chip from '@mui/material/Chip';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      fontSize: (props) => `${props.size * 0.8125}rem`,
      height: (props) => `${props.size * 32}px`,
      borderRadius: "9999px"
    },
    avatar: {
      "&&": {
        height: (props) => `${props.size * 24}px`,
        width: (props) => `${props.size * 24}px`,
        fontSize: (props) => `${props.size * 0.75}rem`
      }
    },
    deleteIcon: {
      height: (props) => `${props.size * 22}px`,
      width: (props) => `${props.size * 22}px`,
      color: "green"
    }
}));

const CustomChip = (props) => {
    const { size = 1, ...restProps } = props;
    const classes = useStyles({ size });

    return (
    <Chip
    className={classes.root}
    classes={{ avatar: classes.avatar, deleteIcon: classes.deleteIcon }}
    {...restProps}
    />
    );
}

export default CustomChip;
  
  
