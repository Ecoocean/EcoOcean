import React from 'react'
import { FiChevronLeft } from "react-icons/fi";
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
import { FaHotel, FaUmbrellaBeach, FaPlusCircle, FaListUl, FaCog, FaHome } from "react-icons/fa";
import MunicipalList from "./MunicipalList";
import BeachSegmentList from "./BeachSegmentList";

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

            <Tab id="home" header="Ecoocean" icon={<FaHome />} active>
               {openTab === 'home' && <EcooceanHome />}
            </Tab>
            <Tab id="pollution-reports" header="Pollution Reports" icon={<FaListUl />}>
               {openTab === 'pollution-reports' && <BackToTop>
                  <ReportList/>
               </BackToTop> }

            </Tab>
            <Tab id="municipals" header="Municipals" icon={<FaHotel />}>
               {openTab === 'municipals' && <MunicipalList /> }
            </Tab>
            <Tab id="beach-segments" header="Beach Segments" icon={<FaUmbrellaBeach />}>
               {openTab === 'beach-segments' && <BeachSegmentList />}
            </Tab>
            <Tab id="add-report" header="Add Pollution Report" icon={<FaPlusCircle/>}>
               <PollutionForm />
            </Tab>
            <Tab id="settings" header="Settings" icon={<FaCog />} anchor="bottom">
               { openTab === 'settings' && <SettingsTab/>}
            </Tab>

         </Sidebar>
      </section>
   )

}

export default SidebarComponent