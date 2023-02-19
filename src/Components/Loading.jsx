import React from "react";
import LoadingLogo from "../img/loading_logo.png";
import { motion } from "framer-motion";

function Loading() {
    return <div className="loading-div">
        <motion.div className="loading"
                    initial={{ rotate: "0deg" }}
                    animate={{ rotate: "360deg" }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    </motion.div>
        <div className="loading-logo">
            <img src={LoadingLogo} alt="logo loading"/>
        </div>    
    </div>
}

export default Loading;