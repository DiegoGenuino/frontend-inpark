import { useState } from "react"
import Inparklogo from '../../assets/inpark.logo.svg';

export const Signup = () => {
    const [dataForm, setDataForm] = useState({
        'email': '',
        'senha': ''
    }
    )

    return (
        <div className="container">
            <div className="container-left">
                <div className="logo">
                    <img src={Inparklogo} alt="Logotipo inpark" />
                </div>
            </div>
            <div className="container-right">

            </div>
        </div>
    )


}