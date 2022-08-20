import React from 'react'
import "./Footer.css"

function Footer() {
  return (
    <div className='footer__div'>

        <div className='footer_social'>
            <i class='bx bxl-facebook' style={{paddingRight: "10px", cursor: "pointer"}}></i>
            <i class='bx bxl-twitter' style={{paddingRight: "10px", cursor: "pointer"}}></i>
            <i class='bx bxl-linkedin' style={{paddingRight: "10px", cursor: "pointer"}}></i>
        </div>

    </div>
  )
}

export default Footer