import React, { useState } from 'react'
import { FiHome, FiChevronLeft, FiPlusCircle, FiList, FiSettings } from "react-icons/fi";
import { Sidebar, Tab } from './react-leaflet-sidetabs'
import ReportList from "./ReportList";
import SettingsTab from "./tabs/SettingsTab";
import PollutionForm from "./modals/forms/PollutionForm";
import {
   sideBarCollapsedVar,
    sideBarOpenTabVar
} from "./cache";
import {useReactiveVar} from "@apollo/client";
import EcooceanHome from "./tabs/EcooceanHome";
import BackToTop from "./ScrollToTop";
import { FaDrawPolygon } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import {useQuery} from "@apollo/client";
import {GET_GVULOTS_GEOJSON} from "./GraphQL/Queries";


const SidebarComponent = ({ map }) => {

   const openTab = useReactiveVar(sideBarOpenTabVar);
   const sideBarCollapsed = useReactiveVar(sideBarCollapsedVar);
   const { data } = useQuery(GET_GVULOTS_GEOJSON, {
      fetchPolicy: "network-only",
  });

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
            <Tab id="beach-segments" header="Beach Segments" icon={<FaDrawPolygon />}>
            <Stack sx={{ width: '100%' }} spacing={2}>
               { 
            data && data.gvulots.nodes.map((gvul, i) => {
                return <Alert severity={ i % 3 === 0 ? "error" : i % 3 === 1 ? "warning" : "success"}>
                <AlertTitle>{gvul.muniHeb}</AlertTitle>
                information regarding pollution status <strong>check it out!</strong>
                </Alert>
            })
         }
            </Stack>
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