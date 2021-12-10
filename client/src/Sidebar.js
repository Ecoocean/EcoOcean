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
            <Tab id="beach-segments" header="Beach Segments" icon={<FaDrawPolygon />}>
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