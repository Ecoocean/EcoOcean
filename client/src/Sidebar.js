import React, { useState } from 'react'
import { FiHome, FiChevronLeft, FiPlusCircle, FiList, FiSettings } from "react-icons/fi";
import { Sidebar, Tab } from './react-leaflet-sidetabs'
import ReportList from "./ReportList";
import SettingsTab from "./SettingsTab";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PollutionForm from "./modals/forms/PollutionForm";



const SidebarComponent = ({ map }) => {

   const [openTab, setOpenTab] = useState('home')

   const onClose = () => {
      setOpenTab(false)
   }

   const onOpen = id => {
      setOpenTab(id)
   }

   return (
      <section className="Sidebar">
         <Sidebar
            map={map}
            position="left"
            collapsed={!openTab}
            selected={openTab}
            closeIcon={<FiChevronLeft />}
            onClose={onClose}
            onOpen={onOpen}
            panMapOnChange
            rehomeControls>

            <Tab id="home" header="Ecoocean" icon={<FiHome />} active>
               <Box sx={{ display: "flex", paddingTop: "40px", flexDirection: "column", alignItems: "center", pl: 1, pb: 1 }}>
                  <Grid item xs={6}>
                     <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <img
                            src="/images/ecoOcenLogoNavPainted.png"
                            alt="logo"
                            style={{ width: "12rem" }}
                        />
                     </Typography>
                  </Grid>
                  <Grid item xs={6}>
                     <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <img
                            src="/images/bgu.png"
                            alt="logo"
                            style={{ width: "12rem" }}
                        />
                     </Typography>
                  </Grid>
               </Box>

            </Tab>
            <Tab id="props" header="Pollution Reports" icon={<FiList />}>
               <ReportList/>
            </Tab>
            <Tab id="add-report" header="Add Pollution Report" icon={<FiPlusCircle/>}>
               <PollutionForm openTab={openTab}/>
            </Tab>
            <Tab id="settings" header="Settings" icon={<FiSettings />} anchor="bottom">
               <SettingsTab/>
            </Tab>

         </Sidebar>
      </section>
   )

}

export default SidebarComponent