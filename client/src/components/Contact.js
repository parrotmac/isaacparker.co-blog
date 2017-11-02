import React, {Component} from 'react';
import './styles/Contact.css';
import myFace from '../img/isaac-parker-profile-photo.jpeg';
import ContainerRow from "./ContainerRow";

class Contact extends Component {
    render() {
        return (
            <ContainerRow>
                <div className="col-md-8 col-md-offset-2">
                    <div className={'ContactInfo'}>
                        <img className={'Contact-MyFace'} alt={'Isaac Parker'} src={myFace} />
                        <ul className={'Contact-Items'}>
                            <li>The Electronic Mail: <a href={'mailto:parrotmac@gmail.com'} target={'_blank'}>parrotmac@gmail.com</a></li>
                            <li>The PSTN: <a href={'tel:+1(801) 808-1030'}>+1(801) 808-1030</a></li>
                        </ul>
                    </div>
                </div>
            </ContainerRow>
        )
    }
}

export default Contact
