import React from "react";


function Footer(){
    const year = new Date().getFullYear();

    return <>
        <div className="footer">
            <p>© {year}</p>
            <p>Made with ❤️ by <a href="https://ed-dev.me">Emanuele D'Agata</a></p>
        </div>
    </>
}
export default Footer;