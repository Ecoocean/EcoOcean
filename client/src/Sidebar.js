import React from 'react'
import { FiHome, FiChevronLeft, FiPlusCircle, FiList, FiSettings } from "react-icons/fi";
import { Sidebar, Tab } from './react-leaflet-sidetabs'
import ReportList from "./ReportList";
import SettingsTab from "./tabs/SettingsTab";
import PollutionForm from "./modals/forms/PollutionForm";
import {
    gvulotVar,
    sideBarCollapsedVar,
    sideBarOpenTabVar
} from "./cache";
import {useReactiveVar} from "@apollo/client";
import EcooceanHome from "./tabs/EcooceanHome";
import BackToTop from "./ScrollToTop";
import { FaDrawPolygon } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse';

const SidebarComponent = ({ map }) => {

   const openTab = useReactiveVar(sideBarOpenTabVar);
   const sideBarCollapsed = useReactiveVar(sideBarCollapsedVar);

   const onClose = () => {
      sideBarOpenTabVar('');
      sideBarCollapsedVar(false);
   }

   const onOpen = id => {
      sideBarOpenTabVar(id);
      sideBarCollapsedVar(true);
   }

   return (
      <section className="Sidebar">
         <Sidebar
            map={map}
            position="left"
            collapsed={!sideBarCollapsed}
            selected={openTab}
            closeIcon={<FiChevronLeft />}
            onClose={onClose}
            onOpen={onOpen}
            panMapOnChange
            rehomeControls>

            <Tab id="home" header="Ecoocean" icon={<FiHome />} active>
               <EcooceanHome />
            </Tab>
            <Tab id="pollution-reports" header="Pollution Reports" icon={<FiList />}>
               <BackToTop>
                  <ReportList/>
               </BackToTop>
            </Tab>
            <Tab id="municipals" header="Municipals" icon={<FaDrawPolygon />}>
               <List sx={{ display: "list-item", width: "100%" }} >
                  <TransitionGroup>
                     { gvulotVar() && gvulotVar().map((gvul, i) => {
                     return <Collapse key={i}><ListItem divider component="div"><Alert severity={ i % 3 === 0 ? "error" : i % 3 === 1 ? "warning" : "success"}>
                        <AlertTitle>{gvul.muniHeb}</AlertTitle>
                        information regarding pollution status <strong>check it out!</strong>
                     </Alert></ListItem></Collapse>
                  })
               }
                  </TransitionGroup>
               </List>
            </Tab>
            <Tab id="add-report" header="Add Pollution Report" icon={<FiPlusCircle/>}>
                <PollutionForm />
            </Tab>
            <Tab id="settings" header="Settings" icon={<FiSettings />} anchor="bottom">
               <SettingsTab/>
            </Tab>

         </Sidebar>
      </section>
   )

}

export default SidebarComponent