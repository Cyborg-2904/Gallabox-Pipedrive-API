import { getcontactdetails,getwhatsapptemplates} from "./Backend/generalfunctions";
import React from 'react'
import Fields from "./fields";
import axios from "axios";

function App() {
    
    return(
        <div>
            <Fields fields={getwhatsapptemplates()}/>
        </div>
    );
}