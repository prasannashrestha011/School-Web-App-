import React, { useContext } from "react";
import { ComponentContext } from "../context/componentprovider";
const ComponentHook=()=>{
    return(
        useContext(ComponentContext)
    )
}
export default ComponentHook