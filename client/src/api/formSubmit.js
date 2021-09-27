import axios from "axios";
import { baseURL, applyServerDownInterceptor } from "./base";

const formSubmit = axios.create({
    baseURL: baseURL + "/form_submit",
});

applyServerDownInterceptor(formSubmit);

export default formSubmit;