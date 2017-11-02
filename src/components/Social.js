import React, {Component} from 'react'
import './styles/Social.css';
import githubLogo from '../img/github.svg';
import linkedInLogo from '../img/linkedin-color.svg';
import twitterLogo from '../img/twitter-color.svg';

class Social extends Component {
    render() {
        return (
            <div className={'SocialBar'}>
                <a href={'https://twitter.com/parrotmac'} target={'_blank'} rel={'nofollow noopener'} className="SocialItem">
                    <img className={'SocialIcon'} id={'SocialIcon-Twitter'} src={twitterLogo} alt={'Twitter Logo'} />
                    <p className={"SocialName"}>@parrotmac</p>
                </a>
                <a href={'https://www.linkedin.com/in/isaac-parker-27a09787'} target={'_blank'} rel={'nofollow noopener'} className="SocialItem">
                    <img className={'SocialIcon'} id={'SocialIcon-LinkedIn'} src={linkedInLogo} alt={'LinkedIn Logo'} />
                    <p className={"SocialName"}>Isaac Parker</p>
                </a>
                <a href={'https://github.com/parrotmac'} target={'_blank'} rel={'nofollow noopener'} className="SocialItem">
                    <img className={'SocialIcon'} id={'SocialIcon-Github'} src={githubLogo} alt={'Github Logo'} />
                    <p className={"SocialName"}>parrotmac</p>
                </a>
            </div>
        )
    }
}

export default Social
