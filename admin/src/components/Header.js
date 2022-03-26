import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountMenu from "./AccountMenu";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate } from "react-router-dom";


function LinkTab(props) {
  const navigate = useNavigate();
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
        navigate(props.href);
      }}
      {...props}
    />
  );
}

function Header() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              Admin EcoOcean
            </Typography>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              <Tabs
                  textColor="inherit"
                  value={value}
                  onChange={handleChange}
                  aria-label="nav tabs example"
              >
                <LinkTab label="Home" href="/"/>
                <LinkTab label="Users" href="/users"/>
              </Tabs>
            </Typography>
            <div>
              <AccountMenu/>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
  );

}

export default Header;
