import React, {Component} from 'react';
import './styles/Contact.css';
import myFace from '../img/isaac-parker-profile-photo.jpeg';
import HorizontalRule from "./HorizontalRule";

class Contact extends Component {
    render() {
        return (
            <div className="col-md-8 col-md-offset-2">
                <div className="Contact">
                    <img className={'Contact-MyFace pull-right'} alt={'Isaac Parker'} src={myFace} />
                    <div className={'Contact-Info'}>
                        <h2 className={'Contact-MyName'}>Isaac Parker</h2>
                        <HorizontalRule width={50} hMargin={0} />
                        <ul className={'Contact-Items'}>
                            <li>The Electronic Mails: <a href={'mailto:parrotmac@gmail.com'} target={'_blank'}>parrotmac@gmail.com</a></li>
                            <li>The PSTN: <a href={'tel:+1(801) 808-1030'}>+1(801) 808-1030</a></li>
                        </ul>
                        <HorizontalRule width={50} hMargin={0} />
                        <div className={'Contact-AboutMe'}>
                            <h4>About Me</h4>
                            <p>I'm a technology-obsessed human.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Contact
